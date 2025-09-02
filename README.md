## Nightfall — a sleek time dashboard

Dark, elegant, and animated. Features a rich clock with multiple styles, live weather, and rotating facts fetched with React Query.

### Features
- **Clock styles**: analog, digital, neon, gothic (animated with framer-motion)
- **Theme system**: custom themes via `next-themes` with a `ThemeSwitcher`
- **Weather widget**: location-aware mock data with interactive refresh and quick city input
- **Facts carousel**: fetches multiple facts with **@tanstack/react-query**, auto-rotates, manual controls, and hourly refresh
- **React Query Devtools**: toggleable devtools baked in (bottom-right)

### Tech stack
- **Next.js App Router** + TypeScript
- **Tailwind CSS**
- **Framer Motion** animations
- **@tanstack/react-query** + devtools
- **next-themes** for theme switching
- **Bun** for fast dev/install

### Quick start
```bash
# install deps
bun install

# run dev
bun dev

# build & start
bun run build
bun run start
```

Open `http://localhost:3000`.

### Project layout
```
app/
  layout.tsx          # wraps with AppProviders (Theme + React Query)
  page.tsx            # renders Layout (Nightfall dashboard)
components/
  layout/clock/
    Layout.tsx        # main page content (export { Layout })
    components/
      ClockFaces.tsx  # all clock renderers + moonphase UI
      ClockStyleSelector.tsx
  layout/other/
    FactOfTheDay.tsx  # React Query facts carousel
    TimezoneSelector.tsx
    Moonphase.tsx
    root/ThemeSwitcher.tsx
  cards/Weather.tsx    # Weather widget
  others/AppProviders.tsx
  others/ReactQueryProvider.tsx
  static/Footer.tsx
```

### Environment
No API keys required. Facts use `https://uselessfacts.jsph.pl` (no auth). Weather uses mock data plus browser geolocation when available.

### Scripts
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

### Notes
- The React Query Devtools button appears at the bottom-right.
- To change default theme or available themes, edit `components/others/ThemeProvider.tsx`.
- To tweak fact frequency or count, see `FactOfTheDay.tsx` (`factsToShow`, auto-rotate interval, `refetchInterval`).

### License
MIT
