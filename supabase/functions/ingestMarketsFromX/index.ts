import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.1";
import { getEnv, jsonResponse } from "../_shared/utils.ts";

type XTrend = {
  id: string;
  name: string;
  category?: string;
};

const UNSAFE_KEYWORDS = ["bet", "casino", "gambling", "wager", "odds"];
const DISALLOWED_PUBLIC_FIGURE_TOPICS = [
  "pregnancy",
  "pregnant",
  "embarazo",
  "sexual",
  "sexo",
  "health",
  "salud",
  "illness",
  "hospital",
  "allegedly",
  "rumor",
  "rumour",
  "dicen que",
  "people say",
  "tal vez",
  "quizá",
  "quizas"
];

const EMOJI_ONLY_REGEX = /^[\p{Extended_Pictographic}\s]+$/u;
const PUBLIC_FIGURE_ALLOWLIST = [
  // Extend with verified public figures or official lists.
  "carlos rivera",
  "sofia reyes"
];

function isSafeTopic(name: string) {
  const lower = name.toLowerCase();
  if (EMOJI_ONLY_REGEX.test(name)) return false;
  if (UNSAFE_KEYWORDS.some((word) => lower.includes(word))) return false;
  if (DISALLOWED_PUBLIC_FIGURE_TOPICS.some((word) => lower.includes(word))) {
    return false;
  }
  return true;
}

function isPublicFigureTopic(name: string) {
  const lower = name.toLowerCase();
  return PUBLIC_FIGURE_ALLOWLIST.some((person) => lower.includes(person));
}

// X is used only as an idea generator, not a source of truth.
// Legal-safety statement:
// "Markets involving public figures are limited strictly to
// already-public, verifiable events. The platform does not publish
// or incentivize rumors or private personal speculation."
function resolveVerificationSource(topic: string) {
  const lower = topic.toLowerCase();

  const mappings: { match: RegExp; url: string; question: string }[] = [
    {
      match: /cuenta.*suspendid|account.*suspend/i,
      url: "https://help.x.com/en/rules-and-policies/x-rules",
      question: "¿La cuenta pública asociada fue suspendida oficialmente?"
    },
    {
      match: /comunicado|statement|apolog/i,
      url: "https://www.reuters.com/world/",
      question: "¿Se publicó un comunicado oficial verificable?"
    },
    {
      match: /demanda|lawsuit|arrest|convic/i,
      url: "https://www.justice.gov/news",
      question: "¿Existe un registro público oficial del evento legal?"
    }
  ];

  const match = mappings.find((entry) => entry.match.test(lower));
  return match ?? null;
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchTrendsFromX(token?: string): Promise<XTrend[]> {
  if (!token) {
    // Mocked data for hackathon speed.
    return [
      { id: "mock-1", name: "Carlos Rivera anuncia concierto" },
      { id: "mock-2", name: "Sofia Reyes: suspensión de cuenta oficial" }
    ];
  }

  const response = await fetch("https://api.x.com/2/trends/place.json?id=1", {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!response.ok) {
    return [];
  }

  const data = await response.json().catch(() => []);
  const trends = Array.isArray(data?.[0]?.trends) ? data[0].trends : [];

  return trends.map((trend: { name: string; promoted_content?: string }) => ({
    id: trend.name,
    name: trend.name,
    category: trend.promoted_content ? "promo" : undefined
  }));
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return jsonResponse(405, { error: "method_not_allowed" });
  }

  const supabaseUrl = getEnv("SUPABASE_URL");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");
  const xBearerToken = Deno.env.get("X_BEARER_TOKEN");

  const serviceClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const trends = await fetchTrendsFromX(xBearerToken);
  const safeTrends = trends.filter(
    (trend) => isSafeTopic(trend.name) && isPublicFigureTopic(trend.name)
  );

  // Strict filtering: only public-figure events with external verification.
  // Designed to reject the vast majority of candidates (>90%).
  const verifiedCandidates = safeTrends
    .map((trend) => {
      const verification = resolveVerificationSource(trend.name);
      if (!verification) return null;
      return {
        ...trend,
        verification
      };
    })
    .filter(Boolean) as Array<
    XTrend & {
      verification: { url: string; question: string };
    }
  >;

  if (verifiedCandidates.length === 0) {
    return jsonResponse(200, { ok: true, inserted: 0, mocked: !xBearerToken });
  }

  const { data: existingRule } = await serviceClient
    .from("resolution_rules")
    .select("id")
    .eq("name", "x_mentions_threshold")
    .maybeSingle();

  let ruleId = existingRule?.id;

  if (!ruleId) {
    const { data: createdRule, error } = await serviceClient
      .from("resolution_rules")
      .insert({
        name: "x_mentions_threshold",
        source: "x",
        rule_json: { min_mentions: 100 },
        deterministic: true
      })
      .select("id")
      .maybeSingle();

    if (error || !createdRule) {
      return jsonResponse(500, { error: "rule_seed_failed" });
    }

    ruleId = createdRule.id;
  }

  const now = new Date();
  const endsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const records = verifiedCandidates.map((trend) => ({
    source_topic_id: trend.id,
    topic_text: trend.name,
    topic_slug: slugify(trend.name),
    question_text: trend.verification.question,
    description:
      "Mercado auto-generado desde tendencias públicas verificables. No hay dinero ni premios.",
    subject_type: "public_figure",
    verification_required: true,
    verification_source_url: trend.verification.url,
    starts_at: now.toISOString(),
    ends_at: endsAt.toISOString(),
    status: "open",
    resolution_rule_id: ruleId
  }));

  const { data, error } = await serviceClient
    .from("markets")
    .upsert(records, { onConflict: "source_topic_id" })
    .select("id");

  if (error) {
    return jsonResponse(500, { error: "market_insert_failed" });
  }

  return jsonResponse(200, {
    ok: true,
    inserted: data?.length ?? 0,
    mocked: !xBearerToken
  });
});
