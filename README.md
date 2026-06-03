# SisReq - Sistema de Requerimentos Acadêmicos

Sistema web desenvolvido para digitalizar e automatizar os processos de requerimentos acadêmicos do IFCE - Campus Cedro.

---

# 📚 Sobre o Projeto

O SisReq tem como objetivo substituir processos manuais em papel por um sistema online, permitindo que alunos realizem solicitações acadêmicas de forma digital, com acompanhamento de status e gerenciamento pelos servidores administrativos.

---

# 🚀 Tecnologias Utilizadas

## Front-end
- React
- Vite
- React Router DOM
- CSS

## Back-end
- Node.js
- Express
- Prisma ORM
- SQLite
- JWT
- bcryptjs

---

# 📁 Estrutura do Projeto

```text
sisreq-back
 ├─ prisma
 ├─ src
 │   ├─ controllers
 │   ├─ routes
 │   ├─ services
 │   ├─ middlewares
 │   ├─ utils
 │   └─ server.js
 ├─ .env
 ├─ package.json
```

---

# ⚙️ Como Rodar o Projeto

## 1. Clonar o repositório

```bash
git clone https://github.com/seu-repositorio/sisreq.git
```

---

## 2. Entrar na pasta do back-end

```bash
cd sisreq-back
```

---

## 3. Instalar dependências

```bash
npm install
```

---

## 4. Criar arquivo `.env`

Crie um arquivo chamado `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="segredo123"
PORT=3000
```

---

## 5. Configurar o Prisma

### Gerar Prisma Client

```bash
npx prisma generate
```

### Criar banco SQLite e tabelas

```bash
npx prisma migrate dev --name init
```

---

## 6. Rodar o servidor

```bash
npm run dev
```

O servidor será iniciado em:

```text
http://localhost:3000
```

