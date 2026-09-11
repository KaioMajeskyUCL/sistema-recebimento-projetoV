const bcrypt = require('bcrypt');
const usuarioRepository = require('../repositories/usuarioRepository');
const jwt = require('jsonwebtoken');

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

async function login(email, senha) {
    if (!email || !senha) {
        throw new Error('E-mail e senha são obrigatórios.');
    }

    const usuario = await usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
        throw new Error('E-mail ou senha inválidos.');
    }

    const senhaCorreta = await bcrypt.compare(
        senha,
        usuario.senha_hash
    );

    if (!senhaCorreta) {
        throw new Error('E-mail ou senha inválidos.');
    }

    const token = jwt.sign(
        {
            id: usuario.id,
            nome: usuario.nome,
            perfil: usuario.perfil
        },
        process.env.JWT_SECRET,
        {
            expiresIn: '8h'
        }
    );

    return {
        token,
        usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            perfil: usuario.perfil
        }
    };
}

module.exports = {
    cadastrar,
    login
};