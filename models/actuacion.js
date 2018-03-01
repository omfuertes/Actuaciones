var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ActuacionSchema = new Schema(
  {
  	descripcion:{type: String, requiered: true, max: 200},
	tipo:{type: String, requiered: true, enum: ['SOLICITUD','VISADO','NOTARIALES','CENSO','PASAPORTE','LEGALIZACIONES','TRANSFERENCIA','LEGALIZACION','NATURALIZACIONES','COPIA CERTIFICADA VISADO','APOSTILLA'], default: 'APOSTILLA'}
  }
);

// Virtual for Actuacion URL
ActuacionSchema
.virtual('url')
.get(function () {
  return '/catalog/actuacion/' + this._id;
});

//Export model
module.exports = mongoose.model('Actuacion', ActuacionSchema);


