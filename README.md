# chambresito.com

Plataforma de predicciones con créditos de participación (sin dinero, sin cash-out).

## Configuración rápida

1) Copia `.env.example` a `.env.local`
2) Pega tus credenciales de Supabase, X y vudy
3) Ejecuta las migraciones en Supabase con `supabase/migrations/001_init.sql`
4) Despliega las Edge Functions:
   - `placePrediction`
   - `resolveMarket`
   - `ingestMarketsFromX`
5) Configura un cron POST a `ingestMarketsFromX` con `service_role`

## Seguridad

- No hay balances locales: vudy.com es fuente de verdad.
- Tokens solo como créditos de servicio, sin valor monetario.
- RLS obliga permisos mínimos; admin solo por JWT `role=admin`.
