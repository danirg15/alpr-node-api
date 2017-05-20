let router = require('express').Router()
let UserController = require('../controllers/UserController')
let validate = require('express-validation');
let validators = require('./validators');


router.post('/users/register', validate(validators.user.full), (req, res) => {
	UserController.store(req.body, (err) => {
		if (err) res.status(500).json(err)
        else res.status(201).json({'message': 'Register successfuly'})
	})
})


router.get('/users', (req, res) => {
	
})

router.get('/users/:id', (req, res) => {
	
})


module.exports = router;