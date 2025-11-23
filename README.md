# Recollab v2 · Advanced Collaborative Live Docs

Recollab v2 is an enhanced Next.js 14 + TypeScript collaborative document platform that builds upon the solid foundation of v1 with powerful new AI capabilities, version history, and document templates. It combines a Lexical-based editor, Liveblocks real-time presence/storage, and a custom MongoDB-backed authentication system to provide teams with an intelligent, responsive workspace for ideation and documentation.


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

- **🤖 AI-Powered Features:** Intelligent document summarization, content suggestions, smart formatting, and title generation powered by OpenAI.
- **📚 Version History:** Complete document version tracking with diff viewer, restore functionality, and change analytics.
- **📋 Document Templates:** Professional templates for meeting notes, project specs, SWOT analysis, research papers, and blog posts.
- **🔄 Real-time Collaboration:** Low-latency multiplayer editing powered by Liveblocks, complete with cursors, presence, and shared storage.
- **🔐 Custom Auth Layer:** Email + password flow with secure session cookies, bcrypt hashing, and MongoDB session persistence.
- **📝 Lexical Editor:** Rich text formatting with extensible nodes, slash commands, collaborative cursors, and comment anchors.
- **👥 Team Productivity:** Share modals, commenter/reader/editor roles, and collaborative indicators keep everyone aligned.
- **🎨 Modern DX:** Type-safe APIs, organized server actions, and directory routing streamline feature development.

---

## 🖥️ Screens & UX Summary

| Screen | Description |
| --- | --- |
| Home | Welcome screen showing user details, quick document actions, and template selection. |
| Document Workspace | Primary collaborative editor with AI assistant, version history, presence avatars, and share controls. |
| AI Assistant | Floating panel providing document summarization, content suggestions, and smart formatting. |
| Version History | Interactive timeline showing document versions with diff viewer and restore functionality. |
| Template Selector | Modal for browsing and selecting from various document templates with variable customization. |
| Authentication | Custom sign-in and sign-up pages using server actions and progressive form feedback. |

---

## 🏗️ Architecture Overview

| Layer | Description |
| --- | --- |
| **Next.js App Router** | Server components for layouts, routing, and server actions for auth flows. |
| **Custom Auth** | `lib/auth.ts` manages hashing, session creation/deletion, and cookie orchestration. |
| **MongoDB Models** | `User`, `Session`, and `DocumentVersion` schemas provide persistence via a pooled connection helper. |
| **AI Service** | `lib/ai-service.ts` handles OpenAI integration for document enhancement features. |
| **Version History** | `lib/version-history.ts` manages document snapshots with diff and restore capabilities. |
| **Template System** | `lib/templates.ts` provides structured document templates with variable substitution. |
| **Liveblocks Provider** | `/app/Provider.tsx` configures auth endpoint, `resolveUsers`, and mention suggestions. |
| **UI Components** | ShadCN-based inputs, buttons, modals, and custom UI under `components/`. |
| **Editor** | Lexical editor setup with Liveblocks bindings for shared document state. |

---

## 🗂️ Directory Structure

```text
recollab/
├─ app/
│  ├─ (auth)/              # Sign-in & sign-up routes with custom forms
│  ├─ (root)/              # Home & document routes requiring authentication
│  ├─ api/
│  │  ├─ liveblocks-auth/ # Liveblocks auth endpoint wired to custom auth
│  │  └─ versions/         # Version history API endpoints
│  ├─ layout.tsx           # Root layout fetching the current user server-side
│  └─ Provider.tsx         # Client wrapper configuring LiveblocksProvider
├─ components/
│  ├─ ai/                  # AI-powered features (AIAssistant)
│  ├─ auth/                # AuthProvider, LoginForm, RegisterForm, LogoutButton, UserMenu
│  ├─ editor/              # Lexical editor setup and nodes
│  ├─ templates/           # Document template selection and variable forms
│  ├─ version/             # Version history UI components
│  ├─ ui/                  # Reusable UI components (Card, Badge, etc.)
│  └─ ...                  # Shared UI (Header, ShareModal, ActiveCollaborators, etc.)
├─ lib/
│  ├─ actions/             # Server actions (auth, user lookups, rooms)
│  ├─ models/              # Mongoose schemas (User, Session, DocumentVersion)
│  ├─ ai-service.ts        # OpenAI integration for AI features
│  ├─ auth.ts              # Custom auth utilities
│  ├─ db.ts                # MongoDB connection helper
│  ├─ templates.ts         # Document templates and processing
│  ├─ utils.ts             # Helpers including user color computation
│  └─ version-history.ts   # Version tracking and diff functionality
├─ public/                 # Static assets (icons, logos)
├─ types/                  # Shared TypeScript definitions (AuthUser)
├─ middleware.ts           # Pass-through middleware placeholder
├─ package.json            # Scripts & dependencies (includes OpenAI, date-fns)
└─ tsconfig.json           # Path and type configuration
```

---

## 🧰 Tech Stack

- **Framework:** Next.js 14 (App Router, Server Components, Route Handlers)
- **Language:** TypeScript
- **Database:** MongoDB via Mongoose
- **Realtime:** Liveblocks (client, node, react, react-lexical bindings)
- **Editor:** Lexical
- **AI:** OpenAI GPT-3.5 Turbo for intelligent features
- **UI:** Tailwind CSS, ShadCN components, Lucide icons
- **Auth:** Custom email/password with bcryptjs and session cookies
- **Date Handling:** date-fns for timestamp formatting
- **Tooling:** ESLint (Next config), TypeScript 5, PostCSS/Tailwind build pipeline

---

## 🆕 What's New in V2

### 🤖 AI-Powered Features
- **Document Summarization:** Generate concise summaries of your documents using OpenAI GPT-3.5 Turbo
- **Content Suggestions:** Get intelligent text completions and writing suggestions based on context
- **Smart Formatting:** AI-powered document structure improvements and readability enhancements
- **Title Generation:** Automatically generate relevant and engaging titles for your documents

### 📚 Version History System
- **Automatic Snapshots:** Documents are automatically versioned when significant changes are made
- **Visual Diff Viewer:** Compare any two versions with side-by-side diff highlighting
- **Restore Functionality:** Restore any previous version with a single click
- **Change Analytics:** Track who made what changes and when
- **Content Hashing:** Efficient change detection prevents duplicate versions

### 📋 Document Templates
- **Professional Templates:** Choose from meeting notes, project specifications, SWOT analysis, research papers, and blog posts
- **Variable Substitution:** Customize templates with your specific information
- **Smart Defaults:** Pre-populated fields with common business and academic formats
- **Template Categories:** Organized by business, personal, academic, technical, and creative use cases
- **Search & Filter:** Find the perfect template quickly with search and category filtering

### 🎨 Enhanced UI/UX
- **Modern Component Library:** Expanded ShadCN components with cards, badges, and enhanced modals
- **Improved Navigation:** Better organization of features and intuitive user flows
- **Responsive Design:** Optimized for desktop, tablet, and mobile experiences
- **Accessibility Improvements**: Better keyboard navigation and screen reader support

---

## 📦 Core Features

### V2 Enhancements
1. **🤖 AI-Powered Assistant** – Document summarization, content suggestions, smart formatting, and title generation using OpenAI.
2. **📚 Version History** – Complete document version tracking with diff viewer, restore functionality, and change analytics.
3. **📋 Document Templates** – Professional templates for meeting notes, project specs, SWOT analysis, research papers, and blog posts with variable substitution.

### Original Features
4. **Secure Custom Authentication** – register, login, logout with hashed passwords and HTTP-only cookies.
5. **Session Management** – MongoDB-backed sessions with automatic expiry and cookie cleanup.
6. **Collaborative Editing** – Lexical editor combined with Liveblocks room storage for co-authoring.
7. **Presence & Cursors** – See who is active, view color-coded cursors, and mention teammates.
8. **Document Sharing Controls** – Invite collaborators, manage edit/view access, and list room members.
9. **Live Document List** – Explore, open, and manage documents tied to the authenticated user.
10. **Responsive UI** – Tailwind-based layout optimized for both desktop and mobile editing experiences.
11. **Server Actions** – Form submissions backed by server actions for auth and room operations.

---

## 🚀 Advanced Feature Backlog

These are aspirational items the team may tackle next. Prioritize per roadmap needs.

- Role-based access control with policy-driven permissions.
- Expiring and password-protected share links.
- Enhanced collaboration with real-time cursors and selections.
- Document analytics and usage insights.
- Rich media support: image uploads, embeds, and file attachments.
- Comprehensive search functionality across documents and content.
- Dark mode and theme customization.
- Export functionality (PDF, Markdown, Word).
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

# OpenAI (for AI features)
OPENAI_API_KEY=
```

> **Note:** The Mongo URI should include your database name as shown. For Atlas clusters, use the `mongodb+srv://` variant and ensure IP allowlists/credentials are configured. OpenAI API key is required for AI-powered features.

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

### DocumentVersion
```ts
{
  roomId: string;
  title: string;
  content: string;
  version: number;
  author: string;
  authorName?: string;
  authorAvatar?: string;
  changeDescription?: string;
  createdAt: Date;
  contentHash: string; // For detecting actual content changes
}
```

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

