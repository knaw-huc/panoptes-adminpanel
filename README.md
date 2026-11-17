# Panoptes Adminpanel

React application for managing Panoptes tenants and their configuration.

With the admin panel you can:

- Create and edit tenants.
- Manage datasets per tenant, including their facets, result properties and detail properties.
- Create users and view existing users.

## Tech stack
- [React 19](https://react.dev) + Typescript, built with [Vite](https://vite.dev)
- [Tanstack Router](https://tanstack.com/router) - file based routing in `src/routes.ts`)
- [Tanstack Query](https://tanstack.com/query) and [Tanstack Form](https://tanstack.com/form)
- [Mantine](https://mantine.dev) for UI components

## Getting started

Requirements: Node.JS and NPM, and a running Panoptes backend (remote or local).

```sh
npm install
cp .env.example .env
npm run dev
```

The dev server runs at http://localhost:5173 by default.

### Configuration

The backend is configured with the following environment variables (see `.env.example`):

| Variable           | Description                                   | Default       |
|--------------------|-----------------------------------------------|---------------|
| `VITE_PROTOCOL`    | Protocol used to reach the backend            | `http`        |
| `VITE_BASE_DOMAIN` | Base domain of the backend                    | `admin.local` |
| `VITE_PORT`        | Port of the backend                           | `8000`        |

The backend URL becomes `<VITE_PROTOCOL>://<VITE_BASE_DOMAIN>:<VITE_PORT>`. Tenant URLs use the same protocol and port with the tenant's own domain.

## Scripts

| Command           | Description                                   |
|-------------------|-----------------------------------------------|
| `npm run dev`     | Start the Vite dev server                     |
| `npm run build`   | Type-check and build for production (`dist/`) |
| `npm run lint`    | Run ESLint                                    |
| `npm run preview` | Serve the production build locally            |

## Docker

The Dockerfile builds the application and serves it with nginx on port 80:

```sh
docker build -t panoptes-adminpanel .
docker run -p 8080:80 \
  -e VITE_PROTOCOL=https \
  -e VITE_BASE_DOMAIN=admin.example.org \
  -e VITE_PORT=443 \
  panoptes-adminpanel
```

The configuration variables are applied at container start rather than at build time: `deployment/entrypoints.sh` substitutes them into the
built config bundle with `envsubst` before starting nginx. This means one image can be deployed against different backends. 
`deployment/nginx.conf` falls back to `index.html` so client-side routes work on reload. image can be deployed against 
different backends. `deployment/nginx.conf` falls back to `index.html` so client-side routes work on reload.

## Authentication

Users log in via `/login`. The access and refresh tokens (JWT) are stored in `localStorage`; expired access tokens 
are refreshed automatically via `/api/auth/refresh`, and the user is redirected to the login page when the session can no longer be renewed (see `src/auth.ts`).

