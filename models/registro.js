var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var RegistroSchema = new Schema({
  nrotra:{type: Number, required: true},
  actuacion: {type: Schema.ObjectId, ref: 'Actuacion', required: true},
  persona: {type: Schema.ObjectId, ref: 'Persona', required: true},
  dependencia: {type: Schema.ObjectId, ref: 'Dependencia', required: true},
  fecha: {type: Date, default: Date.now},
  valor: {type: Number},
  estado:{type: String, required: true, enum: ['Finalizado','Entregado','Asignado Especies','Pagado','Anulado','Por Pagar','Otros','Ingresado','Sin Costo'], default: 'Finalizado'},
});


// Virtual for book's URL
RegistroSchema
.virtual('url')
.get(function () {
  return '/catalog/registro/' + this._id;
});

RegistroSchema
.virtual('regfecha')
.get(function () {
  return moment(this.fecha).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('Registro', RegistroSchema);