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

---

## API-03: Market Creation Endpoint Path

**Date:** 2026-01-31

**Requirement (TASKS.md):**
> API-03: `POST /markets/create` - Insert validated market (admin only)

**Implementation:**
```
POST /api/markets
```

**Decision:**
Used RESTful convention where `POST /resource` creates a new resource, rather than `/resource/create`. This is consistent with standard REST API design patterns:
- `GET /markets` - List markets
- `POST /markets` - Create market
- `GET /markets/:id` - Get single market

**Rationale:**
- Industry-standard REST convention
- Cleaner API surface
- Consistent with other endpoints in the system

---

## API Endpoints: Error Response Format

**Date:** 2026-01-31

**Requirement (docs/api/endpoints.md):**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": "Additional error details (optional)"
  }
}
```

**Implementation:**
```json
{
  "error": "error_code"
}
```

**Decision:**
Used the simpler error format that matches the existing Edge Functions (`placePrediction`, `resolveMarket`, `ingestMarketsFromX`). All three Edge Functions use:
```typescript
return jsonResponse(4xx, { error: "error_code" });
```

**Rationale:**
- Consistency with existing Edge Functions
- Simpler client-side error handling
- Error codes are self-descriptive (e.g., `missing_auth`, `market_not_found`, `admin_required`)

**Future Consideration:**
If richer error messages are needed, the format can be extended to:
```json
{
  "error": "error_code",
  "message": "Human-readable message"
}
```

---

## API-01/API-08: Cron Secret Authentication

**Date:** 2026-01-31

**Observation:**
The plan specified adding `X-Cron-Secret` header validation for cron-triggered endpoints (API-01 and API-08) when exposed via Next.js API routes.

**Implementation:**
Added `validateCronSecret()` helper in `lib/apiHelpers.ts` and `requireAdminOrCron()` for endpoints that accept either admin JWT or cron secret.

**Affected Endpoints:**
- `POST /api/ingest/x` - Accepts cron secret OR admin JWT
- `POST /api/markets/:id/resolve` - Accepts cron secret OR admin JWT

**Required Environment Variable:**
```
CRON_SECRET=<secure-random-string>
```

**Rationale:**
- Defense-in-depth when exposing ingestion/resolution via HTTP
- Allows cron jobs to trigger without user context
- Falls back to admin JWT authentication for manual triggers
