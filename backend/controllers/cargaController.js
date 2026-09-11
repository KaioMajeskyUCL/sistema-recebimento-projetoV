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

async function atualizar(req, res) {
    try {
        await cargaService.atualizar(req.params.id, req.body);

        res.status(200).json({
            mensagem: 'Carga atualizada com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        if (erro.message === 'Carga não encontrada.') {
            return res.status(404).json({
                mensagem: erro.message
            });
        }

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensagem: 'Já existe uma carga cadastrada com esse número.'
            });
        }

        if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                mensagem: 'O fornecedor informado não existe.'
            });
        }

        res.status(400).json({
            mensagem: erro.message || 'Erro ao atualizar carga.'
        });
    }
}

async function excluir(req, res) {
    try {
        await cargaService.excluir(req.params.id);

        res.status(200).json({
            mensagem: 'Carga excluída com sucesso!'
        });

    } catch (erro) {
        console.error(erro);

        if (erro.message === 'Carga não encontrada.') {
            return res.status(404).json({
                mensagem: erro.message
            });
        }

        res.status(400).json({
            mensagem: 'Erro ao excluir carga.'
        });
    }
}

async function atualizarStatus(req, res) {
    try {
            const { status } = req.body;

            const idUsuario = req.usuario.id;

        await cargaService.atualizarStatus(
            req.params.id,
            status,
            idUsuario
        );

        res.status(200).json({
            mensagem: 'Status da carga atualizado e registrado no histórico!'
        });

    } catch (erro) {
        console.error(erro);

        if (erro.message === 'Carga não encontrada.') {
            return res.status(404).json({
                mensagem: erro.message
            });
        }

        if (erro.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({
                mensagem: 'O usuário informado não existe.'
            });
        }

        res.status(400).json({
            mensagem: erro.message
        });
    }
}

async function buscarHistorico(req, res) {
    try {
        const historico = await cargaService.buscarHistorico(req.params.id);

        res.status(200).json(historico);

    } catch (erro) {
        console.error(erro);

        if (erro.message === 'Carga não encontrada.') {
            return res.status(404).json({
                mensagem: erro.message
            });
        }

        res.status(500).json({
            mensagem: 'Erro ao consultar histórico da carga.'
        });
    }
}

module.exports = {
    criar,
    listarTodas,
    buscarPorId,
    atualizar,
    excluir,
    atualizarStatus,
    buscarHistorico
};