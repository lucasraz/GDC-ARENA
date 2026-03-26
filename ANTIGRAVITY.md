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
### 📐 Design System & Patterns
- **Glassmorphism**: UI elements use `backdrop-filter: blur(10px)` with translucent backgrounds (`rgba(0,0,0,0.8)`).
- **Responsive Utilities**:
  - `.desktop-only`: `display: none` below 768px.
  - `.mobile-only`: `display: none` above 768px.
- **Tactical Scaling**: Elements in `TacticalField.tsx` use `.tactical-shield` (56px desktop / 38px mobile) and `.tactical-label` classes for unified responsive behavior.
- **Mobile Navigation**: Replaced bottom navigation with a top-level **Drawer Menu** (`MobileNavigation.tsx`) for a cleaner, functional "Premium" look.
- **Global Interaction**: Implemented `-webkit-tap-highlight-color: transparent` to eliminate browser-default click artifacts (green squares) on mobile.

### 🚀 Deployment & Environment
- **Platform**: Vercel (Production ready).
- **Checkpoint**: `checkpoint-mobile-v1` (Stable Mobile Optimization).
- **Mandatory Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (Backend logic).

### 🛠️ Key Components
- `Header.tsx`: Server Component for global data.
- `MobileNavigation.tsx`: Client Drawer for mobile links.
- `TacticalField.tsx`: Responsive 4-3-3 soccer field visualization.
- `ShareButtons.tsx`: Unified broadcasting component for News, Chronicles, and Events (Web Share API + WhatsApp).
- `EventsClient.tsx`: Features expandable cards and integrated tactical discussions (Comments).
- `EventCommentsSection.tsx`: Real-time community engagement for match events.
- `Footer.tsx`: Integrated Official Instagram link with premium SVG branding.

### 📅 Next Steps
1. **Tenant Orchestration**: Finalize dynamic tenant discovery.
2. **NotebookLM Automation**: Integrate automated editorial cycles for news.
3. **Performance Monitoring**: Monitor Vercel metrics for cold starts.

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
- [x] Financial Orchestration (Payment Status, Bulk Quitação, RLS Master Key).
- [x] Community Engagement (Event Comments & Tactical Discussions).
- [x] Content Broadcasting (Share System for News/Cronicas/Events).
- [x] Mobile Polish (Clean Cartola UI, Instagram Footer, No Click Artifacts).
- [ ] Implement Tenant Discovery/Creation logic (for new users).

## 💰 Financial Orchestration Rules (Layer 2)
1. **Host Control**: Only the event creator can toggle payment status (is_paid).
2. **Bulk Settlement**: Toggling a host marks all their guests as paid in a single operation.
3. **Master Key**: RLS Policy ensures data integrity while allowing cross-user updates for authors.
4. **Receipts**: Automated WhatsApp confirmation with dynamic content (Event, Guests, Beers).

## ⚙️ Environment Variables (Vercel Deployment)
Mandatory variables to be set in Vercel to avoid `MIDDLEWARE_INVOCATION_FAILED`:
- `NEXT_PUBLIC_SUPABASE_URL`: Your project URL from Supabase dashboard.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your project Anon Key from Supabase dashboard.
- `SUPABASE_SERVICE_ROLE_KEY`: (Internal/Backend) for high-privilege operations (Layer 2).


