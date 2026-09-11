const express = require('express');
const cargaController = require('../controllers/cargaController');

const router = express.Router();

router.get('/', cargaController.listarTodas);
router.get('/:id', cargaController.buscarPorId);
router.post('/', cargaController.criar);
router.put('/:id', cargaController.atualizar);
router.delete('/:id', cargaController.excluir);
router.patch('/:id/status', cargaController.atualizarStatus);

module.exports = router;