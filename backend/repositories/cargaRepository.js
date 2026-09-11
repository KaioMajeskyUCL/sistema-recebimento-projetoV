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

async function listarTodas() {
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
            f.nome AS fornecedor
        FROM Carga c
        INNER JOIN Fornecedor f
            ON c.id_fornecedor = f.id
        ORDER BY c.data DESC, c.id DESC
    `;

    const [resultado] = await db.query(sql);

    return resultado;
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
    `;

    const [resultado] = await db.execute(sql, [id]);

    return resultado[0];
}

module.exports = {
    criar,
    listarTodas,
    buscarPorId
};