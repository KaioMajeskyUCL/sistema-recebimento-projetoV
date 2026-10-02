const express = require('express');
const fornecedorController = require('../controllers/fornecedorController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();

// Todas as rotas de fornecedor exigem autenticação
router.use(autenticar);

router.post('/', fornecedorController.criar);
router.get('/', fornecedorController.listarTodos);
router.get('/:id', fornecedorController.buscarPorId);
router.put('/:id', fornecedorController.atualizar);
router.delete('/:id', fornecedorController.excluir);

module.exports = router;