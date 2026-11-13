# @arorms/ui

The arorms design system — "Calm Operator": tokens, primitives, page patterns and the app shell.
Depends on [`@arorms/core`](https://www.npmjs.com/package/@arorms/core) for runtime behaviour; the
reverse dependency never exists.

## Install

```bash
pnpm add @arorms/ui @arorms/core
```

Peer dependencies: `react`, `react-dom` 19, `react-router-dom` 7, `lucide-react`, `tailwindcss` 4.

The package ships **TypeScript source** (`exports` points at `src`, no build step). Your
bundler/TS must compile `.ts`/`.tsx` directly — Vite 8 is tested; webpack/Next.js may fail on
`.ts`-extension imports and `allowImportingTsExtensions`.

## Use

`styles/index.css` — exactly two lines, in this order:

```css
@import "tailwindcss";
@import "@arorms/ui/theme.css";
```

`theme.css` redefines Tailwind's own token names (`bg-card`, `text-muted-foreground`,
`rounded-lg`, `shadow-sm`, …). It also carries `@source "./"`, so Tailwind scans this package's
components without a `node_modules` path in your config. Do not import `tailwindcss` inside it.

Components live in `src/components` (primitives + patterns), `src/layout` (app shell, auth pages).
`UiLabelsProvider` injects the consumer's translated strings (close/cancel/loading/pagination), so
this package never guesses a translation key.

## What is in here

| Area | Components |
| --- | --- |
| Surfaces | `Card`, `InsetPanel`, `SectionCard`, `SectionHeader`, `ItemCard`, `StatCard` |
| Page framing | `PageHeader`, `DetailHeader`, `FilterBar`, `DescriptionList` |
| Actions | `Button`, `IconButton` |
| Forms | `Field`, `Input`, `Select`, `Textarea`, `Checkbox`, `SearchInput` |
| Selection | `Chip`, `ChipGroup`, `ChipToggleGroup`, `Tag`, `Segmented` |
| Lists | `DataTable`, `DataTableRow`, `Pagination` |
| States | `Spinner`, `Skeleton*`, `Empty`, `EmptyState`, `ErrorState`, `Avatar` |
| Overlays | `Modal`, `ConfirmDialog`, `ToastProvider`, `useToast` |
| Chrome | `AppShell`, `Sidebar`, `Header`, `SettingsMenu`, `ThemeSwitcher`, `LanguageSwitcher`, `ProtectedRoute`, `LoginPage`, `CallbackPage` |

## Rules

- Component defaults stay overridable via `className` (`cn(defaults, className)`).
- Only Tailwind's token names, redefined by value. Token names are frozen from `0.1.0`.
- No business content, no translation dictionaries, no `import.meta.env`.

```bash
pnpm typecheck
pnpm check:hardcoded
```

Design contract: `docs/design-system.md`. Authoring rules: `docs/conventions.md`.
Release process: `docs/releasing.md`.
