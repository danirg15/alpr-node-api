const exec      = require('child_process').exec

const licence_plate_patterns = require('../data/licence_plate_patterns')


self = module.exports = {

    identify: (data, callback) => {
        exec(`alpr -c ${data.region_code} -n 5 -j ${data.image_path}`, (err, stdout, stderr) => {
            if (err) {
                callback(err, null)
            }else {
                let output = JSON.parse(stdout)
                if(output.results.length === 0) {
                    callback(null, {
                        'status': 'ZERO_RESULTS',
                        'result': {}
                    })
                }else{
                    self.parse_results(output.results[0], data.country_code, callback)
                }
            }
        })
        
    },  


    parse_results: (result, country_code, callback) => {
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
