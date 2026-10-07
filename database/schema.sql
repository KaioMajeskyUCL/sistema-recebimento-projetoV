DROP DATABASE IF EXISTS sistema_recebimento;

CREATE DATABASE sistema_recebimento;

USE sistema_recebimento;


-- =========================================
-- TABELA: Usuario
-- =========================================

CREATE TABLE Usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(40) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    perfil VARCHAR(30) NOT NULL,

    CONSTRAINT chk_usuario_perfil
        CHECK (perfil IN ('AUXILIAR_ADMINISTRATIVO', 'ENCARREGADO'))
);


-- =========================================
-- TABELA: Fornecedor
-- =========================================

CREATE TABLE Fornecedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cnpj VARCHAR(14) NOT NULL UNIQUE,
    nome VARCHAR(150) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE
);


-- =========================================
-- TABELA: TipoProblema
-- =========================================

CREATE TABLE TipoProblema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    descricao VARCHAR(255)
);

INSERT INTO TipoProblema (nome, descricao) VALUES
('AVARIA', 'Produto ou embalagem com avaria'),
('SOBRA_FALTA', 'Divergência entre a quantidade recebida e a quantidade esperada'),
('TEMPERATURA', 'Problema relacionado à temperatura da carga'),
('NOTA_FISCAL', 'Problema relacionado à nota fiscal ou documentação'),
('VALIDADE', 'Problema relacionado à validade dos produtos'),
('MOTORISTA', 'Ocorrência relacionada ao motorista'),
('OUTRO', 'Problema que não se enquadra nas demais categorias');


-- =========================================
-- TABELA: Carga
-- =========================================

CREATE TABLE Carga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_fornecedor INT NOT NULL,
    numero_carga INT NOT NULL UNIQUE,
    data DATE NOT NULL,
    tipo_carga VARCHAR(20) NOT NULL,
    quantidade_paletes INT NOT NULL,
    hora_chegada TIME NOT NULL,
    hora_docagem TIME,
    hora_finalizacao TIME,
    status VARCHAR(30) NOT NULL DEFAULT 'SEM_STATUS',
    ativo BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT chk_carga_tipo
        CHECK (tipo_carga IN ('CARGA_SECA', 'CAMARA_FRIA')),

    CONSTRAINT chk_carga_paletes
        CHECK (quantidade_paletes > 0),

    CONSTRAINT chk_carga_status
        CHECK (
            status IN (
                'SEM_STATUS',
                'PRESENTE',
                'DOCADO',
                'EM_CONFERENCIA',
                'FINALIZADO',
                'COM_PROBLEMAS'
            )
        ),

    CONSTRAINT fk_carga_fornecedor
        FOREIGN KEY (id_fornecedor)
        REFERENCES Fornecedor(id)
);


CREATE INDEX idx_carga_status_ativo_data
ON Carga (status, ativo, data);

-- =========================================
-- TABELA: Problema
-- =========================================

CREATE TABLE Problema (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_carga INT NOT NULL,
    id_tipo_problema INT NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    data_registro DATETIME NOT NULL,

    CONSTRAINT fk_problema_carga
        FOREIGN KEY (id_carga)
        REFERENCES Carga(id),

    CONSTRAINT fk_problema_tipo
        FOREIGN KEY (id_tipo_problema)
        REFERENCES TipoProblema(id)
);


-- =========================================
-- TABELA: HistoricoStatus
-- =========================================

CREATE TABLE HistoricoStatus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_carga INT NOT NULL,
    status VARCHAR(30) NOT NULL,
    data_hora DATETIME NOT NULL,
    id_usuario INT NOT NULL,

    CONSTRAINT chk_historico_status
        CHECK (
            status IN (
                'SEM_STATUS',
                'PRESENTE',
                'DOCADO',
                'EM_CONFERENCIA',
                'FINALIZADO',
                'COM_PROBLEMAS'
            )
        ),

    CONSTRAINT fk_historico_carga
        FOREIGN KEY (id_carga)
        REFERENCES Carga(id),

    CONSTRAINT fk_historico_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES Usuario(id)
);