
const assistenteService = require('../services/assistenteService');

async function perguntar(req, res) {
    try {
        const { pergunta } = req.body || {};

        const resultado = await assistenteService.perguntar(pergunta);

        return res.status(200).json(resultado);

    } catch (erro) {
        console.error('Erro no assistente:', erro.message);

        const status = erro.status || 500;

        return res.status(status).json({
            mensagem: status === 500
                ? 'Erro interno no assistente IA.'
                : erro.message
        });
    }
}

module.exports = {
    perguntar
};
