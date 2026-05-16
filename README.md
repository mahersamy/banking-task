# Banking Portal

> Angular front-end technical task — Banking Sector  
> Built with Angular 21, PrimeNG, TanStack Query, RxJS & Signals

---

## Table of Contents

- [Quick Start](#quick-start)
- [Login Credentials](#login-credentials)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Feature Checklist](#feature-checklist)
  - [Layer 1 — Core Shell](#layer-1--core-shell)
  - [Layer 2 — Transactions & Business Logic](#layer-2--transactions--business-logic)
  - [Layer 3 — Advanced Features & Architecture](#layer-3--advanced-features--architecture)
- [Architecture Decisions](#architecture-decisions)
- [Validation Rules](#validation-rules)
- [Business Rules](#business-rules)
- [Assumptions](#assumptions)
- [Known Limitations](#known-limitations)

---

## Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 20.x |
| npm | >= 9.x |
| Angular CLI | >= 21.x |

### Installation

```bash
# 1. Clone the repository
git clone <repo-url>
cd banking-task

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
# or
ng serve --configuration dev
```

Open your browser at **http://localhost:4200**

### Build for Production

```bash
ng build --configuration prod
```

---

## Login Credentials

> The app uses a static mock authentication layer — no backend required.

| Email | Password |
|-------|----------|
| `maher.samy@mail.com` | `Pass@123` |

Password rules enforced: minimum 8 characters, at least one uppercase letter, one lowercase letter, one digit, and one special character (`!@#$%^&*`).

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Angular 21 (Standalone Components) |
| UI Library | PrimeNG 21 + Bootstrap 5 |
| Icons | Font Awesome 6 |
| State Management | Angular Signals + TanStack Query v5 |
| Reactivity | RxJS 7.8 |
| Forms | Angular Reactive Forms only |
| HTTP | Angular HttpClient with functional interceptors |
| Routing | Angular Router with lazy loading |
| Styling | SCSS with 7-1 partial architecture |
| SSR | Angular SSR (Express) |
| Unique IDs | uuid v4 (client-side transaction IDs) |
| Build Tool | @angular/build (esbuild) |
| Testing | Vitest |

---

## Project Structure

```
src/
├── app/
│   ├── core/
│   │   ├── constants/          # App-wide constants (localStorage keys, regex)
│   │   ├── guards/             # authGuard, publicGuard
│   │   ├── interceptors/       # Auth token + global error handling
│   │   ├── layout/             # Shell layout: sidebar, navbar
│   │   ├── models/             # Typed route interfaces (AppRoute, AppRouteData)
│   │   ├── services/           # StorageService (SSR-safe localStorage wrapper)
│   │   └── utils/              # date.util, export-csv.util, extract-sidebar-items.util
│   ├── features/
│   │   ├── auth/               # Login page, auth facade, auth state, mock API
│   │   ├── dashboard/          # Customers list, customer detail, account card, mini statement
│   │   └── transactions/       # Transactions list, create transaction, validators
│   └── shared/
│       ├── components/         # FieldError, InfoGrid, Pagination
│       ├── directive/          # LoadingDirective (button spinner)
│       ├── pipes/              # TxAmountPipe, TxDatePipe, CompactNumberPipe
│       └── validation/         # passwordValidator
└── styles/
    ├── abstracts/              # Mixins, functions, breakpoints
    ├── base/                   # CSS reset
    ├── components/             # Global button, form, dialog, loading styles
    ├── themes/                 # PrimeNG dark theme overrides, CSS variables
    └── utilities/              # Display helpers
```

---

## Feature Checklist

### Layer 1 — Core Shell

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 1.1 | Login screen with email + password fields | ✅ | `/auth/login` |
| 1.2 | Email format validation | ✅ | `Validators.email` |
| 1.3 | Password validation (strength regex) | ✅ | Custom `passwordValidator` |
| 1.4 | Redirect to dashboard after login | ✅ | Navigates to `/dashboard` on success |
| 1.5 | Public route guard (no access to login if authenticated) | ✅ | `publicGuard` |
| 1.6 | Auth route guard (redirect to login if not authenticated) | ✅ | `authGuard` checks localStorage token |
| 1.7 | Customer list on dashboard | ✅ | Loads from `customers.json` |
| 1.8 | Select customer → view details | ✅ | Navigates to `/dashboard/customers/:cif` |
| 1.9 | Customer detail: personal information grid | ✅ | National ID, segment, email, phone |
| 1.10 | Customer detail: linked accounts list | ✅ | Filtered by `customerId` |
| 1.11 | Angular routing | ✅ | Lazy-loaded feature routes |
| 1.12 | Services for data loading | ✅ | `DashboardApiService`, `TransactionsApiService` |
| 1.13 | Interfaces / models | ✅ | `Customer`, `Account`, `Transaction`, `CustomerDetail` |
| 1.14 | Responsive layout | ✅ | Sidebar collapses to icon-only on mobile |

---

### Layer 2 — Transactions & Business Logic

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 2.1 | View transactions per selected account | ✅ | Filtered by `accountId` from state |
| 2.2 | Filter by date range | ✅ | `dateFrom` / `dateTo` in filter form |
| 2.3 | Filter by transaction type | ✅ | Debit / Credit dropdown |
| 2.4 | Filter by category | ✅ | Loaded from `transaction-categories.json` |
| 2.5 | Sort by date | ✅ | Toggle asc/desc on column header click |
| 2.6 | Sort by amount | ✅ | Toggle asc/desc on column header click |
| 2.7 | Create transaction — Reactive Form only | ✅ | No template-driven forms used anywhere |
| 2.8 | Transaction Type field (Debit/Credit) — required | ✅ | `p-select` with `Validators.required` |
| 2.9 | Amount — required, > 0, max 100,000, max 2 decimals | ✅ | `Validators.min(0.01)`, `Validators.max(100_000)`, `maxDecimalsValidator` |
| 2.10 | Date — required, must not be in the future | ✅ | Custom `futureDateValidator` |
| 2.11 | Merchant — required, 3–50 characters | ✅ | `minLength(3)`, `maxLength(50)` |
| 2.12 | Category — required dropdown | ✅ | Options loaded from `transaction-categories.json` |
| 2.13 | Business rule: debit must not exceed balance | ✅ | Cross-field `exceedsBalanceValidator` + facade check |
| 2.14 | Business rule: debit subtracts from balance | ✅ | `delta = -amount` applied via `updateAccountBalance` |
| 2.15 | Business rule: credit adds to balance | ✅ | `delta = +amount` applied via `updateAccountBalance` |
| 2.16 | Transaction ID generated client-side | ✅ | `TRN_${uuidv4()}` |
| 2.17 | Custom validators | ✅ | `futureDateValidator`, `maxDecimalsValidator`, `exceedsBalanceValidator` |
| 2.18 | Cross-field validation | ✅ | Amount validator reads account balance + type from parent form |
| 2.19 | Inline error messages | ✅ | `FieldErrorComponent` with merged default + custom messages |
| 2.20 | Transaction appears immediately in UI | ✅ | `state.addTransaction()` updates signal; UI reacts instantly |
| 2.21 | localStorage persistence (optional) | ⚠️ | Not implemented — state resets on page refresh (see Assumptions) |

---

### Layer 3 — Advanced Features & Architecture

| # | Requirement | Status | Notes |
|---|-------------|--------|-------|
| 3.1 | Mini statement (last 5 transactions per account) | ✅ | `MiniStatementComponent` on customer detail page |
| 3.2 | Export transactions to CSV | ✅ | `exportToCsv` util — exports filtered + sorted list |
| 3.3 | Monthly insights — total debit | ✅ | `monthlyDebit` computed signal in `TransactionsFacade` |
| 3.4 | Monthly insights — total credit | ✅ | `monthlyCredit` computed signal |
| 3.5 | Monthly insights — highest spending category | ✅ | `topCategory` computed signal — aggregates debit by category |
| 3.6 | Cache JSON data | ✅ | TanStack Query with `staleTime: 5 min` — no re-fetches while fresh |
| 3.7 | Maintain selected customer/account state | ✅ | Signal-based state persists across navigation within session |
| 3.8 | Avoid reloading JSON files | ✅ | `loadAll()` is a no-op if cache already populated; TanStack Query deduplicates |
| 3.9 | Pagination | ✅ | Custom `PaginationComponent` with page size selector (5/10/25) |
| 3.10 | Loading indicators | ✅ | Spinner on customers list, transactions list, and submit buttons |
| 3.11 | Error handling | ✅ | Global `errorHandlingInterceptor` shows PrimeNG toast; per-feature error states |

---

## Architecture Decisions

### Facade + State + API Pattern

Each feature follows a strict three-layer separation:

```
Component  →  Facade  →  State (Signals)
                    ↘  API Service (HTTP)
```

- **Facade** — the only public API for components; orchestrates API calls, state mutations, and business logic.
- **State** — holds all `signal()` primitives; exposes only `asReadonly()` to the facade.
- **API Service** — thin HTTP wrapper with no business logic.

This makes each layer independently testable and prevents components from ever mutating state directly.

### Angular Signals over RxJS Subjects for State

All local state (selected customer, filter, sort, pagination) is modelled with `signal()` and `computed()`. RxJS is used only where it belongs — HTTP streams, `takeUntilDestroyed`, and `forkJoin` for parallel requests.

### TanStack Query for Remote Data

JSON files are treated as remote data sources. TanStack Query provides:
- Automatic deduplication (only one HTTP request per query key)
- 5-minute stale window before background refetch
- Cache-level balance updates via `queryClient.setQueryData` when a transaction is created — no re-fetch needed.

### Typed Route Metadata

`AppRoute` extends Angular's `Route` with a typed `data` property (`AppRouteData`). The sidebar is built automatically by `extractSidebarItems()` which walks the route tree and collects every route where `data.sidebar === true`. Adding a new page to the sidebar requires only setting `data: { sidebar: true, label: '...', icon: '...' }` on the route — no other changes.

### SSR-Safe Storage

`StorageService` wraps `localStorage` with `isPlatformBrowser()` guards. All reads return `null` on the server and writes are silently skipped. This prevents `localStorage is not defined` crashes during SSR prerendering.

### Functional Interceptors

Both HTTP interceptors (`authInterceptor`, `errorHandlingInterceptor`) are written as standalone functional interceptors registered via `withInterceptors([...])`. No class-based interceptors are used.

---

## Validation Rules

### Login Form

| Field | Rules |
|-------|-------|
| Email | Required, valid email format |
| Password | Required, min 8 chars, at least 1 uppercase, 1 lowercase, 1 digit, 1 special character (`!@#$%^&*`) |

### Create Transaction Form

| Field | Rules |
|-------|-------|
| Type | Required |
| Amount | Required · Must be > 0 · Max 100,000 · Max 2 decimal places · Debit must not exceed account balance (cross-field) |
| Date | Required · Must not be in the future |
| Merchant | Required · Min 3 characters · Max 50 characters |
| Category | Required |

All errors display inline immediately on field touch via the reusable `FieldErrorComponent`. Error messages can be overridden per-field via the `messages` input.

---

## Business Rules

| Rule | Implementation |
|------|---------------|
| Debit cannot exceed account balance | Checked in both `exceedsBalanceValidator` (form level) and `TransactionsFacade.createTransaction` (service level — double guard) |
| Debit subtracts from balance | `delta = -amount` passed to `DashboardFacade.updateAccountBalance` |
| Credit adds to balance | `delta = +amount` passed to `DashboardFacade.updateAccountBalance` |
| Balance update is reflected immediately | `queryClient.setQueryData` patches both `['accounts']` and `['customerDetail', cif]` cache entries without a network call |
| Transaction ID is client-generated | Format: `TRN_<uuid-v4>` |
| New transaction appears instantly | `TransactionsState.addTransaction` prepends to the signal array; all `computed()` signals recompute synchronously |

---

## Assumptions

1. **Authentication is mocked** — a real JWT is not issued; a `uuid` token is stored in `localStorage` as a session identifier. The auth interceptor attaches it as a `Bearer` token header on all requests (harmless with static JSON files).

2. **No localStorage persistence for transactions** — the task marks this optional. Transactions created during a session are held in-memory (Angular Signals state) and reset on page refresh. This was omitted in favour of demonstrating clean signal-based reactivity. Adding it would require one `StorageService.set` call in `TransactionsState.addTransaction` and a `loadAll` fallback check.

3. **Monthly insights use the current calendar month** — insights on the transactions page show debit total, credit total, and top spending category for the current month only. Because the bundled mock data is dated December 2025, the insights panel will show zero until a new transaction is created (or the mock dates are updated). This is expected behaviour given static fixtures.

4. **Transaction T9101 uses `accountId: A2001`** — this ID does not exist in `accounts.json`. The transaction is intentionally excluded from all account views as a result. A real backend would enforce referential integrity.

5. **Mona Hassan (CIF: C002) has no accounts** — the mock `accounts.json` contains only accounts for Ahmed Ali (C001). Mona's detail page renders the empty-accounts state by design.

6. **No "New Customer" flow** — the button exists in the header as a UI placeholder per the spec but is not wired to a form (customer creation was not listed as a task requirement).

7. **Balance updates are session-only** — balance changes persist in TanStack Query's in-memory cache for the session. Refreshing the page resets balances to the original JSON values.

8. **SSR render mode is Client** — all routes are set to `RenderMode.Client` in `app.routes.server.ts`. SSR infrastructure (Express server, `@angular/ssr`) is scaffolded and ready but the app runs as a standard SPA. This was chosen to avoid SSR hydration issues with PrimeNG overlays during the assessment.

9. **The sidebar auto-builds from route metadata** — any route with `data: { sidebar: true }` is automatically included in the sidebar. No manual sidebar array to maintain.

---

## Known Limitations

- Transaction data does not persist across browser sessions (localStorage persistence not implemented — marked optional in spec).
- Monthly insights show zero with the default mock data because all fixture transactions are dated 2025-12-xx and the current date is in 2026. Create a new transaction to populate them.
- The "New Customer" button is a UI placeholder with no backing form.
