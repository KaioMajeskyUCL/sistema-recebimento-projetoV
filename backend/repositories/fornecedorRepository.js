const db = require('../config/database');

async function criar(cnpj, nome) {
    const sql = `
        INSERT INTO Fornecedor (cnpj, nome)
        VALUES (?, ?)
    `;

    const [resultado] = await db.execute(sql, [cnpj, nome]);

    return resultado.insertId;
}

async function listarTodos() {
    const sql = `
        SELECT
            id,
            cnpj,
            nome
        FROM Fornecedor
        WHERE ativo = TRUE
        ORDER BY nome ASC
    `;

    const [resultado] = await db.execute(sql);

    return resultado;
}

async function buscarPorId(id) {
    const sql = `
        SELECT
            id,
            cnpj,
            nome
        FROM Fornecedor
        WHERE id = ?
          AND ativo = TRUE
    `;

    const [resultado] = await db.execute(sql, [id]);

    return resultado[0];
}

async function atualizar(id, cnpj, nome) {
    const sql = `
        UPDATE Fornecedor
        SET cnpj = ?,
            nome = ?
        WHERE id = ?
          AND ativo = TRUE
    `;

    const [resultado] = await db.execute(sql, [cnpj, nome, id]);

    return resultado;
}

async function excluir(id) {
    const sql = `
        UPDATE Fornecedor
        SET ativo = FALSE
        WHERE id = ?
          AND ativo = TRUE
    `;

    const [resultado] = await db.execute(sql, [id]);

    return resultado;
}

module.exports = {
    criar,
    listarTodos,
    buscarPorId,
    atualizar,
    excluir
};