var Persona = require('../models/persona');
var Registro = require('../models/registro');

var async = require('async');

// Despliega lista de todas las personas
exports.persona_list = function(req, res, next) {
      //Persona.find().limit(1000)
	 Persona.find({apellido:/^A/}).limit(10000)
	    
		//.sort([['apellido','ascending'],['nombre','ascending']])
		.exec(function(err, list_personas){
			if (err) {return next(err);}
			// sin errores, render
			res.render('persona_list',{title: 'Personas',persona_list: list_personas});
		});;
};

// Desplega una persona 
exports.persona_detail = function(req, res, next) {
    Persona.findById(req.params.id)
     .exec(function (err, personainstance) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('persona_detail', { title: 'Persona:', personainstance: personainstance });
    });
	
};

// Creacion de Persona GET
exports.persona_create_get = function(req, res, next) {
      res.render('persona_form', { title: 'Nueva Persona' });

};

// Persona  POST
exports.persona_create_post = function(req, res, next) {
     //res.send('NOT IMPLEMENTED: Persona create 1 POST');
	var longitud = Number, latitud = Number;
	    
	// chequeo que el nombre no esta en blanco
	req.checkBody('nombre', 'Debe ingresar nombre').notEmpty(); 
	req.checkBody('apellido', 'Debe ingresar apellido').notEmpty(); 
	
	// Nacimiento
	req.checkBody('nacimiento', 'Fecha invalida').optional({ checkFalsy: true }).isISO8601(); 
    req.checkBody('nacionalidad', 'Debe ingresar nacionalidad').notEmpty(); 
	req.sanitize('genero').trim();
	//loc 
	req.checkBody('longitud', 'Debe ingresar Longitud').notEmpty(); 
	req.checkBody('latitud', 'Debe ingresar Latitud').notEmpty(); 
	
	 //Run the validators
    var errors = req.validationErrors();
	
	
	 //Create a genre object with escaped and trimmed data.
	 
    var persona = new Persona(
      { nombre: req.body.nombre, 
        apellido: req.body.apellido,
        nacimiento: req.body.nacimiento,
		nacionalidad: req.body.nacionalidad,
    	genero: req.body.genero,
		loc: [req.body.longitud, req.body.latitud]
       });
	   
	 if (errors) {
        res.render('persona_form', { title: 'Nueva Persona', persona: persona, errors: errors});
    return;
    } 
    else {
    // Data from form is valid
    
        persona.save(function (err) {
            if (err) { return next(err); }
               //successful - redirect to new author record.
               res.redirect(persona.url);
            });
    }
       
};

// Desplega forma de eliminar Persona GET
exports.persona_delete_get = function(req, res, next) {
   async.parallel({
        persona: function(callback) {     
            Persona.findById(req.params.id).exec(callback);
        },
        persona_registroinstances: function(callback) {
          Registro.find({'persona': req.params.id }).exec(callback);
		  //BookInstance.count(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('persona_elimina', { title: 'Eliminar Persona', persona: results.persona, persona_registroinstances: results.persona_registroinstances} );
    });
    
};

// Eliminar persona on POST
exports.persona_delete_post = function(req, res,next) {
   
    req.checkBody('personaid', 'El Id Persona debe existir ').notEmpty();  
    
    async.parallel({
        persona: function(callback) {     
            Persona.findById(req.body.personaid).exec(callback);
        },
        persona_registroinstances: function(callback) {
          Registro.find({ 'persona': req.body.personaid },'Instances').exec(callback);
		  
        },
    }, function(err, results) {
        if (err) { return next(err); }
        //Success
        if (results.persona_registroinstances.length > 0) {
            //books has booksinstances. Render in same way as for GET route.
            res.render('persona_elimina', { title: 'Elimina Persona', persona: results.persona, persona_registroinstances: results.persona_registroinstances } );
            return;
        }
        else {
            //books has not bookinstances. Delete object and redirect to the list of books
            Persona.findByIdAndRemove(req.body.personaid, function deletePersona(err) {
                if (err) { return next(err); }
                //Success - got to book list
                res.redirect('/catalog/persona');
            });

        }
    });

};

// Display Persona update form on GET
exports.persona_update_get = function(req, res, next) {
  	req.sanitize('id').escape();
    req.sanitize('id').trim();

    //Get personas for form
    async.parallel({
        persona: function(callback) {
            Persona.findById(req.params.id).populate('persona').exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
            
        // Mark our selected genres as checked
    res.render('persona_form', { title: 'Actualiza Persona', persona: results.persona});
    });
};

// Handle Persona update on POST
exports.persona_update_post = function(req, res,next) {
      
	//Sanitize id passed in. 
    req.sanitize('id').escape();
    req.sanitize('id').trim();
    	 
	 
	// chequeo que el nombre no esta en blanco
	req.checkBody('nombre', 'Debe ingresar nombre').notEmpty(); 
	req.checkBody('apellido', 'Debe ingresar apellido').notEmpty(); 
	
	// Nacimiento
	req.checkBody('nacimiento', 'Fecha invalida').optional({ checkFalsy: true }).isISO8601(); 
    req.checkBody('nacionalidad', 'Debe ingresar nacionalidad').notEmpty(); 
	req.sanitize('genero').trim();
	//loc 
	req.checkBody('longitud', 'Debe ingresar Longitud').notEmpty(); 
	req.checkBody('latitud', 'Debe ingresar Latitud').notEmpty(); 
	
	 //Run the validators
    
	
	 //Create a genre object with escaped and trimmed data.
	 
    var persona = new Persona(
      { nombre: req.body.nombre, 
        apellido: req.body.apellido,
        nacimiento: req.body.nacimiento,
		nacionalidad: req.body.nacionalidad,
    	genero: req.body.genero,
		loc: [req.body.longitud, req.body.latitud],
		_id:req.params.id
       });
	   
	 var errors = req.validationErrors();  
	 if (errors){
		// Re-render book with error information
        // Get all authors and genres for form 
        async.parallel({
            persona: function(callback){
                Persona.find(callback);}
		},
		function(err, results) {
            if (err) { return next(err); }
	       res.render('persona_form', { title: 'Actualiza Persona', persona: results.persona, errors: errors})
	    });
	 }
    else {
    // Data from form is valid
       // Data from form is valid. Update the record.
        Persona.findByIdAndUpdate(req.params.id, persona, {}, function (err,thepersona) {
            if (err) { return next(err); }
            //successful - redirect to book detail page.
            res.redirect(thepersona.url);
        });
    }
};

exports.persona_list1 = function(req, res, next) {
      Persona.find().limit(1000)
		//.sort([['apellido','ascending'],['nombre','ascending']])
		.exec(function(err, list_personas){
			if (err) {return next(err);}
			// sin errores, render
			res.render('grafico',{title: 'Personas1',persona_list: list_personas});
		});
};