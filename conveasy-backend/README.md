# ConvEasy Backend

API de Gerenciamento de Convênios para o setor TEIA da UNDB

## 📋 Descrição

Sistema de backend desenvolvido em **Python 3.10+** com **FastAPI** para gerenciar convênios, empresas parceiras e usuários do sistema TEIA. Utiliza **Supabase** como banco de dados e storage.

## 🏗️ Arquitetura

```
conveasy-backend/
├── app/
│   ├── core/                 # Funcionalidades essenciais
│   │   ├── security.py       # JWT e autenticação
│   │   └── config.py
│   ├── database/             # Gerenciamento de dados
│   │   └── supabase_client.py
│   ├── models/               # Modelos Pydantic
│   │   ├── empresa.py
│   │   ├── convenio.py
│   │   └── usuario.py
│   ├── schemas/              # Schemas para requisições/respostas
│   │   ├── empresa.py
│   │   ├── convenio.py
│   │   └── usuario.py
│   ├── utils/                # Utilitários e validadores
│   │   └── validators.py
│   ├── api/
│   │   └── v1/               # API v1
│   │       ├── router.py
│   │       ├── dependencies.py
│   │       └── endpoints/
│   │           ├── empresa.py
│   │           ├── convenio.py
│   │           └── usuario.py
│   ├── middlewares/          # Middlewares
│   │   └── cors.py
│   └── main.py               # Aplicação principal
├── .env                      # Variáveis de ambiente (desenvolvimento)
├── .env.example              # Exemplo de variáveis de ambiente
├── requirements.txt          # Dependências Python
└── README.md
```

## 🚀 Início Rápido

### Pré-requisitos

- Python 3.10+
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
