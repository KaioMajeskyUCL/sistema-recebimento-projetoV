
const express = require('express');
const router = express.Router();

const dashboardController = require('../controllers/dashboardController');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', authMiddleware, dashboardController.obterResumo);

router.get(
    '/periodo',
    authMiddleware,
    dashboardController.obterResumoPorPeriodo
);

module.exports = router;
