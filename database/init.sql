-- ============================================================
-- RPA (Report Problem Assistant) — PostgreSQL Schema
-- Script de criação do banco de dados
-- ============================================================

-- Criar o banco (execute separadamente se necessário)
-- CREATE DATABASE rpa_db;

-- ============================================================
-- TIPOS ENUMERADOS
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'perfil_usuario') THEN
        CREATE TYPE perfil_usuario AS ENUM ('cliente', 'empresa');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'status_relatorio') THEN
        CREATE TYPE status_relatorio AS ENUM ('recebido', 'em_analise', 'em_andamento', 'concluido');
    END IF;
END
$$;

-- ============================================================
-- TABELA: usuarios
-- ============================================================

CREATE TABLE IF NOT EXISTS usuarios (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    nome_completo   VARCHAR(150)    NOT NULL,
    email           VARCHAR(100)    NOT NULL,
    hash_senha      TEXT            NOT NULL,
    perfil          SMALLINT        NOT NULL DEFAULT 0,   -- 0 = Client, 1 = Company (maps to EF Core enum)
    telefone        BIGINT          NOT NULL,
    criado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Índice único no email
CREATE UNIQUE INDEX IF NOT EXISTS idx_usuarios_email
    ON usuarios (email);

-- ============================================================
-- TABELA: relatorios
-- ============================================================

CREATE TABLE IF NOT EXISTS relatorios (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_protocolo    VARCHAR(20)     NOT NULL,
    descricao           VARCHAR(500)    NOT NULL,
    url_imagem          VARCHAR(500),
    latitude            DOUBLE PRECISION,
    longitude           DOUBLE PRECISION,
    status              SMALLINT        NOT NULL DEFAULT 0,   -- 0 = Received (maps to EF Core enum)
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    usuario_id          UUID            NOT NULL,

    -- Foreign key para o usuário que abriu o chamado
    CONSTRAINT fk_relatorios_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios (id)
        ON DELETE CASCADE
);

-- Índice único no número de protocolo
CREATE UNIQUE INDEX IF NOT EXISTS idx_relatorios_numero_protocolo
    ON relatorios (numero_protocolo);

-- Índice na FK do usuário para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_relatorios_usuario_id
    ON relatorios (usuario_id);

-- ============================================================
-- TABELA: historico_status_relatorio
-- ============================================================

CREATE TABLE IF NOT EXISTS historico_status_relatorio (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    relatorio_id    UUID            NOT NULL,
    status          SMALLINT        NOT NULL,   -- Maps to EF Core ReportStatus enum
    alterado_em     TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    observacoes     VARCHAR(500),

    -- Foreign key para o relatório
    CONSTRAINT fk_historico_relatorio
        FOREIGN KEY (relatorio_id)
        REFERENCES relatorios (id)
        ON DELETE CASCADE
);

-- Índice na FK do relatório para consultas de timeline
CREATE INDEX IF NOT EXISTS idx_historico_relatorio_id
    ON historico_status_relatorio (relatorio_id);

-- ============================================================
-- TRIGGER: Atualizar "atualizado_em" automaticamente
-- ============================================================

CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplica o trigger na tabela relatorios
DROP TRIGGER IF EXISTS trg_relatorios_atualizar_timestamp ON relatorios;

CREATE TRIGGER trg_relatorios_atualizar_timestamp
    BEFORE UPDATE ON relatorios
    FOR EACH ROW
    EXECUTE FUNCTION atualizar_timestamp();

-- ============================================================
-- FIM DO SCRIPT
-- ============================================================
