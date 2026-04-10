#!/bin/bash

# Script de inicialização do Conveasy Backend
# Uso: ./start.sh [dev|prod|test]

MODE=${1:-dev}

echo "🚀 Iniciando Conveasy Backend em modo: $MODE"

# Verificar se .env existe
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "📋 Copie .env.example para .env e configure as variáveis"
    exit 1
fi

# Instalar dependências
echo "📦 Instalando dependências..."
pip install -r requirements.txt

case $MODE in
    "dev")
        echo "🛠️  Iniciando modo desenvolvimento..."
        uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
        ;;
    "prod")
        echo "🏭 Iniciando modo produção..."
        uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
        ;;
    "test")
        echo "🧪 Executando testes..."
        pytest tests/ -v --cov=app --cov-report=html
        ;;
    *)
        echo "❌ Modo inválido. Use: dev, prod ou test"
        exit 1
        ;;
esac