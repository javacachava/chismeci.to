import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import {
  getBearerToken,
  getEnv,
  getRoleFromJwt,
  jsonResponse
} from "../_shared/utils.ts";

type ResolvePayload = {
  market_id: string;
};

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" });
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(401, { error: "missing_auth" });
  }

  const role = getRoleFromJwt(token);
  if (role !== "admin") {
    return jsonResponse(403, { error: "admin_required" });
  }

  const supabaseUrl = getEnv("SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const xBearerToken = Deno.env.get("X_BEARER_TOKEN");

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  let payload: ResolvePayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: "invalid_json" });
  }

  if (!payload?.market_id) {
    return jsonResponse(400, { error: "missing_market_id" });
  }

  const { data: market, error: marketError } = await serviceClient
    .from("markets")
    .select(
      "id, status, topic_text, subject_type, verification_required, verification_source_url, resolution_rule_id, resolution_rules (id, rule_json, source)"
    )
    .eq("id", payload.market_id)
    .maybeSingle();

  if (marketError || !market) {
    return jsonResponse(404, { error: "market_not_found" });
  }

  if (market.status !== "open") {
    return jsonResponse(409, { error: "market_not_open" });
  }

  const rule = market.resolution_rules;
  if (!rule) {
    return jsonResponse(400, { error: "missing_resolution_rule" });
  }

  if (market.verification_required && !market.verification_source_url) {
    return jsonResponse(400, { error: "missing_verification_source" });
  }

  // Simplified deterministic evaluation. If X API is unavailable, mock data is used.
  const ruleJson = rule.rule_json as { min_mentions?: number };
  const minMentions = ruleJson?.min_mentions ?? 100;

  let mentionCount = 0;
  let usedMock = false;

  if (!xBearerToken) {
    usedMock = true;
    mentionCount = 120;
  } else {
    const searchUrl =
      "https://api.x.com/2/tweets/search/recent?query=" +
      encodeURIComponent(`"${market.topic_text}"`);
    const response = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${xBearerToken}` }
    });

    if (!response.ok) {
      usedMock = true;
      mentionCount = 120;
    } else {
      const data = await response.json().catch(() => ({}));
      mentionCount = data?.meta?.result_count ?? 0;
    }
  }

  const outcome = mentionCount >= minMentions;

  const resolutionEvidence = {
    source: rule.source,
    rule: { min_mentions: minMentions },
    mention_count: mentionCount,
    mocked: usedMock,
    verification_source_url: market.verification_source_url
  };

  const { error: updateError } = await serviceClient
    .from("markets")
    .update({
      status: "resolved",
      resolved_outcome: outcome,
      resolved_at: new Date().toISOString(),
      resolution_rule_id: rule.id,
      resolution_evidence: resolutionEvidence
    })
    .eq("id", market.id);

  if (updateError) {
    return jsonResponse(500, { error: "market_update_failed" });
  }

  const { error: reputationError } = await serviceClient.rpc(
    "award_reputation_points",
    {
      p_market_id: market.id,
      p_outcome: outcome
    }
  );

  if (reputationError) {
    return jsonResponse(500, { error: "reputation_award_failed" });
  }

  return jsonResponse(200, {
    ok: true,
    market_id: market.id,
    resolved_outcome: outcome,
    mocked: usedMock
  });
});
