const problemaRepository = require('../repositories/problemaRepository');
const cargaRepository = require('../repositories/cargaRepository');
const tipoProblemaRepository = require('../repositories/tipoProblemaRepository');

async function criar(dados) {
    const { id_carga, id_tipo_problema, descricao } = dados;

    if (!id_carga || !id_tipo_problema || !descricao) {
        const erro = new Error(
            'Carga, tipo de problema e descrição são obrigatórios.'
        );
        erro.status = 400;
        throw erro;
    }

    const carga = await cargaRepository.buscarPorId(id_carga);

    if (!carga) {
        const erro = new Error('Carga não encontrada.');
        erro.status = 404;
        throw erro;
    }

    const tipoProblema =
        await tipoProblemaRepository.buscarPorId(id_tipo_problema);

    if (!tipoProblema) {
        const erro = new Error('Tipo de problema não encontrado.');
        erro.status = 404;
        throw erro;
    }

    const id = await problemaRepository.criar(
        id_carga,
        id_tipo_problema,
        descricao
    );

    return problemaRepository.buscarPorId(id);
}

async function listarTodos() {
    return problemaRepository.listarTodos();
}

async function buscarPorId(id) {
    const problema = await problemaRepository.buscarPorId(id);

    if (!problema) {
        const erro = new Error('Problema não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return problema;
}

async function atualizar(id, dados) {
    const { id_tipo_problema, descricao } = dados;

    await buscarPorId(id);

    if (!id_tipo_problema || !descricao) {
        const erro = new Error(
            'Tipo de problema e descrição são obrigatórios.'
        );
        erro.status = 400;
        throw erro;
    }

    const tipoProblema =
        await tipoProblemaRepository.buscarPorId(id_tipo_problema);

    if (!tipoProblema) {
        const erro = new Error('Tipo de problema não encontrado.');
        erro.status = 404;
        throw erro;
    }

    await problemaRepository.atualizar(
        id,
        id_tipo_problema,
        descricao
    );

    return problemaRepository.buscarPorId(id);
}

async function excluir(id) {
    await buscarPorId(id);

    await problemaRepository.excluir(id);

    return {
        mensagem: 'Problema excluído com sucesso.'
    };
}

module.exports = {
    criar,
    listarTodos,
    buscarPorId,
    atualizar,
    excluir
};