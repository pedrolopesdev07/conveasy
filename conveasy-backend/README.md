# ConvEasy Backend

API de Gerenciamento de Convênios para o setor TEIA da UNDB

## 📋 Descrição

Sistema de backend desenvolvido em **Python 3.10+** com **FastAPI** para gerenciar convênios, empresas parceiras e usuários do sistema TEIA. Utiliza **Supabase** como banco de dados e storage, com autenticação JWT completa e sistema de alertas automatizado.

## ✨ Funcionalidades

- 🔐 **Autenticação JWT** com refresh tokens
- 👥 **Controle de Acesso Baseado em Roles** (Admin, Gestor, Usuário)
- 🤝 **CRUD completo de Convênios**
- 🏢 **CRUD completo de Empresas** com validação de CNPJ
- 📄 **Sistema de Documentos** com upload para Supabase Storage
- 🚨 **Sistema de Alertas** automatizado para vencimentos
- 📊 **Dashboard com métricas** em tempo real
- 🛡️ **Rate limiting** para proteção contra ataques
- 📝 **Logs estruturados** para auditoria
- 🧪 **Testes automatizados** com pytest

## 🏗️ Arquitetura

```
conveasy-backend/
├── app/
│   ├── core/                 # Funcionalidades essenciais
│   │   ├── security.py       # JWT e autenticação
│   │   └── config.py         # Configurações Pydantic
│   ├── database/             # Gerenciamento de dados
│   │   └── supabase_client.py
│   ├── models/               # Modelos Pydantic v1
│   ├── schemas/              # Schemas para requests/responses
│   ├── utils/                # Utilitários e validadores
│   │   └── validators.py     # Validação CNPJ, etc.
│   ├── api/
│   │   └── v1/               # API v1
│   │       ├── router.py     # Agregador de rotas
│   │       ├── dependencies.py # Dependências FastAPI
│   │       └── endpoints/    # Endpoints específicos
│   │           ├── usuarios.py
│   │           ├── empresas.py
│   │           ├── convenios.py
│   │           ├── alertas.py
│   │           └── documentos.py
│   ├── middlewares/          # Middlewares FastAPI
│   │   └── cors.py
│   └── main.py               # Aplicação FastAPI principal
├── tests/                    # Testes automatizados
│   └── test_api.py
├── Dockerfile                # Container Docker
├── docker-compose.yml        # Orquestração
├── pytest.ini               # Configuração pytest
├── start.sh                 # Script de inicialização
├── requirements.txt          # Dependências Python
├── .env.example             # Exemplo de variáveis ambiente
└── README.md
```

## 🚀 Início Rápido

### Pré-requisitos

- Python 3.10+
- Conta Supabase configurada
- Git

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <repository-url>
   cd conveasy-backend
   ```

2. **Configure o ambiente**
   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env

   # Edite o .env com suas configurações do Supabase
   nano .env
   ```

3. **Instale as dependências**
   ```bash
   pip install -r requirements.txt
   ```

4. **Execute a aplicação**
   ```bash
   # Modo desenvolvimento
   ./start.sh dev

   # Ou diretamente
   uvicorn app.main:app --reload
   ```

### Usando Docker

```bash
# Construir e executar
docker-compose up --build

# Apenas executar
docker-compose up
```

## 📚 API Documentation

### Endpoints Principais

#### Autenticação
- `POST /api/v1/usuarios/login` - Login
- `POST /api/v1/usuarios/refresh-token` - Refresh token
- `POST /api/v1/usuarios/logout` - Logout
- `POST /api/v1/usuarios/change-password` - Alterar senha

#### Usuários
- `GET /api/v1/usuarios/me` - Dados do usuário logado
- `GET /api/v1/usuarios/` - Listar usuários (Admin/Gestor)
- `POST /api/v1/usuarios/` - Criar usuário (Admin/Gestor)
- `PUT /api/v1/usuarios/{id}` - Atualizar usuário
- `DELETE /api/v1/usuarios/{id}` - Deletar usuário

#### Convênios
- `GET /api/v1/convenios/` - Listar convênios
- `POST /api/v1/convenios/` - Criar convênio (Gestor/Admin)
- `GET /api/v1/convenios/{id}` - Detalhes do convênio
- `PUT /api/v1/convenios/{id}` - Atualizar convênio
- `DELETE /api/v1/convenios/{id}` - Deletar convênio
- `POST /api/v1/convenios/{id}/documentos` - Upload documento

#### Empresas
- `GET /api/v1/empresas/` - Listar empresas
- `POST /api/v1/empresas/` - Criar empresa (Gestor/Admin)
- `GET /api/v1/empresas/{id}` - Detalhes da empresa
- `PUT /api/v1/empresas/{id}` - Atualizar empresa
- `DELETE /api/v1/empresas/{id}` - Deletar empresa

#### Alertas
- `GET /api/v1/alertas/` - Listar alertas do usuário
- `POST /api/v1/alertas/` - Criar alerta
- `POST /api/v1/alertas/{id}/marcar-lida` - Marcar como lida

#### Documentos
- `GET /api/v1/documentos/` - Listar documentos
- `GET /api/v1/documentos/{id}` - Detalhes do documento
- `GET /api/v1/documentos/{id}/download` - Download do documento
- `DELETE /api/v1/documentos/{id}` - Deletar documento

### Documentação Interativa

Acesse `http://localhost:8000/docs` para a documentação interativa Swagger UI.

## 🧪 Testes

```bash
# Executar todos os testes
./start.sh test

# Ou diretamente
pytest tests/ -v --cov=app --cov-report=html

# Ver relatório de cobertura
open htmlcov/index.html
```

## 🔒 Segurança

- **JWT Authentication** com tokens de acesso e refresh
- **Rate Limiting** para proteção contra ataques de força bruta
- **CORS** configurado para origens específicas
- **Password Hashing** com bcrypt
- **Input Validation** com Pydantic
- **SQL Injection Protection** via Supabase client

## 📊 Monitoramento

- Logs estruturados em todos os endpoints
- Métricas de erro e performance
- Alertas automáticos para convênios vencendo
- Dashboard com estatísticas em tempo real

## 🚀 Deployment

### Produção

1. Configure as variáveis de ambiente em produção
2. Use o Docker Compose para deployment
3. Configure um reverse proxy (nginx)
4. Configure SSL/TLS

### Ambiente de Produção Recomendado

```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  backend:
    build: .
    environment:
      - DEBUG=false
      - ACCESS_TOKEN_EXPIRE_MINUTES=15
    restart: unless-stopped
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para detalhes.

## 📞 Suporte

Para suporte, entre em contato com a equipe de desenvolvimento ou abra uma issue no repositório.
- Pip
- Conta Supabase

### 1. Instalação

```bash
# Clone o repositório
git clone <repository-url>
cd conveasy-backend

# Crie um ambiente virtual
python -m venv venv

# Ative o ambiente virtual
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Instale as dependências
pip install -r requirements.txt
```

### 2. Configuração

```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o .env com suas credenciais Supabase
# SUPABASE_URL=https://seu-projeto.supabase.co
# SUPABASE_KEY=sua-chave-publica
# SECRET_KEY=sua-chave-secreta-para-jwt
```

### 3. Execução

```bash
# Inicie o servidor
python -m uvicorn app.main:app --reload --port 8000

# A API estará disponível em:
# http://localhost:8000
# Documentação (Swagger UI): http://localhost:8000/docs
# Documentação (ReDoc): http://localhost:8000/redoc
```

## 📚 Documentação da API

A documentação interativa está disponível em `/docs` quando a aplicação estiver rodando.

### Exemplo de Endpoints

#### Autenticação
- `POST /api/v1/usuarios/login` - Fazer login
- `GET /api/v1/usuarios/me` - Obter dados do usuário autenticado

#### Empresas
- `GET /api/v1/empresas` - Listar todas as empresas
- `POST /api/v1/empresas` - Criar nova empresa (RN06 - CNPJ único)
- `GET /api/v1/empresas/{id}` - Obter detalhes de uma empresa
- `PUT /api/v1/empresas/{id}` - Atualizar empresa
- `DELETE /api/v1/empresas/{id}` - Deletar empresa

#### Convênios
- `GET /api/v1/convenios` - Listar convênios
- `POST /api/v1/convenios` - Criar convênio
- `GET /api/v1/convenios/{id}` - Obter detalhes de convênio
- `PUT /api/v1/convenios/{id}` - Atualizar convênio
- `DELETE /api/v1/convenios/{id}` - Deletar convênio

#### Usuários
- `GET /api/v1/usuarios` - Listar usuários (admin)
- `POST /api/v1/usuarios` - Criar usuário (admin)
- `PUT /api/v1/usuarios/{id}` - Atualizar usuário
- `PATCH /api/v1/usuarios/{id}/role` - Atualizar role (admin)
- `DELETE /api/v1/usuarios/{id}` - Deletar usuário (admin)

## 🔐 Autenticação e Autorização

A API utiliza **JWT (JSON Web Tokens)** para autenticação. 

### Papéis de Usuário (Roles)

- **Admin**: Acesso total ao sistema
- **Gestor**: Pode gerenciar convênios e empresas
- **Usuário**: Acesso visualização apenas

### Fluxo de Autenticação

1. Usuário faz login com email e senha
2. API retorna token JWT
3. Cliente inclui token no header `Authorization: Bearer <token>`
4. API valida token e autoriza requisição

## ✅ Requisitos Não-Funcionais (RNF07)

O código foi desenvolvido seguindo princípios de:

- **Limpeza**: Nomes descritivos, estrutura clara, sem código duplicado
- **Manutenibilidade**: Separação de responsabilidades, comentários onde necessário
- **Extensibilidade**: Fácil adicionar novos endpoints e funcionalidades
- **Tradabilidade**: Logging implementado em operações importantes

## 🎯 Regras de Negócio Implementadas

- **RN06**: Validação de CNPJ único para empresas
- **RN07**: Código limpo e manutenível

## 🔄 Validadores Customizados

### CNPJ (RN06)
```python
from app.utils.validators import validate_cnpj, format_cnpj

if validate_cnpj("11.222.333/0001-81"):
    cnpj_formatado = format_cnpj("11222333000181")
```

### Email e Telefone
```python
from app.utils.validators import validate_email, validate_phone

if validate_email("user@example.com"):
    # Email válido
    
if validate_phone("(65) 99999-9999"):
    # Telefone válido
```

## 🚨 Tratamento de Erros

Todos os endpoints retornam respostas padronizadas:

```json
{
  "detail": "Mensagem de erro descritiva"
}
```

Códigos HTTP utilizados:
- `200 OK`: Sucesso
- `201 Created`: Recurso criado
- `400 Bad Request`: Dados inválidos
- `401 Unauthorized`: Autenticação necessária
- `403 Forbidden`: Sem permissão
- `404 Not Found`: Recurso não encontrado
- `500 Internal Server Error`: Erro do servidor

## 📦 Dependências Principais

- **FastAPI**: Framework web moderno
- **Uvicorn**: Servidor ASGI
- **Pydantic**: Validação e serialização de dados
- **Supabase**: PostgreSQL + Auth + Storage
- **Python-Jose**: Implementação JWT
- **Passlib**: Hash de senhas
- **Python-dotenv**: Gerenciamento de variáveis de ambiente

## 🔧 Customização

Para adicionar novos endpoints, siga a estrutura:

1. Crie modelos em `app/models/novo_recurso.py`
2. Crie schemas em `app/schemas/novo_recurso.py`
3. Crie endpoints em `app/api/v1/endpoints/novo_recurso.py`
4. Importe o router em `app/api/v1/router.py`

## 📝 Logging

Os logs são configurados em `app/main.py` e incluem:
- Nível de severidade
- Timestamp
- Nome do módulo
- Mensagem

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/minha-feature`)
2. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
3. Push para a branch (`git push origin feature/minha-feature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto é propriedade da UNDB - Setor TEIA

## 📧 Suporte

Para dúvidas ou problemas, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para gerenciar convênios de forma eficiente.**
