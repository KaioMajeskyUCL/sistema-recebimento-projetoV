const tipoProblemaRepository = require('../repositories/tipoProblemaRepository');

async function listarTodos() {
    return tipoProblemaRepository.listarTodos();
}

async function buscarPorId(id) {
    const tipoProblema = await tipoProblemaRepository.buscarPorId(id);

    if (!tipoProblema) {
        const erro = new Error('Tipo de problema não encontrado.');
        erro.status = 404;
        throw erro;
    }

    return tipoProblema;
}

module.exports = {
    listarTodos,
    buscarPorId
};