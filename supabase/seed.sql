-- Seed file for Chambrecito prediction market
-- Run with: supabase db reset (includes seed) or psql -f seed.sql

-- ============================================================================
-- RESOLUTION RULES
-- ============================================================================
INSERT INTO resolution_rules (id, name, source, rule_json, deterministic) VALUES
  ('a1b2c3d4-0001-4000-8000-000000000001', 'Standard X Mentions', 'x_api', '{"min_mentions": 100, "time_window_hours": 24}', true),
  ('a1b2c3d4-0001-4000-8000-000000000002', 'High Volume X Mentions', 'x_api', '{"min_mentions": 500, "time_window_hours": 48}', true),
  ('a1b2c3d4-0001-4000-8000-000000000003', 'News Verification', 'news_api', '{"min_sources": 3, "credibility_threshold": 0.8}', true),
  ('a1b2c3d4-0001-4000-8000-000000000004', 'Price Target', 'price_feed', '{"comparison": "gte", "threshold": null}', true);

-- ============================================================================
-- MARKETS
-- ============================================================================
-- Open markets (active)
INSERT INTO markets (
  id, source_topic_id, topic_text, topic_slug, question_text, description,
  subject_type, verification_required, verification_source_url,
  starts_at, ends_at, status, resolution_rule_id
) VALUES
  (
    'b2c3d4e5-0001-4000-8000-000000000001',
    'x_topic_btc_100k_2025',
    'Bitcoin Price Prediction',
    'bitcoin-100k-2025',
    'Will Bitcoin reach $100,000 by end of Q1 2025?',
    'This market resolves YES if Bitcoin (BTC) reaches or exceeds $100,000 USD on any major exchange before March 31, 2025.',
    'protocol',
    true,
    'https://coinmarketcap.com/currencies/bitcoin/',
    NOW() - INTERVAL '7 days',
    NOW() + INTERVAL '60 days',
    'open',
    'a1b2c3d4-0001-4000-8000-000000000004'
  ),
  (
    'b2c3d4e5-0001-4000-8000-000000000002',
    'x_topic_eth_merge_success',
    'Ethereum Shanghai Upgrade',
    'ethereum-shanghai-upgrade',
    'Will Ethereum successfully complete the next major upgrade without critical issues?',
    'Resolves YES if the upgrade completes with no rollbacks, major exploits, or extended downtime (>4 hours).',
    'protocol',
    true,
    'https://ethereum.org/en/upgrades/',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '30 days',
    'open',
    'a1b2c3d4-0001-4000-8000-000000000001'
  ),
  (
    'b2c3d4e5-0001-4000-8000-000000000003',
    'x_topic_elon_tweet_doge',
    'Elon Musk Dogecoin Tweet',
    'elon-musk-dogecoin-tweet',
    'Will Elon Musk tweet about Dogecoin this week?',
    'Resolves YES if @elonmusk posts any tweet mentioning Dogecoin, DOGE, or the Doge meme within the market period.',
    'public_figure',
    true,
    'https://x.com/elonmusk',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '6 days',
    'open',
    'a1b2c3d4-0001-4000-8000-000000000002'
  ),
  (
    'b2c3d4e5-0001-4000-8000-000000000004',
    'x_topic_sec_spot_etf',
    'SEC Spot ETF Approval',
    'sec-spot-etf-approval',
    'Will the SEC approve another spot crypto ETF this quarter?',
    'Resolves YES if the U.S. Securities and Exchange Commission approves any new spot cryptocurrency ETF.',
    'organization',
    true,
    'https://www.sec.gov/',
    NOW() - INTERVAL '14 days',
    NOW() + INTERVAL '75 days',
    'open',
    'a1b2c3d4-0001-4000-8000-000000000003'
  ),
  (
    'b2c3d4e5-0001-4000-8000-000000000005',
    'x_topic_solana_outage',
    'Solana Network Stability',
    'solana-network-stability',
    'Will Solana experience a network outage in the next 30 days?',
    'Resolves YES if Solana mainnet experiences any downtime exceeding 1 hour.',
    'protocol',
    true,
    'https://status.solana.com/',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '25 days',
    'open',
    'a1b2c3d4-0001-4000-8000-000000000001'
  ),
  (
    'b2c3d4e5-0001-4000-8000-000000000006',
    'x_topic_apple_crypto',
    'Apple Crypto Integration',
    'apple-crypto-integration',
    'Will Apple announce any cryptocurrency-related feature in 2025?',
    'Resolves YES if Apple officially announces integration of cryptocurrency payments, wallets, or blockchain features.',
    'organization',
    true,
    'https://www.apple.com/newsroom/',
    NOW() - INTERVAL '10 days',
    NOW() + INTERVAL '180 days',
    'open',
    'a1b2c3d4-0001-4000-8000-000000000003'
  );

-- Resolved markets (historical)
INSERT INTO markets (
  id, source_topic_id, topic_text, topic_slug, question_text, description,
  subject_type, verification_required, verification_source_url,
  starts_at, ends_at, status, resolution_rule_id,
  resolved_outcome, resolved_at, resolution_evidence
) VALUES
  (
    'b2c3d4e5-0001-4000-8000-000000000007',
    'x_topic_btc_halving_2024',
    'Bitcoin Halving 2024',
    'bitcoin-halving-2024',
    'Will the Bitcoin halving occur before May 2024?',
    'Resolves YES if Bitcoin block reward halving (to 3.125 BTC) occurs before May 1, 2024.',
    'protocol',
    true,
    'https://www.blockchain.com/explorer',
    NOW() - INTERVAL '200 days',
    NOW() - INTERVAL '100 days',
    'resolved',
    'a1b2c3d4-0001-4000-8000-000000000001',
    true,
    NOW() - INTERVAL '95 days',
    '{"block_height": 840000, "halving_date": "2024-04-19", "verified_at": "2024-04-19T12:00:00Z"}'
  ),
  (
    'b2c3d4e5-0001-4000-8000-000000000008',
    'x_topic_ftx_refunds',
    'FTX Customer Refunds',
    'ftx-customer-refunds',
    'Will FTX customers receive at least 50% refunds by end of 2024?',
    'Resolves YES if FTX bankruptcy proceedings result in customers receiving 50%+ of their funds.',
    'organization',
    true,
    'https://restructuring.ra.kroll.com/FTX/',
    NOW() - INTERVAL '300 days',
    NOW() - INTERVAL '60 days',
    'resolved',
    'a1b2c3d4-0001-4000-8000-000000000003',
    true,
    NOW() - INTERVAL '55 days',
    '{"refund_percentage": 118, "announcement_date": "2024-10-07", "source": "court_documents"}'
  ),
  (
    'b2c3d4e5-0001-4000-8000-000000000009',
    'x_topic_eth_10k',
    'Ethereum $10K',
    'ethereum-10k-2024',
    'Will Ethereum reach $10,000 in 2024?',
    'Resolves YES if ETH reaches or exceeds $10,000 USD on any major exchange during 2024.',
    'protocol',
    true,
    'https://coinmarketcap.com/currencies/ethereum/',
    NOW() - INTERVAL '400 days',
    NOW() - INTERVAL '30 days',
    'resolved',
    'a1b2c3d4-0001-4000-8000-000000000004',
    false,
    NOW() - INTERVAL '25 days',
    '{"max_price_2024": 4092, "target": 10000, "reached": false}'
  );

-- Canceled market
INSERT INTO markets (
  id, source_topic_id, topic_text, topic_slug, question_text, description,
  subject_type, verification_required, verification_source_url,
  starts_at, ends_at, status, resolution_rule_id
) VALUES
  (
    'b2c3d4e5-0001-4000-8000-000000000010',
    'x_topic_canceled_example',
    'Canceled Market Example',
    'canceled-market-example',
    'Will this event happen?',
    'This market was canceled due to ambiguous resolution criteria.',
    'event',
    true,
    'https://example.com',
    NOW() - INTERVAL '50 days',
    NOW() - INTERVAL '20 days',
    'canceled',
    NULL
  );

-- ============================================================================
-- USER ROLES (for testing - these would normally come from Supabase Auth)
-- Note: Use your actual Supabase auth user IDs in production
-- ============================================================================
INSERT INTO user_roles (user_id, role) VALUES
  ('c3d4e5f6-0001-4000-8000-000000000001', 'admin'),
  ('c3d4e5f6-0001-4000-8000-000000000002', 'user'),
  ('c3d4e5f6-0001-4000-8000-000000000003', 'user'),
  ('c3d4e5f6-0001-4000-8000-000000000004', 'user'),
  ('c3d4e5f6-0001-4000-8000-000000000005', 'user');

-- ============================================================================
-- PREDICTIONS (for resolved and open markets)
-- Note: In production, these are created via place_prediction_tx() function
-- ============================================================================

-- Predictions for resolved BTC Halving market (market 7 - resolved YES)
INSERT INTO predictions (id, user_id, market_id, choice, action_type, idempotency_key, created_at) VALUES
  ('d4e5f6a7-0001-4000-8000-000000000001', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000007', 'yes', 'predict', 'pred_user2_market7_1', NOW() - INTERVAL '150 days'),
  ('d4e5f6a7-0001-4000-8000-000000000002', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000007', 'yes', 'predict', 'pred_user3_market7_1', NOW() - INTERVAL '145 days'),
  ('d4e5f6a7-0001-4000-8000-000000000003', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000007', 'no', 'predict', 'pred_user4_market7_1', NOW() - INTERVAL '140 days'),
  ('d4e5f6a7-0001-4000-8000-000000000004', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000007', 'yes', 'predict', 'pred_user5_market7_1', NOW() - INTERVAL '130 days');

-- Predictions for resolved FTX market (market 8 - resolved YES)
INSERT INTO predictions (id, user_id, market_id, choice, action_type, idempotency_key, created_at) VALUES
  ('d4e5f6a7-0001-4000-8000-000000000005', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000008', 'no', 'predict', 'pred_user2_market8_1', NOW() - INTERVAL '250 days'),
  ('d4e5f6a7-0001-4000-8000-000000000006', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000008', 'yes', 'predict', 'pred_user3_market8_1', NOW() - INTERVAL '240 days'),
  ('d4e5f6a7-0001-4000-8000-000000000007', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000008', 'yes', 'predict', 'pred_user4_market8_1', NOW() - INTERVAL '230 days');

-- Predictions for resolved ETH $10K market (market 9 - resolved NO)
INSERT INTO predictions (id, user_id, market_id, choice, action_type, idempotency_key, created_at) VALUES
  ('d4e5f6a7-0001-4000-8000-000000000008', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000009', 'yes', 'predict', 'pred_user2_market9_1', NOW() - INTERVAL '350 days'),
  ('d4e5f6a7-0001-4000-8000-000000000009', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000009', 'no', 'predict', 'pred_user3_market9_1', NOW() - INTERVAL '340 days'),
  ('d4e5f6a7-0001-4000-8000-000000000010', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000009', 'yes', 'predict', 'pred_user5_market9_1', NOW() - INTERVAL '330 days');

-- Predictions for open Bitcoin $100K market (market 1)
INSERT INTO predictions (id, user_id, market_id, choice, action_type, idempotency_key, created_at) VALUES
  ('d4e5f6a7-0001-4000-8000-000000000011', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000001', 'yes', 'predict', 'pred_user2_market1_1', NOW() - INTERVAL '5 days'),
  ('d4e5f6a7-0001-4000-8000-000000000012', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000001', 'yes', 'predict', 'pred_user3_market1_1', NOW() - INTERVAL '4 days'),
  ('d4e5f6a7-0001-4000-8000-000000000013', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000001', 'no', 'predict', 'pred_user4_market1_1', NOW() - INTERVAL '3 days'),
  ('d4e5f6a7-0001-4000-8000-000000000014', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000001', 'yes', 'predict', 'pred_user5_market1_1', NOW() - INTERVAL '2 days');

-- Predictions for open Ethereum upgrade market (market 2)
INSERT INTO predictions (id, user_id, market_id, choice, action_type, idempotency_key, created_at) VALUES
  ('d4e5f6a7-0001-4000-8000-000000000015', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000002', 'yes', 'predict', 'pred_user2_market2_1', NOW() - INTERVAL '2 days'),
  ('d4e5f6a7-0001-4000-8000-000000000016', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000002', 'yes', 'predict', 'pred_user3_market2_1', NOW() - INTERVAL '1 day'),
  ('d4e5f6a7-0001-4000-8000-000000000017', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000002', 'yes', 'predict', 'pred_user4_market2_1', NOW() - INTERVAL '12 hours');

-- Predictions for Elon/Doge market (market 3)
INSERT INTO predictions (id, user_id, market_id, choice, action_type, idempotency_key, created_at) VALUES
  ('d4e5f6a7-0001-4000-8000-000000000018', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000003', 'yes', 'predict', 'pred_user2_market3_1', NOW() - INTERVAL '20 hours'),
  ('d4e5f6a7-0001-4000-8000-000000000019', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000003', 'no', 'predict', 'pred_user5_market3_1', NOW() - INTERVAL '18 hours');

-- Predictions for SEC ETF market (market 4)
INSERT INTO predictions (id, user_id, market_id, choice, action_type, idempotency_key, created_at) VALUES
  ('d4e5f6a7-0001-4000-8000-000000000020', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000004', 'yes', 'predict', 'pred_user3_market4_1', NOW() - INTERVAL '10 days'),
  ('d4e5f6a7-0001-4000-8000-000000000021', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000004', 'no', 'predict', 'pred_user4_market4_1', NOW() - INTERVAL '8 days');

-- ============================================================================
-- TOKEN LEDGER (mirrors predictions)
-- ============================================================================
INSERT INTO token_ledger (id, user_id, market_id, prediction_id, vudy_tx_id, entry_type, amount, created_at) VALUES
  -- Market 7 (BTC Halving)
  ('e5f6a7b8-0001-4000-8000-000000000001', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000007', 'd4e5f6a7-0001-4000-8000-000000000001', 'vudy_tx_001', 'consume', 10, NOW() - INTERVAL '150 days'),
  ('e5f6a7b8-0001-4000-8000-000000000002', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000007', 'd4e5f6a7-0001-4000-8000-000000000002', 'vudy_tx_002', 'consume', 25, NOW() - INTERVAL '145 days'),
  ('e5f6a7b8-0001-4000-8000-000000000003', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000007', 'd4e5f6a7-0001-4000-8000-000000000003', 'vudy_tx_003', 'consume', 15, NOW() - INTERVAL '140 days'),
  ('e5f6a7b8-0001-4000-8000-000000000004', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000007', 'd4e5f6a7-0001-4000-8000-000000000004', 'vudy_tx_004', 'consume', 20, NOW() - INTERVAL '130 days'),
  -- Market 8 (FTX)
  ('e5f6a7b8-0001-4000-8000-000000000005', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000008', 'd4e5f6a7-0001-4000-8000-000000000005', 'vudy_tx_005', 'consume', 30, NOW() - INTERVAL '250 days'),
  ('e5f6a7b8-0001-4000-8000-000000000006', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000008', 'd4e5f6a7-0001-4000-8000-000000000006', 'vudy_tx_006', 'consume', 50, NOW() - INTERVAL '240 days'),
  ('e5f6a7b8-0001-4000-8000-000000000007', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000008', 'd4e5f6a7-0001-4000-8000-000000000007', 'vudy_tx_007', 'consume', 35, NOW() - INTERVAL '230 days'),
  -- Market 9 (ETH $10K)
  ('e5f6a7b8-0001-4000-8000-000000000008', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000009', 'd4e5f6a7-0001-4000-8000-000000000008', 'vudy_tx_008', 'consume', 100, NOW() - INTERVAL '350 days'),
  ('e5f6a7b8-0001-4000-8000-000000000009', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000009', 'd4e5f6a7-0001-4000-8000-000000000009', 'vudy_tx_009', 'consume', 75, NOW() - INTERVAL '340 days'),
  ('e5f6a7b8-0001-4000-8000-000000000010', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000009', 'd4e5f6a7-0001-4000-8000-000000000010', 'vudy_tx_010', 'consume', 40, NOW() - INTERVAL '330 days'),
  -- Market 1 (BTC $100K)
  ('e5f6a7b8-0001-4000-8000-000000000011', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000001', 'd4e5f6a7-0001-4000-8000-000000000011', 'vudy_tx_011', 'consume', 50, NOW() - INTERVAL '5 days'),
  ('e5f6a7b8-0001-4000-8000-000000000012', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000001', 'd4e5f6a7-0001-4000-8000-000000000012', 'vudy_tx_012', 'consume', 30, NOW() - INTERVAL '4 days'),
  ('e5f6a7b8-0001-4000-8000-000000000013', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000001', 'd4e5f6a7-0001-4000-8000-000000000013', 'vudy_tx_013', 'consume', 25, NOW() - INTERVAL '3 days'),
  ('e5f6a7b8-0001-4000-8000-000000000014', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000001', 'd4e5f6a7-0001-4000-8000-000000000014', 'vudy_tx_014', 'consume', 45, NOW() - INTERVAL '2 days'),
  -- Market 2 (ETH Upgrade)
  ('e5f6a7b8-0001-4000-8000-000000000015', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000002', 'd4e5f6a7-0001-4000-8000-000000000015', 'vudy_tx_015', 'consume', 20, NOW() - INTERVAL '2 days'),
  ('e5f6a7b8-0001-4000-8000-000000000016', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000002', 'd4e5f6a7-0001-4000-8000-000000000016', 'vudy_tx_016', 'consume', 35, NOW() - INTERVAL '1 day'),
  ('e5f6a7b8-0001-4000-8000-000000000017', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000002', 'd4e5f6a7-0001-4000-8000-000000000017', 'vudy_tx_017', 'consume', 15, NOW() - INTERVAL '12 hours'),
  -- Market 3 (Elon/Doge)
  ('e5f6a7b8-0001-4000-8000-000000000018', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000003', 'd4e5f6a7-0001-4000-8000-000000000018', 'vudy_tx_018', 'consume', 10, NOW() - INTERVAL '20 hours'),
  ('e5f6a7b8-0001-4000-8000-000000000019', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000003', 'd4e5f6a7-0001-4000-8000-000000000019', 'vudy_tx_019', 'consume', 15, NOW() - INTERVAL '18 hours'),
  -- Market 4 (SEC ETF)
  ('e5f6a7b8-0001-4000-8000-000000000020', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000004', 'd4e5f6a7-0001-4000-8000-000000000020', 'vudy_tx_020', 'consume', 60, NOW() - INTERVAL '10 days'),
  ('e5f6a7b8-0001-4000-8000-000000000021', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000004', 'd4e5f6a7-0001-4000-8000-000000000021', 'vudy_tx_021', 'consume', 40, NOW() - INTERVAL '8 days');

-- ============================================================================
-- MARKET SNAPSHOTS (time-series data for charts)
-- ============================================================================

-- Snapshots for Market 1 (BTC $100K) - showing growth over time
INSERT INTO market_snapshots (id, market_id, snapshot_at, total_predictions, yes_count, no_count) VALUES
  ('f6a7b8c9-0001-4000-8000-000000000001', 'b2c3d4e5-0001-4000-8000-000000000001', NOW() - INTERVAL '5 days', 1, 1, 0),
  ('f6a7b8c9-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000001', NOW() - INTERVAL '4 days', 2, 2, 0),
  ('f6a7b8c9-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000001', NOW() - INTERVAL '3 days', 3, 2, 1),
  ('f6a7b8c9-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000001', NOW() - INTERVAL '2 days', 4, 3, 1);

-- Snapshots for Market 2 (ETH Upgrade)
INSERT INTO market_snapshots (id, market_id, snapshot_at, total_predictions, yes_count, no_count) VALUES
  ('f6a7b8c9-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000002', NOW() - INTERVAL '2 days', 1, 1, 0),
  ('f6a7b8c9-0001-4000-8000-000000000006', 'b2c3d4e5-0001-4000-8000-000000000002', NOW() - INTERVAL '1 day', 2, 2, 0),
  ('f6a7b8c9-0001-4000-8000-000000000007', 'b2c3d4e5-0001-4000-8000-000000000002', NOW() - INTERVAL '12 hours', 3, 3, 0);

-- Snapshots for Market 7 (resolved BTC Halving)
INSERT INTO market_snapshots (id, market_id, snapshot_at, total_predictions, yes_count, no_count) VALUES
  ('f6a7b8c9-0001-4000-8000-000000000008', 'b2c3d4e5-0001-4000-8000-000000000007', NOW() - INTERVAL '150 days', 1, 1, 0),
  ('f6a7b8c9-0001-4000-8000-000000000009', 'b2c3d4e5-0001-4000-8000-000000000007', NOW() - INTERVAL '145 days', 2, 2, 0),
  ('f6a7b8c9-0001-4000-8000-000000000010', 'b2c3d4e5-0001-4000-8000-000000000007', NOW() - INTERVAL '140 days', 3, 2, 1),
  ('f6a7b8c9-0001-4000-8000-000000000011', 'b2c3d4e5-0001-4000-8000-000000000007', NOW() - INTERVAL '130 days', 4, 3, 1);

-- ============================================================================
-- REPUTATION POINTS (for resolved markets)
-- ============================================================================

-- BTC Halving market (resolved YES) - users who predicted YES get points
INSERT INTO reputation_points (id, user_id, market_id, points, reason) VALUES
  ('a7b8c9d0-0001-4000-8000-000000000001', 'c3d4e5f6-0001-4000-8000-000000000002', 'b2c3d4e5-0001-4000-8000-000000000007', 10, 'market_resolution'),
  ('a7b8c9d0-0001-4000-8000-000000000002', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000007', 10, 'market_resolution'),
  ('a7b8c9d0-0001-4000-8000-000000000003', 'c3d4e5f6-0001-4000-8000-000000000005', 'b2c3d4e5-0001-4000-8000-000000000007', 10, 'market_resolution');

-- FTX market (resolved YES) - users who predicted YES get points
INSERT INTO reputation_points (id, user_id, market_id, points, reason) VALUES
  ('a7b8c9d0-0001-4000-8000-000000000004', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000008', 10, 'market_resolution'),
  ('a7b8c9d0-0001-4000-8000-000000000005', 'c3d4e5f6-0001-4000-8000-000000000004', 'b2c3d4e5-0001-4000-8000-000000000008', 10, 'market_resolution');

-- ETH $10K market (resolved NO) - users who predicted NO get points
INSERT INTO reputation_points (id, user_id, market_id, points, reason) VALUES
  ('a7b8c9d0-0001-4000-8000-000000000006', 'c3d4e5f6-0001-4000-8000-000000000003', 'b2c3d4e5-0001-4000-8000-000000000009', 10, 'market_resolution');

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- This seed creates:
-- - 4 resolution rules
-- - 10 markets (6 open, 3 resolved, 1 canceled)
-- - 5 users (1 admin, 4 regular users)
-- - 21 predictions across various markets
-- - 21 token ledger entries (matching predictions)
-- - 11 market snapshots (for chart visualization)
-- - 6 reputation point awards (for resolved markets)
