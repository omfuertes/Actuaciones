var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var DependenciaSchema = new Schema(
  {
    nombre: {type: String, required: true, max: 100},
    tipod: {type: String, required: true, enum: ['Consulado', 'Embajada', 'Coordinacion'], default: 'Consulado'},
	ubicacion: {type: Schema.ObjectId, ref: 'Ubicacion', required: true},
    loc:{ type: [Number], index: '2d', required: false}	
  }
);

//DependeciaSchema
//.virtual('depen')
//.get(function () {
//  return this.tipod + ' - ' + this.nombre;
//});

// Virtual for author's URL
DependenciaSchema
.virtual('url')
.get(function () {
  return '/catalog/dependencia/' + this._id;
});


//Export model
module.exports = mongoose.model('Dependencia', DependenciaSchema);