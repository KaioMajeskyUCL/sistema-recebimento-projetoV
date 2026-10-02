const problemaService = require('../services/problemaService');

async function criar(req, res) {
    try {
        const problema = await problemaService.criar(req.body);

        return res.status(201).json({
            mensagem: 'Problema registrado com sucesso.',
            problema
        });
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function listarTodos(req, res) {
    try {
        const problemas = await problemaService.listarTodos();

        return res.status(200).json(problemas);
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const problema = await problemaService.buscarPorId(req.params.id);

        return res.status(200).json(problema);
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function atualizar(req, res) {
    try {
        const problema = await problemaService.atualizar(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            mensagem: 'Problema atualizado com sucesso.',
            problema
        });
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function excluir(req, res) {
    try {
        const resultado = await problemaService.excluir(req.params.id);

        return res.status(200).json(resultado);
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

module.exports = {
    criar,
    listarTodos,
    buscarPorId,
    atualizar,
    excluir
};