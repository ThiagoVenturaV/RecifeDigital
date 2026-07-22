# 🏙️ Recife Digital — Plataforma de Cursos Acessíveis

[![Deploy](https://img.shields.io/badge/▲_Deploy-recifedigital.vercel.app-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://recifedigital.vercel.app/)

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel Serverless](https://img.shields.io/badge/Vercel-Serverless-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL-00E599?logo=postgresql&logoColor=black)](https://neon.tech/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-F95700?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Acessibilidade VLibras](https://img.shields.io/badge/VLibras-Acessível-00529C)](https://vlibras.gov.br/)

Plataforma web educacional e de inclusão digital desenvolvida em parceria entre a **Prefeitura do Recife** e a **CESAR School**. Oferece cursos gratuitos de capacitação digital com experiência responsiva, leitor de tela nativo (TTS), tradução em Libras, emissão de certificados em PDF com validação, autenticação segura serverless e persistência completa em NeonDB (PostgreSQL).

> 🔗 **Acesso ao site:** [recifedigital.vercel.app](https://recifedigital.vercel.app/)

---

## 📸 Telas & Design

O desenvolvimento seguiu protótipos de alta fidelidade extraídos via MCP Figma:

| Tela | Descrição |
|------|-----------|
| **Catálogo de Cursos (Home)** | Header com logos oficiais, banner hero, listagem por categorias e níveis |
| **Player de Aula** | Vídeo responsivo, navegação por módulos, widget de Fixação Rápida |
| **Avaliação (Quiz)** | Cronômetro, barra de progresso, aprovação ≥70%, celebração com confetti |
| **Certificados** | Card em destaque, download de PDF real (`jspdf`), verificação de autenticidade |
| **Mobile** | Bottom Navigation Bar fixa (Cursos, Progresso, Certificados, Perfil) |

---

## ✨ Funcionalidades

### 🔒 Autenticação Completa (Serverless)
- Cadastro e login com criptografia `bcryptjs` (salt de 10 rodadas)
- Tokens `JWT` com expiração de 24 horas
- Persistência real de usuários no **NeonDB** (PostgreSQL)
- Logout com expiração imediata de cookies
- Modal de auth no header (Entrar / Cadastrar-se / Sair)

### 🗄️ Backend & Banco de Dados
- **8 endpoints serverless** na Vercel (`/api/*`), todos auto-contidos
- NeonDB como banco PostgreSQL serverless
- Tabelas: `users`, `courses`, `user_progress`, `certificates`
- Endpoint `/api/seed` para migração e seed inicial do banco

### 📱 PWA (Progressive Web App)
- Instalável como app nativo no Android, iOS e Desktop
- Detector automático de dispositivo com tutorial personalizado
- Cache offline via Service Worker (`public/sw.js`)

### ♿ Acessibilidade Completa
- **Leitor de Tela Nativo (TTS)**: Síntese de voz em `pt-BR` via `window.speechSynthesis`
- **VLibras**: Tradução automática em Libras ([LibrasWidget](https://github.com/ThiagoVenturaV/LibrasWidget))
- **Alto Contraste & Dimensionador de Fonte**: Ajuste de 100% a 130%

### 🎓 Sistema de Certificados
- Emissão de certificado em **PDF real** com `jspdf`
- Código de verificação único por certificado
- Validação de autenticidade via endpoint `/api/verify`

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 19, Vite 8, TypeScript 6, Vanilla CSS (modular), Lucide React |
| **Backend** | Vercel Serverless Functions (Node.js 24) |
| **Banco de Dados** | NeonDB — PostgreSQL Serverless (`@neondatabase/serverless`) |
| **Autenticação** | `jsonwebtoken`, `bcryptjs` |
| **PDF & UI** | `jspdf`, `canvas-confetti`, `html2canvas`, `js-cookie` |
| **Acessibilidade** | Web Speech API, VLibras API |

---

## 📁 Estrutura do Projeto

```
recife-digital/
├── api/                          # Serverless Functions (Vercel)
│   ├── auth/
│   │   ├── register.ts           # Cadastro → bcrypt.hash + INSERT NeonDB
│   │   ├── login.ts              # Login → bcrypt.compare + JWT
│   │   ├── logout.ts             # Logout → expiração de cookie
│   │   └── me.ts                 # Sessão → verifica JWT e retorna perfil
│   ├── certificates.ts           # CRUD de certificados
│   ├── courses.ts                # Listagem de cursos
│   ├── progress.ts               # Progresso do aluno
│   ├── seed.ts                   # Migração DDL + seed inicial
│   ├── verify.ts                 # Validação de certificado
│   └── db.ts                     # Conector NeonDB (legado)
├── public/
│   ├── favicon.png               # Ícone do app
│   ├── recife_azul_sobre_branco.png  # Logo Prefeitura do Recife
│   ├── logoSchool.svg            # Logo CESAR School
│   ├── manifest.json             # PWA Manifest
│   └── sw.js                     # Service Worker
├── src/
│   ├── components/               # Header, BottomNav, AuthModal, PWA, Quiz...
│   ├── styles/                   # CSS modular (Header.css, AuthModal.css...)
│   ├── data/                     # Dados iniciais de cursos e módulos
│   ├── types/                    # Interfaces TypeScript
│   ├── utils/                    # PDF Generator, Device Detector, TTS
│   ├── views/                    # CatalogView, PlayerView, CertificatesView...
│   ├── App.tsx                   # Roteamento e estado global
│   └── index.css                 # Design System (tokens, reset, tipografia)
├── vercel.json                   # Configuração de rotas e rewrites
├── tsconfig.json
└── package.json
```

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js ≥ 18
- Conta no [NeonDB](https://neon.tech/) (para backend com banco)

### Desenvolvimento Local

```bash
# Clonar o repositório
git clone https://github.com/ThiagoVenturaV/RecifeDigital.git
cd RecifeDigital

# Instalar dependências
npm install

# Rodar em modo de desenvolvimento
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Deploy na Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Variáveis de Ambiente (Vercel)

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão do NeonDB (PostgreSQL) |
| `JWT_SECRET` | Chave secreta para assinatura JWT (opcional, tem fallback) |

### Seed do Banco de Dados

Após o primeiro deploy, acesse:
```
https://recifedigital.vercel.app/api/seed
```
Isso cria as tabelas e insere dados iniciais (cursos, usuário demo e certificado).

---

## 📜 Licença

Este projeto é disponibilizado para fins educacionais e de capacitação social.  
Desenvolvido por **Thiago Ventura** para a **Prefeitura do Recife** & **CESAR School**.
