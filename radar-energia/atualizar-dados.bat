@echo off
echo =========================================
echo ATUALIZACAO AUTOMATICA DA ANEEL
echo =========================================
echo.

REM Descobre automaticamente a pasta onde o .bat esta
set "PROJETO=%~dp0backend"

REM Localiza o Node.js pelo PATH do Windows
set "NODE=node"

REM Localiza o script automaticamente
set "SCRIPT=%PROJETO%\src\scripts\atualizarDados.js"

echo Projeto:
echo %PROJETO%
echo.

if not exist "%SCRIPT%" (
    echo ERRO: O arquivo atualizarDados.js NAO foi encontrado!
    echo.
    echo Caminho procurado:
    echo %SCRIPT%
    echo.
    pause
    exit /b 1
)

echo Arquivo encontrado!
echo.

echo Node:
node --version

if errorlevel 1 (
    echo.
    echo ERRO: Node.js nao foi encontrado no computador.
    echo Instale o Node.js antes de executar este arquivo.
    echo.
    pause
    exit /b 1
)

echo.
echo Entrando na pasta do projeto...
cd /d "%PROJETO%"

echo Pasta atual:
cd
echo.

echo Executando atualizarDados.js...
echo.

node "%SCRIPT%"

echo.

if %ERRORLEVEL% EQU 0 (
    echo =========================================
    echo ATUALIZACAO CONCLUIDA COM SUCESSO
    echo =========================================
) else (
    echo =========================================
    echo ERRO DURANTE A ATUALIZACAO
    echo Codigo do erro: %ERRORLEVEL%
    echo =========================================
)

echo.
pause