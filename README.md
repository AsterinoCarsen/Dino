# Dino
![License](https://img.shields.io/badge/license-MIT-blue)
![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)

---

## Overview
Dino is a web application designed for sport climbers and boulderers to track their performance over time, tailor their training, and quantify their improvements with a gamified user-interface.

---

## Demo

### Dashboard Page
![Log Climb Demo](./public/gif1.gif)

### Climbing Logbook
![Log Climb Demo](assets/gifs/log-climb-demo.gif)

### Profile
![Log Climb Demo](assets/gifs/log-climb-demo.gif)

---

## Features

- Full-stack user authentication with JWT
- Track lifetime climbing stats and weekly progress
- Earn badges for important milestones
- Data visualization using ReCharts
- Responsive UI with Next.js and Tailwind

---

## Tech Stack
- **Frontend:** Next.js 15, React 19, Tailwind 4
- **Backend:** Node.js, Supabase, PostgreSQL
- **Utilities:** JWT, ReCharts, Iconify, BCrypt, UUID

---

## Installation
```bash
git clone https://github.com/AsterinoCarsen/Dino.git
cd Dino
npm install
npm run dev
```

Create a `.env.local` file inside the parent directory with the following environment variables:
```env
DATABASE_URL=<Your database URL>
DATABASE_KEY=<Your database key>
JWT_SECRET=<Your JWT secret>
CAPTCHA_SECRET=<Your CAPTCHA secret>
NEXT_PUBLIC_CAPTCHA_SITE_KEY=<Your CAPTCHA site key>
```