#  Prodesk Internship Task

A professional repository documenting the core modules, enterprise features, and technical missions completed during the engineering internship at Prodesk IT.

## Intern Profile

* **Name:** Ujjawal TIwari
* **Role:** Full Stack Intern
* **Organization:** Prodesk IT
* **Timeline:** June 2026 - Present

## Repository Overview
This repository documents the technical contributions, core modules, and full-stack development achievements during my Software Engineering Internship at Prodesk IT.

## Tasks

| Sl. No. |Project| Core Focus | Stack Used | Live Link |
| :--- | :--- | :--- | :--- | :--- |
| 1 |Prodesk Landing Page|Responsive marketing landing page|HTML5, Tailwind CSS, Node.js| [Live Link](https://prodesk-theta.vercel.app/) |
| 2 |Cash Flow Dashboard|Personal finance tracking and reporting|HTML5, JavaScript, Tailwind CSS, Chart.js, jsPDF| [Live Link](https://prodesksprint2.vercel.app/) |
| 3 |GitShowcase |GitHub profile search and comparison logic |HTML5, JavaScript, CSS3, GitHub REST API   | [Live Link](https://prodesksprint3.vercel.app/) |
| 12 |Storybook Design System & Real-Time WebSocket Matrix|Isolated CDD components (Track A) & Bi-directional Socket.IO pipeline (Track B)|Next.js 14, React 18, Storybook 8, Socket.IO, Express, Tailwind CSS| [Documentation](Sprint_12/README.md) |
 

---
## Sprint_1 - Prodesk Landing Page

Sprint_1 delivers a responsive landing page implementation using Tailwind CSS through an npm build workflow.

## Key features:
* *Responsive hero and section layout.*
* *Tailwind utility-driven styling.*
* *Build pipeline for generated CSS output.*

## Directory: Sprint_1
*https://prodesk-theta.vercel.app/

---

## Sprint_2 - Cash Flow Dashboard

Sprint_2 is a browser-based finance dashboard for salary and expense management.

## Key features:

* Salary and expense tracking.
* Remaining balance computation.
* INR/USD currency toggle.
* Live exchange-rate fetch with fallback.
* Expense pie chart visualization.
* PDF report generation.
* localStorage persistence.

  ## Directory: Sprint_2
* Live: https://prodesksprint2.vercel.app/

### Sprint_3 - GitShowcase

Sprint_3 is a GitHub user search utility focused on API integration and robust loading/error behavior.

Key features:

- GitHub user profile search.
- API-driven profile rendering.
- Loading state and not-found handling.
- Battle mode support for user comparison flow.

Directory: Sprint_3
https://prodesksprint3.vercel.app/

---

## Sprint_12 - Storybook Design Systems & Real-Time WebSockets

Sprint_12 marks the transition into enterprise-level architectures across two specialized tracks:

### Key Features:
* **Track A: Component-Driven Development with Storybook**:
  - Isolated UI catalog decoupled from main Next.js runtime.
  - Three core isolated components: `Button.jsx`, `Input.jsx`, and `ProductCard.jsx` with sibling `.stories.jsx` definitions.
  - Tailwind CSS integration inside Storybook iframe via `.storybook/preview.js`.
  - Next.js `<Image>` runtime decoupling with native asset photography.
* **Track B: Persistent Real-Time WebSocket Matrix**:
  - Bi-directional TCP WebSocket connection via Socket.IO 4.x.
  - Explicit CORS configuration for multi-origin clients (`:3000`, `:5173`).
  - React 18 `StrictMode` lifecycle cleanup (`return () => socket.disconnect()`) to eliminate duplicate event payloads.
  - Selective broadcast (`socket.broadcast.emit`) vs. Global cluster broadcast (`io.emit`).
  - Automated integration testing suite with 5/5 passing tests.
  - Native Postman WebSocket audit integration.

Directory: Sprint_12
[Sprint 12 Technical Documentation](Sprint_12/README.md)
