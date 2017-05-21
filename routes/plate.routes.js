const router = require('express').Router()
const LicencePlateController = require('../controllers/LicencePlateController')
const validator = require('express-validation');
const validate = require('./validate');
const fs = require('fs');
const formidable = require('formidable')


// router.post('/licence_plate/identify', validator(validate.plate_request), (req, res) => {
// 	LicencePlateController.identify(req.body, (err, results) => {
// 		if (err) res.status(500).json(err)
//         else res.status(200).json(results)
// 	})
// })


router.get('/', function (req, res){
	var form = "<!DOCTYPE HTML><html><body>" +
	"<form method='post' action='/api/upload' enctype='multipart/form-data'>" +
	"<input type='file' name='image'/>" +
	"<input type='text' name='country_code'/>" +
	"<input type='submit' /></form>" +
	"</body></html>";
	res.writeHead(200, {'Content-Type': 'text/html' });
	res.end(form);  
});


router.post('/upload', function(req, res) {
	let form = new formidable.IncomingForm();
	form.maxFieldsSize = 3 * 1024 * 1024; //3MB
	form.keepExtensions = true
	form.uploadDir = './data/uploads'

	form.parse(req, function(err, fields, files) {
		if (err) throw err
		else {
			let data = {
				'country_code': 'es',
				'region_code': 'eu',
				'image_path': files.image.path
			}

			LicencePlateController.identify(data, (err, results) => {
				fs.unlink(files.image.path, () => {})
				if (err) res.status(500).json(err)
		        else res.status(200).json(results)
			})
		}		
	})

})



module.exports = router;