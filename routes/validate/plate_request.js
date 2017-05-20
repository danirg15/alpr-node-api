const Joi = require('joi');
 
module.exports = {
	  body: {
	    image:       	Joi.string().base64().required(),
	    country_code: 	Joi.string().only(['es']).default('es'),
	  	region_code: 	Joi.string().only(['eu']).default('eu', 'European licence plates')
	  }	
}
