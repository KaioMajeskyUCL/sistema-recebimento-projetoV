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

        // Número da carga duplicado
        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensagem: 'Já existe uma carga cadastrada com esse número.'
            });
        }

        // Fornecedor informado não existe
        if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                mensagem: 'O fornecedor informado não existe.'
            });
        }

        // Outros erros
        res.status(400).json({
            mensagem: erro.message || 'Erro ao cadastrar carga.'
        });
    }
}

async function listarTodas(req, res) {
    try {
        const cargas = await cargaService.listarTodas();

        res.status(200).json(cargas);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: 'Erro ao consultar cargas.'
        });
    }
}

async function buscarPorId(req, res) {
    try {
        const carga = await cargaService.buscarPorId(req.params.id);

        res.status(200).json(carga);

    } catch (erro) {
        console.error(erro);

        if (erro.message === 'Carga não encontrada.') {
            return res.status(404).json({
                mensagem: erro.message
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao consultar carga.'
        });
    }
}

module.exports = {
    criar,
    listarTodas,
    buscarPorId
};