var Actuacion = require('../models/actuacion');
var Registro = require('../models/registro');

var async = require('async');

// Desplega lista de todas las actuaciones
exports.actuacion_list = function(req, res, next) {
        Actuacion.find()
		.sort([['descripcion','ascending']])
		.exec(function(err, list_actuaciones){
			if (err) {return next(err);}
			// sin errores, render
			res.render('actuacion_list',{title: 'Actuaciones',actuacion_list: list_actuaciones});
		});
};


// Despelga una actuacion
exports.actuacion_detail = function(req, res, next) {
     Actuacion.findById(req.params.id)
     .exec(function (err, actuacioninstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('actuacion_detail', { title: 'Actuacion:', actuacioninstance: actuacioninstance });
    });
};

// Forma de alta de una actuacion GET
exports.actuacion_create_get = function(req, res, next) {
     res.render('actuacion_form', { title: 'Nueva Actuacion' });
};

// Actuacion  POST
exports.actuacion_create_post = function(req, res) {
    req.checkBody('descripcion', 'Debe ingresar la descripcion').notEmpty(); 
	req.sanitize('tipo').trim(); 
	// variable de validacion de errores
	var errors = req.validationErrors();
	// creo objeto actuacion
	 var actuacion = new Actuacion(
      { descripcion: req.body.descripcion, 
        tipo: req.body.tipo
       });
	   
	 if (errors) {
        res.render('actuacion_form', { title: 'Nueva Actuación', actuacion: actuacion, errors: errors});
    return;
    } 
    else {
    // Los datos son validos
    
        actuacion.save(function (err) {
            if (err) { return next(err); }
               //satisfactorio.
               res.redirect(actuacion.url);
            });
    }
	
};

// Despliega forma de eliminar Actuacion GET
exports.actuacion_delete_get = function(req, res, next) {
    async.parallel({
        actuacion: function(callback) {     
            Actuacion.findById(req.params.id).exec(callback);
        },
        actuacion_registroinstances: function(callback) {
          Registro.find({'actuacion': req.params.id }).exec(callback);
		},
    }, function(err, results) {
        if (err) { return next(err); }
        //satisfactio mando a render
        res.render('actuacion_elimina', { title: 'Eliminar Actuacion', actuacion: results.actuacion, actuacion_registroinstances: results.actuacion_registroinstances} );
    }); 
};

//Eliminar actuacion on POST
exports.actuacion_delete_post = function(req, res, next) {
    req.checkBody('actuacionid', 'El Id de Actuacion debe existir ').notEmpty();  
    
    async.parallel({
        actuacion: function(callback) {     
            Actuacion.findById(req.body.actuacionid).exec(callback);
        },
        actuacion_registroinstances: function(callback) {
          Registro.find({ 'actuacion': req.body.actuacionid },'Instances').exec(callback);
		  
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Satisfactorio
        if (results.actuacion_registroinstances.length > 0) {
            //La actuciacion tiene registros. Render como  GET route.
            res.render('actuacion_elimina', { title: 'Elimina actuacion', actuacion: results.actuacion, actuacion_registroinstances: results.actuacion_registroinstances } );
            return;
        }
        else {
            //Actuacion no tiene registros
            Actuacion.findByIdAndRemove(req.body.actuacionid, function deleteActuacion(err) {
                if (err) { return next(err); }
                //Success - got to book list
                res.redirect('/catalog/actuacion');
            });

        }
    });
};

// Desplega forma de actualizar Actuacion on GET
exports.actuacion_update_get = function(req, res,next) {
    req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Get actuaciones for form
    async.parallel({
        actuacion: function(callback) {
            Actuacion.findById(req.params.id).populate('actuacion').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
            
       res.render('actuacion_form', { title: 'Actualiza actuacion', actuacion: results.actuacion});
    });
};

// Handle Actuacion update on POST
exports.actuacion_update_post = function(req, res, next) {
   	//Sanitize id passed in. 
    req.sanitize('id').escape();
    req.sanitize('id').trim();
    	 
	 
	// chequeo que el nombre no esta en blanco
	req.checkBody('descripcion', 'Debe ingresar descripcion').notEmpty(); 
	req.sanitize('tipo').trim();
	//loc 

	 //Run the validators
    
	 var errors = req.validationErrors();
	 //Create a genre object with escaped and trimmed data.
	 
    var actuacion = new Actuacion(
      { descripcion: req.body.descripcion, 
    	tipo: req.body.tipo,
		_id:req.params.id
       });
	   
	  
	 if (errors){
		// Re render con error
        async.parallel({
            actuacion: function(callback){
                Actuacion.find(callback);}
		},
		function(err, results) {
            if (err) { return next(err); }
	       res.render('actuacion_form', { title: 'Actualiza actuacion', actuacion: results.actuacion, errors: errors})
	    });
	 }
    else {
    // La forma es valida. Actualiza el registro Actaucion
        Actuacion.findByIdAndUpdate(req.params.id, actuacion, {}, function (err,theactuacion) {
            if (err) { return next(err); }
            //successful - redirect Actuacion.
            res.redirect(theactuacion.url);
        });
    }
};