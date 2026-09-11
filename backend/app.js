const express = require('express');
require('dotenv').config();

const db = require('./config/database');

const cargaRoutes = require('./routes/cargaRoutes');

const app = express();

app.use(express.json());

app.use('/cargas', cargaRoutes);

app.get('/', (req, res) => {
    res.json({
        mensagem: 'API do Sistema de Gestão de Recebimento funcionando!'
    });
});

app.get('/teste-db', async (req, res) => {
    try {
        const [resultado] = await db.query('SELECT 1 AS conectado');

        res.json({
            mensagem: 'Banco de dados conectado com sucesso!',
            resultado: resultado[0]
        });
    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao conectar ao banco de dados.'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});