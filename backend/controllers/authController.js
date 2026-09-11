const authService = require('../services/authService');

async function cadastrar(req, res) {
    try {
        const resultado = await authService.cadastrar(req.body);

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso!',
            id: resultado.insertId
        });

    } catch (erro) {
        console.error(erro);

        if (erro.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                mensagem: 'Já existe um usuário cadastrado com esse e-mail.'
            });
        }

        res.status(400).json({
            mensagem: erro.message
        });
    }
}

module.exports = {
    cadastrar
};