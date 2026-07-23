# AI development log

A short log of the work sessions that built this project.

---

### Entry 1 — Scaffolding and design system

Set up the project structure (`css/`, `js/`) and ported the approved
anime-style dashboard design into a shared `style.css` with CSS
variables, so every page (auth screens, dashboard, clients, profile)
draws from the same palette, type scale and components.

### Entry 2 — Accounts and sessions

Implemented `auth.js`: `crm_users` for stored accounts, `crm_signup`
validation (valid email, 6+ character password), and `crm_session`
for the logged-in user. Built the sign up and login pages, including
the "Invalid email or password" message on bad credentials.

### Entry 3 — Route protection

Added `requireAuth()` as an auth guard, called at the top of every
protected page (`dashboard.html`, `clients.html`, `profile.html`)
before the page body renders, so an unauthenticated visitor is
redirected to `login.html` instead of seeing protected content.
Wired up `Log out` to clear the session.

### Entry 4 — Clients CRUD against a mock API

Built `api.js` as a stand-in backend: `apiGetClients`, `apiAddClient`
and `apiDeleteClient`, each returning a promise after a short delay to
mimic real network latency. `clients.js` renders a loading state while
the "request" is in flight, validates the add-client form, and asks
for confirmation before deleting a record.

### Entry 5 — Polish and documentation

Added the light/dark theme toggle (`crm_theme`), derived a couple of
dashboard numbers from live client data instead of static copy, fixed
the theme icon not matching the stored theme on first load, and wrote
the README covering structure, storage keys and how to run the app.
