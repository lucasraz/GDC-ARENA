# ANTIGRAVITY.md - GDC-ARENA

## Project Identity
- **Name:** GDC-ARENA
- **Purpose:** Micro-SaaS Arena Platform (as specified in initial request)
- **Status:** Initialized (Scaffold phase)

## Tech Stack (Pilot Recommendations)
- **Frontend / Backend Orchestration:** Next.js (Node.js/TypeScript)
- **Styling:** Vanilla CSS + Framer Motion for premium aesthetics.
- **Database / Auth:** Supabase (PostgreSQL with RLS for multi-tenant isolation).
- **Testing (TDD):** Vitest / Jest / Playwright.
- **CI/CD:** GitHub Actions / Vercel.

## 🏛️ 3-Layer Micro-SaaS Architecture (directives/ orchestration/ execution/)
Following strictly AGENTS_MSAAS.md instructions:

1.  **Layer 1: Directive (`directives/`)**
    - Canonical product intent in Markdown.
    - Defines business rules, user flows, and billing logic.
2.  **Layer 2: Orchestration (`backend/`)**
    - Orchestration services coordinates repositories and external clients.
    - Enforces authorization (tenant boundaries) and transaction safety.
3.  **Layer 3: Execution (`execution/`)**
    - Deterministic infrastructure modules (Database repositories, Stripe clients, Email).
    - No business decisions here. Just I/O and persistence.

## 🧼 Clean Code Standards
Following strictly MICROSAAS_CLEAN_CODE.md:
- **Intention First:** Names reflect domain concepts (`calculate_fee`), not mechanics (`process_data`).
- **Function Size:** Target 5-20 lines per function.
- **Single Responsibility:** One function = one conceptual step.
- **Illegal States:** Use strict typing and enums (`OrderStatus`) to prevent invalid states.
- **Refactoring:** Continuous improvement on every change.

## 🔐 Security Protocols (Vigilance)
Following strictly SECURITY.md:
- **Tenant Isolation:** Every query must include `tenant_id` at the repository level.
- **Input Validation:** Mandatory sanitization/validation at Orchestration level.
- **Least Privilege:** Database access restricted via RLS (Row Level Security).
- **Sensitive Data:** Never logged, never hardcoded (strictly `.env`).
- **Standard Checks:** SQLi, XSS, CSRF, and dependency monitoring.

## 📁 Project Structure
```text
GDC-ARENA/
├── directives/      # Product/Business SOPs (Layer 1)
├── backend/         # Orchestration (Services/Policies/Jobs) (Layer 2)
├── execution/       # Infrastructure/Repositories/API Clients (Layer 3)
├── components/      # (Optional) Frontend UI components
├── tests/           # TDD implementation suite
├── .tmp/            # Temporary processing data (git-ignored)
├── ANTIGRAVITY.md   # This living document
├── AGENTS_MSAAS.md  # Original instructions
├── MICROSAAS_CLEAN_CODE.md # Code quality standards
└── SECURITY.md      # Security guidelines
```

## 🛠️ Current Status (Small Releases)
- [x] Initial folder structure created.
- [x] ANTIGRAVITY.md living document initialized.
- [x] TECH STACK APPROVAL (Excluíndo Stripe conforme pedido do usuário).
- [x] Initial project scaffold (Next.js/Supabase/Testing).
- [x] First product directive created (User Profile).
- [x] Implementations (Backend Orchestration and Repositories - User Profile).
- [ ] Implement Tenant Discovery/Creation logic (for new users).
- [x] UI Components for Profile Management (based on Design System).
- [x] Tab: Cartola - Dicas (UI and Layout).
- [x] Tab: Notícias (Editorial Layout).
- [x] Scheduled Content Updates (NotebookLM + 07h/15h/22h cycles).
- [x] Authentication Integration (Supabase Auth + SSR Middleware).
- [x] Integration of "Manuscrito Inteligente" (NotebookLM Search Base) for Cartola Tips.
- [x] Visual Tactical Field (4-3-3) with real Club Crests (Brasões).
- [x] Simplified Elite Command (Original Tactical 4-3-3).
- [ ] Implement Tenant Discovery/Creation logic (for new users).
