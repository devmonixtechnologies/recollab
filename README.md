# Recollab v3 · Next-Generation Collaborative Live Docs

Recollab v3 represents a significant leap forward in collaborative document editing, building upon the solid foundation of v2 with cutting-edge AI capabilities, enhanced real-time collaboration, advanced performance optimizations, and enterprise-grade security features. This version combines a Lexical-based editor, Liveblocks real-time presence/storage, and a custom MongoDB-backed authentication system to provide teams with an intelligent, responsive, and secure workspace for ideation and documentation.


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

## ✨ V3 Highlights

- **🤖 Advanced AI Integration:** Real-time auto-completion, smart formatting suggestions, contextual content assistance, and intelligent title generation powered by OpenAI GPT-3.5 Turbo with confidence scoring.
- **� Performance Optimizations:** Virtual scrolling for large documents, debounced AI requests, memoized components, and comprehensive performance monitoring with metrics collection.
- **� Enterprise Security:** Enhanced session management, CSRF protection, rate limiting, input sanitization, password strength validation, and comprehensive audit logging.
- **� Enhanced Collaboration:** Live presence indicators with user avatars, real-time cursor tracking, advanced user search, and improved mention suggestions.
- **🎨 Modern UI/UX:** Framer Motion animations, toast notifications, advanced search with filters, responsive design, and accessibility improvements.
- **🧪 Comprehensive Testing:** Jest testing suite with 70% coverage threshold, component testing, and mock implementations for all external services.
- **� Version History:** Complete document version tracking with visual diff viewer, restore functionality, and change analytics (enhanced from v2).
- **📋 Document Templates:** Professional templates with variable substitution and smart defaults (enhanced from v2).

---

## 🖥️ Screens & UX Summary

| Screen | Description |
| --- | --- |
| Home | Welcome dashboard with user details, quick document actions, template selection, and activity feed. |
| Document Workspace | Primary collaborative editor with advanced AI assistant, version history, live presence indicators, and enhanced share controls. |
| AI Smart Assistant | Floating panel providing real-time auto-completion, content suggestions, smart formatting, and title generation with confidence scoring. |
| Advanced Search | Powerful document discovery with search, filters, tags, date ranges, and sorting options. |
| Version History | Interactive timeline showing document versions with visual diff viewer and restore functionality. |
| Template Selector | Modal for browsing and selecting from various document templates with variable customization. |
| Authentication | Enhanced sign-in and sign-up pages with improved validation, security features, and progressive form feedback. |

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

## 🆕 What's New in V3

### 🤖 Advanced AI Features
- **Real-time Auto-completion:** Context-aware text suggestions as you type with keyboard navigation.
- **Smart Formatting Assistant:** AI-powered document structure improvements with confidence scoring.
- **Enhanced Content Suggestions:** More intelligent and contextually relevant writing suggestions.
- **Interactive AI Panel:** Tabbed interface for different AI features with minimize/maximize functionality.
- **Confidence Scoring:** Visual indicators for AI suggestion confidence levels.

### 🚀 Performance & Scalability
- **Virtual Scrolling:** Efficient rendering of large documents and lists.
- **Debounced AI Requests:** Optimized API calls to reduce costs and improve responsiveness.
- **Component Memoization:** Intelligent re-rendering optimization for better performance.
- **Performance Monitoring:** Built-in metrics collection and performance tracking.
- **Lazy Loading:** On-demand loading of components and data.

### 🔒 Enhanced Security
- **Advanced Session Management:** Secure token handling with absolute and inactivity timeouts.
- **CSRF Protection:** Cross-site request forgery prevention with token validation.
- **Rate Limiting:** Configurable API rate limiting with custom implementation.
- **Input Sanitization:** Comprehensive input validation and XSS prevention.
- **Password Strength Validation:** Advanced password requirements with visual feedback.
- **Security Audit Logging:** Comprehensive security event tracking and monitoring.
- **Content Security Policy:** Enhanced CSP headers for improved browser security.

### 👥 Enhanced Collaboration
- **Live Presence Indicators:** Real-time user avatars with activity status and editing indicators.
- **Advanced User Search:** Improved user discovery with search, filtering, and pagination.
- **Enhanced Mentions:** Better mention suggestions with user avatars and status.
- **Real-time Activity Feed:** Live updates of user actions and document changes.

### 🎨 Modern UI/UX
- **Framer Motion Animations:** Smooth, performant animations throughout the application.
- **Toast Notifications:** Non-intrusive notification system with multiple types and actions.
- **Advanced Search Interface:** Powerful document discovery with multiple filter options.
- **Responsive Design:** Optimized for desktop, tablet, and mobile experiences.
- **Accessibility Improvements:** Better keyboard navigation and screen reader support.

### 🧪 Testing & Quality
- **Comprehensive Test Suite:** Jest-based testing with 70% coverage threshold.
- **Component Testing:** Isolated component testing with mocked dependencies.
- **Performance Testing:** Built-in performance monitoring and metrics collection.
- **Security Testing:** Input validation and security feature testing.

---

## 📦 Core Features

### V3 Enhancements
1. **🤖 Advanced AI Assistant** – Real-time auto-completion, smart formatting, contextual suggestions, and confidence scoring.
2. **🚀 Performance Suite** – Virtual scrolling, debounced requests, memoized components, and performance monitoring.
3. **🔒 Security Framework** – Enhanced session management, CSRF protection, rate limiting, and audit logging.
4. **👥 Enhanced Collaboration** – Live presence indicators, advanced user search, and real-time activity feeds.
5. **🎨 Modern UI/UX** – Framer Motion animations, toast notifications, and advanced search interface.
6. **🧪 Testing Infrastructure** – Comprehensive Jest suite with 70% coverage and component testing.

### V2 Features (Enhanced)
7. **📚 Version History** – Complete document version tracking with diff viewer, restore functionality, and change analytics.
8. **📋 Document Templates** – Professional templates for meeting notes, project specs, SWOT analysis, research papers, and blog posts with variable substitution.
9. **🔐 Secure Custom Authentication** – register, login, logout with hashed passwords and HTTP-only cookies.
10. **Session Management** – MongoDB-backed sessions with automatic expiry and cookie cleanup.
11. **Collaborative Editing** – Lexical editor combined with Liveblocks room storage for co-authoring.
12. **Presence & Cursors** – See who is active, view color-coded cursors, and mention teammates.
13. **Document Sharing Controls** – Invite collaborators, manage edit/view access, and list room members.
14. **Live Document List** – Explore, open, and manage documents tied to the authenticated user.
15. **Responsive UI** – Tailwind-based layout optimized for both desktop and mobile editing experiences.
16. **Server Actions** – Form submissions backed by server actions for auth and room operations.

---

## 🚀 Advanced Feature Backlog

These are aspirational items the team may tackle next. Prioritize per roadmap needs.

### High Priority
- Real-time cursor selections and text highlighting
- Document analytics and usage insights dashboard
- Rich media support: image uploads, embeds, and file attachments
- Comprehensive search functionality across documents and content
- Dark mode and theme customization

### Medium Priority
- Export functionality (PDF, Markdown, Word)
- Workflow webhooks for Zapier/Make integrations
- Infrastructure-as-Code support (Terraform modules) for one-click deployments
- Advanced permission system with role-based access control
- Expiring and password-protected share links

### Low Priority
- Playwright end-to-end regression suite
- Storybook catalog for UI documentation and visual regression
- Mobile app development (React Native)
- Advanced AI features (document translation, sentiment analysis)
- Integration with popular third-party services (Google Docs, Notion, etc.)

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
| `npm run test` | Run Jest test suite. |
| `npm run test:watch` | Run Jest tests in watch mode. |
| `npm run test:coverage` | Run Jest tests with coverage report. |

---

## ✅ Testing & Quality

- **Unit/Integration Testing:** Jest-based testing suite with 70% coverage threshold.
- **Component Testing:** Isolated component testing with mocked dependencies using React Testing Library.
- **Performance Testing:** Built-in performance monitoring and metrics collection.
- **Security Testing:** Input validation, CSRF protection, and security feature testing.
- **E2E Testing:** (Planned) Use Playwright for multi-user collaboration scenarios.
- **Type Safety:** TypeScript enforces contracts across server actions, components, and models.
- **Linting:** Run `npm run lint` to catch common pitfalls and maintain standards.
- **Coverage Reports:** Run `npm run test:coverage` to generate detailed coverage reports.

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

