# 💸 Cash-Flow — AI Prompts Used to Build This Project

> Yeh 4 prompts hain jo is poore project ko step-by-step build karne ke liye use kiye gaye.
> Har prompt pichle se zyada advanced hai.

---

## Prompt 1 — Base Layout & Design System

```
Build a dark-themed Salary & Expense Tracker dashboard using only HTML, CSS, and Vanilla JavaScript (no frameworks, no libraries).

The app should have:
- A sticky glassmorphism header with a logo, app name "Cash-Flow", a currency tag badge showing current currency (₹ INR), a "Switch to USD" button, and a "Download Report" button.
- Three stat cards at the top showing: Total Salary (green accent), Total Expenses (red accent), Remaining Balance (purple accent). Each card should have an emoji icon, a label, and a large amount value.
- A two-column layout below: left column (360px fixed) for forms, right column (flexible) for expense list and chart.
- Left column: a "Set Your Salary" form card with a currency prefix symbol input field, and an "Add Expense" form card with expense name and amount fields.
- Right column: an "Expense Log" card with an item count badge and empty state, and a "Spending Overview" card for a donut chart with a custom legend.
- A fixed alert banner at the top (hidden by default) with a warning message and close button.
- A footer with copyright text.

Design requirements:
- CSS custom properties (variables) for all colors, fonts, spacing, and transitions.
- Dark background: #09090b with subtle radial gradient overlays in green, purple, and amber.
- Use Google Fonts: Inter (body) and Outfit (headings/numbers).
- Smooth hover effects on all interactive elements.
- Fully responsive layout that stacks to single column on mobile.
- Custom scrollbar styling.

Do NOT use Tailwind, Bootstrap, or any CSS framework. Write all CSS from scratch.
```

---

## Prompt 2 — JavaScript State, Forms & LocalStorage

```
Now add complete JavaScript logic to the Cash-Flow dashboard built in the previous step. Use strict mode and a centralized global state object.

State object must hold: salary (number), expenses (array of objects), currency string, exchangeRate, and chartInstance.

Implement the following features:

1. SALARY FORM:
   - On submit, validate: field must not be empty, value must be a positive number.
   - Show inline error messages below the input with red styling.
   - Store salary in INR internally (convert from USD if currently in USD mode using exchangeRate).
   - After setting salary, clear input and re-focus it.

2. EXPENSE FORM:
   - Validate both name (not empty) and amount (positive number).
   - Each expense object must have: id (unique, use Date.now + random), name, amount (stored in INR), and date (formatted as "28 Jun 2026").
   - On successful add, animate the new item sliding in at the top of the list.
   - Automatically assign a category emoji icon based on expense name using regex pattern matching (cover: rent/house, food/swiggy/zomato, groceries, netflix/spotify/OTT, petrol/fuel/cab, electricity/wifi/bill, mobile/recharge, gym/fitness, clothes/shopping/amazon, medicine/doctor, emi/loan/insurance, education/course — fallback: 💸).

3. EXPENSE LIST:
   - Render all expenses as list items showing: category icon, name, date, formatted amount, and a delete button (🗑️) that is hidden by default and appears on row hover.
   - Delete must animate the item sliding out, then remove from state and re-render stats.
   - Show empty state with floating coin emoji animation when no expenses exist.
   - Show item count badge (e.g. "3 items") in the card header.

4. STATS DISPLAY:
   - On any change, update all 3 stat cards with a flash animation (CSS keyframe triggered by adding/removing a class).
   - Check threshold: if salary > 0 and remainingBalance < 10% of salary, add "critical" class to balance card (triggers red pulsing animation) and show the alert banner with exact remaining percentage.

5. LOCALSTORAGE:
   - Save salary, expenses array, and currency on every change using JSON.stringify.
   - Load and restore all data on page init.
   - Escape all user input using a custom escapeHtml() function before rendering to DOM.

Use document.getElementById and DOM methods only — no innerHTML for user data (use textContent or escapeHtml).
```

---

## Prompt 3 — Live Currency API & Chart.js Visualization

```
Extend the Cash-Flow app with two advanced features: live currency conversion and a donut chart.

FEATURE 1 — Live Currency Toggle (INR ↔ USD):

When user clicks "Switch to USD":
- Disable the button and show a loading spinner inside the rate status box (CSS spinner animation, no images).
- Try fetching live USD to INR rate from: https://api.frankfurter.app/latest?from=USD&to=INR
- If that fails (network error or non-ok HTTP status), automatically fallback to: https://open.er-api.com/v6/latest/USD
- Extract rate from response.rates.INR in both cases.
- On success: store rate in state, switch currency to 'USD', update header badge to "$ USD", change button text to "Switch to INR", show success message with green styling and the live rate.
- On total failure: show red error message, re-enable button.
- All amounts in the UI (stat cards, expense list, chart legend) must re-render in USD using: inrValue / exchangeRate.
- Currency prefix symbol (₹ or $) must update in both form inputs.
- All formatting: use fixed 2 decimal places.

When user clicks "Switch to INR":
- Reset currency to INR, update badge and button text, re-render all values back in INR.
- Show default hint text in rate status box.

FEATURE 2 — Chart.js Donut Chart:

Use Chart.js v4 (already loaded via CDN). Render a donut chart showing "Expenses vs Remaining Balance".

Chart requirements:
- Only show chart if salary > 0. Otherwise show empty state message.
- IMPORTANT: Before creating a new chart, always call .destroy() on the previous instance stored in state.chartInstance to prevent duplication bugs.
- Data: [totalExpenses, Math.max(0, remainingBalance)]
- Colors: expenses → rgba(239, 68, 68, 0.85), balance → rgba(124, 58, 237, 0.85)
- cutout: '55%' for donut style
- Disable built-in legend (use custom HTML legend below chart instead).
- Custom tooltip showing formatted amount + percentage of total.
- Animate on each update: animateRotate + animateScale, duration 600ms, easing easeInOutQuart.
- Custom HTML legend below chart: two items (Expenses in red dot, Balance in purple dot) each showing current formatted value.

Re-render chart on every salary or expense change.
```

---

## Prompt 4 — PDF Report Generation & Final Polish

```
Add PDF export functionality and final polish to the Cash-Flow app.

PDF REPORT (using jsPDF v2.5, already loaded via CDN):

When "Download Report" button is clicked, generate and auto-download a professional A4 PDF named "CashFlow_Report_YYYY-MM-DD.pdf" with:

1. HEADER SECTION (full-width dark bar):
   - Title: "Cash-Flow Report" in white bold 22pt
   - Subtitle: "Salary & Expense Summary — [current date formatted as '28 June 2026']" in muted color 10pt

2. SUMMARY CARDS (rounded dark rectangle):
   - Three columns side by side: TOTAL SALARY (green text), TOTAL EXPENSES (red/pink text), REMAINING BALANCE (purple or red if critical)
   - Show values in current currency (convert if USD mode)
   - If in USD mode, add a small italic note: "* Converted at 1 USD = INR X.XX"

3. EXPENSE TABLE:
   - Purple header row with columns: #, Expense Name, Date, Amount
   - Alternating row colors: dark row (#1a1e2e text light) / light row (#f0f2f8 text dark)
   - Truncate expense names longer than 32 chars with "..."
   - Amount column in red/pink prefix with "-"
   - If no expenses: show italic "No expenses logged yet."
   - Handle multi-page: if y position exceeds 270mm, add new page and repeat the table header

4. FOOTER ROW:
   - Dark background row showing "Net Remaining Balance:" label and the final balance value (green if healthy, red if critical)

5. SIGNATURE LINE:
   - Small italic muted text: "Generated by Cash-Flow"

FINAL POLISH:

- Add CSS @keyframes for: slideDown (alert banner), shake (alert icon), float (empty state coin), flash (stat card number update), slide-in (new expense item), fadeSlideOut (deleted expense item), pulse-danger (critical balance pulsing red glow).
- Make layout fully responsive: below 900px stack to single column, below 600px reduce padding and font sizes.
- All buttons must have :active scale(0.97) transform.
- Salary and expense prefix symbols (₹/$) must update instantly when currency changes.
- On page load (init function): restore all localStorage data, update UI for saved currency mode, re-render stats + expense list + chart.
- Use 'use strict' at top of JS file.
- All DOM element references stored in a single const DOM = {} object at the top.
- LocalStorage keys stored in a const LS_KEYS = {} object.
```

---

*Sprint 02 | Cash-Flow Project | Prodesk IT*
