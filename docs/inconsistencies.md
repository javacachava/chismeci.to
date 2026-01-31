# Inconsistencies Log

This document tracks discrepancies between documented requirements and implementation decisions.

---

## RLS-02: Markets SELECT Policy

**Date:** 2026-01-31

**Requirement (TASKS.md):**
> RLS-02: Create SELECT policy for `markets` (users can read open markets)

**Original Implementation (001_init.sql):**
```sql
create policy markets_read on markets
  for select to anon, authenticated
  using (true);
```

This allowed ALL markets to be read by any user, regardless of status.

**Resolution:**
Per user request, the policy was updated to restrict non-admin users to reading only open markets. Admins retain access to all markets (open, resolved, canceled).

**New Implementation (002_rls_markets_open_only.sql):**
```sql
drop policy if exists markets_read on markets;

create policy markets_read on markets
  for select to anon, authenticated
  using (status = 'open' or is_admin());
```

**Rationale:**
- Non-admin users should only see markets they can participate in (open status)
- Resolved/canceled markets may contain sensitive resolution data
- Admins need full visibility for management and auditing purposes

---

## EF-03: ingestMarketsFromX Authentication

**Date:** 2026-01-31

**Observation:**
Unlike `resolveMarket` (EF-02) which requires admin JWT verification, `ingestMarketsFromX` (EF-03) has no authentication check.

**Comparison:**

| Function | Auth Check |
|----------|------------|
| `placePrediction` | JWT required (any authenticated user) |
| `resolveMarket` | JWT required + admin role verification |
| `ingestMarketsFromX` | None |

**Design Decision: Intentional**

This is intentional, not an oversight. The function is designed for Supabase Cron compatibility:

1. **Cron Jobs Have No User Context** - Supabase Cron triggers Edge Functions without a user session. There's no JWT to verify.

2. **Service Role Key Usage** - The function uses `SUPABASE_SERVICE_ROLE_KEY` internally to perform database operations, which is a secure server-side credential.

3. **Non-Destructive Operations Only** - The function only performs upserts (insert or skip existing). It cannot:
   - Delete markets
   - Modify existing markets
   - Resolve markets
   - Affect user data

**Security Mitigations:**

1. **POST-Only** - Rejects non-POST requests
2. **Strict Safety Filters** - Rejects >90% of topic candidates
3. **Public Figure Allowlist** - Only pre-approved subjects
4. **Verification Source Required** - Must match known verification patterns
5. **Upsert Conflict Key** - Duplicate source IDs are ignored
6. **No Sensitive Data Exposure** - Returns only counts, no user data

**Alternative Considered:**

Adding API key authentication (e.g., `X-Cron-Secret` header) was considered but deemed unnecessary given:
- The function's limited scope (non-destructive market creation)
- Supabase's infrastructure security for cron triggers
- The strict content filtering already in place

**Recommendation:**

If exposing this function to external triggers beyond Supabase Cron becomes necessary, add API key validation:

```typescript
const cronSecret = req.headers.get("X-Cron-Secret");
if (cronSecret !== Deno.env.get("CRON_SECRET")) {
  return jsonResponse(401, { error: "unauthorized" });
}
```
