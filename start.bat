@echo off
REM Script de Setup e Execução do DualOS para Windows
REM Execute: start.bat

echo ========================================
echo    DualOS - Inicializando...
echo ========================================
echo.

REM Verificar se Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao encontrado!
    echo        Instale Node.js 18+ em: https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version
echo.

REM Verificar se as dependências estão instaladas
if not exist "node_modules\" (
    echo ========================================
    echo    Instalando dependencias...
    echo    Isso pode levar alguns minutos
    echo ========================================
    echo.
    
    REM Verificar se pnpm está disponível
    where pnpm >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        echo Usando pnpm...
        pnpm install
    ) else (
        echo Usando npm...
        npm install
    )
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo [OK] Dependencias instaladas com sucesso!
    ) else (
        echo.
        echo [ERRO] Erro ao instalar dependencias
        pause
        exit /b 1
    )
) else (
    echo [OK] Dependencias ja instaladas
)

echo.
echo ========================================
echo    Iniciando servidor...
echo ========================================
echo.
echo    DualOS estara disponivel em:
echo    http://localhost:5173
echo.
echo    Pressione Ctrl+C para parar
echo ========================================
echo.

REM Iniciar servidor
where pnpm >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    pnpm dev
) else (
    npm run dev
)
