USE sistema_recebimento;

-- =========================================
-- POVOAMENTO INICIAL - ENTREGA 4
-- =========================================

-- FORNECEDORES
INSERT INTO Fornecedor (cnpj, nome) VALUES
('11111111000111', 'Fornecedor Alfa'),
('22222222000122', 'Fornecedor Beta'),
('33333333000133', 'Fornecedor Gama');


-- CARGAS
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
) VALUES
(1, 9001, '2026-10-20', 'CARGA_SECA', 20,
 '07:00:00', '07:30:00', '08:15:00', 'FINALIZADO'),

(2, 9002, '2026-10-20', 'CAMARA_FRIA', 15,
 '08:00:00', '08:40:00', '09:30:00', 'FINALIZADO'),

(3, 9003, '2026-10-20', 'CARGA_SECA', 25,
 '09:00:00', '09:20:00', NULL, 'EM_CONFERENCIA'),

(1, 9004, '2026-10-21', 'CAMARA_FRIA', 12,
 '10:00:00', '10:45:00', NULL, 'DOCADO'),

(2, 9005, '2026-10-21', 'CARGA_SECA', 18,
 '11:00:00', NULL, NULL, 'PRESENTE'),

(3, 9006, '2026-10-21', 'CAMARA_FRIA', 22,
 '12:00:00', '12:30:00', '13:20:00', 'COM_PROBLEMAS'),

(1, 9007, '2026-10-22', 'CARGA_SECA', 30,
 '07:30:00', '08:00:00', '09:10:00', 'FINALIZADO'),

(2, 9008, '2026-10-22', 'CAMARA_FRIA', 16,
 '09:00:00', NULL, NULL, 'PRESENTE');


-- PROBLEMAS
INSERT INTO Problema (
    id_carga,
    id_tipo_problema,
    descricao,
    data_registro
)
SELECT
    c.id,
    tp.id,
    'Temperatura acima do limite esperado',
    '2026-10-21 13:00:00'
FROM Carga c
JOIN TipoProblema tp ON tp.nome = 'TEMPERATURA'
WHERE c.numero_carga = 9006;

INSERT INTO Problema (
    id_carga,
    id_tipo_problema,
    descricao,
    data_registro
)
SELECT
    c.id,
    tp.id,
    'Embalagens danificadas durante a descarga',
    '2026-10-20 08:00:00'
FROM Carga c
JOIN TipoProblema tp ON tp.nome = 'AVARIA'
WHERE c.numero_carga = 9001;