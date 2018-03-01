var Persona = require('../models/persona');
var Registro = require('../models/registro');

var async = require('async');

// Despliega lista de todas las personas
exports.persona_list = function(req, res, next) {
      Persona.find()
		.sort([['apellido','ascending'],['nombre','ascending']])
		.exec(function(err, list_personas){
			if (err) {return next(err);}
			// sin errores, render
			res.render('persona_list',{title: 'Personas',persona_list: list_personas});
		});;
};
