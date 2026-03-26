# Directive: Authentication (Supabase)
Manage secure user identity, session persistence, and tenant isolation using Supabase Auth.

## Intent
Ensure that only authenticated users can access profile management and premium features (like Cartola-Dicas). Every user must be linked to a `tenant_id` at the time of creation.

## User Flow
1. **User Sign Up/Login Page:**
   - Input: Email & Password or Social Login (Provider: Google).
   - Validation: Emails must be verified (unless bypassed in development).
2. **Post-Authentication:**
   - Redirect to `/profile` if it's the first time and they need to set up their identity.
   - Redirect to `/dashboard` otherwise.
3. **Tenant Integration:**
   - Every `auth.uid()` must be stored in the `profiles` table along with a mandatory `tenant_id`.

## Business Rules
- **Rule 1 (Session):** Use `@supabase/ssr` to manage cookies for persistent authentication across server and client components.
- **Rule 2 (Boundary):** Unauthenticated users are redirected to `/login` when trying to access `/profile`.
- **Rule 3 (Creation):** When a user is created via Auth, a trigger or a post-signup action must create their initial `profiles` record with a default `tenant_id`.

## Security Constraints
- SSR for all session management to prevent client-side JS attacks.
- Middleware enforcement of token validity.
- RLS (Row Level Security) enabled on all tables using `auth.uid()`.
