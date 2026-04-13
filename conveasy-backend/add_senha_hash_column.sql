-- Adicionar coluna senha_hash à tabela usuarios existente
-- Execute este SQL no painel do Supabase: Database > SQL Editor

ALTER TABLE usuarios 
ADD COLUMN IF NOT EXISTS senha_hash VARCHAR(255) NOT NULL DEFAULT '';

-- Criar índice para busca por senha_hash (opcional, para performance)
CREATE INDEX IF NOT EXISTS idx_usuarios_senha_hash ON usuarios(senha_hash);

-- Atualizar registros existentes com uma senha hash padrão (opcional)
-- UPDATE usuarios SET senha_hash = '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflHQrxG' WHERE senha_hash = '';
