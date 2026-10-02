const express = require('express');
const tipoProblemaController = require('../controllers/tipoProblemaController');
const autenticar = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(autenticar);

router.get('/', tipoProblemaController.listarTodos);
router.get('/:id', tipoProblemaController.buscarPorId);

module.exports = router;