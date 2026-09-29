# MentorHub

MentorHub is a full-stack entrepreneur mentoring platform designed to help founders and business owners connect with expert mentors, schedule sessions, track goals, and access business plan templates.

## Features
- Mentor-to-entrepreneur pairing
- Dashboard overview for entrepreneurs
- Session booking and mentoring history
- Business plan templates
- Smart recommendations for mentor matches
- Modern React frontend and Express API

## Tech stack
- Frontend: React + Vite
- Backend: Node.js + Express
- Database: PostgreSQL-ready Prisma schema
- Styling: Custom CSS

## Project structure
- `client/` — frontend application
- `server/` — backend API and mock business logic
- `README.md` — setup guide

## Getting started

### 1) Install dependencies
```bash
npm install --workspace server
npm install --workspace client
```

### 2) Start the services
```bash
npm run dev
```

The frontend runs on http://localhost:5173 and the backend runs on http://localhost:5000.

## Default demo account
Use any of the seeded users created in the backend. For example:
- Email: `founder@mentorhub.com`
- Password: `password123`

## Future expansion
- Real PostgreSQL integration
- WebSocket chat
- Video calls with Agora or Twilio
- Admin dashboard
- Payments and subscriptions
- AI-powered business coaching

