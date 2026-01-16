<p align="center">
  <img src="https://img.shields.io/badge/⚡-Orch8-000000?style=for-the-badge&labelColor=84CC16" alt="Orch8 Logo" />
</p>

<h1 align="center">Orch8</h1>

<p align="center">
  <strong>AI-Native Workflow Automation for the Modern Stack</strong>
</p>

<p align="center">
  Build, orchestrate, and automate intelligent workflows with a visual drag-and-drop editor.<br/>
  Connect LLMs, APIs, and services — zero infrastructure headaches.
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Bun-1.2-F9F1E1?style=flat-square&logo=bun&logoColor=black" alt="Bun" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Prisma-7.1-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/PRs-Welcome-brightgreen?style=flat-square" alt="PRs Welcome" />
</p>

---

## 📖 Overview

**Orch8** (pronounced "orchestrate") is a modern, open-source workflow automation platform that empowers developers and teams to create, manage, and execute AI-powered automated workflows through an intuitive visual editor.

Think **n8n meets AI** — designed from the ground up for the age of language models and intelligent agents.

### Why Orch8?

| Problem | Orch8 Solution |
|---------|----------------|
| Complex integrations require extensive coding | Visual node-based editor with drag-and-drop |
| AI integrations are afterthoughts | First-class LLM nodes (Gemini, GPT, Claude) |
| Slow execution engines | High-performance Bun runtime |
| Scattered credentials management | Centralized, encrypted credential vault |
| Limited observability | Real-time execution tracking & history |

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎨 Visual Workflow Editor
Intuitive drag-and-drop canvas powered by React Flow. Design complex workflows without writing code.

### ⚡ Multiple Trigger Types
- **Manual** — Trigger workflows on-demand
- **Webhook** — Expose as API endpoints with token auth
- **Cron** — Schedule recurring executions

### 🤖 AI-Native Nodes
Built-in Gemini AI integration for intelligent automation. Chain prompts, process data, and build agent workflows.

</td>
<td width="50%">

### 📧 Multi-Channel Messaging
- **Email via Resend** — Transactional & marketing emails
- **Telegram Bots** — Instant messaging automation

### 🔐 Secure Credential Vault
Store API keys, tokens, and secrets securely. Encrypted at rest, easy to manage.

### 📊 Execution Observability
Track every workflow run with detailed logs, timing data, and node-by-node output inspection.

</td>
</tr>
</table>

---

## 🏗️ Architecture

Orch8 is built as a **Turborepo monorepo** for efficient builds, shared configurations, and clean separation of concerns.

```
orch8/
├── 📁 apps/
│   ├── frontend/         # React + Vite SPA
│   ├── backend/          # Express.js API Server  
│   └── engine/           # Workflow Execution Engine
│
├── 📁 packages/
│   ├── db/               # Prisma ORM + Database Schema
│   ├── ui/               # Shared UI Components
│   ├── eslint-config/    # Shared ESLint Configuration
│   └── typescript-config/# Shared TypeScript Configuration
│
├── docker-compose.yml    # Container Orchestration
└── turbo.json            # Turborepo Configuration
```

### Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, Vite 7, TailwindCSS 4, React Flow, TanStack Query, Framer Motion |
| **Backend** | Express.js 5, Bun Runtime, JWT Authentication |
| **Database** | PostgreSQL 16 + Prisma ORM 7 |
| **DevOps** | Docker, Docker Compose, Turborepo |
| **Testing** | TypeScript strict mode, ESLint |

---

## 🚀 Quick Start

### Prerequisites

| Requirement | Version | Installation |
|------------|---------|--------------|
| **Node.js** | ≥ 18.x | [nodejs.org](https://nodejs.org) |
| **Bun** | ≥ 1.2.x | [bun.sh/docs/installation](https://bun.sh/docs/installation) |
| **PostgreSQL** | ≥ 16 | [postgresql.org](https://www.postgresql.org/download/) or Docker |
| **Docker** (optional) | Latest | [docker.com](https://www.docker.com/get-started) |

### Option 1: Local Development

```bash
# 1. Clone the repository
git clone https://github.com/vasantkr97/orch8.git
cd orch8

# 2. Install dependencies
bun install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# 4. Configure database connection
# In packages/db/.env:
DATABASE_URL="postgresql://user:password@localhost:5432/orch8"

# In apps/backend/.env:
DATABASE_URL="postgresql://user:password@localhost:5432/orch8"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"

# 5. Set up the database
bun run db:generate   # Generate Prisma client
bun run db:push       # Push schema to database

# 6. Start development servers
bun run dev
```

🎉 **You're ready!**
- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:3000](http://localhost:3000)

### Option 2: Docker Compose

```bash
# 1. Clone and navigate
git clone https://github.com/vasantkr97/orch8.git
cd orch8

# 2. Configure environment
cp .env.example .env
# Edit .env with desired credentials

# 3. Start services
docker compose up -d

# 4. Run database migrations
docker compose exec backend bunx prisma migrate deploy
```

---

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start all apps in development mode (hot-reload) |
| `bun run build` | Build all apps and packages for production |
| `bun run lint` | Run ESLint across all packages |
| `bun run format` | Format code with Prettier |
| `bun run check-types` | Run TypeScript type checking |
| `bun run db:generate` | Generate Prisma client |
| `bun run db:push` | Push schema changes to database |
| `bun run db:studio` | Open Prisma Studio (visual DB editor) |

### Running Individual Apps

```bash
# Frontend only
turbo dev --filter=frontend

# Backend only
turbo dev --filter=backend
```

---

## 📦 Supported Node Types

| Node | Description | Credentials Required |
|------|-------------|---------------------|
| **🔘 Manual Trigger** | Start workflows manually from the UI | None |
| **🔗 Webhook Trigger** | Receive external HTTP requests with payload | None |
| **📧 Email (Resend)** | Send transactional emails via Resend API | `resendemail` |
| **💬 Telegram** | Send messages via Telegram Bot | `telegram` |
| **🤖 Gemini AI Agent** | Process data with Google's Gemini AI | `gemini` |

---

## 🔌 API Reference

The backend exposes a comprehensive REST API. Full documentation: [**API_Reference.md**](./API_Reference.md)

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/signup` | `POST` | Create a new account |
| `/api/auth/signin` | `POST` | Login (sets JWT cookie) |
| `/api/auth/signout` | `POST` | Logout and clear session |
| `/api/auth/me` | `GET` | Get current user info |

### Workflows

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/workflows/createWorkflow` | `POST` | Create a new workflow |
| `/api/workflows/getallWorkflows` | `GET` | List all workflows |
| `/api/workflows/getWorkflowById/:id` | `GET` | Get workflow by ID |
| `/api/workflows/updateWorkflow/:id` | `POST` | Update workflow |
| `/api/workflows/deleteWorkflow/:id` | `DELETE` | Delete workflow |

### Executions

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/executions/workflow/:id/execute` | `POST` | Manual execution |
| `/api/executions/webhookExecute/:id` | `POST` | Webhook execution |
| `/api/executions/list` | `GET` | List all executions (with filters) |
| `/api/executions/:id/details` | `GET` | Get execution details |
| `/api/executions/:id/stop` | `POST` | Stop running execution |

### Credentials

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/credentials/postCredentials` | `POST` | Create credentials |
| `/api/credentials/getCredentials` | `POST` | List all credentials |
| `/api/credentials/updateCredentials/:id` | `PUT` | Update credentials |
| `/api/credentials/deleteCredentials/:id` | `DELETE` | Delete credentials |

---

## 🗄️ Database Schema

Orch8 uses PostgreSQL with Prisma ORM. Core models:

```prisma
model User {
  id          String        @id @default(uuid())
  email       String        @unique
  password    String        # bcrypt hashed
  username    String
  workflows   Workflow[]
  credentials Credentials[]
  executions  Execution[]
}

model Workflow {
  id           String      @id @default(uuid())
  title        String
  isActive     Boolean
  webhookToken String?     @unique
  triggerType  TriggerType # manual | webhook | cron
  nodes        Json
  connections  Json
  executions   Execution[]
}

model Execution {
  id         String        @id @default(cuid())
  status     ExecStatus    # pending | running | success | failed | stopped
  mode       ExecutionMode # manual | webhook | cron
  data       Json
  results    Json?
  startedAt  DateTime?
  finishedAt DateTime?
}

model Credentials {
  id       String   @id @default(cuid())
  title    String
  platform Platform # resendemail | telegram | gemini
  data     Json     # Encrypted sensitive data
}
```

---

## 🔒 Security

- **🔑 JWT Authentication** — Secure token-based auth with HTTP-only cookies
- **🔐 Password Hashing** — bcrypt with configurable salt rounds
- **🎫 Webhook Tokens** — Unique, cryptographically secure tokens per workflow
- **🔒 Credential Encryption** — Sensitive API keys stored securely
- **🛡️ CORS Protection** — Configurable allowed origins
- **✅ Input Validation** — Request validation on all endpoints

---

## 🛠️ Development Guide

### Project Structure (Frontend)

```
apps/frontend/src/
├── components/           # Reusable React components
│   ├── nodes/           # Workflow node components (Email, Telegram, Gemini)
│   ├── edges/           # Custom edge components
│   ├── ui/              # Base UI components (Button, Input, Card, etc.)
│   └── parameters/      # Node parameter inputs
├── hooks/               # Custom React hooks
│   ├── workflowHooks/   # Workflow state management
│   └── executionHooks/  # Execution tracking
├── pages/               # Application pages
│   ├── LandingPage.tsx
│   ├── WorkflowEditor.tsx
│   ├── Projects.tsx
│   ├── Executions.tsx
│   └── Credentials.tsx
├── services/            # API service layer
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

### Adding a New Node Type

1. Create node component in `apps/frontend/src/components/nodes/`
2. Register in `nodeTypes.tsx` and `nodeConfig.tsx`
3. Add backend handler in execution engine
4. Create credential type if needed (update Prisma schema)

### Code Style

- **TypeScript** — Strict mode enabled
- **ESLint** — Shared config across packages
- **Prettier** — Consistent code formatting

```bash
# Check types
bun run check-types

# Lint all packages
bun run lint

# Format code
bun run format
```

---

## 🤝 Contributing

We welcome contributions from the community! Here's how to get started:

### Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Create** a feature branch: `git checkout -b feature/amazing-feature`
4. **Make** your changes with clear, descriptive commits
5. **Test** your changes thoroughly
6. **Push** to your branch: `git push origin feature/amazing-feature`
7. **Open** a Pull Request

### Contribution Guidelines

| Type | Guidelines |
|------|-----------|
| **Bug Fixes** | Include issue reference, add tests if applicable |
| **New Features** | Open an issue first to discuss the feature |
| **Documentation** | Keep it clear, concise, and up-to-date |
| **Code Style** | Follow existing patterns, run `bun run lint` |

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add Slack node integration
fix: resolve webhook token generation issue
docs: update API reference
refactor: simplify execution engine logic
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

Orch8 is built on the shoulders of giants:

- [**React Flow**](https://reactflow.dev/) — Powerful node-based UI framework
- [**Turborepo**](https://turborepo.com/) — Efficient monorepo management
- [**Prisma**](https://www.prisma.io/) — Next-gen TypeScript ORM
- [**Bun**](https://bun.sh/) — Blazing-fast JavaScript runtime
- [**TailwindCSS**](https://tailwindcss.com/) — Utility-first CSS framework
- [**Framer Motion**](https://www.framer.com/motion/) — Production-ready animations

---

## 📞 Support

- 📖 **Documentation**: Check this README and [API Reference](./API_Reference.md)
- 🐛 **Bug Reports**: [Open an issue](https://github.com/vasantkr97/orch8/issues/new)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/vasantkr97/orch8/discussions)
- 💬 **Community**: Coming soon!

---

<p align="center">
  <sub>Built with ❤️ by the <a href="https://github.com/vasantkr97">Orch8 Team</a></sub>
</p>

<p align="center">
  <sub>⭐ Star us on GitHub — it helps!</sub>
</p>