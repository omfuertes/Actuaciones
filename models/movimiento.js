var moment = require('moment');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MovimientoSchema = new Schema({
  nrotra:{type: Number, required: true},
  actuacion: {type: Schema.ObjectId, ref: 'Actuacion', required: true},
  persona: {type: Schema.ObjectId, ref: 'Persona', required: true},
  dependencia: {type: Schema.ObjectId, ref: 'Dependencia', required: true},
  fecha: {type: Date, default: Date.now},
  valor: {type: Number},
  estado:{type: String, required: true, enum: ['Finalizado','Entregado','Asignado Especies','Pagado','Anulado','Por Pagar','Otros','Ingresado','Sin Costo'], default: 'Finalizado'},
});


// Virtual for book's URL
MovimientoSchema
.virtual('url')
.get(function () {
  return '/catalog/movimiento/' + this._id;
});

MovimientoSchema
.virtual('regfecha')
.get(function () {
  return moment(this.fecha).format('MMMM Do, YYYY');
});

//Export model
module.exports = mongoose.model('Movimiento', MovimientoSchema);