
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

module.exports = {
    obterResumo
};
