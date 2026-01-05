# Areeb Ehsan — Portfolio

A production-style personal portfolio built with **Next.js App Router**, **TypeScript**, **Tailwind CSS v4**, **Framer Motion**, and the **GitHub API**. It aims to feel like an "engineer with taste": dark, glassy, animated, and fast.

## Tech stack

- Next.js (App Router, TypeScript)
- Tailwind CSS v4 (via `@tailwindcss/postcss`)
- Framer Motion
- `next/image`
- `lucide-react` icons
- Optional analytics via `@vercel/analytics` (or Plausible with a small change)
- Optional MDX support for future case studies/blog posts

---

## Getting started

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
```

Then open `http://localhost:3000` in your browser.

---

## Deploying to Vercel

1. Push this project to a GitHub repository.
2. Go to Vercel and import the repo.
3. Use the default Next.js settings.
4. Once deployed, update `siteConfig.url` (see below) to your production URL and redeploy.

If you want Vercel Analytics, keep `analytics.provider` set to `"vercel"` (default). Otherwise, set it to `"none"`.

---

## Content editing guide (single source of truth)

All editable content lives in the `content/` directory. You generally don&apos;t need to touch the React components unless you want to change structure or layout.

### 1. Site-wide config — `content/siteConfig.ts`

- `name`: Site title used in the `<title>` tag and OpenGraph.
- `description`: Default SEO description.
- `url`: Set this to your production URL (e.g., `https://areeb.dev`).
- `ogImage`: Path to the OpenGraph image (e.g., `/og.png`).
- `analytics`:
  - `provider`: `"none" | "vercel" | "plausible"` (only `"vercel"` is wired in by default).
  - `plausibleDomain`: Used if you wire in Plausible manually.
- `nav`: Controls the nav labels and the sections used by the sticky header + command palette.

### 2. Profile / hero / socials — `content/profile.ts`

Key fields:

- `name`: Your name.
- `headline`: Short, punchy description that pairs with your name.
- `roles`: Rotating roles shown in the hero (e.g., `"Full-Stack Engineer"`, `"AI/ML"`).
- `subheadline`: 1–2 lines under the hero, describing your focus.
- `location`: Optional location string.
- `quickFacts`: Cards for education, GPA, graduation, interests, etc.
- `now`: Text used in the hero side card and the "Now" section.
- `resumeUrl`: Link to your resume (e.g., `/files/areeb-ehsan-resume.pdf` — put the file under `public/files`).
- `social`: Update the `linkedin` and `email` URLs to your actual profile and email address.

### 3. Skills — `content/skills.ts`

- `skillFilters`: The categories for the filter chips (e.g., `AI / ML`, `Full Stack`).
- `skillGroups`: Groups by `Languages`, `Frameworks`, `Libraries`, `Tools`.
  - Each skill includes `name`, optional `level`, and `tags` to link it to a filter.

Updating this file automatically updates the **Skills** section, including the interactive filter.

### 4. Featured projects — `content/featuredProjects.ts`

This file lets you manually pin, describe, and reorder projects while still merging in live data from GitHub.

For each `FeaturedProjectOverride`:

- `slug`: Stable identifier used for keys and Framer Motion layout IDs.
- `title`: Display name.
- `repo`: GitHub repo in `"owner/name"` format (e.g., `"AreebEhsan/research-assistant-extension"`).
- `priority`: Lower numbers appear earlier in the grid.
- `problem`, `solution`, `impact`: Narrative used in the project modal.
- `techStack`: Array of strings shown as chips.
- `screenshots`: Optional images (add files under `public/images/projects`).

The app:

1. Fetches all public repos for `AreebEhsan` using the GitHub API.
2. Merges them with manual overrides from `featuredProjects.ts`.
3. Fills remaining slots (up to 8) with the most interesting repos based on stars and recency.

If you rename a repo or add new ones, just update the `repo` field here.

### 5. Experience & education — `content/experience.ts`

- `timeline`: Controls the vertical timeline in the Experience section.
  - Each item has `title`, `organization`, `start`, `end`, `type`, and `highlights`.
- This is where you add internships, research roles, or additional programs.

### 6. Achievements — `content/achievements.ts`

- `achievements`: Cards in the Accomplishments section.
- Add, remove, or rename awards as needed.

---

## GitHub integration

The portfolio pulls public repos for `github.com/AreebEhsan` using server-side `fetch` with **incremental revalidation** (~6 hours):

- Logic lives in `lib/github.ts` and `lib/projects.ts`.
- No GitHub token is required, but you can set `GITHUB_TOKEN` in your environment for higher rate limits.

If the API call fails, the page will gracefully render without project stats.

---

## Motion & interaction system

Framer Motion is used heavily but carefully:

- Central variants in `components/motion/variants.ts` (e.g., `fadeInUp`, `staggerContainer`).
- Section components (`Hero`, `About`, `Skills`, `Projects`, `Experience`, `NowSection`, `Contact`) use these variants for consistent, performant animations.
- The Projects grid uses `AnimatePresence` and `layoutId` for a smooth project detail modal.

If you want to tone down motion for accessibility, you can add a `prefers-reduced-motion` check and conditionally disable animations.

---

## Structure overview

- `app/layout.tsx` — Root layout, metadata, sticky nav, command palette, analytics shell.
- `app/page.tsx` — Home page; fetches GitHub data and composes all sections.
- `components/layout/*` — NavBar, CommandPalette (Cmd/Ctrl+K), AnalyticsShell.
- `components/sections/*` — Hero, About, Skills, Projects, Experience, NowSection, Contact.
- `components/motion/variants.ts` — Shared Framer Motion variants.
- `content/*` — All editable content for the site.
- `lib/github.ts` — GitHub fetch + normalization.
- `lib/projects.ts` — Merge GitHub data with manual featured projects.
- `lib/utils.ts` — Small utilities like `cn` and `formatDate`.

---

## Customizing the design

Most of the visual language is controlled by:

- `app/globals.css` — gradient mesh background, glass panels, chips, badges.
- Tailwind utility classes inside components.

You can tweak colors, radii, and shadows via CSS variables at the top of `globals.css`.
