
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


async function obterResumoPorPeriodo(dataInicio, dataFim) {
    // Valida o formato das datas
    const formatoData = /^\d{4}-\d{2}-\d{2}$/;

    if (
        !formatoData.test(dataInicio) ||
        !formatoData.test(dataFim)
    ) {
        const erro = new Error(
            'Informe as datas no formato AAAA-MM-DD.'
        );
        erro.status = 400;
        throw erro;
    }

    // Verifica se as datas existem no calendário
    function dataValida(valor) {
        const data = new Date(`${valor}T00:00:00Z`);

        return !Number.isNaN(data.getTime()) &&
            data.toISOString().slice(0, 10) === valor;
    }

    if (!dataValida(dataInicio) || !dataValida(dataFim)) {
        const erro = new Error('Data inválida.');
        erro.status = 400;
        throw erro;
    }

    if (dataInicio > dataFim) {
        const erro = new Error(
            'A data inicial não pode ser posterior à data final.'
        );
        erro.status = 400;
        throw erro;
    }


const totalCargas =
    await dashboardRepository.totalCargasPorPeriodo(
        dataInicio,
        dataFim
    );

const totalPaletes =
    await dashboardRepository.totalPaletesPorPeriodo(
        dataInicio,
        dataFim
    );

    
const tempoMedioEspera =
    await dashboardRepository.tempoMedioEsperaPorPeriodo(
        dataInicio,
        dataFim
    );

    
const tempoMedioDescarga =
    await dashboardRepository.tempoMedioDescargaPorPeriodo(
        dataInicio,
        dataFim
    );

    
const cargasPorTipo =
    await dashboardRepository.cargasPorTipoPorPeriodo(
        dataInicio,
        dataFim
    );

    
const cargasPorFornecedor =
    await dashboardRepository.cargasPorFornecedorPorPeriodo(
        dataInicio,
        dataFim
    );

    
const cargasComProblemas =
    await dashboardRepository.cargasComProblemasPorPeriodo(
        dataInicio,
        dataFim
    );

    
const problemasPorTipo =
    await dashboardRepository.problemasPorTipoPorPeriodo(
        dataInicio,
        dataFim
    );



return {
    dataInicio,
    dataFim,
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
    obterResumo,
    obterResumoPorPeriodo
};
