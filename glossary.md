# Technical English Glossary

This glossary contains essential professional terminology utilized throughout the development, documentation, and code base of the 10X CRM application.

| Term                      | Definition / Context in CRM                                                                                                 |
| :------------------------ | :-------------------------------------------------------------------------------------------------------------------------- |
| **Authentication (Auth)** | The process of verifying the identity of a user attempting to access the CRM via credentials matching.                      |
| **Authorization**         | The security mechanism that determines if an authenticated user has rights to view specific system paths.                   |
| **State Management**      | The centralized tracking, caching, and mutation of application data models (e.g., synchronizing `clientsState`).            |
| **Asynchronous (Async)**  | Operations that run in the background without blocking the primary user interface thread, such as calling APIs.             |
| **Route Guard**           | A protective programmatic check running before page loads to divert unauthenticated requests back to safety grids.          |
| **Shallow Copy**          | A new array wrapper pointing to the original reference memory elements, useful for isolated layout filters.                 |
| **IIFE**                  | Immediately Invoked Function Expression; a JavaScript function that runs as soon as it is defined to encapsulate variables. |
| **Toaster System**        | A temporary visual UI alert popup stacking at layout boundaries to confirm immediate system event changes.                  |
| **Pipeline Overview**     | A statistical breakdown tracking clients moving across operational phases (Leads, Contacted, Won, Lost).                    |
| **Event Delegation**      | Attaching a single listener to a parent element to handle interactions on dynamically rendered child items.                 |
