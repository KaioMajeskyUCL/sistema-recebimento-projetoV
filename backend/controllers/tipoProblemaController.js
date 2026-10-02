const tipoProblemaService = require('../services/tipoProblemaService');

async function listarTodos(req, res) {
    try {
        const tipos = await tipoProblemaService.listarTodos();

        return res.status(200).json(tipos);
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const tipo = await tipoProblemaService.buscarPorId(req.params.id);

        return res.status(200).json(tipo);
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

module.exports = {
    listarTodos,
    buscarPorId
};