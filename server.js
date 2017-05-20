//--------------------------------------------
//		App Modules
//--------------------------------------------
const http =			require('http')
const express = 		require('express')
const app 	= 			express()
const bodyParser = 		require('body-parser')
const env = 			require('dotenv').config()
const path = 			require('path')
const logger = 			require('morgan')
const config = 			require('config')
const auth = 			require('./middleware/jwtAuth')
const helmet = 			require('helmet')
const cors = 			require('cors')

//--------------------------------------------
//		Middlewares
//--------------------------------------------
app.use(helmet())
app.use(cors())
app.use(bodyParser.json({limit: '2mb'}))
app.use(bodyParser.urlencoded({ extended: false }))


//--------------------------------------------
//		Configuration
//--------------------------------------------
const port = process.env.PORT || 3000

if(config.util.getEnv('NODE_ENV') !== 'test') {
    app.use(logger('dev'))
}



//--------------------------------------------
//		Routing
//--------------------------------------------
app.use('/api', require('./routes/plate.routes'))
 
//Validation errors parsing
// app.use((err, req, res, next) => res.status(400).json(err))

//--------------------------------------------
//		Runnn!
//--------------------------------------------
const server = http.createServer(app)

server.listen(port, function(err) {
	if (err) throw err
	console.log('Server running on port: ' + port)
})

module.exports = app //export for testing


