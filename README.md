# Radar de Monitoramento de Energia Elétrica

Sistema desenvolvido para monitoramento e análise de interrupções no fornecimento de energia elétrica, utilizando dados públicos disponibilizados pela ANEEL.

## Descrição do problema

Os dados públicos disponibilizados pela ANEEL sobre interrupções no fornecimento de energia elétrica possuem grande volume de informações e são disponibilizados periodicamente. Analisar esses dados manualmente pode dificultar a identificação de padrões, a comparação entre períodos e a visualização das principais ocorrências.

## Descrição da solução

O sistema automatiza a obtenção e a atualização dos dados, armazenando as informações em um banco de dados PostgreSQL.

O backend, desenvolvido em **Node.js e Express**, disponibiliza os dados por meio de uma API REST e realiza as consultas e o processamento necessários.

No frontend, desenvolvido em **React**, as informações são apresentadas em um dashboard interativo, permitindo visualizar indicadores, evolução das interrupções ao longo dos meses, tipos de interrupção e dados por distribuidora, além de aplicar filtros por período.

Dessa forma, o projeto transforma os dados brutos da ANEEL em informações organizadas e visualmente acessíveis para facilitar o acompanhamento e a análise das interrupções de energia elétrica.

---

## Demonstração do Dashboard

### Análise dos dados

<img width="1782" height="904" alt="Dashboard - Análise dos dados" src="https://github.com/user-attachments/assets/83253ef0-d17a-4dbe-908a-0ad4a228e8e4" />

### Visão geral

<img width="1828" height="901" alt="Dashboard - Visão geral" src="https://github.com/user-attachments/assets/4980be24-f2d5-442c-8c25-38f65a353001" />

### Visualização detalhada

<img width="1871" height="1908" alt="Dashboard - Visualização detalhada" src="https://github.com/user-attachments/assets/9a88c14c-0b3c-4ffd-ae1c-a2faa00a6b78" />

---

# Tecnologias utilizadas

### Backend

* Node.js
* Express
* PostgreSQL
* API REST
* CSV
* Importação de dados da ANEEL
* Nodemon

### Frontend

* React
* Vite
* JavaScript
* CSS

### Fonte dos dados

Os dados utilizados pelo sistema são provenientes da base pública da **ANEEL — Agência Nacional de Energia Elétrica**.

---

# 1. Pré-requisitos

Antes de executar o projeto, é necessário ter instalado:

* Node.js
* npm
* PostgreSQL
* Git

Recomenda-se utilizar uma versão recente do Node.js.

Para verificar as instalações:

```bash
node --version
npm --version
psql --version
git --version
```

---

# 2. Clonar o projeto

Clone o repositório:

```bash
git clone https://github.com/caua-lucas/radar-energia-aneel.git
```

Depois, entre na pasta do projeto:

```bash
cd radar-energia-aneel
```

---

# 3. Configuração do PostgreSQL

O sistema utiliza PostgreSQL para armazenar os dados das interrupções.

Crie o banco de dados:

```sql
CREATE DATABASE radar_energia;
```

Depois, conecte-se ao banco pelo terminal do VS Code:

```bash
psql -U postgres -d radar_energia
```

A tabela utilizada pelo sistema é:

```text
interrupcoes
```

Ela armazena os dados importados da ANEEL.

A configuração da conexão com o banco está localizada em:

```text
backend/src/config/database.js
```

Configure usuário, senha, banco, host e porta de acordo com o PostgreSQL instalado na máquina.

---

# 4. Instalar as dependências do Backend

É necessário estar na pasta `backend` para executar os comandos desta seção.

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

O `npm install` utiliza o arquivo:

```text
package.json
```

e instala automaticamente as dependências necessárias do backend.

## Criação automática da tabela

Após executar o `npm install`, execute:

```bash
npm run db
```

Esse comando executa automaticamente o processo de criação das estruturas necessárias no banco de dados, incluindo a tabela utilizada pelo sistema.

> O comando `npm run db` deve estar configurado no `package.json` do backend.

Caso o comando `npm run db` não esteja configurado no `package.json`, a tabela deverá ser criada utilizando o script SQL disponibilizado no projeto.

## Nodemon

O projeto utiliza o **Nodemon** para reiniciar automaticamente o servidor durante o desenvolvimento.

Caso o Nodemon ainda não esteja instalado no projeto:

```bash
npm install --save-dev nodemon
```

Depois, o servidor pode ser iniciado com:

```bash
npm run dev
```

---

# 5. Instalar as dependências do Frontend

Abra outro terminal.

A partir da pasta `radar-energia-aneel`, entre no frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

O `npm install` instala as dependências definidas no `package.json` do frontend.

## Vite

O frontend utiliza o Vite como ferramenta de desenvolvimento.

Caso o Vite ainda não esteja instalado no projeto:

```bash
npm install -D vite
```

Depois, execute:

```bash
npm run dev
```

---

# 6. Importação dos dados da ANEEL

O projeto possui scripts responsáveis pela atualização e importação dos dados.

Os principais arquivos são:

```text
backend/src/scripts/atualizarDados.js
backend/src/scripts/importarDados.js
```

O processo funciona da seguinte maneira:

1. O sistema consulta os recursos disponibilizados pela ANEEL.
2. Identifica o arquivo referente ao ano mais recente disponível.
3. Faz o download do arquivo.
4. Extrai os dados.
5. Processa o CSV.
6. Insere os registros no PostgreSQL.

---

# 7. Atualizar os dados

Existe também um arquivo:

```text
atualizar-dados.bat
```

Esse arquivo pode ser utilizado no Windows para executar o processo de atualização automática.

O script identifica automaticamente o recurso anual mais recente disponível na ANEEL,realiza o download e importa os dados para o banco.

Para atualizar os dados disponíveis na ANEEL, execute:

```bash
cd radar-energia-aneel/radar-energia/backend
node src/scripts/atualizarDados.js
```

Ou a partir da pasta `backend`, também é possível executar diretamente pelo Node.js:

```bash
node src/scripts/atualizarDados.js
```

Também é possível executá-lo manualmente pelo terminal.

### Git Bash

Na pasta principal do projeto, onde está o arquivo:

```bash
./atualizar-dados.bat
```

### PowerShell

```powershell
.\atualizar-dados.bat
```

O fluxo de execução é:

```text
atualizar-dados.bat
        ↓
atualizarDados.js
        ↓
consulta os dados mais recentes da ANEEL
        ↓
faz o download
        ↓
processa o arquivo CSV
        ↓
atualiza o PostgreSQL
```

---

# 8. Atualização automática com arquivo `.bat` e Agendador de Tarefas

## Agendamento automático

Para automatizar o processo, o arquivo `.bat` pode ser configurado no **Agendador de Tarefas do Windows**.

O Agendador de Tarefas permite definir quando o processo será executado, por exemplo:

```text
Mensalmente
     ↓
Horário configurado
     ↓
atualizar-dados.bat
     ↓
atualizarDados.js
     ↓
Dados da ANEEL atualizados
```

### Como configurar

1. Abra o **Agendador de Tarefas** do Windows.
2. Clique em **Criar Tarefa Básica**.
3. Defina um nome, por exemplo:

```text
Atualização Radar de Energia
```

4. Escolha a frequência de execução, como mensalmente.
5. Defina o horário desejado.
6. Na opção **Iniciar um programa**, selecione o arquivo:

```text
atualizar-dados.bat
```

7. Finalize a configuração.

A partir desse momento, o Windows poderá executar o arquivo `.bat` automaticamente no horário configurado.

### Importante

O caminho configurado no arquivo `.bat` deve ser ajustado de acordo com o local onde o projeto estiver instalado.

Por exemplo, se o projeto for copiado para outro computador, os caminhos absolutos existentes no `.bat` deverão ser alterados.

Além disso, o computador precisa estar ligado no momento da execução e o PostgreSQL deve estar disponível para que a atualização seja concluída corretamente.

---


# 9. Executar o Backend

Na pasta:

```text
radar-energia-aneel/backend
```

execute:

```bash
npm run dev
```

Caso o projeto esteja configurado para execução direta pelo Node.js, também pode ser utilizado:

```bash
node src/server.js
```

Quando o servidor estiver funcionando, deverá aparecer uma mensagem semelhante a:

```text
PostgreSQL conectado!
Servidor rodando em http://localhost:3001
```

A API estará disponível em:

```text
http://localhost:3001
```

---

# 10. Executar o Frontend

Abra outro terminal e entre na pasta:

```bash
cd radar-energia-aneel/frontend
```

Execute:

```bash
npm run dev
```

O Vite fornecerá o endereço local do frontend, normalmente:

```text
http://localhost:5173
```

Abra esse endereço no navegador.

---

# 11. Executando o projeto completo

Para executar o sistema completo, são necessários dois processos:

### Terminal 1 — Backend

```bash
cd radar-energia-aneel/backend
npm install
npm run db
npm run dev
```

### Terminal 2 — Frontend

```bash
cd radar-energia-aneel/frontend
npm install
npm run dev
```

Depois, acesse o endereço fornecido pelo Vite no navegador.

---

# 12. Estrutura do projeto

```text
radar-energia/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   │
│   │   ├── controllers/
│   │   │   └── interrupcoesController.js
│   │   │
│   │   ├── middlewares/
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   └── interrupcaoModel.js
│   │   │
│   │   ├── routes/
│   │   │   └── index.js
│   │   │
│   │   ├── scripts/
│   │   │   ├── atualizarDados.js
│   │   │   ├── importarDados.js
│   │   │   └── configurarBanco.js
│   │   │
│   │   ├── services/
│   │   │   ├── aneelService.js
│   │   │   └── interrupcaoService.js
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package.json
│   └── package-lock.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   │   └── icone_radar
│   │   │
│   │   ├── components/
│   │   │   ├── Cards.jsx
│   │   │   ├── Filtros.jsx
│   │   │   ├── GraficoMensal.jsx
│   │   │   ├── GraficoTipos.jsx
│   │   │   ├── Header.jsx
│   │   │   └── TabelaDistribuidoras.jsx
│   │   │
│   │   ├── hooks/
│   │   │   └── useDashboard.js
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── package-lock.json
│
├── data/
│
└── atualizar-dados.bat
```

---

# 13. Dashboard

O dashboard apresenta informações como:

* Total de interrupções
* Interrupções por período
* Interrupções por tipo
* Duração média das interrupções
* Distribuidoras com maior quantidade de interrupções
* Evolução mensal dos registros

Os filtros de período permitem consultar diferentes intervalos de dados armazenados no PostgreSQL.

---

# 14. Fluxo do sistema

```text
ANEEL
  ↓
Download dos dados
  ↓
Arquivo CSV
  ↓
Processamento
  ↓
PostgreSQL
  ↓
Backend Node.js
  ↓
API REST
  ↓
Frontend React
  ↓
Dashboard
```

---

# 15. Observações importantes

* O PostgreSQL precisa estar em execução antes de iniciar o backend.
* O backend precisa estar funcionando para que o frontend consiga consultar os dados.
* O frontend e o backend são executados separadamente.
* As dependências devem ser instaladas com `npm install` em cada pasta que possui um `package.json`.
* O comando `npm run db` deve ser executado na pasta `backend`.
* O arquivo `package-lock.json` deve ser mantido no projeto para garantir maior consistência das versões das dependências instaladas.
* O arquivo `.bat` pode precisar de ajustes de caminho quando o projeto for executado em outro computador.
* As credenciais do PostgreSQL devem ser configuradas de acordo com o ambiente utilizado.
