#!/bin/bash

# Script de Setup e Execução do DualOS
# Execute: chmod +x start.sh && ./start.sh

echo "🚀 DualOS - Inicializando..."
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null
then
    echo "❌ Node.js não encontrado!"
    echo "   Instale Node.js 18+ em: https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) encontrado"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Instalando dependências..."
    echo "   (Isso pode levar alguns minutos na primeira vez)"
    echo ""
    
    # Verificar se pnpm está disponível
    if command -v pnpm &> /dev/null
    then
        echo "   Usando pnpm..."
        pnpm install
    else
        echo "   Usando npm..."
        npm install
    fi
    
    if [ $? -eq 0 ]; then
        echo ""
        echo "✅ Dependências instaladas com sucesso!"
    else
        echo ""
        echo "❌ Erro ao instalar dependências"
        exit 1
    fi
else
    echo "✅ Dependências já instaladas"
fi

echo ""
echo "🎯 Iniciando servidor de desenvolvimento..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  DualOS estará disponível em:"
echo "  http://localhost:5173"
echo ""
echo "  Pressione Ctrl+C para parar o servidor"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Iniciar servidor
if command -v pnpm &> /dev/null
then
    pnpm dev
else
    npm run dev
fi
