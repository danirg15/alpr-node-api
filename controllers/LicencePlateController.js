const Guid      = require('guid')
const base64Img = require('base64-img')
const fs        = require('fs')
const exec      = require('child_process').exec

const licence_plate_patterns = require('../data/licence_plate_patterns')


self = module.exports = {

    identify: (data, callback) => {
        const image_id = Guid.create()
        base64Img.img('data:image/png;base64,'+data.image, './data/upload', image_id, (err, filepath) => {
            if (err) {
                callback(err, null)
                return
            }
            else {
                exec(`alpr -c ${data.country_code} -j ${filepath}`, (err, stdout, stderr) => {
                    if (err) {
                        callback(err, null)
                    }else {
                        fs.unlink(filepath, () => {})
                        let result = JSON.parse(stdout)
                        console.log(result)
                        self.parse_results(result, data.country_code, callback)
                    }
                })
            }
        }) 
        
    },  


    parse_results: (result, country_code, callback) => {
        if(result.length === 0) {
            callback(null, {
                'status': 'ZERO_RESULTS',
                'result': {}
            })
        }
        else {
            let response = {
                'status': 'OK',
                'result': {
                    'licence_plate': '',
                    'confidence': result.confidence,
                    'processing_time_ms': result.processing_time_ms,
                    'country': {
                        'code': country_code,
                        'name': '',
                    },
                    'candidates': result.candidates
                }
            }
            
            const country = licence_plate_patterns[country_code]
            response.result.country.name = country.country

            //Verify if found plate matches the pattern
            //Otherwise look for the first candidate matching the pattern
            if(self.findMatchingPattern(result.plate, country.patterns)) {
                response.result.licence_plate = result.plate
            } else {
                for (var i = 0; i < result.candidates.length; i++) {
                    if(self.findMatchingPattern(result.candidates[i].plate, country.patterns)) {
                        response.result.licence_plate = result.candidates[i].plate
                        response.result.confidence = result.candidates[i].confidence
                        break
                    }
                }
            }

            callback(null, response)
        }//else
    },


    findMatchingPattern: (plate, patterns) => {
        for (var i = 0; i < patterns.length; i++) {
            if(plate.match(patterns[i].regex)) {
                return patterns[i]
            }        
        }
        return null
    },

}
