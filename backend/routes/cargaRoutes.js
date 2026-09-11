const express = require('express');
const cargaController = require('../controllers/cargaController');

const router = express.Router();

router.post('/', cargaController.criar);

module.exports = router;