# Dino

![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-10-purple)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Redis](https://img.shields.io/badge/Redis-7-red)

**Live:** [dino.asterino.dev](https://dino.asterino.dev)

---

## Overview

Dino is a full-stack climbing analytics platform for sport climbers and boulderers. Log sessions and ascents, track grade progression across V-Scale, YDS, and French grading systems, earn achievements, and get AI-powered insights into your climbing performance.

---

## Demo

### Dashboard
![Dashboard](./apps/web/public/Dashboard.gif)

### Logbook
![Logbook](./apps/web/public/Logbook.gif)

### Insights
![Insights](./apps/web/public/Insights.gif)

### Achievements
![Achievements](./apps/web/public/Achievements.gif)

## Features

- JWT authentication with secure token storage
- Session-based climbing logbook with ascent tracking
- Grade normalization engine across V-Scale, YDS, and French systems
- Three insight visualizations — grade pyramid, attempt ratio, volume over time
- AI-powered chart summaries via Groq LLM with typewriter animation
- Achievement system with 23 seeded definitions and real-time progress tracking
- Redis cache-aside layer for computed insights (~5ms cached vs ~50ms uncached)
- Self-hosted API on Ubuntu home server via Cloudflare tunnel

## Tech Stack

**Frontend**
- Next.js 16, React 19, TypeScript
- Tailwind CSS 4
- TanStack Query, Zustand
- Recharts, Lucide React

**Backend**
- ASP.NET Core 10, C#
- Entity Framework Core, PostgreSQL
- Redis (StackExchange.Redis)
- JWT authentication, BCrypt

**Infrastructure**
- Docker Compose
- Cloudflare Tunnel
- Ubuntu Server (self-hosted)
- Vercel (frontend)


## Architecture

```
dino.asterino.dev (Vercel)
        ↓
Cloudflare Tunnel
        ↓
Ubuntu Home Server
  ├── ASP.NET Core API (Docker)
  ├── PostgreSQL (Docker)
  └── Redis (Docker)
```

## Local Development

**Prerequisites:** Docker Desktop, Node.js, .NET 10 SDK

**1. Clone the repo**
```bash
git clone https://github.com/AsterinoCarsen/Dino.git
cd Dino
```

**2. Start infrastructure**
```bash
docker compose up -d
```

**3. Set up the API**
```bash
cd apps/api
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5433;Database=climbinglog;Username=postgres;Password=postgres"
dotnet user-secrets set "Redis:ConnectionString" "localhost:6379"
dotnet user-secrets set "Jwt:Key" "your-secret-key-at-least-32-chars"
dotnet user-secrets set "Jwt:Issuer" "climbinglog-api"
dotnet user-secrets set "Jwt:Audience" "climbinglog-client"
dotnet ef database update
dotnet watch run
```

**4. Set up the frontend**
```bash
cd apps/web
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:5000
npm install
npm run dev
```

---

## Environment Variables

**`apps/web/.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
GROQ_API_KEY=your-groq-api-key
```

**API (via .NET User Secrets locally, environment variables in production)**
```env
ConnectionStrings__DefaultConnection=
Redis__ConnectionString=
Jwt__Key=
Jwt__Issuer=
Jwt__Audience=
```

---

## Contributions

Built by [Carsen Asterino](https://asterino.dev).