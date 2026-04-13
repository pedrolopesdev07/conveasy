# 🚨 PROMPT COMPLETO PARA GEMINI - ERRO DE SIGNUP CONVEASY

## 📋 CONTEXTO COMPLETO DO PROJETO

### 🏗️ Arquitetura do Sistema
- **Frontend**: React + Vite rodando em http://localhost:5173
- **Backend**: FastAPI (Python 3.10) rodando em http://localhost:8000
- **Database**: Supabase PostgreSQL (https://idkjeyosxnprwnjbqlbt.supabase.co)
- **Projeto**: ConvEasy - Sistema de Gerenciamento de Convênios

### 📁 Estrutura de Diretórios
```
Conveasy/
├── conveasy-backend/
│   ├── app/
│   │   ├── models/
│   │   │   ├── usuario.py (modelos Pydantic)
│   │   │   ├── empresa.py (modelos Pydantic)
│   │   │   └── convenio.py (modelos Pydantic)
│   │   ├── api/v1/
│   │   │   ├── endpoints/
│   │   │   │   └── usuario.py (endpoints de auth)
│   │   │   └── router.py (roteamento)
│   │   ├── middlewares/
│   │   │   └── cors.py (middleware CORS)
│   │   ├── database/
│   │   │   └── supabase_client.py (cliente Supabase)
│   │   ├── core/
│   │   │   └── security.py (JWT, hash de senha)
│   │   ├── schemas/
│   │   │   └── usuario.py (schemas Pydantic)
│   │   └── config.py (configurações)
│   ├── .env (variáveis de ambiente)
│   ├── start_server.py (script de inicialização)
│   └── requirements.txt
└── Prototipo-ConveFlow-alta-fidelidade/
    ├── src/
    │   ├── lib/supabaseConfig.js (config Supabase frontend)
    │   └── app/pages/ (páginas React)
    └── .env.local (variáveis frontend)
```

### 🔧 Configurações Atuais

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

### 🗄️ Estrutura da Tabela `usuarios` no Supabase
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

### 🐍 Modelos Pydantic (Backend)

#### app/models/usuario.py
```python
from pydantic import BaseModel, Field
from pydantic_settings import BaseSettings
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    GESTOR = "gestor"
    USUARIO = "usuario"

class UsuarioBase(BaseModel):
    usuario: str = Field(..., min_length=1, max_length=255)  # do frontend
    nome: Optional[str] = Field(None, alias="nome_completo")
    email: EmailStr
    perfil: UserRole = Field(default=UserRole.USUARIO, alias="role")
    setor: Optional[str] = Field(None, alias="departamento")
    
    model_config = {
        "populate_by_name": True,
        "from_attributes": True
    }

class UsuarioCreate(UsuarioBase):
    senha: str = Field(..., min_length=8, max_length=255)

class UsuarioResponse(UsuarioBase):
    id: str
    createdat: datetime = Field(alias="created_at")
    ultimoacesso: Optional[datetime] = Field(None, alias="ultimo_acesso")
    status: bool = Field(True, alias="ativo")
```

### 🔗 Endpoint de Signup (Backend)

#### app/api/v1/endpoints/usuario.py
```python
@router.post("/test-signup")
async def test_signup(usuario: UsuarioCreate):
    """
    Endpoint de teste sem Supabase
    """
    print("🔥 TESTE SIGNUP SEM SUPABASE")
    print(f"👉 Dados recebidos: {usuario.dict()}")
    return {"msg": "funcionando", "data": usuario.dict()}

@router.post("/signup", response_model=UsuarioResponse, status_code=status.HTTP_201_CREATED)
async def signup(usuario: UsuarioCreate, supabase=Depends(get_supabase)):
    """
    Endpoint para cadastro de novo usuário
    """
    print("🔥 INICIOU SIGNUP")
    print(f"👉 Dados recebidos: {usuario.dict()}")

    try:
        # Verificar se email já existe
        print("👉 antes do select")
        existing = supabase.table("usuarios").select("*").eq("email", usuario.email).execute()
        print("✅ passou do select")
        print(f"👉 Existing: {existing.data}")

        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email já cadastrado"
            )

        print("👉 antes do hash")
        senha_hash = get_password_hash(usuario.senha)
        print("✅ passou do hash")

        print("👉 antes do insert")
        response = supabase.table("usuarios").insert({
            "nome": usuario.usuario,  # mapeamento: frontend.usuario -> tabela.nome
            "email": usuario.email,
            "perfil": usuario.perfil.value if hasattr(usuario.perfil, 'value') else usuario.perfil,
            "setor": usuario.setor,
            "senha_hash": senha_hash
        }).execute()
        print("✅ passou do insert")
        print(f"👉 Response: {response.data}")

        return response.data[0]

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Erro no cadastro: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro ao cadastrar usuário"
        )
```

### 🌐 CORS Configuration

#### app/middlewares/cors.py
```python
from fastapi.middleware.cors import CORSMiddleware

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

### 🚀 Script de Inicialização

#### start_server.py
```python
import uvicorn
from app.config import settings

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",  # Aceita conexões de qualquer IP
        port=8000,
        reload=settings.DEBUG,
        log_level="info"
    )
```

## 🚨 ERRO ATUAL

### Sintomas
1. **Backend inicia corretamente** no terminal com uvicorn
2. **Frontend não consegue se conectar** ao backend
3. **Requisições HTTP falham** com erro de conexão
4. **curl também não consegue** acessar os endpoints

### Logs do Backend
```
INFO:     Will watch for changes in these directories: ['C:\\Users\\softw\\OneDrive\\Desktop\\Conveasy\\conveasy-backend']
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process [19720] using WatchFiles
```

### Erro ao Tentar Acessar
```bash
curl http://localhost:8000/health
# Resultado: Invoke-WebRequest : Impossível conectar-se ao servidor remoto
```

## 🔍 INVESTIGAÇÃO NECESSÁRIA

### 1. Problema de Conexão
O backend está rodando em `127.0.0.1:8000` mas não responde a requisições externas.

### 2. Possíveis Causas
- **Conflito de host**: uvicorn rodando em 127.0.0.1 mas configurado para 0.0.0.0
- **Firewall/Windows**: Bloqueando conexões na porta 8000
- **Erro de inicialização**: Aplicação FastAPI não iniciou corretamente
- **Problema de dependências**: Algum módulo faltando causando erro silencioso

### 3. Pontos a Verificar
- Se o processo uvicorn está realmente ouvindo na porta 8000
- Se há outros processos usando a porta 8000
- Se o firewall do Windows está bloqueando
- Se há erros no startup da aplicação

## 🎯 SOLUÇÕES A TESTAR

### 1. Verificar Porta em Uso
```bash
netstat -ano | findstr :8000
```

### 2. Testar Conexão Local
```bash
# Testar com 127.0.0.1
curl http://127.0.0.1:8000/health

# Testar com localhost
curl http://localhost:8000/health
```

### 3. Verificar Processos
```bash
tasklist | findstr python
```

### 4. Testar com Porta Diferente
```python
# Mudar porta para 8001 no start_server.py
uvicorn.run("app.main:app", host="0.0.0.0", port=8001, reload=True)
```

### 5. Verificar Logs Detalhados
```python
# Adicionar mais logs no main.py
@app.on_event("startup")
async def startup_event():
    print("🚀 Aplicação FastAPI iniciada com sucesso!")
    print(f"📍 Host: 0.0.0.0")
    print(f"🌐 Porta: 8000")
```

## 📋 AÇÃO SOLICITADA AO GEMINI

Por favor, investigue sistematicamente o problema de conexão do backend FastAPI seguindo esta ordem:

1. **Analise o código de inicialização** do FastAPI e identifique possíveis problemas
2. **Verifique se há conflito** entre a configuração do uvicorn e o host real
3. **Sugira comandos específicos** para diagnosticar o problema no Windows
4. **Proponha soluções** alternativas se o problema persistir
5. **Forneça um passo a passo** detalhado para resolver o problema

## 🎯 OBJETIVO FINAL

Fazer com que o backend FastAPI responda corretamente às requisições HTTP do frontend e do curl, permitindo que o sistema de signup funcione normalmente.

## 📊 INFORMAÇÕES ADICIONAIS

- **Python**: 3.10
- **FastAPI**: Latest
- **React**: 18+
- **Vite**: Latest
- **Supabase**: Latest
- **OS**: Windows 11
- **PowerShell**: Versão atual
- **Navegador**: Chrome/Firefox

O problema está especificamente na **conexão HTTP com o backend**, que impede o funcionamento de todos os endpoints.
