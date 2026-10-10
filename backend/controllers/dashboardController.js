
const dashboardService = require('../services/dashboardService');

async function obterResumo(req, res) {
    try {
        const resumo = await dashboardService.obterResumo();

        return res.status(200).json(resumo);
    } catch (erro) {
        console.error('Erro ao consultar dashboard:', erro);

        return res.status(500).json({
            mensagem: 'Erro ao carregar os indicadores do dashboard.'
        });
    }
}


async function obterResumoPorPeriodo(req, res) {
    try {
        const { data_inicio, data_fim } = req.query;

        const resultado =
            await dashboardService.obterResumoPorPeriodo(
                data_inicio,
                data_fim
            );

        return res.status(200).json(resultado);

    } catch (erro) {
        console.error('Erro no filtro por período:', erro.message);

        return res.status(erro.status || 500).json({
            mensagem: erro.status === 400
                ? erro.message
                : 'Erro ao consultar indicadores por período.'
        });
    }
}


module.exports = {
    obterResumo,
     obterResumoPorPeriodo
};
