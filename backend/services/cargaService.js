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

async function listarTodas(
    pagina = 1,
    limite = 20,
    status = null,
    tipo = null,
    idFornecedor = null,
    dataInicio = null,
    dataFim = null,
    numeroCarga = null
) {
    pagina = Number(pagina);
    limite = Number(limite);

    if (pagina < 1 || !Number.isInteger(pagina)) {
        pagina = 1;
    }

    if (limite < 1 || !Number.isInteger(limite)) {
        limite = 20;
    }

    if (limite > 100) {
        limite = 100;
    }

    const statusValidos = [
        'SEM_STATUS',
        'PRESENTE',
        'DOCADO',
        'EM_CONFERENCIA',
        'FINALIZADO',
        'COM_PROBLEMAS'
    ];

    if (status && !statusValidos.includes(status)) {
        const erro = new Error('Status inválido.');
        erro.status = 400;
        throw erro;
    }

    const tiposValidos = [
        'CARGA_SECA',
        'CAMARA_FRIA'
    ];

    if (tipo && !tiposValidos.includes(tipo)) {
        const erro = new Error('Tipo de carga inválido.');
        erro.status = 400;
        throw erro;
    }

    if (idFornecedor) {
    idFornecedor = Number(idFornecedor);

    if (!Number.isInteger(idFornecedor) || idFornecedor < 1) {
        const erro = new Error('Fornecedor inválido.');
        erro.status = 400;
        throw erro;
    }
}

const formatoData = /^\d{4}-\d{2}-\d{2}$/;

if (dataInicio && !formatoData.test(dataInicio)) {
    const erro = new Error('Data inicial inválida. Use o formato YYYY-MM-DD.');
    erro.status = 400;
    throw erro;
}

if (dataFim && !formatoData.test(dataFim)) {
    const erro = new Error('Data final inválida. Use o formato YYYY-MM-DD.');
    erro.status = 400;
    throw erro;
}

if (dataInicio && dataFim && dataInicio > dataFim) {
    const erro = new Error('A data inicial não pode ser maior que a data final.');
    erro.status = 400;
    throw erro;
}

if (numeroCarga) {
    numeroCarga = Number(numeroCarga);

    if (!Number.isInteger(numeroCarga) || numeroCarga < 1) {
        const erro = new Error('Número da carga inválido.');
        erro.status = 400;
        throw erro;
    }
}

const cargas = await cargaRepository.listarTodas(
    pagina,
    limite,
    status,
    tipo,
    idFornecedor,
    dataInicio,
    dataFim,
    numeroCarga
);

const total = await cargaRepository.contarTodas(
    status,
    tipo,
    idFornecedor,
    dataInicio,
    dataFim,
    numeroCarga
);

    return {
        dados: cargas,
        paginacao: {
            pagina,
            limite,
            total,
            totalPaginas: Math.ceil(total / limite)
        }
    };
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