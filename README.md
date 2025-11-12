# Recollab · Collaborative Live Docs

Recollab is a basic Next.js 14 + TypeScript application that delivers a rich, multiplayer document editing experience. It combines a Lexical-based editor, Liveblocks real-time presence/storage, and a custom MongoDB-backed authentication system to give teams a secure, responsive workspace for ideation and documentation.


## 📚 Table of Contents

1. [Highlights](#highlights)
2. [Screens & UX Summary](#screens--ux-summary)
3. [Architecture Overview](#architecture-overview)
4. [Directory Structure](#directory-structure)
5. [Tech Stack](#tech-stack)
6. [Core Features](#core-features)
7. [Advanced Feature Backlog](#advanced-feature-backlog)
8. [Getting Started](#getting-started)
9. [Environment Variables](#environment-variables)
10. [Custom Authentication Notes](#custom-authentication-notes)
11. [Liveblocks Integration](#liveblocks-integration)
12. [Data Models](#data-models)
13. [Available Scripts](#available-scripts)
14. [Testing & Quality](#testing--quality)
15. [Troubleshooting](#troubleshooting)
16. [Contributing](#contributing)
17. [License](#license)
18. [Credits](#credits)

---

## ✨ Highlights

- **Real-time Collaboration:** Low-latency multiplayer editing powered by Liveblocks, complete with cursors, presence, and shared storage.
- **Custom Auth Layer:** Email + password flow with secure session cookies, bcrypt hashing, and MongoDB session persistence.
- **Lexical Editor:** Rich text formatting with extensible nodes, slash commands, collaborative cursors, and comment anchors.
- **Team Productivity:** Share modals, commenter/reader/editor roles, and collaborative indicators keep everyone aligned.
- **Modern DX:** Type-safe APIs, organized server actions, and directory routing streamline feature development.

---

## 🖥️ Screens & UX Summary

| Screen | Description |
| --- | --- |
| Home | Welcome screen showing user details, quick document actions, and onboarding entry points. |
| Document Workspace | Primary collaborative editor with presence avatars, share controls, and version hints. |
| Authentication | Custom sign-in and sign-up pages using server actions and progressive form feedback. |
| Collaborative Room | Rich editor experience plus inline share modal, active collaborators, and Liveblocks provider. |

---

## 🏗️ Architecture Overview

| Layer | Description |
| --- | --- |
| **Next.js App Router** | Server components for layouts, routing, and server actions for auth flows. |
| **Custom Auth** | `lib/auth.ts` manages hashing, session creation/deletion, and cookie orchestration. |
| **MongoDB Models** | `User` and `Session` schemas provide persistence via a pooled connection helper. |
| **Liveblocks Provider** | `/app/Provider.tsx` configures auth endpoint, `resolveUsers`, and mention suggestions. |
| **UI Components** | ShadCN-based inputs, buttons, modals, and custom auth UI under `components/`. |
| **Editor** | Lexical editor setup with Liveblocks bindings for shared document state. |

---

## 🗂️ Directory Structure

```text
recollab/
├─ app/
│  ├─ (auth)/              # Sign-in & sign-up routes with custom forms
│  ├─ (root)/              # Home & document routes requiring authentication
│  ├─ api/liveblocks-auth/ # Liveblocks auth endpoint wired to custom auth
│  ├─ layout.tsx           # Root layout fetching the current user server-side
│  └─ Provider.tsx         # Client wrapper configuring LiveblocksProvider
├─ components/
│  ├─ auth/                # AuthProvider, LoginForm, RegisterForm, LogoutButton, UserMenu
│  ├─ editor/              # Lexical editor setup and nodes
│  └─ ...                  # Shared UI (Header, ShareModal, ActiveCollaborators, etc.)
├─ lib/
│  ├─ actions/             # Server actions (auth, user lookups, rooms)
│  ├─ models/              # Mongoose schemas (User, Session)
│  ├─ auth.ts              # Custom auth utilities
│  ├─ db.ts                # MongoDB connection helper
│  └─ utils.ts             # Helpers including user color computation
├─ public/                 # Static assets (icons, logos)
├─ types/                  # Shared TypeScript definitions (AuthUser)
├─ middleware.ts           # Pass-through middleware placeholder
├─ package.json            # Scripts & dependencies
└─ tsconfig.json           # Path and type configuration
```

---

## 🧰 Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components, Route Handlers)
- **Language:** TypeScript
- **Database:** MongoDB via Mongoose
- **Realtime:** Liveblocks (client, node, react, react-lexical bindings)
- **Editor:** Lexical
- **UI:** Tailwind CSS, ShadCN components, Lucide icons
- **Auth:** Custom email/password with bcryptjs and session cookies
- **Tooling:** ESLint (Next config), TypeScript 5, PostCSS/Tailwind build pipeline

---

## 📦 Core Features

1. **Secure Custom Authentication** – register, login, logout with hashed passwords and HTTP-only cookies.
2. **Session Management** – MongoDB-backed sessions with automatic expiry and cookie cleanup.
3. **Collaborative Editing** – Lexical editor combined with Liveblocks room storage for co-authoring.
4. **Presence & Cursors** – See who is active, view color-coded cursors, and mention teammates.
5. **Document Sharing Controls** – Invite collaborators, manage edit/view access, and list room members.
6. **Live Document List** – Explore, open, and manage documents tied to the authenticated user.
7. **Responsive UI** – Tailwind-based layout optimized for both desktop and mobile editing experiences.
8. **Server Actions** – Form submissions backed by server actions for auth and room operations.

---

## 🚀 Advanced Feature Backlog

These are aspirational items the team may tackle next. Prioritize per roadmap needs.

- Role-based access control with policy-driven permissions.
- Expiring and password-protected share links.
- Version history with snapshot diff & restore.
- AI-assisted editing (summaries, rewrite suggestions).
- Offline-ready draft syncing with optimistic updates.
- Slack & email notification pipelines.
- Workflow webhooks for Zapier/Make integrations.
- Infrastructure-as-Code support (Terraform modules) for one-click deployments.
- Playwright end-to-end regression suite.
- Storybook catalog for UI documentation and visual regression.

---

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/devmonixtechnologies/recollab.git
   cd recollab
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Configure environment** – create `.env` (see [Environment Variables](#environment-variables)).

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) and sign up for a new account.

---

## 🔐 Environment Variables

Create `.env` in the project root:

```env
# Database
MONGODB_URI=mongodb://127.0.0.1:27017/recollab
MONGODB_DB=recollab

# Liveblocks
NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=
LIVEBLOCKS_SECRET_KEY=
```

> **Note:** The Mongo URI should include your database name as shown. For Atlas clusters, use the `mongodb+srv://` variant and ensure IP allowlists/credentials are configured.

---

## 🔑 Custom Authentication Notes

- **Password Hashing:** Implemented with `bcryptjs` at a cost factor of 12.
- **Session Tokens:** Random 32-byte tokens hashed via SHA-256 and stored in MongoDB.
- **HTTP-Only Cookies:** `recollab_session` cookie is set server-side with a 7-day expiry.
- **Server Actions:** `registerAction`, `loginAction`, `logoutAction` encapsulate all auth flows.
- **Guards:** `requireUser` redirects unauthenticated users to `/sign-in`.
- **User Shape:** Shared `AuthUser` type keeps frontend context and server utilities in sync.

---

## 🔄 Liveblocks Integration

- **Auth Endpoint:** `/app/api/liveblocks-auth/route.ts` calls `getCurrentUser()` and identifies users with Liveblocks using email as the room identifier.
- **Provider Setup:** `/app/Provider.tsx` wraps client routes, providing `resolveUsers` and `resolveMentionSuggestions` callbacks that query MongoDB.
- **Client Features:** Presence avatars, mention suggestions, and shared storage map seamlessly onto Liveblocks APIs.

---

## 🗃️ Data Models

### User
```ts
{
  email: string;
  password: string; // bcrypt hash
  name?: string;
  avatarUrl?: string;
  color?: string; // generated via getUserColor
  createdAt: Date;
  updatedAt: Date;
}
```

### Session
```ts
{
  tokenHash: string; // sha256 hashed session token
  user: ObjectId<User>;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### Room (Liveblocks)
Managed by Liveblocks storage; metadata (title, creator, access map) is stored in the Liveblocks dashboard or associated backend actions.

---

## 📜 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start Next.js in development mode with hot reloading. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Run the production build locally. |
| `npm run lint` | Execute ESLint using Next.js config. |

---

## ✅ Testing & Quality

- **Unit/Integration Testing:** (Planned) Add Vitest/Jest suites covering auth flows and utility functions.
- **E2E Testing:** (Planned) Use Playwright for multi-user collaboration scenarios.
- **Type Safety:** TypeScript enforces contracts across server actions, components, and models.
- **Linting:** Run `npm run lint` to catch common pitfalls and maintain standards.

---

## 🩺 Troubleshooting

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| `Missing MONGODB_URI environment variable` | `.env` not configured or server not restarted | Add variable and restart `npm run dev`. |
| `MongoParseError: Invalid scheme` | URI missing `mongodb://` or `mongodb+srv://` | Correct connection string. |
| `TypeError [ERR_INVALID_ARG_TYPE]` during auth | Session token retrieval returning a Promise | Ensure `getSessionTokenFromCookie` is awaited everywhere (already addressed). |
| Liveblocks auth 401/403 | Incorrect Liveblocks keys or user lookup returns null | Double-check `.env` keys and user data. |
| Cookies missing in production | Missing `secure` flag | Ensure `NODE_ENV=production` and HTTPS is used. |

---

## 🤝 Contributing

1. Fork the repository and create a feature branch.
2. Follow the coding standards (TypeScript, ESLint, Tailwind conventions).
3. Add or update tests when introducing new features.
4. Submit a pull request describing the change, testing performed, and screenshots if applicable.

### Suggested Contributions
- Expand the advanced feature backlog (RBAC, version history, notifications).
- Add integration tests for auth and room access controls.
- Improve accessibility (ARIA attributes, keyboard navigation, focus states).
- Translate UI strings for internationalization readiness.

---

## 📄 License

This project is for free to use and modify. You can use it for personal and commercial use.

---

