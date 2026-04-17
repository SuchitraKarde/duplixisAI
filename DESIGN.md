# Design Brief: Multilingual Duplicate Record Detection

## Tone & Aesthetic
Modern tech + AI sophistication. Glassmorphism with soft blue/purple gradients. Approachable clarity for productivity workflows.

## Color Palette (OKLCH)

| Role | Light Mode | Dark Mode | Usage |
|------|-----------|----------|-------|
| Primary | `0.48 0.28 265` (Deep Blue) | `0.68 0.22 280` (Bright Blue) | CTAs, Links, Active States |
| Secondary | `0.93 0.08 260` (Pale Blue) | `0.20 0.04 260` (Dark Blue) | Card Backgrounds, Hover States |
| Accent | `0.58 0.22 290` (Vibrant Purple) | `0.72 0.20 290` (Bright Purple) | Highlights, Success Indicators |
| Success | `0.62 0.24 135` (Green) | `0.62 0.24 135` (Green) | High Similarity (85%+) |
| Warning | `Yellow 0.68` (Warm) | `Yellow 0.68` (Warm) | Medium Similarity (50-84%) |
| Destructive | `0.58 0.25 25` (Red) | `0.65 0.22 25` (Red) | Low Similarity (<50%) |

## Typography
- **Display**: General Sans (bold headers, CTAs, hero text)
- **Body**: DM Sans (content, labels, descriptions)
- **Mono**: Geist Mono (code, similarity scores, technical data)

## Structural Zones

| Zone | Light Mode | Dark Mode | Treatment |
|------|-----------|----------|-----------|
| Header | Glassmorphic with blur, semi-transparent | Glassmorphic with darker blur | `glass-card` utility, sticky top, subtle border-b |
| Hero | Gradient accent line + clear typography | Same with inverted gradient | `gradient-ai` overlay, fade-in-up animation |
| Content Cards | Frosted glass with `glass-card-hover` | Darker frosted glass, higher contrast | Hover lift (-translate-y-1), shadow-glass |
| Results List | Alternating card backgrounds | Same with elevated depth | Color-coded similarity badges (high/med/low) |
| Footer | Minimal, subtle elevation | Same with reduced opacity | Border-t, muted background |

## Component Patterns
- **Card**: `.glass-card` + hover state → `.glass-card-hover` (lift + shadow)
- **Button**: `.btn-primary` (gradient) | `.btn-secondary` (glass outline)
- **Similarity Badge**: `.similarity-high` (green) | `.similarity-medium` (yellow) | `.similarity-low` (red)
- **Forms**: Glass-styled inputs with `input` token, smooth focus ring in `primary`

## Motion & Transitions
- **Default**: `--transition-glass` (0.35s cubic-bezier for smooth spring feel)
- **Entrance**: `.fade-in-up` (0.6s ease-out on page load)
- **Floating**: `.animate-float` (subtle vertical drift, 3s)
- **Glow**: `.animate-pulse-glow` (for active processing state)
- **Hover**: `hover:-translate-y-0.5` + `hover:shadow-lg` on all interactive elements

## Spacing & Rhythm
- Grid: 4px base unit
- Card padding: `2rem` (outer spacing), `1.5rem` (inner content)
- Section spacing: `6rem` vertical, `2rem` horizontal gutters
- Responsive breakpoints: sm (640px), md (768px), lg (1024px)

## Signature Detail
Glassmorphism cards with **dual-layer depth**: semi-transparent frosted glass background + backdrop blur + subtle colored border. On hover, cards lift with spring animation + elevated shadow. Success indicators use vibrant green with soft background wash. Similarity scores animate in with `.fade-in-up`.

## Constraints
- No generic AI purple everywhere — use palette intentionally
- All interactive elements must have clear hover/focus states
- Dark mode is not inverted; colors tuned for readability + mood
- Animations are smooth spring curves, never jarring eases
- Glassmorphism only on cards/overlays, not full-page backgrounds

