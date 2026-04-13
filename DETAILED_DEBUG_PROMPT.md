# PROMPT DETALHISTA PARA DEBUG DE CARREGAMENTO INFINITO NO FRONTEND

## CONTEXTO COMPLETO DO PROJETO

### Arquitetura do Sistema
- **Backend**: FastAPI (Python) rodando em http://localhost:8000
- **Frontend**: React/Vite rodando em http://localhost:5173
- **Database**: Supabase PostgreSQL (https://idkjeyosxnprwnjbqlbt.supabase.co)
- **Projeto**: ConvEasy - Sistema de Gerenciamento de Convênios

### Estrutura de Arquivos Relevantes
```
Conveasy/
├── conveasy-backend/
│   ├── app/
│   │   ├── models/usuario.py (modelos Pydantic)
│   │   ├── api/v1/endpoints/usuario.py (endpoints de auth)
│   │   ├── middlewares/cors.py (CORS configurado com ["*"])
│   │   └── config.py (configurações)
│   ├── .env (variáveis de ambiente)
│   └── requirements.txt
└── Prototipo-ConveFlow-alta-fidelidade/
    ├── src/
    │   ├── lib/supabaseConfig.js (config Supabase frontend)
    │   └── app/pages/ (páginas React)
    └── .env.local (variáveis frontend)
```

### Configurações Atuais

#### Backend (.env)
```bash
SUPABASE_URL=https://idkjeyosxnprwnjbqlbt.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlka2pleW9zeG5wcnduamJxbGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2NDE1NSwiZXhwIjoyMDkwNjQwMTU1fQ.BG-pEYCfdOGYifuTZoI676laQjR7dMmTRz5VlJUjo0I
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlka2pleW9zeG5wcnduamJxbGJ0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2NDE1NSwiZXhwIjoyMDkwNjQwMTU1fQ.BG-pEYCfdOGYifuTZoI676laQjR7dMmTRz5VlJUjo0I
SECRET_KEY=convEasy-secret-key-2024-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
DEBUG=True
API_V1_STR=/api/v1
PROJECT_NAME=ConvEasy Backend
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Frontend (.env.local)
```bash
VITE_SUPABASE_URL=https://idkjeyosxnprwnjbqlbt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlka2pleW9zeG5wcnduamJxbGJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjQxNTUsImV4cCI6MjA5MDY0MDE1NX0.tN85TlWBcDgKxkCbmMxgySbtV_OKiUmXgTcHjgdo_18
```

### Estrutura da Tabela `usuarios` no Supabase
```sql
-- Colunas existentes:
- id (UUID, PRIMARY KEY)
- nome (VARCHAR) -- campo principal do frontend
- email (VARCHAR, UNIQUE)
- perfil (VARCHAR) -- equivalente a 'role' no backend
- setor (VARCHAR)
- status (BOOLEAN) -- equivalente a 'ativo' no backend
- createdat (TIMESTAMP) -- equivalente a 'created_at' no backend
- ultimoacesso (TIMESTAMP)
- senha_hash (VARCHAR) -- adicionada recentemente
```

### Modelos Pydantic (Backend)
```python
# app/models/usuario.py
class UsuarioBase(BaseModel):
    usuario: str = Field(..., min_length=1, max_length=255)  # do frontend
    nome: Optional[str] = Field(None, alias="nome_completo")
    email: EmailStr
    perfil: UserRole = Field(default=UserRole.USUARIO, alias="role")
    setor: Optional[str] = Field(None, alias="departamento")

class UsuarioCreate(UsuarioBase):
    senha: str = Field(..., min_length=8, max_length=255)

class UsuarioResponse(UsuarioBase):
    id: str
    createdat: datetime = Field(alias="created_at")
    ultimoacesso: Optional[datetime] = Field(None, alias="ultimo_acesso")
    status: bool = Field(True, alias="ativo")
```

### Endpoint de Signup (Backend)
```python
# app/api/v1/endpoints/usuario.py
@router.post("/signup", response_model=UsuarioResponse)
async def signup(usuario: UsuarioCreate):
    # Verifica email existente
    existing = supabase.table("usuarios").select("*").eq("email", usuario.email).execute()
    
    # Hash da senha
    senha_hash = get_password_hash(usuario.senha)
    
    # Insere usuário
    response = supabase.table("usuarios").insert({
        "nome": usuario.usuario,  # mapeamento: frontend.usuario -> tabela.nome
        "email": usuario.email,
        "perfil": usuario.perfil.value,
        "setor": usuario.setor,
        "senha_hash": senha_hash
    }).execute()
    
    return response.data[0]
```

### CORS Configuration
```python
# app/middlewares/cors.py
def setup_cors_middleware(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Temporário para debug
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
        expose_headers=["*"],
    )
```

## PROBLEMA ATUAL

### Sintomas
1. **Frontend**: Carregamento infinito ao tentar fazer signup
2. **Console Browser**: Apenas erro de favicon.ico (404) - não é o problema real
3. **Backend**: Reiniciou sem erros após correção do .env
4. **Network Tab**: Requisição fica em estado "pending" indefinidamente

### Formulário de Signup (Frontend)
- **Campos**: usuario, email, senha, confirmação de senha
- **Comportamento**: Botão fica carregando infinitamente após submit
- **URL da requisição**: POST http://localhost:8000/api/v1/usuario/signup

### Tarefas Já Realizadas
✅ Corrigido Pydantic v2 (BaseSettings import)
✅ Configurado service_role key no backend
✅ Configurado anon key no frontend
✅ CORS ajustado para porta 5173
✅ Tabela `usuarios` criada no Supabase
✅ Modelos adaptados para colunas da tabela existente
✅ Endpoint corrigido para mapeamento de campos
✅ Coluna `senha_hash` adicionada à tabela
✅ Arquivo .env limpo (sem variáveis do frontend)

## INVESTIGAÇÃO NECESSÁRIA

### Áreas a Verificar

#### 1. Frontend (React/Vite)
- **Componente de Formulário**: Verificar se há validações bloqueando o submit
- **Chamada API**: Verificar se a requisição está sendo feita corretamente
- **Tratamento de Erros**: Verificar se há tratamento silencioso de erros
- **Estado Loading**: Verificar se há estado de loading que não é resetado

#### 2. Backend (FastAPI)
- **Endpoint Health**: Verificar se backend está respondendo
- **Logs de Requisição**: Verificar se a requisição chega ao backend
- **Validação Pydantic**: Verificar se há erros de validação
- **Conexão Supabase**: Verificar se a conexão está funcionando

#### 3. Network
- **CORS Real**: Verificar se há erros de CORS não visíveis
- **Timeout**: Verificar se há timeout na requisição
- **Headers**: Verificar se headers estão corretos

#### 4. Supabase
- **Permissões**: Verificar se tabela tem permissões corretas
- **RLS**: Verificar se Row Level Security está bloqueando
- **Conexão**: Testar conexão direta com Supabase

## COMANDOS PARA DEBUG

### Testes Diretos
```bash
# 1. Testar health do backend
curl http://localhost:8000/health

# 2. Testar endpoint de signup direto
curl -X POST http://localhost:8000/api/v1/usuario/signup \
  -H "Content-Type: application/json" \
  -d '{"usuario":"test","email":"test@test.com","senha":"12345678"}'

# 3. Verificar logs do backend
# Verificar terminal onde backend está rodando

# 4. Testar conexão Supabase direto
# Usar Supabase SQL Editor para testar inserts
```

### Verificações no Browser
```javascript
// 1. No Console do Browser
fetch('http://localhost:8000/health')
  .then(r => r.json())
  .then(console.log)

// 2. Testar signup manual
fetch('http://localhost:8000/api/v1/usuario/signup', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    usuario: 'test',
    email: 'test@test.com', 
    senha: '12345678'
  })
}).then(r => r.json()).then(console.log)
```

## SOLUÇÕES POTENCIAIS

### 1. Problema no Frontend
- **Estado Loading**: Componente não reseta estado de loading
- **Validação**: Validação assíncrona travando submit
- **Error Handling**: Erro sendo capturado e não mostrado

### 2. Problema no Backend
- **Timeout**: Operação Supabase demorando muito
- **Validação**: Pydantic rejeitando request silenciosamente
- **CORS Real**: CORS bloqueando apesar da configuração

### 3. Problema de Rede
- **Proxy**: Vite dev server proxy interferindo
- **Firewall**: Firewall bloqueando requisição
- **Porta**: Conflito de portas

## AÇÃO SOLICITADA

Por favor, investigue sistematicamente o problema de carregamento infinito no signup, seguindo esta ordem:

1. **Verifique se o backend está respondendo** (testar health endpoint)
2. **Capture a requisição exata** que o frontend está enviando
3. **Verifique logs do backend** durante a tentativa de signup
4. **Teste o endpoint diretamente** com curl/fetch
5. **Investigue o componente React** do formulário de signup
6. **Verifique se há erros silenciosos** no frontend ou backend

Forneça uma solução completa e detalhada para resolver o problema, incluindo:
- Diagnóstico preciso da causa raiz
- Código corrigido se necessário
- Passos para testar a solução
- Explicação do que estava causando o problema

## INFORMAÇÕES ADICIONAIS

- **Python**: 3.10
- **FastAPI**: Latest
- **React**: 18+
- **Vite**: Latest
- **Supabase**: Latest
- **OS**: Windows 11
- **Browser**: Provavelmente Chrome/Firefox

O problema está acontecendo especificamente no fluxo de signup, outros endpoints podem estar funcionando normalmente.
