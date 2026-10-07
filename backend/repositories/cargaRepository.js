const db = require('../config/database');

async function criar(carga) {
    const sql = `
        INSERT INTO Carga (
            id_fornecedor,
            numero_carga,
            data,
            tipo_carga,
            quantidade_paletes,
            hora_chegada,
            hora_docagem,
            hora_finalizacao,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const valores = [
        carga.id_fornecedor,
        carga.numero_carga,
        carga.data,
        carga.tipo_carga,
        carga.quantidade_paletes,
        carga.hora_chegada,
        carga.hora_docagem || null,
        carga.hora_finalizacao || null,
        carga.status
    ];

    const [resultado] = await db.execute(sql, valores);

    return resultado;
}

async function listarTodas(
    pagina = 1,
    limite = 20,
    status = null,
    tipo = null,
    idFornecedor = null,
    dataInicio = null,
    dataFim = null,
    numeroCarga = null
) {
    const offset = (pagina - 1) * limite;

    let sql = `
        SELECT
            c.id,
            c.numero_carga,
            c.data,
            c.tipo_carga,
            c.quantidade_paletes,
            c.hora_chegada,
            c.hora_docagem,
            c.hora_finalizacao,
            c.status,
            c.id_fornecedor,
            f.nome AS fornecedor
        FROM Carga c
        INNER JOIN Fornecedor f
            ON c.id_fornecedor = f.id
        WHERE c.ativo = TRUE
    `;

    const valores = [];

    if (status) {
        sql += ` AND c.status = ?`;
        valores.push(status);
    }

    if (tipo) {
        sql += ` AND c.tipo_carga = ?`;
        valores.push(tipo);
    }

    if (idFornecedor) {
    sql += ` AND c.id_fornecedor = ?`;
    valores.push(idFornecedor);
    }

    if (dataInicio) {
    sql += ` AND c.data >= ?`;
    valores.push(dataInicio);
}

if (dataFim) {
    sql += ` AND c.data <= ?`;
    valores.push(dataFim);
}

if (numeroCarga) {
    sql += ` AND numero_carga = ?`;
    valores.push(numeroCarga);
}

    sql += `
        ORDER BY c.id DESC
        LIMIT ? OFFSET ?
    `;

    valores.push(limite, offset);

    const [resultado] = await db.query(sql, valores);

    return resultado;
}

async function contarTodas(
    status = null,
    tipo = null,
    idFornecedor = null,
    dataInicio = null,
    dataFim = null,
    numeroCarga = null
) {
    let sql = `
        SELECT COUNT(*) AS total
        FROM Carga
        WHERE ativo = TRUE
    `;

    const valores = [];

    if (status) {
        sql += ` AND status = ?`;
        valores.push(status);
    }

    if (tipo) {
        sql += ` AND tipo_carga = ?`;
        valores.push(tipo);
    }

    if (idFornecedor) {
    sql += ` AND id_fornecedor = ?`;
    valores.push(idFornecedor);
}

if (dataInicio) {
    sql += ` AND data >= ?`;
    valores.push(dataInicio);
}

if (dataFim) {
    sql += ` AND data <= ?`;
    valores.push(dataFim);
}

if (numeroCarga) {
    sql += ` AND numero_carga = ?`;
    valores.push(numeroCarga);
}

    const [resultado] = await db.execute(sql, valores);

    return resultado[0].total;
}

async function buscarPorId(id) {
    const sql = `
        SELECT
            c.id,
            c.numero_carga,
            c.data,
            c.tipo_carga,
            c.quantidade_paletes,
            c.hora_chegada,
            c.hora_docagem,
            c.hora_finalizacao,
            c.status,
            c.id_fornecedor,
            f.nome AS fornecedor
        FROM Carga c
        INNER JOIN Fornecedor f
            ON c.id_fornecedor = f.id
        WHERE c.id = ?
          AND c.ativo = TRUE
    `;

    const [resultado] = await db.execute(sql, [id]);

    return resultado[0];
}

async function atualizar(id, carga) {
    const sql = `
        UPDATE Carga
        SET
            id_fornecedor = ?,
            numero_carga = ?,
            data = ?,
            tipo_carga = ?,
            quantidade_paletes = ?,
            hora_chegada = ?,
            hora_docagem = ?,
            hora_finalizacao = ?,
            status = ?
        WHERE id = ?
    `;

    const valores = [
        carga.id_fornecedor,
        carga.numero_carga,
        carga.data,
        carga.tipo_carga,
        carga.quantidade_paletes,
        carga.hora_chegada,
        carga.hora_docagem || null,
        carga.hora_finalizacao || null,
        carga.status,
        id
    ];

    const [resultado] = await db.execute(sql, valores);

    return resultado;
}

async function excluir(id) {
    const sql = `
        UPDATE Carga
        SET ativo = FALSE
        WHERE id = ?
    `;

    const [resultado] = await db.execute(sql, [id]);

    return resultado;
}

async function atualizarStatus(id, status) {
    const sql = `
        UPDATE Carga
        SET status = ?
        WHERE id = ?
    `;

    const [resultado] = await db.execute(sql, [status, id]);

    return resultado;
}

async function atualizarStatusComHistorico(id, status, idUsuario) {
    const conexao = await db.getConnection();

    try {
        await conexao.beginTransaction();

        await conexao.execute(
            `
            UPDATE Carga
            SET status = ?
            WHERE id = ?
            `,
            [status, id]
        );

        await conexao.execute(
            `
            INSERT INTO HistoricoStatus (
                id_carga,
                status,
                data_hora,
                id_usuario
            )
            VALUES (?, ?, NOW(), ?)
            `,
            [id, status, idUsuario]
        );

        await conexao.commit();

    } catch (erro) {
        await conexao.rollback();
        throw erro;

    } finally {
        conexao.release();
    }
}

async function buscarHistorico(idCarga) {
    const sql = `
        SELECT
            h.id,
            h.status,
            h.data_hora,
            h.id_usuario,
            u.nome AS usuario
        FROM HistoricoStatus h
        INNER JOIN Usuario u
            ON h.id_usuario = u.id
        WHERE h.id_carga = ?
        ORDER BY h.data_hora DESC
    `;

    const [resultado] = await db.execute(sql, [idCarga]);

    return resultado;
}

module.exports = {
    criar,
    listarTodas,
    contarTodas,
    buscarPorId,
    atualizar,
    excluir,
    atualizarStatus,
    atualizarStatusComHistorico,
    buscarHistorico
};