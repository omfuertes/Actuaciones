var express = require('express');
var router = express.Router();

// Require controller modules
var registro_controller = require('../controllers/registroController');
var persona_controller = require('../controllers/personaController');
var actuacion_controller = require('../controllers/actuacionController');
var ubicacion_controller = require('../controllers/ubicacionController');
var dependencia_controller = require('../controllers/dependenciaController');

/// Registro Rutes ///
// GET catalog home page. //
router.get('/', registro_controller.index);

// GET request for creating a registro.  //
router.get('/registro/create', registro_controller.registro_create_get);

// POST request for create registro
router.post('/registro/create', registro_controller.registro_create_post);

// GET request to delete registro. //
router.get('/registro/:id/delete', registro_controller.registro_delete_get);

// POST requets for delete registro
router.post('/registro/:id/delete', registro_controller.registro_delete_post)

// GET request for registro update form on GET
router.get('/registro/:id/update', registro_controller.registro_update_get);

// POST request for update registro
router.post('/registro/:id/update', registro_controller.registro_update_post);

// GET request for list of all registros items. //
router.get('/registro', registro_controller.registro_list);

// GET request  for a specific registro//
router.get('/registro/:id', registro_controller.registro_detail);



/// Ubicacion Rutes ///

// GET request for creating a ubicacion. NOTE This must come before routes that display Book (uses id) //
router.get('/ubicacion/create', ubicacion_controller.ubicacion_create_get);

// POST request for create ubicacion
router.post('/ubicacion/create', ubicacion_controller.ubicacion_create_post);

// GET request to delete ubicacion. //
router.get('/ubicacion/:id/delete', ubicacion_controller.ubicacion_delete_get);

// POST requets for delete ubicacion
router.post('/ubicacion/:id/delete', ubicacion_controller.ubicacion_delete_post)

// GET request for ubicacion update form on GET
router.get('/ubicacion/:id/update', ubicacion_controller.ubicacion_update_get);

// POST request for update ubicacion
router.post('/ubicacion/:id/update', ubicacion_controller.ubicacion_update_post);

// GET request for list of all ubicacions items. //
router.get('/ubicacion', ubicacion_controller.ubicacion_list);

// GET request  for a specific ubicacion
router.get('/ubicacion/:id', ubicacion_controller.ubicacion_detail);


/// Dependencia Rutes ///

// GET request for creating a dependencia. NOTE This must come before routes that display Book (uses id) //
router.get('/dependencia/create', dependencia_controller.dependencia_create_get);

// POST request for create dependencia
router.post('/dependencia/create', dependencia_controller.dependencia_create_post);

// GET request to delete dependencia. //
router.get('/dependencia/:id/delete', dependencia_controller.dependencia_delete_get);

// POST requets for delete dependencia
router.post('/dependencia/:id/delete', dependencia_controller.dependencia_delete_post);

// GET request for dependencia update form on GET
router.get('/dependencia/:id/update', dependencia_controller.dependencia_update_get);

// POST request for update dependencia
router.post('/dependencia/:id/update', dependencia_controller.dependencia_update_post);

// GET request for list of all ubicacions items. //
router.get('/dependencia', dependencia_controller.dependencia_list);

// GET request  for a specific dependencia
router.get('/dependencia/:id', dependencia_controller.dependencia_detail);


/// actuacion Rutes ///

// GET request for creating a actuacion. NOTE This must come before routes that display Book (uses id) //
router.get('/actuacion/create', actuacion_controller.actuacion_create_get);

// POST request for create actuacion
router.post('/actuacion/create', actuacion_controller.actuacion_create_post);

// GET request to delete actuacion. //
router.get('/actuacion/:id/delete', actuacion_controller.actuacion_delete_get);

// POST requets for delete actuacion
router.post('/actuacion/:id/delete', actuacion_controller.actuacion_delete_post)

// GET request for actuacion update form on GET
router.get('/actuacion/:id/update', actuacion_controller.actuacion_update_get);

// POST request for update actuacion
router.post('/actuacion/:id/update', actuacion_controller.actuacion_update_post);

// GET request for list of all actuacion items. //
router.get('/actuacion', actuacion_controller.actuacion_list);

// GET request  for a specific actuacion
router.get('/actuacion/:id', actuacion_controller.actuacion_detail);



/// persona Rutes ///

// GET request for creating a persona. NOTE This must come before routes that display Book (uses id) //
router.get('/persona/create', persona_controller.persona_create_get);

// POST request for create persona
router.post('/persona/create', persona_controller.persona_create_post);

// GET request to delete persona. //
router.get('/persona/:id/delete', persona_controller.persona_delete_get);

// POST requets for delete persona
router.post('/persona/:id/delete', persona_controller.persona_delete_post)

// GET request for persona update form on GET
router.get('/persona/:id/update', persona_controller.persona_update_get);

// POST request for update persona
router.post('/persona/:id/update', persona_controller.persona_update_post);

// GET request for list of all persona items. //
router.get('/persona', persona_controller.persona_list);

// GET request  for a specific persona//
router.get('/persona/:id', persona_controller.persona_detail);


// GET request  for a specific persona//
router.get('/grafico/aaa', persona_controller.persona_list1);



module.exports = router;