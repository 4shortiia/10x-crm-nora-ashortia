# 🛠️ CRM Architecture, Data Layer & UI Optimization

This technical note documents the implementation updates for the CRM data layer, styling framework, and performance patches applied to the layout.

---

## 🎨 1. Premium Anime Theme & Color Palette

The interface utilizes a custom, high-contrast theme engineered with non-intrusive colors inspired by classic anime palettes (Chakra Orange, Sky Blue, and Deep Charcoal).

- **Light Theme Basics**: Clean `#f8fafc` primary background with high-contrast text (`#0f172a`) to ensure readable interfaces on light surfaces.
- **Charcoal Dark Mode**: Replaced pure blacks with a soft, deep charcoal canvas (`#121212` and `#1e1e1e`) to reduce eye strain during prolonged sessions.
- **Core Accents**:
    - `--accent-color`: `#f97316` (Naruto Chakra Orange) for main action indicators and system highlights.
    - `--status-contacted`: `#0284c7` (Sky Blue) utilized for ongoing communications.
    - `--status-lost`: `#dc2626` (Red) used for dropped interactions or severe validation issues.

---

## 💾 2. Local Data Architecture & Schema Mapping

Instead of direct third-party API processing dependencies, the system routes initial client objects via `js/data.js` and local storage mechanisms to guarantee consistent data structures:

- **Dynamic Data Pipeline**: Synchronized customer matrices map compound values instantly (e.g., merging structural names and mapping fields into dedicated entities like `.badge.lead` or `.badge.won`).
- **State Retention**: User selections and UI parameters are safely serialized within `localStorage` for responsive performance state recovery.

---

## ⚡ 3. UI Optimization & Performance Patches

### Fix: Flash of Unstyled Content (FOUC) on Dashboard

During route changes, background processing for large datasets (like status matrices or demographic arrays) caused a brief "white flash" before the dark theme script executed.

**Resolution Patch**: Pre-render theme checks are now placed immediately inside the opening `<body>` tag, bypassing DOMContentLoaded delays:

```html
<body>
    <script>
        if (localStorage.getItem("theme") === "dark") {
            document.body.classList.add("dark-theme");
        }
    </script>
    ...
</body>
```
