const db = require('../config/database');

async function listarTodos() {
    const sql = `
        SELECT
            id,
            nome,
            descricao
        FROM TipoProblema
        ORDER BY nome ASC
    `;

    const [resultado] = await db.execute(sql);

    return resultado;
}

async function buscarPorId(id) {
    const sql = `
        SELECT
            id,
            nome,
            descricao
        FROM TipoProblema
        WHERE id = ?
    `;

    const [resultado] = await db.execute(sql, [id]);

    return resultado[0];
}

module.exports = {
    listarTodos,
    buscarPorId
};