## GiveGoa Website & Admin Dashboard

Built with Next.js (App Router), Tailwind CSS and Supabase.  
This app exposes a public projects catalog and an admin area for managing projects and bulk-importing data from CSV.

---

### Tech Stack

- **Frontend**: Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS, shadcn/ui, lucide-react
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deployment**: Vercel (recommended), Netlify plugin possible

---

### 1. Prerequisites

- Node.js 18+ and npm / pnpm / yarn.
- Supabase account (`https://supabase.com`).
- (Recommended) Vercel account (`https://vercel.com`) for deployment.

---

### 2. Local Development

#### 2.1 Clone & install

```bash
git clone <your-repo-url>
cd v0-give-goa-website-and-dashboard

pnpm install        # or npm install / yarn install
```

#### 2.2 Environment variables

Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

- `NEXT_PUBLIC_*` keys are used in the browser.
- `SUPABASE_SERVICE_ROLE_KEY` is **server-only** (API routes, server actions).  
  Do **not** commit `.env.local`.

#### 2.3 Run dev server

```bash
pnpm dev           # or npm run dev / yarn dev
```

App runs at `http://localhost:3000`.

---

### 3. Supabase Setup

#### 3.1 Create project & get keys

1. In the Supabase dashboard, create a new project.
2. From **Project Settings → API**, copy:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

#### 3.2 `projects` table schema

Create a table `public.projects`. Example SQL:

```sql
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  sector text,
  geographical_scope text,
  group_no text,
  year text,
  group_id text,
  concentration text,
  sdg text,
  program text,
  project_link text,
  objectives text,
  description text,
  organization_name text,
  image_url text,
  faculty text,
  mentor text,
  student_names text[] default '{}',
  submitter_email text default 'bulk-import@admin.com',
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
```

> Use `uuid_generate_v4()` instead of `gen_random_uuid()` if required by your Postgres setup.

#### 3.3 Row Level Security (RLS)

For development you can leave RLS **disabled** on `projects`.

For production:

1. Enable RLS on `projects`.
2. Add a policy to allow public read of approved projects:

```sql
create policy "Public can read approved projects"
on public.projects
for select
using (status = 'approved');
```

3. Keep insert/update/delete restricted to:
   - Service role (used by `/api/bulk-upload`), and/or
   - Authenticated admin users (if you add Supabase Auth for admins).

---

### 4. Supabase Usage in the Code

- **Browser client** (`lib/supabase.ts`):
  - Uses `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
  - Used in `app/projects/page.tsx` to fetch approved projects.

- **Service-role client** (`app/api/bulk-upload/route.ts`):
  - Uses `SUPABASE_SERVICE_ROLE_KEY` via `createClient`.
  - Bypasses RLS and is used only for trusted bulk imports.

- **Server client with cookies** (`app/admin/page.tsx`):
  - Uses `createServerClient` from `@supabase/ssr` + `cookies()` to:
    - Count total / pending / approved projects.
    - Fetch recent submissions.

---

### 5. Bulk CSV Upload

- **UI**: `app/admin/bulk-upload/page.tsx`
- **API**: `app/api/bulk-upload/route.ts`

#### 5.1 CSV format

Expected header row:

```text
List of Projects,Sector,Geographical Scope,Group No,Year,GroupID,conc,SDG,Link to the projects,Objectives,Program,Student Names,Faculty Advisor,Mentor,image_url
```

Example data row:

```text
Sample Project,Education,Goa,1,2024,GRP001,Marketing,SDG 4,https://example.com,To improve education access,BDA,"Student A, Student B",Prof. X,Mr. Y,https://example.com/sample-project-image.jpg
```

- `image_url` is a public URL to the project image (Supabase Storage, CDN, etc.).

#### 5.2 How the API maps CSV → DB

For each CSV row, `/api/bulk-upload`:

- Normalizes:
  - **Title** from `List of Projects` / `Project Title` / `title` / `Project Name`.
  - **SDG**: parses `SDG 4`, `4`, etc. and maps to full labels like `SDG 4 - Quality Education`.
  - **Program**: codes `CORE`, `BDA`, `BIFS`, `HCM` → `PGDM CORE/BDA/BIFS/HCM`.
  - **Student Names**: `Student Names` column split into a `text[]` array.
  - **Image URL**: from `image_url`, `Image URL`, `ImageURL`, `imageUrl`.
- Inserts into `public.projects` with:
  - `status = 'approved'` by default.
  - `created_at = now()`.

#### 5.3 Using the Bulk Upload UI

1. Go to `/admin/bulk-upload`.
2. Click **Download Template** to get `projects_template.csv`.
3. Fill data in Excel/Sheets, making sure headers stay the same.
4. Export as CSV.
5. Upload in the UI, review the preview, and click **Upload**.
6. Projects are inserted into Supabase and appear on `/projects`.

---

### 6. Projects Page (`/projects`)

File: `app/projects/page.tsx`

- Fetches all `projects` with `status = 'approved'` using the browser Supabase client.
- Features:
  - Search by title, objectives, description, keywords.
  - Filters by Program, Year, SDG.
  - Pagination: 12 projects per page.

#### 6.1 Card images

For each project card:

1. If `project.image_url` exists **and loads successfully**, use it.
2. If missing or broken, fall back to a keyword-based free image:

```ts
const fallbackKeywords =
  `${project.title || ''}, ${project.objectives || project.description || 'community project, social impact'}`;
const fallbackImageUrl = `https://loremflickr.com/800/600/${encodeURIComponent(fallbackKeywords)}`;
```

3. If images cannot load at all, display a large initial letter (first character of the title).

Broken `image_url` values are tracked in state; if an image 404s or fails to load, the UI automatically switches to the fallback.

---

### 7. Admin Dashboard

Key files:

- `app/admin/page.tsx` – dashboard overview.
- `app/admin/projects` – project management.
- `app/admin/projects/pending` – review queue for pending submissions.
- `app/admin/bulk-upload` – CSV import workflow.

Admin dashboard shows:

- Total Projects, Pending Approvals, Approved Projects (Supabase counts).
- Quick links to project management and bulk upload.
- Recent submissions (with status, email, date).

You can extend admin routes to:

- Approve / reject projects by changing `status`.
- Edit project details, including `image_url`.

---

### 8. Environment Variables (Recap)

Set in **`.env.local`** for local dev and in your hosting provider for production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

No OpenAI key is required; AI image generation was removed in favor of free keyword-based images.

---

### 9. Deployment

#### 9.1 Vercel (recommended)

1. Import this repository into Vercel.
2. In project **Settings → Environment Variables**, add:

   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

3. Build command:

```bash
npm run build      # or pnpm build / yarn build
```

4. Vercel automatically handles Next.js output; no extra config required.

#### 9.2 Netlify

- Ensure `@netlify/plugin-nextjs` is installed and configured in `netlify.toml`.
- Build command: `npm run build` (or equivalent).
- If `_next/static/...` assets 404 or have wrong MIME type:
  - Clear Netlify cache and redeploy.
  - Confirm the plugin is active and the publish directory is correct.

---

### 10. Troubleshooting

- **`AuthApiError: Invalid Refresh Token` in browser console**  
  Clear site data (cookies + localStorage) for your domain/localhost and reload.

- **Bulk upload fails**  
  - Check `/api/bulk-upload` logs in the browser dev tools / server logs.
  - Verify CSV headers match the template (especially `image_url`).
  - Ensure `SUPABASE_SERVICE_ROLE_KEY` is set and correct.

- **Images not appearing**  
  - Confirm `image_url` is a valid public image URL.
  - If some URLs 404 or are blocked, the UI will automatically fall back to keyword-based images or the initial avatar.

