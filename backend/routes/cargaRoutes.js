const express = require('express');
const cargaController = require('../controllers/cargaController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();


router.use(autenticar);
router.get('/', cargaController.listarTodas);
router.get('/:id', cargaController.buscarPorId);
router.post('/', cargaController.criar);
router.put('/:id', cargaController.atualizar);
router.delete('/:id', cargaController.excluir);
router.patch('/:id/status', cargaController.atualizarStatus);
router.get('/:id/historico', cargaController.buscarHistorico);

module.exports = router;