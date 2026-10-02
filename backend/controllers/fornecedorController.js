const fornecedorService = require('../services/fornecedorService');

async function criar(req, res) {
    try {
        const fornecedor = await fornecedorService.criar(req.body);

        return res.status(201).json({
            mensagem: 'Fornecedor cadastrado com sucesso.',
            fornecedor
        });
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function listarTodos(req, res) {
    try {
        const fornecedores = await fornecedorService.listarTodos();

        return res.status(200).json(fornecedores);
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const fornecedor = await fornecedorService.buscarPorId(req.params.id);

        return res.status(200).json(fornecedor);
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function atualizar(req, res) {
    try {
        const fornecedor = await fornecedorService.atualizar(
            req.params.id,
            req.body
        );

        return res.status(200).json({
            mensagem: 'Fornecedor atualizado com sucesso.',
            fornecedor
        });
    } catch (erro) {
        return res.status(erro.status || 500).json({
            mensagem: erro.message || 'Erro interno do servidor.'
        });
    }
}

async function excluir(req, res) {
    try {
        const resultado = await fornecedorService.excluir(req.params.id);

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