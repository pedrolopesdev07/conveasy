# Documentação da API ConvEasy

Este documento fornece uma visão geral completa da API REST do ConvEasy, desenvolvida com FastAPI.

## Base URL

```
Desenvolvimento: http://localhost:8000
Produção: https://api.conveasy.undb.br
```

## Autenticação

A API utiliza autenticação JWT (JSON Web Tokens) com refresh tokens.

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

### Fluxo de Autenticação

1. **Login**: Obtenha access token e refresh token
2. **Acesso**: Use access token nas requisições
3. **Refresh**: Use refresh token para obter novo access token
4. **Logout**: Revogue os tokens

## Endpoints

### Autenticação (/api/v1/usuarios)

#### POST /api/v1/usuarios/login
Realiza login do usuário.

**Request:**
```json
{
  "email": "usuario@exemplo.com",
  "password": "senha123"
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 900,
  "user": {
    "id": "uuid",
    "email": "usuario@exemplo.com",
    "nome": "Nome do Usuário",
    "role": "admin|gestor|usuario"
  }
}
```

#### POST /api/v1/usuarios/refresh-token
Renova o access token usando refresh token.

**Request:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "token_type": "bearer",
  "expires_in": 900
}
```

#### POST /api/v1/usuarios/logout
Realiza logout do usuário.

**Request:**
```json
{
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

**Response:**
```json
{
  "message": "Logout realizado com sucesso"
}
```

#### GET /api/v1/usuarios/me
Obtém dados do usuário autenticado.

**Response:**
```json
{
  "id": "uuid",
  "email": "usuario@exemplo.com",
  "nome": "Nome do Usuário",
  "role": "admin|gestor|usuario",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### POST /api/v1/usuarios/change-password
Altera senha do usuário.

**Request:**
```json
{
  "current_password": "senha_atual",
  "new_password": "nova_senha123"
}
```

**Response:**
```json
{
  "message": "Senha alterada com sucesso"
}
```

### Usuários (/api/v1/usuarios)

#### GET /api/v1/usuarios/
Lista todos os usuários (Admin/Gestor).

**Query Parameters:**
- `skip`: número de registros para pular (default: 0)
- `limit`: número máximo de registros (default: 100)
- `role`: filtra por role (opcional)

**Response:**
```json
{
  "total": 10,
  "skip": 0,
  "limit": 100,
  "items": [
    {
      "id": "uuid",
      "email": "usuario@exemplo.com",
      "nome": "Nome do Usuário",
      "role": "admin|gestor|usuario",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/v1/usuarios/
Cria novo usuário (Admin/Gestor).

**Request:**
```json
{
  "email": "novo@exemplo.com",
  "nome": "Novo Usuário",
  "password": "senha123",
  "role": "usuario"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "novo@exemplo.com",
  "nome": "Novo Usuário",
  "role": "usuario",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/v1/usuarios/{id}
Atualiza dados do usuário.

**Request:**
```json
{
  "nome": "Nome Atualizado",
  "email": "atualizado@exemplo.com",
  "role": "gestor"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "atualizado@exemplo.com",
  "nome": "Nome Atualizado",
  "role": "gestor",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### DELETE /api/v1/usuarios/{id}
Remove usuário (Admin).

**Response:**
```json
{
  "message": "Usuário removido com sucesso"
}
```

### Empresas (/api/v1/empresas)

#### GET /api/v1/empresas/
Lista todas as empresas.

**Query Parameters:**
- `skip`: número de registros para pular (default: 0)
- `limit`: número máximo de registros (default: 100)
- `search`: busca por nome ou CNPJ (opcional)
- `cnpj`: filtra por CNPJ exato (opcional)

**Response:**
```json
{
  "total": 50,
  "skip": 0,
  "limit": 100,
  "items": [
    {
      "id": "uuid",
      "nome": "Empresa Exemplo Ltda",
      "cnpj": "11.222.333/0001-81",
      "telefone": "(65) 99999-9999",
      "email": "contato@empresa.com",
      "endereco": {
        "logradouro": "Rua Exemplo",
        "numero": "123",
        "complemento": "Sala 1",
        "bairro": "Centro",
        "cidade": "Cuiabá",
        "estado": "MT",
        "cep": "78000-000"
      },
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/v1/empresas/
Cria nova empresa (Gestor/Admin).

**Request:**
```json
{
  "nome": "Nova Empresa Ltda",
  "cnpj": "11.222.333/0001-81",
  "telefone": "(65) 99999-9999",
  "email": "contato@novaempresa.com",
  "endereco": {
    "logradouro": "Rua Nova",
    "numero": "456",
    "complemento": "",
    "bairro": "Centro",
    "cidade": "Cuiabá",
    "estado": "MT",
    "cep": "78000-000"
  }
}
```

**Response:**
```json
{
  "id": "uuid",
  "nome": "Nova Empresa Ltda",
  "cnpj": "11.222.333/0001-81",
  "telefone": "(65) 99999-9999",
  "email": "contato@novaempresa.com",
  "endereco": {
    "logradouro": "Rua Nova",
    "numero": "456",
    "complemento": "",
    "bairro": "Centro",
    "cidade": "Cuiabá",
    "estado": "MT",
    "cep": "78000-000"
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET /api/v1/empresas/{id}
Obtém detalhes de uma empresa.

**Response:**
```json
{
  "id": "uuid",
  "nome": "Empresa Exemplo Ltda",
  "cnpj": "11.222.333/0001-81",
  "telefone": "(65) 99999-9999",
  "email": "contato@empresa.com",
  "endereco": {
    "logradouro": "Rua Exemplo",
    "numero": "123",
    "complemento": "Sala 1",
    "bairro": "Centro",
    "cidade": "Cuiabá",
    "estado": "MT",
    "cep": "78000-000"
  },
  "convenios_count": 5,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/v1/empresas/{id}
Atualiza dados da empresa.

**Request:**
```json
{
  "nome": "Empresa Atualizada Ltda",
  "telefone": "(65) 88888-8888",
  "email": "novo@empresa.com"
}
```

#### DELETE /api/v1/empresas/{id}
Remove empresa (Admin/Gestor).

**Response:**
```json
{
  "message": "Empresa removida com sucesso"
}
```

### Convênios (/api/v1/convenios)

#### GET /api/v1/convenios/
Lista todos os convênios.

**Query Parameters:**
- `skip`: número de registros para pular (default: 0)
- `limit`: número máximo de registros (default: 100)
- `empresa_id`: filtra por empresa (opcional)
- `status`: filtra por status (ativo, inativo, vencido)
- `search`: busca por nome ou descrição (opcional)

**Response:**
```json
{
  "total": 100,
  "skip": 0,
  "limit": 100,
  "items": [
    {
      "id": "uuid",
      "nome": "Convênio Exemplo",
      "descricao": "Descrição do convênio",
      "empresa": {
        "id": "uuid",
        "nome": "Empresa Exemplo Ltda",
        "cnpj": "11.222.333/0001-81"
      },
      "data_inicio": "2024-01-01",
      "data_fim": "2024-12-31",
      "status": "ativo",
      "valor": 10000.00,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/v1/convenios/
Cria novo convênio (Gestor/Admin).

**Request:**
```json
{
  "nome": "Novo Convênio",
  "descricao": "Descrição detalhada",
  "empresa_id": "uuid",
  "data_inicio": "2024-01-01",
  "data_fim": "2024-12-31",
  "valor": 15000.00,
  "observacoes": "Observações importantes"
}
```

**Response:**
```json
{
  "id": "uuid",
  "nome": "Novo Convênio",
  "descricao": "Descrição detalhada",
  "empresa": {
    "id": "uuid",
    "nome": "Empresa Exemplo Ltda",
    "cnpj": "11.222.333/0001-81"
  },
  "data_inicio": "2024-01-01",
  "data_fim": "2024-12-31",
  "status": "ativo",
  "valor": 15000.00,
  "observacoes": "Observações importantes",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### GET /api/v1/convenios/{id}
Obtém detalhes de um convênio.

**Response:**
```json
{
  "id": "uuid",
  "nome": "Convênio Exemplo",
  "descricao": "Descrição do convênio",
  "empresa": {
    "id": "uuid",
    "nome": "Empresa Exemplo Ltda",
    "cnpj": "11.222.333/0001-81",
    "telefone": "(65) 99999-9999",
    "email": "contato@empresa.com"
  },
  "data_inicio": "2024-01-01",
  "data_fim": "2024-12-31",
  "status": "ativo",
  "valor": 10000.00,
  "observacoes": "Observações importantes",
  "documentos": [
    {
      "id": "uuid",
      "nome": "Contrato.pdf",
      "tipo": "contrato",
      "tamanho": 1024000,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/v1/convenios/{id}
Atualiza dados do convênio.

**Request:**
```json
{
  "nome": "Convênio Atualizado",
  "descricao": "Nova descrição",
  "valor": 20000.00
}
```

#### DELETE /api/v1/convenios/{id}
Remove convênio (Admin/Gestor).

**Response:**
```json
{
  "message": "Convênio removido com sucesso"
}
```

### Documentos (/api/v1/documentos)

#### POST /api/v1/documentos/upload
Faz upload de documento.

**Request (multipart/form-data):**
```
file: <arquivo>
convenio_id: uuid
nome: "Nome do Documento"
tipo: "contrato|outro"
descricao: "Descrição do documento"
```

**Response:**
```json
{
  "id": "uuid",
  "nome": "Nome do Documento",
  "tipo": "contrato",
  "descricao": "Descrição do documento",
  "tamanho": 1024000,
  "convenio_id": "uuid",
  "url": "https://storage.supabase.co/...",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### GET /api/v1/documentos/{id}/download
Baixa documento.

**Response:** Binary file

#### DELETE /api/v1/documentos/{id}
Remove documento.

**Response:**
```json
{
  "message": "Documento removido com sucesso"
}
```

### Alertas (/api/v1/alertas)

#### GET /api/v1/alertas/
Lista alertas do usuário.

**Query Parameters:**
- `skip`: número de registros para pular (default: 0)
- `limit`: número máximo de registros (default: 100)
- `lida`: filtra por status de leitura (true/false)
- `tipo`: filtra por tipo (vencimento, documento, sistema)

**Response:**
```json
{
  "total": 25,
  "skip": 0,
  "limit": 100,
  "items": [
    {
      "id": "uuid",
      "titulo": "Convênio próximo ao vencimento",
      "mensagem": "O convênio X vence em 7 dias",
      "tipo": "vencimento",
      "lida": false,
      "convenio_id": "uuid",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### POST /api/v1/alertas/{id}/marcar-lida
Marca alerta como lida.

**Response:**
```json
{
  "message": "Alerta marcado como lido"
}
```

## Códigos de Status

| Código | Descrição |
|--------|-----------|
| 200 | OK - Requisição bem sucedida |
| 201 | Created - Recurso criado |
| 204 | No Content - Requisição bem sucedida sem conteúdo |
| 400 | Bad Request - Dados inválidos |
| 401 | Unauthorized - Autenticação necessária |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Conflito de dados |
| 422 | Unprocessable Entity - Validação falhou |
| 429 | Too Many Requests - Rate limit excedido |
| 500 | Internal Server Error - Erro do servidor |

## Rate Limiting

A API implementa rate limiting para proteção:
- **100 requisições por minuto** por IP
- **1000 requisições por hora** por usuário autenticado
- **Exceeded**: Response 429 com header `Retry-After`

## Validações

### CNPJ
- Formato: XX.XXX.XXX/XXXX-XX
- Validação matemática do dígito verificador
- Unicidade garantida no banco

### Email
- Formato válido de email
- Lowercase automático

### Senha
- Mínimo 8 caracteres
- Pelo menos 1 letra maiúscula
- Pelo menos 1 número
- Pelo menos 1 caractere especial

## Erros Comuns

### 401 Unauthorized
- Token expirado: use refresh token
- Token inválido: faça login novamente

### 403 Forbidden
- Role insuficiente para a operação
- Recurso não pertence ao usuário

### 422 Unprocessable Entity
- Dados inválidos no request
- CNPJ já existente
- Email já existente

## Testes

Use os seguintes comandos para testar a API:

```bash
# Instalação
pip install -r requirements.txt

# Executar testes
pytest tests/ -v

# Com cobertura
pytest tests/ -v --cov=app --cov-report=html
```

## Documentação Interativa

Acesse as seguintes URLs quando o backend estiver rodando:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI Spec**: http://localhost:8000/openapi.json

---

Para mais informações, consulte o [README principal](./README.md) ou entre em contato com a equipe de desenvolvimento.
