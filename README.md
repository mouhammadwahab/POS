# Shop POS online dashboard

This site shows the shop data stored in Supabase: sales, profit, products, purchases, customers, and suppliers. The public link opens a sign-in page. Use the same username and password as Shop POS.

The service role key is used only on the server. Do not put it in the browser or in git.

## Local run

```powershell
cd web
copy .env.example .env.local
```

Fill `web/.env.local`:

- `SUPABASE_URL` — project URL
- `SUPABASE_SERVICE_ROLE_KEY` — service role key from Supabase project settings
- `SESSION_SECRET` — any long random string

Then:

```powershell
npm install
npm run dev
```

Open http://localhost:3000 and sign in. Sync the till from Settings → Online copy before expecting records here.

## Deploy on Vercel

1. Import this repository in Vercel.
2. Set the project root directory to `web`.
3. Add the same three environment variables.
4. Deploy.

The live link shows only the login page until a Shop POS username and password are entered.
