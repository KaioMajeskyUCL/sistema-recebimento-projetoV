const express = require('express');
const problemaController = require('../controllers/problemaController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(autenticar);

router.post('/', problemaController.criar);
router.get('/', problemaController.listarTodos);
router.get('/:id', problemaController.buscarPorId);
router.put('/:id', problemaController.atualizar);
router.delete('/:id', problemaController.excluir);

module.exports = router;