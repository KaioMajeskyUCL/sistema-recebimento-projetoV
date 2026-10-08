
const dashboardRepository = require('../repositories/dashboardRepository');

async function obterResumo() {
    const totalCargas = await dashboardRepository.totalCargas();
    const totalPaletes = await dashboardRepository.totalPaletes();
    const tempoMedioEspera = await dashboardRepository.tempoMedioEspera();
    const tempoMedioDescarga = await dashboardRepository.tempoMedioDescarga();
    const cargasPorTipo = await dashboardRepository.cargasPorTipo();
    const cargasPorFornecedor = await dashboardRepository.cargasPorFornecedor();
    const cargasComProblemas = await dashboardRepository.cargasComProblemas();
    const problemasPorTipo = await dashboardRepository.problemasPorTipo();

    return {
        totalCargas,
        totalPaletes,
        tempoMedioEspera,
        tempoMedioDescarga,
        cargasPorTipo,
        cargasPorFornecedor,
        cargasComProblemas,
        problemasPorTipo
    };
}

module.exports = {
    obterResumo
};
