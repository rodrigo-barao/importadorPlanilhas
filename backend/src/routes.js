const express = require('express');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
const routes = express.Router();

const CobrancaController = require('./controllers/CobrancaController');
const UnidadeController = require('./controllers/UnidadesController');

routes.post('/uploadCobranca', upload.any(), CobrancaController.processarCobrancaAction);
routes.post('/uploadUnidade', upload.any(), UnidadeController.processarUnidadeAction);
routes.get('/teste', CobrancaController.testeAction);

module.exports = routes;
