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

module.exports = {
    criar
};