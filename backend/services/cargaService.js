const cargaRepository = require('../repositories/cargaRepository');

async function criar(carga) {
    if (!carga.numero_carga) {
        throw new Error('Número da carga é obrigatório.');
    }

    if (!carga.id_fornecedor) {
        throw new Error('Fornecedor é obrigatório.');
    }

    if (!carga.data) {
        throw new Error('Data é obrigatória.');
    }

    if (!carga.tipo_carga) {
        throw new Error('Tipo da carga é obrigatório.');
    }

    if (!carga.quantidade_paletes || carga.quantidade_paletes <= 0) {
        throw new Error('A quantidade de paletes deve ser maior que zero.');
    }

    if (!carga.hora_chegada) {
        throw new Error('Hora de chegada é obrigatória.');
    }

    if (!carga.status) {
        throw new Error('Status é obrigatório.');
    }

    return await cargaRepository.criar(carga);
}

async function listarTodas() {
    return await cargaRepository.listarTodas();
}

async function buscarPorId(id) {
    const carga = await cargaRepository.buscarPorId(id);

    if (!carga) {
        throw new Error('Carga não encontrada.');
    }

    return carga;
}

async function atualizar(id, carga) {
    const cargaExistente = await cargaRepository.buscarPorId(id);

    if (!cargaExistente) {
        throw new Error('Carga não encontrada.');
    }

    if (!carga.numero_carga) {
        throw new Error('Número da carga é obrigatório.');
    }

    if (!carga.id_fornecedor) {
        throw new Error('Fornecedor é obrigatório.');
    }

    if (!carga.data) {
        throw new Error('Data é obrigatória.');
    }

    if (!carga.tipo_carga) {
        throw new Error('Tipo da carga é obrigatório.');
    }

    if (!carga.quantidade_paletes || carga.quantidade_paletes <= 0) {
        throw new Error('A quantidade de paletes deve ser maior que zero.');
    }

    if (!carga.hora_chegada) {
        throw new Error('Hora de chegada é obrigatória.');
    }

    if (!carga.status) {
        throw new Error('Status é obrigatório.');
    }

    return await cargaRepository.atualizar(id, carga);
}

async function excluir(id) {
    const cargaExistente = await cargaRepository.buscarPorId(id);

    if (!cargaExistente) {
        throw new Error('Carga não encontrada.');
    }

    return await cargaRepository.excluir(id);
}

async function atualizarStatus(id, status, idUsuario) {
    const cargaExistente = await cargaRepository.buscarPorId(id);

    if (!cargaExistente) {
        throw new Error('Carga não encontrada.');
    }

    const statusValidos = [
        'SEM_STATUS',
        'PRESENTE',
        'DOCADO',
        'EM_CONFERENCIA',
        'FINALIZADO',
        'COM_PROBLEMAS'
    ];

    if (!statusValidos.includes(status)) {
        throw new Error('Status inválido.');
    }

    if (!idUsuario) {
        throw new Error('Usuário é obrigatório para alterar o status.');
    }

    return await cargaRepository.atualizarStatusComHistorico(
        id,
        status,
        idUsuario
    );
}

async function buscarHistorico(id) {
    const cargaExistente = await cargaRepository.buscarPorId(id);

    if (!cargaExistente) {
        throw new Error('Carga não encontrada.');
    }

    return await cargaRepository.buscarHistorico(id);
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