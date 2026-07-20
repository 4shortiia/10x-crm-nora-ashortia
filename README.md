# 10x-crm-nora-ashortia

# 10X CRM - Client Relationship Management System

A lightweight, high-performance, single-page-feel CRM built strictly with Vanilla JavaScript, semantic HTML5, and modern CSS3. This application serves as a comprehensive portal for managing business clients, monitoring financial pipelines, and tracking user workflows without relying on external frameworks.

## 🚀 Features

- **Secure Route Guards:** Real-time session monitoring using `crm_session` tokens via JavaScript IIFE blocks to prevent unauthorized access.
- **Dynamic Dashboard Analytics:** Real-time calculations of Won Revenue, Active Deals, and weekly client onboardings alongside a ticking system clock.
- **Full CRUD Integration:** Asynchronous client onboarding, updates, and mock-server deletions mirroring state changes locally and to DummyJSON endpoints.
- **Advanced Data Processing:** Non-destructive search, multi-status chip filtering, and structural sorting configurations (A-Z, Newest, High Value).
- **User Profiles & Control:** Updatable company data counters, secure password modification forms, and an instant application cache factory reset.
- **Intuitive UI Enhancements:** Centralized toaster notifications (`toast.js`) and a persistent dark/light theme toggle.

## 🛠️ Technology Stack

- **Frontend:** Semantic HTML5, CSS3 Custom Properties (Variables)
- **Core Logic:** Vanilla JavaScript (ES6+ Module Pattern)
- **State & Persistence:** Browser `localStorage` API
- **Data Source:** DummyJSON REST API

## 💾 Storage Registry References

The architecture relies strictly on the following designated browser storage keys:

- `crm_users` - Stores encrypted/plain credentials and user metadata objects.
- `crm_session` - Tracks active user login timestamps and authentication state.
- `crm_clients` - Holds the primary working client pipeline array.
- `crm_theme` - Evaluates persistent styling mode configurations (`light` / `dark`).

## ⚡ Quick Start

1. Clone or download this repository structure.
2. Open `index.html` via a local development server (e.g., VS Code Live Server).
3. Register a new user account on `signup.html`, then log in to view the main panel.
