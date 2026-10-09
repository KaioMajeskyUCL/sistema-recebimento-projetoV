
const { rateLimit } = require('express-rate-limit');

const assistenteRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,

    keyGenerator: (req) => {
        // Utiliza o identificador do usuário autenticado.
        // Se não existir, utiliza o IP.
        return String(
            req.usuario?.id ??
            req.user?.id ??
            req.ip
        );
    },

    message: {
        mensagem: 'Limite de 5 perguntas por minuto atingido. Aguarde um pouco.'
    }
});

module.exports = assistenteRateLimit;
