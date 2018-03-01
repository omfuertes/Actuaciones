var Ubicacion = require('../models/ubicacion');
var Dependencia = require('../models/dependencia');
var async = require('async');

// DEspliega todas las Ubicaciones
exports.ubicacion_list = function(req, res, next) {
    Ubicacion.find()
		.sort([['continente','ascending'],['pais','ascending'],['ciudad','ascending']])
		.exec(function(err, list_ubicaciones){
			if (err) {return next(err);}
			// sin errores, render
			res.render('ubicacion_list',{title: 'Ubicaciones',ubicacion_list: list_ubicaciones});
		});
};

// Despliega una Ubicacion
exports.ubicacion_detail = function(req, res,next) {
    Ubicacion.findById(req.params.id)
     .exec(function (err, ubicacioninstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('ubicacion_detail', { title: 'Ubicacion:', ubicacioninstance: ubicacioninstance });
    });
};

// Creacion de una ubicacion GET
exports.ubicacion_create_get = function(req, res, next) {
      res.render('ubicacion_form', { title: 'Nueva Ubicacion' });
};

// Ubicacion creacion POST
exports.ubicacion_create_post = function(req, res,next) {
// chequeo que el nombre y ciudad no sea blanco
	req.checkBody('pais', 'Debe ingresar nombre del pais').notEmpty(); 
	req.checkBody('ciudad', 'Debe ingresar ciudad').notEmpty(); 
	req.sanitize('contiente').trim();
	
	 //ejecuta validacion
    var errors = req.validationErrors();
	
	
	 //Create a objeto Ubiacacion
	 
    var ubicacion = new Ubicacion(
      { pais: req.body.pais, 
        ciudad: req.body.ciudad,
    	continente: req.body.contiente,
       });
	   
	 if (errors) {
        res.render('ubicacion_form', { title: 'Nueva Ubicacion', ubicacion: ubiacion, errors: errors});
    return;
    } 
    else {
    // Data from form is valid
    
        ubicacion.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new author record.
               res.redirect(ubicacion.url);
            });
    }
};

// Eliminar Ubicacion on GET
exports.ubicacion_delete_get = function(req, res, next) {
  async.parallel({
        ubicacion: function(callback) {     
            Ubicacion.findById(req.params.id).exec(callback);
        },
        ubicacion_dependenciainstances: function(callback) {
          Dependencia.find({'ubicacion': req.params.id }).exec(callback);
		 //Dependencia.count(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('ubicacion_elimina', { title: 'Eliminar Ubicacion', ubicacion: results.ubicacion, ubicacion_dependenciainstances: results.ubicacion_dependenciainstances} );
    });
};

// Elimina Ubicacion on POST
exports.ubicacion_delete_post = function(req, res,next) {
   req.checkBody('ubicacionid', 'El Id de ubicacion debe existir ').notEmpty();  
    
    async.parallel({
        ubicacion: function(callback) {     
            Ubicacion.findById(req.body.ubicacionid).exec(callback);
        },
        ubicacion_dependenciainstances: function(callback) {
          Dependencia.find({ 'ubicacion': req.body.ubicacionid },'Instances').exec(callback);
		  
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.ubicacion_dependenciainstances.length > 0) {
            //        
            res.render('ubicacion_elimina', { title: 'Elimina ubicacion', ubicacion: results.ubicacion, ubicacion_dependenciainstances: results.ubicacion_dependenciainstances } );
            return;
        }
        else {
            //books has not bookinstances. Delete object and redirect to the list of books
            Ubicacion.findByIdAndRemove(req.body.ubicacionid, function deleteubicacion(err) {
                if (err) { return next(err); }
                //Success - got to book list
                res.redirect('/catalog/ubicacion');
            });

        }
    });
};

// Ubicacion actualizacion on GET
exports.ubicacion_update_get = function(req, res, next) {
   req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Get ubicacion for form
    async.parallel({
        ubicacion: function(callback) {
            Ubicacion.findById(req.params.id).populate('ubicacion').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
            
        // Mark our selected genres as checked
    res.render('ubicacion_form', { title: 'Actualiza Ubicacion', ubicacion: results.ubicacion});
    });
};

// Handle Ubicacion update on POST
exports.ubicacion_update_post = function(req, res, next) {
	//Sanitize id passed in. 
    req.sanitize('id').escape();
    req.sanitize('id').trim();
    	 
    req.checkBody('pais', 'Debe ingresar nombre del pais').notEmpty(); 
	req.checkBody('ciudad', 'Debe ingresar ciudad').notEmpty(); 
	req.sanitize('contiente').trim();
	

	 //Create a objeto Ubiacacion
	 
    var ubicacion = new Ubicacion(
      { pais: req.body.pais, 
        ciudad: req.body.ciudad,
    	continente: req.body.contiente,
		_id:req.params.id
       });
	   
	 	 //ejecuta validacion
    var errors = req.validationErrors();
	  
	   
	 if (errors){
		// Re-render book with error information
        // Get all authors and genres for form 
        async.parallel({
            ubicacion: function(callback){
                Ubicacion.find(callback);}
		},
		function(err, results) {
            if (err) { return next(err); }
	       res.render('ubicacion_form', { title: 'Actualiza Ubicacion', ubicacion: results.ubicacion, errors: errors})
	    });
	 }
    else {
    // Data from form is valid
       // Data from form is valid. Update the record.
        Ubicacion.findByIdAndUpdate(req.params.id, ubicacion, {}, function (err,theubicacion) {
            if (err) { return next(err); }
            //successful - redirect to book detail page.
            res.redirect(theubicacion.url);
        });
    }
};