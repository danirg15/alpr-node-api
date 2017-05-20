const router 			= require('express').Router()
const AuthController 	= require('../controllers/AuthController')
const validate 			= require('express-validation');
const validators 		= require('./validators');

router.post('/auth/login', validate(validators.auth.full), (req, res) => {
	AuthController.login(req.body.username, req.body.password, (err, token) => {
		if (token && !err) {
			res.status(200).json({ 
				'message': 'Successful login',
				'token': token 
			})
		}
		else{
			res.status(401).json({ 
				'message': 'Auth failed'
			})
		}
	})
})


router.get('/auth/refresh_token', (req, res) => {
      
})

router.get('/auth/logout', (req, res) => {
      
})


module.exports = router;