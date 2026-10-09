
const express = require('express');
const router = express.Router();

const assistenteController = require('../controllers/assistenteController');
const authMiddleware = require('../middlewares/authMiddleware');
const assistenteRateLimit = require('../middlewares/assistenteRateLimit');

router.post(
    '/perguntar',
    authMiddleware,
    assistenteRateLimit,
    assistenteController.perguntar
);

module.exports = router;
