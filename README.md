# ConvEasy

Sistema completo de gerenciamento de convênios para o setor TEIA da UNDB, desenvolvido com arquitetura moderna e tecnologias de ponta.

## Resumo Rápido

| Item | Descrição |
|------|-----------|
| **O que é?** | Sistema web para gerenciar convênios, empresas e documentos |
| **Para quem?** | Setor TEIA da UNDB (Admins, Gestores, Usuários) |
| **Tecnologia** | Python/FastAPI (backend) + React/Vite (frontend) |
| **Banco de Dados** | Supabase (PostgreSQL na nuvem) |
| **Instalação** | Requer Python 3.10+, Node.js 18+ e conta Supabase |
| **Tempo estimado** | 15-30 minutos para instalação completa |

## O que é o ConvEasy?

O ConvEasy é um **sistema web completo** para gerenciar convênios, empresas parceiras e documentos do setor TEIA da UNDB. Ele substitui processos manuais e planilhas por uma plataforma digital centralizada, segura e eficiente.

## O que o ConvEasy faz?

### Funcionalidades Principais:

- **Gestão de Convênios**: Cadastro, edição, acompanhamento e controle de validade
- **Cadastro de Empresas**: Registro de empresas parceiras com validação de CNPJ
- **Gestão de Documentos**: Upload e organização de contratos e documentos
- **Controle de Usuários**: Sistema de autenticação com diferentes níveis de acesso
- **Alertas Automáticos**: Notificações sobre vencimentos e eventos importantes
- **Dashboard Interativo**: Métricas e estatísticas em tempo real
- **Busca e Filtragem**: Encontre rapidamente qualquer informação
- **Relatórios**: Geração de relatórios de convênios e empresas

### Para quem serve?

- **Administradores**: Gerenciam todo o sistema e usuários
- **Gestores**: Administram convênios e empresas
- **Usuários**: Visualizam informações e documentos

## Como funciona?

O sistema é composto por duas partes principais:

1. **Backend (API)**: Servidor Python que processa dados, valida informações e gerencia o banco de dados
2. **Frontend (Interface)**: Aplicação web que os usuários acessam no navegador

## O que precisa para funcionar?

### Requisitos Obrigatórios:

#### Software:
- **Python 3.10+** - Para executar o backend
- **Node.js 18+** - Para executar o frontend
- **Git** - Para baixar o código
- **Conta Supabase** - Banco de dados e autenticação na nuvem

#### Hardware:
- **RAM**: Mínimo 4GB (recomendado 8GB)
- **Disco**: 2GB de espaço livre
- **Internet**: Conexão estável para acessar o Supabase

### Serviços Externos:
- **Supabase**: Banco de dados PostgreSQL + Autenticação + Storage
  - Crie conta gratuita em https://supabase.com
  - Crie um novo projeto
  - Copie a URL e a chave pública

## Arquitetura

```
Conveasy/
|
|--- conveasy-backend/          # API Backend (Python/FastAPI)
|   |--- app/                   # Código fonte principal
|   |--- tests/                 # Testes automatizados
|   |--- Dockerfile             # Container Docker
|   |--- requirements.txt       # Dependências Python
|   |--- docker-compose.yml     # Orquestração de containers
|   |--- .env.example           # Exemplo de configuração
|   |--- README.md              # Documentação do backend
|
|--- Prototipo-ConveFlow-alta-fidelidade/  # Frontend (React/Vite)
|   |--- src/                   # Código fonte principal
|   |--- dist/                  # Build de produção
|   |--- package.json           # Dependências Node.js
|   |--- vite.config.ts         # Configuração Vite
|   |--- README.md              # Documentação do frontend
|
|--- README.md                  # Documentação principal (este arquivo)
|--- CONTRIBUTING.md            # Guia de contribuição
|--- LICENSE                    # Licença MIT
|--- .gitignore                 # Arquivos ignorados pelo Git
```

## Tecnologias

### Backend
- **Python 3.10+** - Linguagem principal
- **FastAPI** - Framework web moderno e assíncrono
- **Supabase** - Banco de dados PostgreSQL + Auth + Storage
- **Pydantic** - Validação e serialização de dados
- **JWT** - Autenticação e autorização
- **Uvicorn** - Servidor ASGI
- **Pytest** - Testes automatizados

### Frontend
- **React 18.3.1** - Biblioteca de interface
- **Vite 6.3.5** - Build tool e dev server
- **TailwindCSS 4.1.12** - Framework de estilização
- **Radix UI** - Componentes acessíveis
- **React Router 7.13.0** - Roteamento
- **React Hook Form** - Formulários
- **Supabase JS** - Cliente Supabase
- **Lucide React** - Ícones

### DevOps
- **Docker** - Containerização
- **Docker Compose** - Orquestração
- **Git** - Controle de versão

## Funcionalidades Principais

### Backend
- **Autenticação JWT** com refresh tokens
- **Controle de Acesso** baseado em roles (Admin, Gestor, Usuário)
- **CRUD completo** para convênios, empresas e usuários
- **Validação de CNPJ** integrada
- **Sistema de Documentos** com upload para Supabase Storage
- **Alertas automatizados** para vencimentos
- **Dashboard com métricas** em tempo real
- **Rate limiting** e proteção contra ataques
- **Logs estruturados** para auditoria
- **Testes automatizados** com cobertura

### Frontend
- **Interface responsiva** e moderna
- **Dashboard interativo** com gráficos e métricas
- **Gestão de convênios** com formulários inteligentes
- **Upload de documentos** com preview
- **Sistema de notificações** em tempo real
- **Busca e filtragem** avançada
- **Tema dark/light**
- **Acessibilidade** WCAG 2.1

## Como Instalar e Rodar

Siga estes passos na ordem correta:

### Passo 1: Preparar o Ambiente

1. **Instale o Python 3.10+**
   - Windows: Baixe em https://python.org
   - Linux: `sudo apt install python3.10 python3.10-venv`
   - macOS: `brew install python@3.10`

2. **Instale o Node.js 18+**
   - Baixe em https://nodejs.org
   - Ou use gerenciador de versões (nvm, pyenv)

3. **Verifique as instalações**
   ```bash
   python --version  # Deve ser 3.10+
   node --version    # Deve ser 18+
   npm --version     # Deve vir com Node.js
   ```

### Passo 2: Configurar o Supabase

1. **Crie conta no Supabase**: https://supabase.com
2. **Crie um novo projeto**
3. **Copie as credenciais**:
   - Project URL (ex: https://xxxx.supabase.co)
   - anon public key (chave pública)
   - service_role key (chave privada)

### Passo 3: Baixar o Projeto

```bash
# Clone o repositório
git clone <repository-url>
cd Conveasy
```

### Passo 4: Configurar o Backend

```bash
# Entre na pasta do backend
cd conveasy-backend

# Crie ambiente virtual (importante!)
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# Instale as dependências Python
pip install -r requirements.txt

# Configure as variáveis de ambiente
cp .env.example .env
```

**Edite o arquivo `.env`** com suas credenciais:
```bash
# Substitua pelos seus dados do Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-privada
SECRET_KEY=uma-chave-secreta-muito-forte-para-jwt
```

**Inicie o backend**:
```bash
uvicorn app.main:app --reload --port 8000
```

### Passo 5: Configurar o Frontend

**Abra outro terminal** (não feche o backend):

```bash
# Entre na pasta do frontend
cd ../Prototipo-ConveFlow-alta-fidelidade

# Instale as dependências
npm install

# Configure as variáveis de ambiente
echo "VITE_SUPABASE_URL=https://seu-projeto.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=sua-chave-publica" >> .env.local
```

**Inicie o frontend**:
```bash
npm run dev
```

### Passo 6: Acessar o Sistema

Com ambos os servidores rodando:

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs

### Passo 7: Primeiro Acesso

1. Acesse http://localhost:5173
2. Crie o primeiro usuário (será Admin)
3. Faça login com seu email e senha
4. Comece a usar o sistema!

## Solução de Problemas Comuns

### Backend não inicia:
- Verifique se o ambiente virtual está ativado
- Confirme se Python 3.10+ está sendo usado
- Verifique as credenciais no arquivo `.env`

### Frontend não conecta:
- Confirme se o backend está rodando em http://localhost:8000
- Verifique as variáveis em `.env.local`
- Reinicie o servidor frontend

### Erros do Supabase:
- Verifique se as credenciais estão corretas
- Confirme se o projeto Supabase está ativo
- Verifique as permissões no painel do Supabase

## Acesso à Aplicação

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Documentação API**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Estrutura da API

### Endpoints Principais

#### Autenticação
- `POST /api/v1/usuarios/login` - Login
- `POST /api/v1/usuarios/refresh-token` - Refresh token
- `POST /api/v1/usuarios/logout` - Logout
- `GET /api/v1/usuarios/me` - Dados do usuário logado

#### Convênios
- `GET /api/v1/convenios/` - Listar convênios
- `POST /api/v1/convenios/` - Criar convênio
- `GET /api/v1/convenios/{id}` - Detalhes do convênio
- `PUT /api/v1/convenios/{id}` - Atualizar convênio
- `DELETE /api/v1/convenios/{id}` - Deletar convênio

#### Empresas
- `GET /api/v1/empresas/` - Listar empresas
- `POST /api/v1/empresas/` - Criar empresa
- `GET /api/v1/empresas/{id}` - Detalhes da empresa
- `PUT /api/v1/empresas/{id}` - Atualizar empresa
- `DELETE /api/v1/empresas/{id}` - Deletar empresa

#### Documentos
- `POST /api/v1/documentos/upload` - Upload de documento
- `GET /api/v1/documentos/{id}/download` - Download do documento
- `DELETE /api/v1/documentos/{id}` - Deletar documento

## Segurança

- **JWT Authentication** com tokens de acesso e refresh
- **Rate Limiting** para proteção contra ataques
- **CORS** configurado para origens específicas
- **Password Hashing** com bcrypt
- **Input Validation** com Pydantic
- **SQL Injection Protection** via Supabase client

## Testes

### Backend

```bash
cd conveasy-backend

# Executar todos os testes
pytest tests/ -v --cov=app --cov-report=html

# Ver relatório de cobertura
open htmlcov/index.html
```

### Frontend

```bash
cd Prototipo-ConveFlow-alta-fidelidade

# Executar testes (quando implementados)
npm test
```

## Deploy

### Backend (Produção)

1. Configure as variáveis de ambiente
2. Use Docker Compose para deployment
3. Configure reverse proxy (nginx)
4. Configure SSL/TLS

### Frontend (Produção)

```bash
cd Prototipo-ConveFlow-alta-fidelidade

# Build para produção
npm run build

# Deploy do conteúdo da pasta dist
```

## Monitoramento

- Logs estruturados em todos os endpoints
- Métricas de erro e performance
- Alertas automáticos para convênios vencendo
- Dashboard com estatísticas em tempo real

## Contribuição

Leia o arquivo [CONTRIBUTING.md](./CONTRIBUTING.md) para detalhes sobre como contribuir para o projeto.

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](./LICENSE) para detalhes.

## Suporte

Para suporte, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório.

## Status do Projeto

![Status](https://img.shields.io/badge/status-em_desenvolvimento-yellow)
![Versão](https://img.shields.io/badge/versão-1.0.0--beta-blue)
![Python](https://img.shields.io/badge/python-3.10+-blue)
![React](https://img.shields.io/badge/react-18.3.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

**Desenvolvido com :heart: para o setor TEIA da UNDB**
