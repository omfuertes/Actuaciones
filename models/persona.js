var moment = require('moment');

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PersonaSchema = new Schema(
  { 
    nombre: {type: String, required: true, max: 100},
    apellido: {type: String, required: true, max: 100},
    nacimiento: {type: Date},
    nacionalidad: {type: String, required: true, max: 100},
	genero: {type: String, required: true, enum: ['Hombre', 'Mujer', 'Otro'], default: 'Hombre'},
	loc:{
		type: [Number], 
		index: '2d',
		required: false
		}
  });


// Virtual for author's full name
PersonaSchema
.virtual('nomper')
.get(function () {
  return this.apellido + ', ' + this.nombre;
});

// Virtual for author's URL
PersonaSchema
.virtual('url')
.get(function () {
  return '/catalog/persona/' + this._id;
});

PersonaSchema
.virtual('nac')
.get(function () {
  return moment(this.nacimiento).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('Persona', PersonaSchema);