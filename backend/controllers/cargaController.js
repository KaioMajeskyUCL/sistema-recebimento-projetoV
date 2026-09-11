const cargaService = require('../services/cargaService');

async function criar(req, res) {
    try {
        const resultado = await cargaService.criar(req.body);

        res.status(201).json({
            mensagem: 'Carga cadastrada com sucesso!',
            id: resultado.insertId
        });
    } catch (erro) {
        console.error(erro);

        res.status(400).json({
            mensagem: erro.message
        });
    }
}

module.exports = {
    criar
};