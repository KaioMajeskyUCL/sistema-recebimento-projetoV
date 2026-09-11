const express = require('express');
const cargaController = require('../controllers/cargaController');

const router = express.Router();

router.get('/', cargaController.listarTodas);
router.get('/:id', cargaController.buscarPorId);
router.post('/', cargaController.criar);

module.exports = router;