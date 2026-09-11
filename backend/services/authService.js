const bcrypt = require('bcrypt');
const usuarioRepository = require('../repositories/usuarioRepository');

async function cadastrar(dados) {
    const { nome, email, senha, perfil } = dados;

    if (!nome || !email || !senha || !perfil) {
        throw new Error('Todos os campos são obrigatórios.');
    }

    const perfisValidos = [
        'AUXILIAR_ADMINISTRATIVO',
        'ENCARREGADO'
    ];

    if (!perfisValidos.includes(perfil)) {
        throw new Error('Perfil de usuário inválido.');
    }

    if (senha.length < 6) {
        throw new Error('A senha deve possuir pelo menos 6 caracteres.');
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    return await usuarioRepository.criar({
        nome,
        email,
        senha_hash: senhaHash,
        perfil
    });
}

module.exports = {
    cadastrar
};