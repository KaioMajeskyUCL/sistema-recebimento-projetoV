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

module.exports = {
    criar,
    listarTodas,
    buscarPorId
};