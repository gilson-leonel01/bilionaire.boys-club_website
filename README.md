# 💸Bilionaire Boys Club Website🤑 - Plataforma de membros com conteúdo exclusivo sobre finanças e investimentos

![BBC Website](https://)

## 📌 Visão Geral

O **Bilionaire Boys Club Website** é uma plataforma sofisticada para entusiastas de finanças e investimentos. Oferecemos vídeos exclusivos de eventos, conteúdo premium para membros assinantes, e uma experiência interativa com shorts vídeos motivacionais.

## 🚀 Executando o Projeto

Siga as instruções abaixo para configurar e rodar o projeto localmente.

### 1️⃣ Clonando o Repositório

Primeiro, clone o repositório do projeto:

```sh
git clone https://github.com/gilson-leonel01/bilionaire.boys-club_website.git
cd bilionaire.boys-club_website
```

### 2️⃣ Configuração do Ambiente

#### Backend (NodeJS, Prisma ORM, PostgreSQL)

##### 📌 Pré-requisitos:
- Node.js instalado (versão 16+ recomendada).
- PostgreSQL configurado.
- Prisma ORM configurado.
- Criar um arquivo `.env` e adicionar as credenciais do banco de dados.

##### 📌 Configuração:

1. Instalar as dependências:
   ```sh
   npm install
   ```
2. Rodar as migrações do Prisma ORM:
   ```sh
   npx prisma migrate dev
   ```
3. Iniciar o backend:
   ```sh
   npm run dev
   ```

### 3️⃣ Frontend (Vite, React.js, Zod, React Query, React Router DOM, Tailwind CSS)

1. Acesse o diretório do frontend:
   ```sh
   cd frontend
   ```
2. Instalar as dependências:
   ```sh
   npm install
   ```
3. Iniciar o servidor de desenvolvimento:
   ```sh
   npm run dev
   ```

A aplicação estará disponível em:
frontend: `http://localhost:5173`,
backend: `http://localhost:3001`.

## 📝 Funcionalidades

- 📌 Cadastro de membros e gestão de assinaturas.
- 📌 Vídeos de eventos e shorts motivacionais.
- 🔒 Conteúdo completo acessível apenas para assinantes.

## 🛠️ Tecnologias Utilizadas

### 🔹 Backend:
- NodeJS
- Prisma ORM
- PostgreSQL

### 🔹 Frontend:
- React.js
- Vite
- React Router DOM
- React Query
- Tailwind CSS
- Zod
- Lucide Icons

## 📌 Links úteis

- [Documentação do NodeJS]([https://nodejs.org/docs](https://nodejs.org/docs/latest/api/))
- [PostgreSQL](https://www.postgresql.org/)
- [Prisma ORM](https://www.prisma.io/docs)
- [React.js](https://reactjs.org/)

## 🤝 Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o repositório.
2. Crie uma nova branch (`git checkout -b minha-feature`).
3. Faça as alterações e commite (`git commit -m 'Minha nova feature'`).
4. Envie um pull request.

---

Desenvolvido com 💙 por [Gilson Leonel a.k.a G!](https://github.com/gilson-leonel01)
