var Dependencia = require('../models/dependencia');
var Ubicacion = require('../models/ubicacion');
var Registro = require('../models/registro');

var async = require('async');

// Display list of all Dependencias
exports.dependencia_list = function(req, res, next) {
    Dependencia.find({}, 'nombre tipod ubicacion loc')
    .populate('ubicacion')
    .exec(function (err, list_dependencias) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('dependencia_list', { title: 'Dependencias:', dependencia_list: list_dependencias });
    });
};

// Display detail page for a specific Dependencia
exports.dependencia_detail = function(req, res, next) {
      Dependencia.findById(req.params.id)
     .exec(function (err, dependenciainstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('dependencia_detail', { title: 'Dependencia:', dependenciainstance: dependenciainstance });
    });
};

// Display Dependencia create form on GET
exports.dependencia_create_get = function(req, res, next) {
   	Ubicacion.find({},'ciudad pais continente')
    .exec(function (err, ubicaciones) {
      if (err) { return next(err); } 
	  res.render('dependencia_form', {title: 'Nueva Dependencia', ubicacion_list:ubicaciones});
    });
};

   

// Handle Dependencia create on POST
exports.dependencia_create_post = function(req, res, next) {
   
	var longitud = Number, latitud = Number;
	
	// chequeo que el nombre no esta en blanco
	req.checkBody('nombre', 'Debe ingresar nombre').notEmpty(); 
	req.sanitize('tipod').trim();
	req.sanitize('ubicacion').escape();
	
	//loc 
	req.checkBody('longitud', 'Debe ingresar Longitud1').notEmpty(); 
	req.checkBody('latitud', 'Debe ingresar Latitud').notEmpty(); 
	
	 //Run the validators
    var errors = req.validationErrors();
 
    var dependencia = new Dependencia(
      { nombre: req.body.nombre, 
        tipod: req.body.tipod,
        ubicacion: req.body.ubicacion,
		loc: [req.body.longitud, req.body.latitud]
       });
	 
	 if (errors) {
		 
       res.render('dependencia_form', { title: 'Nueva Dependencia', dependencia: dependencia, errors: errors});
    return;
    } 
    else {
    // Data from form is valid
        dependencia.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to nueva dependencia.
               res.redirect(dependencia.url);
            });
    }
       
};

// Eliminar Dependencia  GET
exports.dependencia_delete_get = function(req, res, next) {
    async.parallel({
        dependencia: function(callback) {     
            Dependencia.findById(req.params.id).exec(callback);
        },
        dependencia_registroinstances: function(callback) {
          Registro.find({'dependencia': req.params.id }).exec(callback);
		  //BookInstance.count(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('dependencia_elimina', { title: 'Eliminar Dependencia', dependencia: results.dependencia, dependencia_registroinstances: results.dependencia_registroinstances} );
    });
};

// Eliminar Dependencia POST
exports.dependencia_delete_post = function(req, res, next) {
    req.checkBody('dependenciaid', 'El Id dependencia debe existir ').notEmpty();  
    
    async.parallel({
        dependencia: function(callback) {     
            Dependencia.findById(req.body.dependenciaid).exec(callback);
        },
        dependencia_registroinstances: function(callback) {
          Registro.find({ 'dependencia': req.body.dependenciaid },'Instances').exec(callback);
		  
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.dependencia_registroinstances.length > 0) {
            //books has booksinstances. Render in same way as for GET route.
            res.render('dependencia_elimina', { title: 'Elimina dependencia', dependencia: results.dependencia, dependencia_registroinstances: results.dependencia_registroinstances } );
            return;
        }
        else {
            //books has not bookinstances. Delete object and redirect to the list of books
            Dependencia.findByIdAndRemove(req.body.dependenciaid, function deletedependencia(err) {
                if (err) { return next(err); }
                //Success - got to book list
                res.redirect('/catalog/dependencia');
            });

        }
    });
};

// Actualizar Dependencia GET
exports.dependencia_update_get = function(req, res, next) {
    req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Get personas for form
    async.parallel({
        dependencia: function(callback) {
            Dependencia.findById(req.params.id).populate('dependencia').exec(callback);
        },
		 ubicacion_list: function(callback) {
		 Ubicacion.find({},'ciudad pais continente').exec(callback);}
    }, function(err, results) {
        if (err) { return next(err); }
            
        // Mark our selected genres as checked
    res.render('dependencia_form', { title: 'Actualiza Dependencia', dependencia: results.dependencia, ubicacion_list: results.ubicacion_list});
    });
};

// Actualizr Dependencia POST
exports.dependencia_update_post = function(req, res, next) {
	//Sanitize id passed in. 
    req.sanitize('id').escape();
    req.sanitize('id').trim();
    	 
	req.checkBody('nombre', 'Debe ingresar nombre').notEmpty(); 
	req.sanitize('tipod').trim();
	req.sanitize('ubicacion').escape();
	
	//loc 
	req.checkBody('longitud', 'Debe ingresar Longitud').notEmpty(); 
	req.checkBody('latitud', 'Debe ingresar Latitud').notEmpty(); 
	
	 //Run the validators
   
 
    var dependencia = new Dependencia(
      { nombre: req.body.nombre, 
        tipod: req.body.tipod,
        ubicacion: req.body.ubicacion,
		loc: [req.body.longitud, req.body.latitud],
		_id:req.params.id
       });

	 var errors = req.validationErrors();  
	 if (errors){
		// Re-render book with error information
        // Get all authors and genres for form 
        async.parallel({
            dependencia: function(callback){
                Dependencia.find(callback);}
		},
		function(err, results) {
            if (err) { return next(err); }
	       res.render('dependencia_form', { title: 'Actualiza Dependencia', dependencia: results.dependencia, errors: errors})
	    });
	 }
    else {
    // Data from form is valid
       // Data from form is valid. Update the record.
        Dependencia.findByIdAndUpdate(req.params.id, dependencia, {}, function (err,thedependencia) {
            if (err) { return next(err); }
            //successful - redirect to book detail page.
            res.redirect(thedependencia.url);
        });
    }
};