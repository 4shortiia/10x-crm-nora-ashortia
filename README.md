# 10x-crm-nora-ashortia

# 10x CRM

A lightweight, front-end-only CRM built with plain HTML, CSS and
JavaScript — no build step, no framework. Data is stored in the
browser's `localStorage`, and a small mock API layer (`js/api.js`)
simulates real network calls (loading delays, promises) so the app
behaves the way it would against a real backend.

## Features

- **Sign up** — name, email and password, with client-side validation
  (valid email, 6+ character password) and toast feedback.
- **Login** — checks credentials against stored accounts; wrong
  email/password shows an "Invalid email or password" message.
- **Auth guard** — `dashboard.html`, `clients.html` and `profile.html`
  all call `requireAuth()` before rendering; without a session you are
  redirected straight to `login.html`. `Log out` clears the session.
- **Clients** — fetched through the mock API with a loading state,
  rendered with plain JS. Add a client (validated, `POST`-style call)
  or delete one with a confirmation prompt (`DELETE`-style call).
- **Theme toggle** — light/dark mode, persisted per browser.

## Project structure

```
10x-crm/
├── index.html        redirects to dashboard or login based on session
├── signup.html
├── login.html
├── dashboard.html
├── clients.html
├── profile.html
├── css/
│   └── style.css      shared design tokens + component styles
├── js/
│   ├── ui.js           toast notifications
│   ├── theme.js         crm_theme light/dark handling
│   ├── auth.js          crm_users / crm_session, signup, login, guard, logout
│   ├── api.js           mock API + crm_clients storage
│   ├── clients.js        clients page logic (fetch, add, delete)
│   ├── dashboard.js      dashboard stats
│   └── profile.js        profile page logic
├── README.md
└── ai-log.md
```

## Storage keys

| Key           | Shape                                    | Purpose                      |
| ------------- | ---------------------------------------- | ---------------------------- |
| `crm_users`   | `[{ name, email, password }]`            | Accounts created via sign up |
| `crm_session` | `{ name, email, loggedInAt }`            | The currently logged-in user |
| `crm_clients` | `[{ id, name, company, value, status }]` | Client records               |
| `crm_theme`   | `"light"` \| `"dark"`                    | UI theme preference          |

## Running it

No build tools required. Open `index.html` in a browser, or serve the
folder with any static file server, e.g.:

```
npx serve .
```

Then sign up for an account and sign in — the app will seed a handful
of sample clients on first load of the clients page.
