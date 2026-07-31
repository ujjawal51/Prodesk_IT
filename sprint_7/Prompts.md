# Sprint 07 - AI Pair Programming & Architecture Notes

## Overview
Quick notes on architectural decisions and AI guidance used while building the Registration Wizard module.

## Key Decisions

1. **State Persistence Across Views**
   - Kept form state hoisted in the master `RegistrationWizard` component using React Hook Form (`useForm`).
   - Switching between views via single-route conditional rendering keeps user inputs completely intact when navigating back/forth.

2. **Real-Time Step Validation**
   - Configured form mode to `onChange` and resolved step schemas using `zod`.
   - Next button stays disabled until all active step fields satisfy schema constraints (valid email with `@`, password >= 8 chars, matching passwords).

3. **UX Polish**
   - Show/Hide password toggle using state-driven input types (`text` vs `password`).
   - Dynamic progress bar tracking active step index.
   - Clean summary step with instant edit jumps.

## Submission Payload
On step 3 submit, data is validated against `fullSchema`, logged via `console.log()`, and triggers a success state view.
