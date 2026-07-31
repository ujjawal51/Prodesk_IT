# Sprint 07 - Registration Wizard

A multi-step onboarding wizard built with **React**, **React Hook Form**, **Zod**, and **Vite**.

## Features

- **3-Step Flow**: Personal Details, Account Credentials, and Review & Submit.
- **State Lifting**: Persistent input data when navigating back and forth between steps.
- **Real-Time Validation**: Instant field errors with `@` check for email, password length rules, and password match checks.
- **Conditional Action Triggers**: Next button disabled until all active view fields pass validation.
- **UX Controls**: Password visibility eyeball toggle, dynamic progress bar, and summary step.
- **Console Log Output**: Logs complete form payload on submit.

## Tech Stack

- React 18
- React Hook Form (`^7.53.0`)
- Zod (`^3.23.8`)
- Lucide React
- Vite

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
