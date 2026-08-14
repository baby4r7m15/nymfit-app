# midnight.exe — page builder

A multi-user, Wix/Carrd-style page builder. Every user gets an account, a
page, and a set of drag-orderable "cards" (hero image, about, quote, stats,
likes/dislikes, personality radar, memories, playlist, friends grid, sysinfo,
plus generic heading/text/image cards) they can add, edit, reorder, show/hide,
and re-theme — live, no redeploy needed. Your original Artemis design ships
as a one-click starter template.

Stack: **Next.js (App Router) on Vercel** + **Supabase** (Postgres, Auth, RLS).

---

## 1. Set up Supabase

1. Create a project at supabase.com (free tier is fine to start).
2. Open **SQL Editor** → **New query**, paste in the entire contents of
   `supabase/schema.sql`, and click **Run**. This creates:
   - `profiles`, `pages`, `blocks` tables
   - Row Level Security policies (users can only edit their own data; admins
     can manage everything; public can only read `published` pages)
   - A trigger that auto-creates a profile + empty page the moment someone
     signs up
3. Go to **Settings → API** and copy:
   - `Project URL`
   - `anon public` key
   - `service_role` key (keep this one secret — server-only)

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the three values from
step 1:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
```

## 3. Run it locally

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`, sign up for an account — this immediately
gives you a page at `/<your-username>` and access to `/dashboard`.

## 4. Make yourself an admin

After signing up once, go back to the Supabase SQL Editor and run:

```sql
update public.profiles set role = 'admin' where username = 'your_username';
```

Log out and back in (or just refresh `/dashboard`) — you'll now see an
**ADMIN** link in the top bar leading to `/admin`, where you can see every
user, publish/unpublish their pages, promote other admins, or delete
accounts.

## 5. Deploy to Vercel

```bash
npm install -g vercel   # if you don't have it
vercel
```

Or connect the repo in the Vercel dashboard. Either way, add the same three
environment variables from step 2 in **Vercel → Project → Settings →
Environment Variables**, then deploy. No other config needed — the app is a
standard Next.js app.

Because saves go straight to Supabase from the browser (using the anon key +
the user's session, protected by Row Level Security), edits appear on the
public page immediately — there's nothing to rebuild or redeploy when a user
edits their page.

## 6. Using it on your phone

Nothing special to install — `/dashboard` is a responsive page, so the
builder (card list + live preview) works in mobile Safari/Chrome. On narrow
screens the editor and preview stack vertically instead of side-by-side.

---

## How it's organized

```
app/
  page.tsx                 landing page
  login/, signup/           auth pages
  auth/actions.ts           signup/login/logout server actions
  dashboard/                the builder (auth-guarded)
  admin/                    admin panel (role-guarded)
  [username]/page.tsx       public rendered page

lib/
  supabase/client.ts         browser Supabase client
  supabase/server.ts         server Supabase client (RLS-respecting)
  supabase/admin.ts          service-role client — admin-only server actions
  cards/registry.ts          every card type: fields + defaults
  cards/CardRenderer.tsx     renders any card type (shared by builder + public page)
  cards/artemisTemplate.ts   the original Artemis design as starter content
  types.ts                   shared TypeScript types

components/
  builder/Builder.tsx        the editor: add/edit/reorder/hide/theme cards
  builder/FieldEditor.tsx    auto-generates edit forms from the card registry
  admin/AdminUserRow.tsx     admin table row actions

supabase/schema.sql          run once in Supabase SQL editor
proxy.ts                     keeps auth session cookies fresh on every request
```

### Adding a new card type

Everything is driven by one file, `lib/cards/registry.ts` — add an entry
there (type name, fields, default content) and a matching `case` in
`lib/cards/CardRenderer.tsx`. The builder's "Add Card" menu and edit forms
pick it up automatically; no other wiring needed.

## Notes / what's intentionally left for you to extend

- **Images**: card fields take a plain image URL. There's no upload UI yet —
  paste a link (e.g. from Supabase Storage, Imgur, etc.). Adding a Supabase
  Storage upload button to `FieldEditor`'s `url` fields is a natural next
  step.
- **One page per user** for now — the schema has a unique constraint on
  `pages.user_id`. Multi-page support would mean dropping that constraint and
  adding a page picker to the dashboard.
- **Drag-to-reorder** currently uses up/down buttons rather than true drag
  handles, for reliability on mobile touch — swap in `@dnd-kit/core` later if
  you want drag gestures.
