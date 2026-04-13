-- Criar tabela de usuários para o ConvEasy
-- Execute este SQL no painel do Supabase: Database > SQL Editor

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    senha_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'usuario',
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índice para busca por email (performance)
CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);

-- Criar índice para busca por role
CREATE INDEX IF NOT EXISTS idx_usuarios_role ON usuarios(role);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_usuarios_updated_at 
    BEFORE UPDATE ON usuarios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Desabilitar RLS por enquanto (usaremos JWT customizado no backend)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;

-- Inserir primeiro usuário admin (opcional)
-- Descomente se quiser criar um admin inicial
/*
INSERT INTO usuarios (nome_completo, email, senha_hash, role)
VALUES (
    'Administrador',
    'admin@conveasy.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflHQrxG', -- senha: admin123
    'admin'
);
*/
