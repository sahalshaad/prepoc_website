# PREPOC Technologies

A premium digital agency website built with Next.js 15, TypeScript, Tailwind CSS, GSAP, Framer Motion, and Lenis.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Animations**: Framer Motion + GSAP + Lenis smooth scroll
- **UI Components**: Radix UI (Shadcn UI compatible)
- **Icons**: Lucide React
- **Fonts**: Sora (headings) + Inter (body)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts, SEO, providers
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles + design tokens
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx      # Sticky navigation
│   │   └── Footer.tsx      # Footer with links
│   ├── sections/
│   │   ├── Hero.tsx        # Full-viewport hero
│   │   ├── Services.tsx    # Services grid (10 services)
│   │   ├── About.tsx       # About + stats counters
│   │   ├── Process.tsx     # 5-step process
│   │   ├── Portfolio.tsx   # Case studies
│   │   ├── Technologies.tsx # Tech marquee
│   │   ├── Testimonials.tsx # Client reviews
│   │   └── CTA.tsx         # Contact CTA
│   └── common/
│       ├── CustomCursor.tsx  # Magnetic cursor
│       ├── SmoothScroll.tsx  # Lenis provider
│       └── AnimatedText.tsx  # Scroll-reveal text
├── hooks/
│   └── useMousePosition.ts
├── lib/
│   └── utils.ts            # cn() utility
└── types/
    └── index.ts
```

## Color System

| Token | Value | Usage |
|-------|-------|-------|
| Primary | `#0E5D47` | Brand green, CTAs |
| Accent | `#D4AF37` | Gold highlights |
| Dark | `#0B0B0B` | Near-black |
| Background | `#050505` | Page background |
| Text | `#F8F8F8` | Primary text |

## Sections

1. **Hero** — Full-viewport with gradient orbs, animated headline, service marquee
2. **Services** — 10 service cards in responsive grid
3. **About** — Stats counters + brand story
4. **Process** — 5-step methodology
5. **Portfolio** — 3 case studies with hover reveals
6. **Technologies** — Dual marquee tech stack + client logos
7. **Testimonials** — 4 client reviews
8. **CTA** — Contact section with glass card
9. **Footer** — Full links + newsletter + social
