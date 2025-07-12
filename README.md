# EchoNoteAI

Bem-vindo ao EchoNoteAI!  
Este projeto é uma aplicação completa para transcrição de áudio usando IA, com autenticação, integração com OpenAI e armazenamento seguro.

---

## Visão Geral

EchoNoteAI é dividido em dois serviços principais:
- **Frontend**: Vue 3 + Vite, hospedado na Vercel.
- **Backend**: Node.js + Express, hospedada no Render.

---

## Arquitetura

- **Frontend**: SPA com Vue Router, controle de rotas protegidas e integração com Firebase Auth.
- **Backend**: API RESTful, autenticação via Firebase, integração com OpenAI e MongoDB Atlas.
- **Banco de Dados**: MongoDB Atlas (cloud).
- **Autenticação**: Firebase Auth.
- **Transcrição**: OpenAI API.

---

## Como funciona o Frontend

- **SPA com Vue Router**: Navegação e proteção de rotas.
- **Guarda de Rotas**: Usuário não autenticado é redirecionado para `/login`.
- **Redirecionamento Universal**: O arquivo `vercel.json` garante que qualquer rota do SPA seja servida pelo `index.html`, evitando erros 404.
- **Variáveis de Ambiente**: Configure tudo pelo painel da Vercel, usando prefixo `VITE_`.
- **Responsividade**: Layout mobile first, adaptado para qualquer dispositivo.

---

## Como funciona o Backend

- **API RESTful**: Rotas para autenticação, transcrição e usuários.
- **Autenticação**: Validação de tokens do Firebase.
- **Rate Limiting**: Limita requisições à rota de transcrição para proteger a OpenAI.
- **Banco de Dados**: Conexão segura com MongoDB Atlas.
- **CORS**: Só aceita requisições do domínio do frontend.
- **Firebase Admin**: Credenciais via variável de ambiente (base64) ou Secret File do Render.
- **Logs e Erros**: Log de requisições e tratamento centralizado de erros.

---

## Banco de Dados

- **MongoDB Atlas**: Usado em produção.
- **Conexão Segura**: String de conexão via variável de ambiente.
- **Desenvolvimento Local**: Pode usar Docker Compose para subir um banco local.

---

## Integração com OpenAI

- **Transcrição de Áudio**: Rota `/transcribe` envia áudio para a OpenAI.
- **Rate Limiting**: Protege contra uso excessivo.
- **Tratamento de Erros**: Mensagens claras para o usuário.

---

## Autenticação

- **Frontend**: Firebase Auth, login social, persistência de sessão.
- **Backend**: Validação do token do Firebase.
- **Domínios Autorizados**: Adicione o domínio do frontend no Firebase para login OAuth.

---

## Rate Limiting

- **Implementação**: Middleware limita requisições por IP.
- **Configuração**: Máximo de 5 requisições por usuário.
- **Mensagens**: Feedback claro ao exceder o limite.

---

## Ambientes e Deploy

### Desenvolvimento

- **Frontend**: `.env` local, rode com `npm run dev`.
- **Backend**: `.env` local, rode com Docker Compose.
- **Banco**: MongoDB local via Docker Compose.

### Produção

- **Frontend**: Deploy na Vercel, variáveis de ambiente no painel.
- **Backend**: Deploy no Render, variáveis e Secret Files no painel.
- **Banco**: MongoDB Atlas, string de conexão segura no Render.

---

## Segurança

- **Variáveis Sensíveis**: Nunca expostas no repositório, sempre configuradas via painel.
- **Secret Files**: Usados no Render para arquivos como o Firebase Service Account.
- **CORS Restrito**: Só o domínio do frontend pode acessar a API.
- **Rate Limiting**: Protege a API da OpenAI.
- **Autenticação**: Tokens sempre validados no backend.

---

## Como rodar o backend com Docker

1. **Configure o arquivo `.env` na pasta `/backend`**  
   Adicione todas as variáveis necessárias (ex: `MONGO_URI`, `JWT_SECRET`, `OPENAI_API_KEY`, etc).

2. **Construa a imagem Docker do backend**
   ```sh
   cd backend
   docker build -t echo-note-backend .
   ```

3. **Rode o container**
   ```sh
   docker run --env-file .env -p 4000:4000 echo-note-backend
   ```

4. **(Opcional) Usando Docker Compose para backend + MongoDB local**
   ```sh
   docker-compose up backend mongo
   ```

**Observações:**
- Para produção, use MongoDB Atlas e configure as variáveis no Render.
- O backend estará disponível em `http://localhost:4000`.

---

## Como rodar localmente o frontend

1. **Clone o repositório**
2. **Configure o `.env` do frontend**
3. **Rode o frontend**
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

---

## Observações Finais

- Toda lógica de rotas protegidas e redirects é feita no frontend (SPA).
- O backend responde apenas APIs e valida autenticação nos endpoints.
- O projeto está pronto para escalar e ser mantido com segurança e flexibilidade.

---