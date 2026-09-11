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

module.exports = {
    criar
};