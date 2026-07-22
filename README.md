# 🏙️ Recife Digital — Plataforma de Cursos Acessíveis

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vercel Serverless](https://img.shields.io/badge/Vercel-Serverless-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![NeonDB](https://img.shields.io/badge/NeonDB-PostgreSQL-00E599?logo=postgresql&logoColor=black)](https://neon.tech/)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-F95700?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Acessibilidade VLibras](https://img.shields.io/badge/VLibras-Acessível-00529C)](https://vlibras.gov.br/)

Plataforma web educacional e de inclusão digital desenvolvida em parceria entre a **Prefeitura do Recife** e a **CESAR School**. O projeto foi construído seguindo **estritamente o design Figma** para telas Desktop e Mobile, oferecendo experiência responsiva, leitor de tela nativo (TTS), tradução em Libras, emissão de certificados em PDF com validação e autenticação segura serverless.

---

## 📸 Telas & Design Figma Integrado (MCP)

O desenvolvimento seguiu os protótipos de alta fidelidade extraídos via MCP Figma:

1. **Catálogo de Cursos (Home)**:
   - Header com logos oficiais da Prefeitura do Recife (`recife_azul_sobre_branco.png`) e CESAR School (`logoSchool.svg`), busca e menu de perfil.
   - Banner Hero de boas-vindas.
   - Listagem por categorias (Informática, Mobile, Sociedade, Programação, Design) e níveis (Básico e Intermediário).
2. **Player de Aula e Exercícios**:
   - Player de vídeo responsivo com controles e legendas.
   - Navegação por módulos e aulas.
   - Widget interativo de **Fixação Rápida** integrado para resposta em tempo real.
3. **Avaliação do Módulo (Prova / Quiz)**:
   - Cronômetro regressivo de tempo restante.
   - Barra de progresso de questões respondidas.
   - Regra de aprovação (70%) e modal com celebração em confetti.
4. **Meus Certificados**:
   - Card em destaque para o certificado mais recente com nota e competências.
   - Emissão e download automático de **PDF Real do Certificado** (`jspdf`).
   - Modal de verificação de autenticidade do código de certificado via Blockchain.
5. **Navegação Mobile (Bottom Navigation Bar)**:
   - Barra fixa inferior para celulares (Cursos, Meu Progresso, Certificados, Perfil) idêntica à especificação do Figma.

---

## ✨ Funcionalidades Principais

### 🔒 Autenticação Serverless (Bcrypt & JWT)
- Criptografia de senhas utilizando `bcryptjs` com salt de 10 rodadas.
- Emissão de tokens `JWT` com expiração de 24 horas.
- Rota de `logout` com expiração e limpeza imediata de cookies HTTP-only (`maxAge: 0`, `expires: Jan 1 1970`).

### 📱 PWA (Progressive Web App) & Tutoriais Inteligentes
- Suporte a instalação como aplicativo nativo no Android, iOS e Desktop.
- Detector automático de dispositivo (`src/utils/deviceDetector.ts`).
- Modal e tutorial personalizado passo a passo para instalação no **iPhone (iOS Safari)**, **Android (Chrome)** e **Desktop**.
- Cache offline via Service Worker (`public/sw.js`).
- Controle de cookies com `js-cookie` para lembrar preferências de uso.

### ♿ Acessibilidade Completa
- **Leitor de Tela Nativo (TTS)**: Motor de síntese de voz usando a API nativa do navegador (`window.speechSynthesis` em `pt-BR`) para leitura em voz alta do conteúdo para pessoas cegas ou com baixa visão.
- **VLibras**: Widget oficial de tradução automática em Libras baseado na biblioteca [ThiagoVenturaV/LibrasWidget](https://github.com/ThiagoVenturaV/LibrasWidget).
- **Alto Contraste & Dimensionador de Fonte**: Chaveador de modo de alto contraste e ajuste proporcional de tamanho de texto (100% a 130%).

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 19, Vite, TypeScript, TailwindCSS, Lucide React, `canvas-confetti`, `jspdf`, `js-cookie`.
- **Backend Serverless**: Vercel Serverless Functions (`/api`), Node.js.
- **Banco de Dados**: NeonDB (PostgreSQL Serverless) com `@neondatabase/serverless`.
- **Autenticação**: JSON Web Token (`jsonwebtoken`), Password Hashing (`bcryptjs`).
- **Acessibilidade**: Web Speech API (`SpeechSynthesisUtterance`), VLibras API.

---

## 📁 Estrutura de Arquivos do Projeto

```
recife-digital/
├── api/                       # Rotas Serverless Vercel
│   ├── auth/
│   │   ├── jwt.ts             # Assinatura e verificação de JWT
│   │   ├── login.ts           # Login com bcrypt.compare
│   │   ├── logout.ts          # Logout com expiração de cookie
│   │   └── register.ts        # Registro com bcrypt.hash
│   ├── courses.ts             # Listagem serverless de cursos
│   ├── db.ts                  # Conector NeonDB PostgreSQL
│   └── verify.ts              # Validação de código de certificado
├── db/
│   └── schema.sql             # DDL do banco PostgreSQL no Neon
├── public/                    # Assets estáticos, logos, manifest e Service Worker
│   ├── recife_azul_sobre_branco.png # Logo Prefeitura do Recife
│   ├── logoSchool.svg         # Logo CESAR School
│   ├── manifest.json          # PWA Web App Manifest
│   └── sw.js                  # Service Worker offline
├── src/
│   ├── components/            # Componentes reutilizáveis (Header, BottomNav, PWA, Quiz, etc.)
│   ├── data/                  # Conjunto inicial de cursos e módulos
│   ├── types/                 # Interfaces TypeScript
│   ├── utils/                 # Utilitários (PDF Generator, Device Detector, Native TTS)
│   ├── views/                 # Páginas principais (CatalogView, PlayerView, CertificatesView, ProgressView)
│   ├── App.tsx                # Roteamento de estado e acessibilidade
│   └── index.css              # Design System e variáveis CSS
├── vercel.json                # Configuração de rotas Vercel
└── package.json
```

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Passo a Passo

```bash
# 1. Clonar o repositório
git clone https://github.com/ThiagoVenturaV/RecifeDigital.git
cd RecifeDigital

# 2. Instalar as dependências
npm install

# 3. Executar o servidor de desenvolvimento
npm run dev

# 4. Compilar para produção
npm run build
```

Acesse em seu navegador no endereço indicado (geralmente `http://localhost:5173`).

---

## 📜 Licença

Este projeto é disponibilizado para fins educacionais e de capacitação social.  
Desenvolvido por **Thiago Ventura** para a **Prefeitura do Recife** & **CESAR School**.
