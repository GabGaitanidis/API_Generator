# Api Mock Data

This project is a full-stack app for creating and testing mock API data.

## What it does

- Lets users sign in and manage projects
- Lets users create rules with JSON schemas and Faker values
- Lets users add condition sets with `if` / `then` logic
- Generates dynamic URLs for each rule
- Returns mock responses from the generated URL
- Lets users test the generated endpoint from the dashboard

## Main features

- JWT login with access and refresh tokens
- Project, rule, and condition set CRUD
- Dynamic mock endpoint generation
- Automatic condition merging into mock data
- Pagination for generated URLs
- Redis cache for repeated config lookups
- Swagger/OpenAPI docs for the backend API

## Project structure

- `Backend/` - Express, TypeScript, PostgreSQL, Drizzle ORM, Redis
- `frontend/` - React, Vite, TypeScript, Axios

## Backend docs

- Swagger UI: `http://localhost:5000/docs`
- OpenAPI JSON: `http://localhost:5000/openapi.json`

## Local run

Backend:

```bash
cd Backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```
