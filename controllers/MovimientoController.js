var Registro = require('../models/registro');
var Actuacion = require('../models/actuacion');
var Persona = require('../models/persona');
var Dependencia = require('../models/dependencia');
var Ubicacion = require('../models/ubicacion');

var async = require('async');

exports.index1 = function(req, res) {
    async.parallel({
        actuacion_count: function(callback) {
            Actuacion.count(callback);
        },
        persona_count: function(callback) {
            Persona.count(callback);
        },
        dependencia_count: function(callback) {
            Dependencia.count(callback);
        },
        ubicacion_count: function(callback) {
            Ubicacion.count(callback);
        },
		registro_count: function(callback) {
            Registro.count(callback);
        },
		
    }, function(err, results) {
        res.render('index', { title: 'Consultas gráficas', error: err, data: results });
    }); 
};

// Display list of all registros
exports.registro_list = function(req, res, next) {
     Registro.find({}, 'nrotra actuacion persona dependencia fecha valor estado')
    .populate('actuacion persona dependencia')
    .exec(function (err, list_registros) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('registro_list', { title: 'Registo Actuaciones:', registro_list: list_registros });
    });
};

// Display detail page for a specific registro
exports.registro_detail = function(req, res, next) {
     Registro.findById(req.params.id)
     .exec(function (err, registroinstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('registro_detail', { title: 'Registro:', registroinstance: registroinstance });
    });
};

// Display registro create form on GET
exports.registro_create_get = function(req, res,next) {
    async.parallel({
        actuacion_list: function(callback) {
            Actuacion.find({},'descripcion').exec(callback);
        },
        persona_list: function(callback) {
            Persona.find({},'apellido nombre').exec(callback);
        },
        dependencia_list: function(callback) {
            Dependencia.find({},'nombre').exec(callback);
        },
		
    }, function(err, results) {
		if (err) { return next(err); }
        res.render('registro_form', { title: 'Nuevo Registro', error: err, 
		actuacion_list: results.actuacion_list, 
		persona_list: results.persona_list,
		dependencia_list: results.dependencia_list});
    }); 
};

// Handle registro create on POST
exports.registro_create_post = function(req, res,next) {
  
  
	// chequeo que el nombre no esta en blanco
	req.checkBody('nrotra', 'Debe ingresar numero de transacion').notEmpty(); 
	req.sanitize('actuacion').escape();
	req.sanitize('persona').escape();
	req.sanitize('dependencia').escape();
	req.checkBody('fecha', 'Fecha invalida').optional({ checkFalsy: true }).isISO8601(); 
	req.checkBody('valor', 'Debe ingresar valor de transacion').notEmpty(); 
	req.sanitize('estado').trim();
	
	 //Run the validators
    var errors = req.validationErrors();
 
    var registro = new Registro(
      { nrotra: req.body.nrotra,
		actuacion: req.body.actuacion,
		persona: req.body.persona,
		dependencia: req.body.dependencia,
		fecha: req.body.fecha,
        valor: req.body.valor,
		estado: req.body.estado, });
	   
	 if (errors) {
        res.render('registro_form', { title: 'Nuevo Registro', registro: registro, errors: errors});
    return;
    } 
    else {
    // Data from form is valid
        registro.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to nuevo registro
               res.redirect(registro.url);
            });
    }
};

// Display registro delete form on GET
exports.registro_delete_get = function(req, res, next) {
     async.parallel({
        registro: function(callback) {     
            Registro.findById(req.params.id).exec(callback);
        },
      
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('registro_elimina', { title: 'Eliminar Registro', registro: results.registro} );
    });
};

// Handle registro delete on POST
exports.registro_delete_post = function(req, res, next) {
     req.checkBody('authorid', 'Author id must exist').notEmpty();  
    
    async.parallel({
        registro: function(callback) {     
            Registro.findById(req.body.registroid).exec(callback);
        },
    
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.registro.length < 0) {
               res.render('registro_elimina', { title: 'Eliminar Registro', registro: results.registro } );
            return;
        }
        else {
            Registro.findByIdAndRemove(req.body.registroid, function deleteRegistro(err) {
                if (err) { return next(err); }
                //Success - got to author list
                res.redirect('/catalog/registro');
            });

        }
    });
};

// Display registro update form on GET
exports.registro_update_get = function(req, res, next) {
    req.sanitize('id').escape();
    req.sanitize('id').trim();
	async.parallel({
        
	registro: function(callback) {
         Registro.findById(req.params.id).populate('registro').exec(callback);
        },
	actuacion_list: function(callback) {
		 Actuacion.find({},'descripcion tipo').exec(callback);},
	
	persona_list: function(callback) {
		 Persona.find({},'nombre apellido').exec(callback);},
	 
	dependencia_list: function(callback) {
		 Dependencia.find({},'nombre tipod').exec(callback);}
		 
    }, function(err, results) {
        if (err) { return next(err); }
            
        // Mark our selected genres as checked
    res.render('registro_form', { title: 'Actualiza registro', registro: results.registro,
	actuacion_list: results.actuacion_list ,
	persona_list: results.persona_list,
	dependencia_list: results.dependencia_list});
    });
};

// Handle registro update on POST
exports.registro_update_post = function(req, res, next) {
    //Sanitize id passed in. 
    req.sanitize('id').escape();
    req.sanitize('id').trim();
    	 
	// chequeo que el nombre no esta en blanco
	req.checkBody('nrotra', 'Debe ingresar numero de transacion').notEmpty(); 
	req.sanitize('actuacion').escape();
	req.sanitize('persona').escape();
	req.sanitize('dependencia').escape();
	req.checkBody('fecha', 'Fecha invalida').optional({ checkFalsy: true }).isISO8601(); 
	req.checkBody('valor', 'Debe ingresar valor de transacion').notEmpty(); 
	req.sanitize('estado').trim();
	
	 //Run the validators
    var errors = req.validationErrors();
 
    var registro = new Registro(
      { nrotra: req.body.nrotra,
		actuacion: req.body.actuacion,
		persona: req.body.persona,
		dependencia: req.body.dependencia,
		fecha: req.body.fecha,
        valor: req.body.valor,
		estado: req.body.estado,
        _id:req.params.id});

	 var errors = req.validationErrors();  
	 if (errors){
		// Re-render book with error information
        // Get all authors and genres for form 
        async.parallel({
            registro: function(callback){
                Registro.find(callback);}
		},
		function(err, results) {
            if (err) { return next(err); }
	       res.render('registro_form', { title: 'Actualiza Registro', registro: results.registro, errors: errors})
	    });
	 }
    else {
    // Data from form is valid
       // Data from form is valid. Update the record.
        Registro.findByIdAndUpdate(req.params.id, registro, {}, function (err,theregistro) {
            if (err) { return next(err); }
            //successful - redirect to book detail page.
            res.redirect(theregistro.url);
        });
    }
};