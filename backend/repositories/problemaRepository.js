const db = require('../config/database');

async function criar(idCarga, idTipoProblema, descricao) {
    const sql = `
        INSERT INTO Problema (
            id_carga,
            id_tipo_problema,
            descricao,
            data_registro
        )
        VALUES (?, ?, ?, NOW())
    `;

    const [resultado] = await db.execute(sql, [
        idCarga,
        idTipoProblema,
        descricao
    ]);

    return resultado.insertId;
}

async function listarTodos() {
    const sql = `
        SELECT
            p.id,
            p.id_carga,
            c.numero_carga,
            p.id_tipo_problema,
            tp.nome AS tipo_problema,
            p.descricao,
            p.data_registro
        FROM Problema p
        INNER JOIN Carga c
            ON p.id_carga = c.id
        INNER JOIN TipoProblema tp
            ON p.id_tipo_problema = tp.id
        ORDER BY p.data_registro DESC
    `;

    const [resultado] = await db.execute(sql);

    return resultado;
}

async function buscarPorId(id) {
    const sql = `
        SELECT
            p.id,
            p.id_carga,
            c.numero_carga,
            p.id_tipo_problema,
            tp.nome AS tipo_problema,
            p.descricao,
            p.data_registro
        FROM Problema p
        INNER JOIN Carga c
            ON p.id_carga = c.id
        INNER JOIN TipoProblema tp
            ON p.id_tipo_problema = tp.id
        WHERE p.id = ?
    `;

    const [resultado] = await db.execute(sql, [id]);

    return resultado[0];
}

async function atualizar(id, idTipoProblema, descricao) {
    const sql = `
        UPDATE Problema
        SET id_tipo_problema = ?,
            descricao = ?
        WHERE id = ?
    `;

    const [resultado] = await db.execute(sql, [
        idTipoProblema,
        descricao,
        id
    ]);

    return resultado;
}

async function excluir(id) {
    const sql = `
        DELETE FROM Problema
        WHERE id = ?
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