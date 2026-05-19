# Echo Investigations

Echo Investigations is a standalone investigation intelligence platform demo with:

- `frontend`: React + Vite + Tailwind-style UI for dashboard, case intelligence, graph, analytics, and report views
- `backend`: FastAPI intelligence API with seeded fake cases, entity resolution, relationship graph payloads, scoring, and audit-ready report data

## Structure

- `frontend/`
- `backend/`

## Intended demo flow

1. Open John Mkhize's case.
2. Review linked identities, shared phones, shared addresses, and employer overlap.
3. Watch the graph and intelligence feed highlight priority and relationships.
4. Open the report panel for a narrative summary.

## Notes

- All data is fake and generated for demo purposes.
- The project is fully separate from previous work in this workspace.

## Local Run

Frontend:

- `cd "C:\Users\angel\OneDrive\Documentos\Playground\Echo Investigations\frontend"`
- `npm.cmd install`
- `npm.cmd run dev`

Backend:

- `cd "C:\Users\angel\OneDrive\Documentos\Playground\Echo Investigations\backend"`
- `.\start-backend.ps1`

## GitHub + Render Demo Hosting

This repo is ready to host as a 2-service Render demo:

- `echo-investigations-api`: FastAPI backend
- `echo-investigations-demo`: static Vite frontend

Files added for deployment:

- [render.yaml](</C:/Users/angel/OneDrive/Documentos/Playground/Echo Investigations/render.yaml>)
- [frontend/.env.example](</C:/Users/angel/OneDrive/Documentos/Playground/Echo Investigations/frontend/.env.example>)
- [.gitignore](</C:/Users/angel/OneDrive/Documentos/Playground/Echo Investigations/.gitignore>)

Frontend API configuration:

- The frontend reads `VITE_API_BASE_URL`.
- On Render, set `VITE_API_BASE_URL` to your backend public URL, for example:
  `https://echo-investigations-api.onrender.com`
- Locally, it still falls back to `http://127.0.0.1:8000`.
- `render.yaml` marks this env var with `sync: false`, so Render will prompt for it during the first Blueprint setup.

Suggested publish flow:

1. Create a new GitHub repo for `Echo Investigations`.
2. Push only the project folder contents, not the wider Playground workspace.
3. In Render, create a new Blueprint deployment from the GitHub repo.
4. When Render prompts for `VITE_API_BASE_URL`, paste the backend service URL.
5. Let Render provision both services from `render.yaml`.
6. Share the frontend URL with the client.
