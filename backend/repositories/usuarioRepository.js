const db = require('../config/database');

async function criar(usuario) {
    const sql = `
        INSERT INTO Usuario (
            nome,
            email,
            senha_hash,
            perfil
        )
        VALUES (?, ?, ?, ?)
    `;

    const [resultado] = await db.execute(sql, [
        usuario.nome,
        usuario.email,
        usuario.senha_hash,
        usuario.perfil
    ]);

    return resultado;
}

async function buscarPorEmail(email) {
    const sql = `
        SELECT
            id,
            nome,
            email,
            senha_hash,
            perfil
        FROM Usuario
        WHERE email = ?
    `;

    const [resultado] = await db.execute(sql, [email]);

    return resultado[0];
}

module.exports = {
    criar,
    buscarPorEmail
};