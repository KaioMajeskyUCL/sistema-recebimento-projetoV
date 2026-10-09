const express = require('express');
require('dotenv').config();
const db = require('./config/database');
const cargaRoutes = require('./routes/cargaRoutes');
const fornecedorRoutes = require('./routes/fornecedorRoutes');
const tipoProblemaRoutes = require('./routes/tipoProblemaRoutes');
const app = express();
const authRoutes = require('./routes/authRoutes');
const problemaRoutes = require('./routes/problemaRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const path = require('path');

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/cargas', cargaRoutes);
app.use('/fornecedores', fornecedorRoutes);
app.use('/tipos-problema', tipoProblemaRoutes);
app.use('/problemas', problemaRoutes);
app.use('/dashboard', dashboardRoutes);

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

app.use('/frontend', express.static(
    path.join(__dirname, '../frontend')
));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});