
const db = require('../config/database');

// Total de cargas ativas cadastradas
async function totalCargas() {
    const [rows] = await db.query(`
        SELECT COUNT(*) AS total
        FROM Carga
        WHERE ativo = TRUE
    `);

    return rows[0].total;
}

async function totalPaletes() {
    const [rows] = await db.query(`
        SELECT COALESCE(SUM(quantidade_paletes), 0) AS total
        FROM Carga
        WHERE ativo = TRUE
    `);

    return Number(rows[0].total);
}


async function tempoMedioEspera() {
    const [rows] = await db.query(`
        SELECT
            ROUND(
                AVG(
                    TIMESTAMPDIFF(
                        MINUTE,
                        hora_chegada,
                        hora_docagem
                    )
                ),
                2
            ) AS media_minutos
        FROM Carga
        WHERE ativo = TRUE
          AND hora_chegada IS NOT NULL
          AND hora_docagem IS NOT NULL
          AND hora_docagem >= hora_chegada
    `);

    return rows[0].media_minutos === null
        ? 0
        : Number(rows[0].media_minutos);
}


async function tempoMedioDescarga() {
    const [rows] = await db.query(`
        SELECT
            ROUND(
                AVG(
                    TIME_TO_SEC(
                        TIMEDIFF(hora_finalizacao, hora_docagem)
                    ) / 60
                ),
                2
            ) AS media_minutos
        FROM Carga
        WHERE ativo = TRUE
          AND hora_docagem IS NOT NULL
          AND hora_finalizacao IS NOT NULL
          AND hora_finalizacao >= hora_docagem
    `);

    return rows[0].media_minutos === null
        ? 0
        : Number(rows[0].media_minutos);
}


async function cargasPorTipo() {
    const [rows] = await db.query(`
        SELECT
            tipo_carga AS tipo,
            COUNT(*) AS quantidade
        FROM Carga
        WHERE ativo = TRUE
        GROUP BY tipo_carga
        ORDER BY quantidade DESC
    `);

    return rows;
}


async function cargasPorFornecedor() {
    const [rows] = await db.query(`
        SELECT
            f.id AS id_fornecedor,
            f.nome AS fornecedor,
            COUNT(c.id) AS quantidade
        FROM Carga c
        INNER JOIN Fornecedor f
            ON c.id_fornecedor = f.id
        WHERE c.ativo = TRUE
        GROUP BY f.id, f.nome
        ORDER BY quantidade DESC
    `);

    return rows;
}


async function cargasComProblemas() {
    const [rows] = await db.query(`
        SELECT
            COUNT(DISTINCT c.id) AS total
        FROM Carga c
        INNER JOIN Problema p
            ON p.id_carga = c.id
        WHERE c.ativo = TRUE
    `);

    return rows[0].total;
}


async function problemasPorTipo() {
    const [rows] = await db.query(`
        SELECT
            tp.id AS id_tipo,
            tp.nome AS tipo,
            COUNT(p.id) AS quantidade
        FROM TipoProblema tp
        INNER JOIN Problema p
            ON p.id_tipo_problema = tp.id
        INNER JOIN Carga c
            ON p.id_carga = c.id
        WHERE c.ativo = TRUE
        GROUP BY tp.id, tp.nome
        ORDER BY quantidade DESC
    `);

    return rows;
}


module.exports = {
    totalCargas,
    totalPaletes,
    tempoMedioEspera,
    tempoMedioDescarga,
    cargasPorTipo,
    cargasPorFornecedor,
    cargasComProblemas,
    problemasPorTipo
};


