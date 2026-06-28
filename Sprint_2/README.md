# 💸 Cash-Flow — Salary & Expense Tracker

> Sprint 02 Project | Vanilla JS + HTML + CSS

A fully functional, real-time salary and expense tracker dashboard built with pure HTML, CSS, and Vanilla JavaScript — no frameworks, no shortcuts.

---

## 📁 Project Structure

```
Sprint_2/
├── index.html          → Main HTML file (structure & semantic markup)
├── css/
│   └── style.css       → All styling (dark theme, animations, responsive)
├── js/
│   └── app.js          → All JavaScript logic (state, DOM, APIs)
└── README.md           → This file
```

---

## ✅ Features Implemented

### Phase 1 — Base MVP
- [x] Salary input form with validation
- [x] Expense name + amount form with validation
- [x] Live calculation: Total Salary - Total Expenses = Remaining Balance
- [x] Dynamic DOM rendering (no page reload)
- [x] Input validation (empty fields, negative/zero values)

### Phase 2 — Data Persistence & Visualization
- [x] **LocalStorage** — all data persists across browser reloads
  - Salary and expenses saved as JSON strings
  - Loaded and parsed on page start
- [x] **Delete Operation** — trash icon on each expense
  - Removes from DOM with animation
  - Updates LocalStorage instantly
  - Recalculates balance in real-time
- [x] **Chart.js Pie/Donut Chart** — "Remaining Balance vs Total Expenses"
  - Previous chart instance destroyed before re-render (no duplication bug)

### Phase 3 — Stretch Goals
- [x] **PDF Report** — jsPDF library exports formatted report with all expenses and final balance
- [x] **Currency Conversion** — Frankfurter API (free, no API key) converts INR ↔ USD live
- [x] **Threshold Alert** — Banner + red text when balance < 10% of salary

---

## 🛠️ Tech Stack

| Technology | Usage |
|---|---|
| HTML5 | Semantic structure, accessibility (aria) |
| CSS3 | Dark theme, glassmorphism, animations, responsive |
| Vanilla JS (ES6+) | All logic, DOM manipulation, state management |
| Chart.js v4 (CDN) | Pie/Donut chart visualization |
| jsPDF v2.5 (CDN) | PDF report generation |
| Frankfurter API | Free live currency exchange rate |
| LocalStorage | Client-side data persistence |

---

## 🔑 Key Technical Notes

- **No string concatenation bug** — all input values wrapped with `parseFloat()` / `Number()`
- **LocalStorage** uses `JSON.stringify()` on save and `JSON.parse()` on load
- **Chart.js** destroys previous instance with `.destroy()` before re-creating
- **No React / No frameworks** — pure `document.getElementById`, `createElement`, `addEventListener`
- **Frankfurter API** — keyless endpoint: `https://api.frankfurter.app/latest?from=USD&to=INR`

---

## 🚀 How to Run

Simply open `index.html` in any modern browser. No server or build step needed.

```
Double-click index.html → Opens in browser ✅
```

---

*Sprint 02 | Cash-Flow Project*
