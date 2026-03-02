# KodNest Premium Build System

A premium SaaS design system. Calm, intentional, coherent, confident.

---

## Design Philosophy

- **Calm** — No animation noise, no flashy effects
- **Intentional** — Every decision has purpose
- **Coherent** — One visual language throughout
- **Confident** — Generous spacing, clear hierarchy

Not flashy. Not loud. Not playful. Not hackathon-style.

---

## Color System

| Token | Value | Use |
|-------|-------|-----|
| Background | `#F7F6F3` | Page background |
| Primary text | `#111111` | Body copy |
| Accent | `#8B0000` | Primary actions, links |
| Success | `#4A6B4A` | Positive states |
| Warning | `#8B6914` | Caution states |

Maximum 4 colors. No gradients. No glassmorphism. No neon.

---

## Typography

- **Headings**: Lora (serif) — large, confident, generous spacing
- **Body**: Inter (sans-serif) — 16–18px, line-height 1.6–1.8
- **Max text width**: 720px for readability

---

## Spacing Scale

Strict scale. No random values.

| Token | Value |
|-------|-------|
| space-1 | 8px |
| space-2 | 16px |
| space-3 | 24px |
| space-4 | 40px |
| space-5 | 64px |

---

## Layout Structure

Every page follows:

1. **Top Bar** — Project name | Step X / Y | Status badge
2. **Context Header** — Large headline, 1-line subtext
3. **Primary Workspace** (70%) — Main interaction area
4. **Secondary Panel** (30%) — Step explanation, prompt box, actions
5. **Proof Footer** — Checklist: UI Built, Logic Working, Test Passed, Deployed

---

## Components

- **Primary button**: Solid deep red (`#8B0000`)
- **Secondary button**: Outlined, transparent
- **Inputs**: Clean borders, no heavy shadows, clear focus state
- **Cards**: Subtle border, no drop shadows, balanced padding

Transitions: 150–200ms, ease-in-out. No bounce. No parallax.

---

## Error & Empty States

- **Errors**: Explain what went wrong + how to fix. Never blame the user.
- **Empty states**: Provide next action. Never feel dead.

---

## File Structure

```
src/
├── components/
│   ├── layout/     — TopBar, ContextHeader, Workspace, Panel, ProofFooter, PageLayout
│   └── ui/         — Button, Input, Card, Badge, EmptyState, ErrorState
├── styles/
│   ├── tokens.css  — Design tokens
│   ├── base.css    — Reset and foundations
│   └── components.css — Component styles
```
