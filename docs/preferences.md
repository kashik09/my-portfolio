# Preferences and Theming

## Model

The preferences model lives in `lib/preferences` and is stored in localStorage under `site-preferences-v1`.

- mode: `formal` or `vibey`
- theme: `system`, `light`, or `dark`
- vibeyTheme: `grape`, `ocean`, `peach`, or `neon` (used only when mode is `vibey`)

Defaults are defined in `lib/preferences/types.ts` as `DEFAULT_PREFERENCES`.

## Data attributes contract

The client gate applies resolved attributes on `<html>`:

- `data-mode="formal|vibey"`
- `data-theme="light|dark"` (resolved when theme is `system`)
- `data-vibey="grape|ocean|peach|neon"` only when mode is `vibey`

If mode is `formal`, the gate removes `data-vibey`.


## Token variables

Token variables are defined in `app/globals.css`:

- Neutrals from `data-theme`: `--bg`, `--surface`, `--border`, `--text`, `--muted`
- Accents from `data-mode` and `data-vibey`: `--primary`, `--primary2`, `--ring`

Utility helpers are also defined for shared components:

- `bg-app`, `surface-app`, `border-app`
- `text-app`, `text-muted-app`, `accent`, `accent-2`
- `bg-accent`, `bg-accent-soft`, `border-accent`, `ring-app`

## Adding future themes

To add a new vibey theme:

1) Extend `VibeyTheme` and `DEFAULT_PREFERENCES` in `lib/preferences/types.ts`.
2) Update validation in `lib/preferences/storage.ts`.
3) Add the new selectors to `app/globals.css` for both light and dark.
4) Add a button in `components/preferences/PreferencesPanel.tsx`.

To add new neutral themes beyond light or dark, update the `data-theme` selectors and the logic in `components/preferences/PreferencesGate.tsx` that resolves system theme.
