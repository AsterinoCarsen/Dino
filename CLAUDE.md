# Dino

Dino ("Dyno" — a dynamic climbing move — spelled Dino) is a full-stack climbing
analytics platform for sport climbers and boulderers: log sessions and ascents,
track grade progression across V-Scale/YDS/French, earn achievements, and get
AI-generated insight summaries. Live at dino.asterino.dev.

See `README.md` for the full feature list, tech stack badges, and local setup
steps — this file focuses on things an agent needs but the README doesn't
spell out.

## Monorepo layout

```
Dino/
├── apps/
│   ├── api/    ASP.NET Core 10 (C#) — REST API, EF Core, PostgreSQL, Redis
│   └── web/    Next.js 16 (Pages Router) — React 19, TypeScript, Tailwind 4
├── docker-compose.yml   api + postgres + redis + cloudflared, for self-hosting
└── .env.example         env vars consumed by docker-compose
```

There is no shared package between `api` and `web` — they only communicate
over HTTP. Treat them as independent projects that happen to live in one repo.

## Git workflow — IMPORTANT

- `main` is the production branch (deployed to Vercel/the home server).
- `dev` is the integration branch. **All work happens on `dev` or a branch
  based off it**, then gets PR'd into `main`.
- History shows `dev` merged into `main` via PR after each unit of work
  (see the `Merge pull request #N from AsterinoCarsen/dev` commits). Don't
  commit directly to `main` unless explicitly told to.
- Commit messages are short, imperative, plain-English summaries of what
  changed (e.g. "Added top % to last session spotlight, new endpoint, moved
  computation to API."). No conventional-commits prefixes, no bodies.
- There are no GitHub Actions/CI workflows in this repo — nothing runs
  automatically on push/PR. Build and test locally before considering work done.

## Backend — `apps/api`

ASP.NET Core 10 Web API, C#, EF Core + PostgreSQL, Redis for caching, JWT auth.

- **Layering**: `Controllers/` (thin, HTTP-only) → `Services/` (business
  logic) → `Data/ClimbingLogContext.cs` (EF Core `DbContext`). Controllers
  extend `BaseController` for `GetUserId()`, which reads the user id out of
  the JWT `NameIdentifier` claim — every non-auth endpoint is scoped to the
  authenticated user this way.
- **Domain model**: `User` → `Session` (a climbing outing) → `Ascent` (a
  single climb within a session). `ClimbStyle` enum: AutoBelay, Boulder,
  TopRope, Lead.
- **Grading system** (`Models/Grades/`): three independent grade scales
  (`VGrade`, `YDSGrade`, `FrenchGrade`) are C# enums whose *integer values
  encode relative difficulty ranking* — do not renumber them casually, and
  never compare ranks across different `GradeSystem` values (`GradeComparer`
  throws if you try). `GradeComparer` converts between the enum and its
  display label (e.g. `YDSGrade._5_10a` ↔ `"5.10a"`, `FrenchGrade._6a_plus`
  ↔ `"6a+"`). An `Ascent` stores `GradeSystem` + `GradeRank` (int), not a
  free-text grade.
- **Achievements** (`Models/Achievements/`): `AchievementDefinition` rows are
  EF Core seed data (`Data/Seeds/AchievementSeeds.cs`, ~23 definitions) baked
  into a migration via `HasData`. `AchievementCondition` (TotalAscents,
  TotalSessions, HighestGrade, TotalHeight) + `Threshold` (+ optional
  `GradeSystem`) define the win condition; `AchievementService` evaluates
  these after ascent writes and creates `UserAchievement` rows. If you add or
  change a seeded achievement, you need a new EF Core migration.
- **Caching**: `CacheService` wraps `IDistributedCache` (Redis) with typed
  JSON get/set/delete. Insight endpoints are cache-aside (~5ms cached vs
  ~50ms uncached per the README). **Any write to a Session or Ascent must
  call `CacheService.InvalidateInsightsAsync(userId)`** or insights will
  serve stale cached data — check existing service methods for the pattern
  before adding a new mutation.
- **AI summaries**: `GroqService` wraps GroqSharp to call the Groq LLM API
  for one-off insight commentary. It swallows exceptions and returns `""` on
  failure by design — insight endpoints must never break because the AI
  provider is down. Don't change this to throw.
- **Rate limiting**: global 100 req/min per IP (`Program.cs`), plus a
  stricter named `"import"` policy (3 req/hour) applied to the CSV import
  endpoint specifically — it's the most expensive/abusable endpoint.
- **Migrations**: `dotnet ef migrations add <Name>` from `apps/api/`, applied
  automatically on startup via `db.Database.Migrate()` in `Program.cs` (not
  a manual step in deployment). Local dev still needs `dotnet ef database
  update` once per the README before first run.
- **Config**: appsettings + .NET User Secrets locally; env vars (double
  underscore `__` separator, e.g. `Groq__ApiKey`) in Docker/production — see
  `docker-compose.yml` and `.env.example` at the repo root for the full set.
- Enums (`ClimbStyle`, `GradeSystem`, `AchievementCondition`) are persisted
  as strings in Postgres (`HasConversion<string>()` in `OnModelCreating`),
  and serialized as strings over JSON (`JsonStringEnumConverter`) — not as
  ints. Keep new enums consistent with this if they cross the API boundary.

## Frontend — `apps/web`

Next.js 16 using the **Pages Router** (`src/pages/`, not the App Router) —
don't introduce `src/app/`. React 19 + TypeScript, Tailwind CSS 4, TanStack
Query for server state, Zustand for client state, Recharts for charts.

- **Structure**: `pages/` (routes) → `components/<feature>/` (feature-scoped
  UI) → `lib/` (cross-cutting: `api.ts`, `queries.ts`, `types.ts`,
  `grades.ts`, `hooks/`, `store/`).
- **API client** (`lib/api.ts`): a thin typed `fetch` wrapper (`api.get/post
  /put/delete`). It auto-attaches the JWT from `useAuthStore`, and on a 401
  it clears auth and redirects to `/authenticate` — don't build a second,
  parallel fetch path; extend this one.
- **Auth**: `useAuthStore` (Zustand + `persist`, localStorage-backed under
  key `auth-storage`) holds `{ token, user }`. `useAuth()` hook wraps
  login/register/logout and handles post-auth navigation. `ProtectedRoute`
  component gates authenticated pages.
- **Server state**: all API reads go through TanStack Query hooks in
  `lib/queries.ts`, one hook per endpoint (`useSessions`, `useGradePyramid`,
  `useAchievementProgress`, etc.), each with an explicit `queryKey` array.
  When adding a new endpoint, add a hook here rather than calling `api.get`
  directly from a component, and make sure mutations invalidate the matching
  query keys (mirroring the backend's cache-invalidation discipline above).
- **Grades on the frontend**: `lib/grades.ts` mirrors the backend's grade
  label/rank logic for client-side display — if you change grade ranking or
  labels in the API, check this file for drift.
- `NEXT_PUBLIC_API_URL` (default `http://localhost:5028` if unset) points at
  the API; `GROQ_API_KEY` in `.env.local` is currently unused by the frontend
  directly (the Groq call is server-side in the API) — verify before relying
  on it.

## Infra

`docker-compose.yml` at the repo root runs `api` + `db` (Postgres 16) +
`redis` (7-alpine) + `cloudflared` for self-hosting on the author's Ubuntu
home server, tunneled to `dino.asterino.dev`. The frontend deploys to Vercel
separately (not part of this compose file). Compose expects the vars in
`.env.example` at the repo root (`POSTGRES_PASSWORD`, `JWT_*`,
`CLOUDFLARE_TUNNEL_TOKEN`, `GROQ__APIKEY`, `GROQ__MODEL`).
