var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UbicacionSchema = new Schema({
  pais: {type: String, required: true, max: 50},
  ciudad: {type: String, required: true, max: 50},
  continente: {type: String, required: true, enum: ['Europa', 'Asia', 'Africa', 'Antartida','Oceania','America Norte','America Central ','America Sur'], default: 'Europa'},
  });

// Virtual for book's URL
UbicacionSchema
.virtual('url')
.get(function () {
  return '/catalog/ubicacion/' + this._id;
});

// Virtual for cuidad-pais-continete
UbicacionSchema
.virtual('ubicate')
.get(function () {
  return this.ciudad + ', ' + this.pais ;
});

//Export model
module.exports = mongoose.model('Ubicacion', UbicacionSchema);