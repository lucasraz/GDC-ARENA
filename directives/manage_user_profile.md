# Directive: Manage User Profile

## Intent
Manage user identity and ensure every user is mapped to a `tenant_id` for security isolation.

## User Flow
1.  **User Authentication:** Use Supabase Auth to identify the user.
2.  **Tenant Association:**
    *   If the user is new, create a default tenant or associate with an existing one via invitation.
    *   Store `tenant_id` in the user session or metadata.
3.  **Profile Data:**
    *   Input: `full_name`, `avatar_url`, `username`.
    *   Output: Persisted user record with mandatory `tenant_id`.

## Business Rules
- **Rule 1 (Multitenancy):** Every database row created by the user MUST contain `tenant_id`.
- **Rule 2 (Identification):** `username` must be unique globally or per tenant? (Globally for an "Arena" name).
- **Rule 3 (Access):** Users can only view data where `tenant_id` matches their own.

## Input/Output Specifications
- **Input:** `update_profile_command { full_name, username, avatar_url }`
- **Output:** `user_profile { id, tenant_id, full_name, username }`

## Constraints
- Supabase RLS (Row Level Security) must be enabled on the `profiles` table.
- Orchestration layer must validate `username` format (slugified).
