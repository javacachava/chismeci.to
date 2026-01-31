import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import {
  getBearerToken,
  getEnv,
  jsonResponse,
  sha256Hex
} from "../_shared/utils.ts";

type PlacePredictionPayload = {
  market_id: string;
  choice: "yes" | "no";
  amount: number;
};

const ACTION_TYPE = "predict";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" });
  }

  const token = getBearerToken(req);
  if (!token) {
    return jsonResponse(401, { error: "missing_auth" });
  }

  const supabaseUrl = getEnv("SUPABASE_URL");
  const anonKey = getEnv("SUPABASE_ANON_KEY");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const vudyBaseUrl = getEnv("VUDY_BASE_URL");
  const vudyApiKey = getEnv("VUDY_API_KEY");

  const authClient = createClient(supabaseUrl, anonKey, {
    global: {
      headers: { Authorization: `Bearer ${token}` }
    },
    auth: { persistSession: false }
  });

  const { data: userData, error: userError } = await authClient.auth.getUser();
  if (userError || !userData?.user) {
    return jsonResponse(401, { error: "invalid_session" });
  }

  let payload: PlacePredictionPayload;
  try {
    payload = await req.json();
  } catch {
    return jsonResponse(400, { error: "invalid_json" });
  }

  if (!payload?.market_id || !payload?.choice || !payload?.amount) {
    return jsonResponse(400, { error: "missing_fields" });
  }

  if (!["yes", "no"].includes(payload.choice)) {
    return jsonResponse(400, { error: "invalid_choice" });
  }

  if (payload.amount <= 0) {
    return jsonResponse(400, { error: "invalid_amount" });
  }

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const { data: market, error: marketError } = await serviceClient
    .from("markets")
    .select("id, status")
    .eq("id", payload.market_id)
    .maybeSingle();

  if (marketError || !market) {
    return jsonResponse(404, { error: "market_not_found" });
  }

  if (market.status !== "open") {
    return jsonResponse(409, { error: "market_closed" });
  }

  const idempotencyKey = await sha256Hex(
    `${userData.user.id}:${payload.market_id}:${ACTION_TYPE}`
  );

  const vudyResponse = await fetch(`${vudyBaseUrl}/consume`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": vudyApiKey
    },
    body: JSON.stringify({
      user_id: userData.user.id,
      market_id: payload.market_id,
      amount: payload.amount,
      action_type: ACTION_TYPE,
      idempotency_key: idempotencyKey
    })
  });

  if (!vudyResponse.ok) {
    return jsonResponse(502, { error: "vudy_consume_failed" });
  }

  const vudyPayload = await vudyResponse.json().catch(() => ({}));
  const vudyTxId = vudyPayload?.vudy_tx_id;

  if (!vudyTxId) {
    return jsonResponse(502, { error: "vudy_missing_tx_id" });
  }

  const { data, error } = await serviceClient.rpc("place_prediction_tx", {
    p_user_id: userData.user.id,
    p_market_id: payload.market_id,
    p_choice: payload.choice,
    p_amount: payload.amount,
    p_idempotency_key: idempotencyKey,
    p_vudy_tx_id: vudyTxId,
    p_action_type: ACTION_TYPE
  });

  if (error) {
    return jsonResponse(500, { error: "prediction_insert_failed" });
  }

  return jsonResponse(200, {
    ok: true,
    idempotency_key: idempotencyKey,
    prediction_id: data?.[0]?.prediction_id ?? null
  });
});
