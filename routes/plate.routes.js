const router = require('express').Router()
const LicencePlateController = require('../controllers/LicencePlateController')
const validator = require('express-validation');
const validate = require('./validate');


router.post('/licence_plate/identify', validator(validate.plate_request), (req, res) => {
	LicencePlateController.identify(req.body, (err, results) => {
		if (err) res.status(500).json(err)
        else res.status(200).json(results)
	})
})


module.exports = router;