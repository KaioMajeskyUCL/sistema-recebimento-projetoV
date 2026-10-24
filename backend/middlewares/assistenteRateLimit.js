const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const assistenteRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,

    keyGenerator: (req) => {
        // Prioriza o identificador do usuário autenticado.
        const usuarioId = req.usuario?.id ?? req.user?.id;

        if (usuarioId != null) {
            return `usuario:${usuarioId}`;
        }

        // Trata corretamente endereços IPv4 e IPv6.
        return ipKeyGenerator(req.ip);
    },

    message: {
        mensagem: 'Limite de 5 perguntas por minuto atingido. Aguarde um pouco.'
    }
});

module.exports = assistenteRateLimit;