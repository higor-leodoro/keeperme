# KeeperMe · Design System

> **v2.0** — Direction: _Premium Digital Instrument_. Dark-first, glassmorphic, technical, editorial-tech.
>
> This is the single source of truth for KeeperMe's visual language. Use this document as context in v0, Claude Code, Cursor, or any AI coding assistant. Paste the relevant sections at the top of your prompts.

---

## 1. Philosophy

### Positioning

KeeperMe is a **premium-exclusive personal finance app**. The brand philosophy is Apple-like: the logo and the execution speak for themselves. Nothing shouts, nothing performs, nothing demands attention.

But unlike pure editorial minimalism (which feels like paper), KeeperMe is a **digital instrument** — a living, intelligent, technical tool. Think Apple Pro apps, Linear, Arc Browser, Blackmagic Design. Premium tech with presence, not silent editorial.

### Target user

People who care about design, recognize good typography, value silent tools. Deliberately not a mass-market app. Users should feel like they're using a crafted instrument, not a consumer app.

### Key differentiator

A conversational AI assistant (OpenAI-powered) that creates transactions automatically when the user describes spending in natural language. Chat is a **first-class feature**, not periphery. Users can also manage shared group expenses (travel, roommates, couples).

### Future

A B2B enterprise dashboard (KeeperMe Business) is planned. The visual language must scale from intimate mobile to corporate desktop without redesign. Glassmorphism and ornamental details should be reducible for enterprise contexts without breaking the identity.

### The 5 non-negotiable principles

1. **Less is radically more.** If in doubt whether an element is needed, remove it. Premium is defined by what you removed, not what you added.

2. **Materiality is a signal, not decoration.** Glassmorphism, blur, and translucent surfaces are used deliberately to create depth hierarchy. Never for visual excitement alone. The logo (metallic orbital) sets the material language; the app echoes it subtly.

3. **Typography is voice.** Two-voice system: humanist display (Bricolage Grotesque) for emotional/identity moments, monospace (JetBrains Mono) for technical/instrumental moments. The contrast between these two is the brand's typographic signature.

4. **Technical microcopy.** Labels use language that suggests a real system running behind the UI: "sincronizado", "sinal · modelo local", "live", "TX", timestamps. Never consumer-friendly fluff.

5. **Atmosphere over flatness.** The background is never a solid color. Always has atmospheric gradients (radial, asymmetric, multi-colored tints) and a subtle grain overlay. This is what separates "instrument" from "paper".

### Forbidden patterns

Explicit prohibitions. Violations break the aesthetic immediately:

- Green for income, red for expense (bank-generic)
- Gradients from gray to darker gray on cards (AI-slop tell)
- Color on category icons (they are monochromatic off-white always)
- Filled/solid icons (always outline)
- Shadows on regular cards in dark mode (elevation is communicated by luminosity, not shadow)
- Bounce, parallax, confetti, counting-up number animations
- "Welcome Back!" greetings with exclamation marks (too enthusiastic, breaks premium silence)
- Inter font anywhere
- Space Grotesk anywhere (overused by AI generators)
- Title Case on labels (only sentence case; ALL CAPS only in caption tokens with letter-spacing)
- Border-radius zero (we are not industrial brutalist)
- Icons above 1.5px stroke-width
- Generic `inset 0 1px 0 rgba(255,255,255,0.1)` highlights on glass surfaces (cliché AI pattern — use radial asymmetric glows instead)

---

## 2. Color

**Theme: dark mode only.** No light mode planned.

### Background atmosphere (required on main screens)

Main screens (Home, Chat, Extrato) MUST have a layered atmospheric background. Not solid black.

```css
/* Three-layer radial gradient mesh, asymmetric */
background-color: #060608;
background-image:
  radial-gradient(
    ellipse 60% 40% at 20% 0%,
    rgba(120, 130, 160, 0.12),
    transparent 60%
  ),
  radial-gradient(
    ellipse 80% 50% at 80% 30%,
    rgba(180, 160, 120, 0.05),
    transparent 55%
  ),
  radial-gradient(
    ellipse 50% 60% at 50% 100%,
    rgba(80, 90, 110, 0.08),
    transparent 60%
  );

/* Grain overlay — inline SVG noise filter, 4% opacity, mix-blend-mode: overlay */
```

The three tints are intentional:

- **Top-left** cool blue — sky, cold metal
- **Mid-right** warm amber — whisky glass, brass
- **Bottom-center** cool blue — depth, ambient

This creates a subtle cinematic atmosphere, not a flat background.

Secondary screens (forms, detail views) can use a simpler single-tint background.

### Core tokens

```css
:root {
  /* Background hierarchy (luminosity-based, not shadow-based) */
  --bg-base: #06060a;
  --bg-elevated: #0f1114; /* cards, inputs */
  --bg-elevated-2: #12151a; /* modals, bottom sheets, icon containers */
  --bg-elevated-3: #1a1d23; /* hover / selected state */

  /* Glass surfaces (used instead of --bg-elevated for premium cards) */
  --glass-light: linear-gradient(
    165deg,
    rgba(255, 255, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.025) 40%,
    rgba(255, 255, 255, 0.01) 100%
  );
  --glass-subtle: rgba(255, 255, 255, 0.025);
  --glass-input: rgba(255, 255, 255, 0.04);

  /* Text (off-white with intentional warmth) */
  --text-primary: #f5f0e8;
  --text-secondary: rgba(245, 240, 232, 0.55);
  --text-hint: rgba(245, 240, 232, 0.38);
  --text-mute: rgba(245, 240, 232, 0.28);

  /* Borders — always 1px, never 2px+ */
  --border-subtle: rgba(245, 240, 232, 0.06);
  --border-default: rgba(245, 240, 232, 0.08);
  --border-strong: rgba(245, 240, 232, 0.14);

  /* Accent */
  --accent: #f5f0e8; /* Intentionally same as --text-primary. Monochromatic. */

  /* Accent highlight (amber, for insight emphasis only) */
  --accent-highlight: #e8d4a8;

  /* Semantic — ONLY for state feedback, never decorative */
  --positive: #a8d4ba; /* income deltas, success states. NEVER on transaction rows. */
  --negative: #d99a9a; /* only for error states on inputs */
  --warning: #e8c67a; /* preventive warnings only */
}
```

### Glass card recipe

When a card should "feel premium" (Home balance hero, AI insight, modal surfaces), use the glass recipe:

```css
.glass-card {
  background: var(--glass-light);
  backdrop-filter: blur(24px) saturate(1.2);
  -webkit-backdrop-filter: blur(24px) saturate(1.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 20px 60px rgba(0, 0, 0, 0.45);
  position: relative;
  overflow: hidden;
}

/* Asymmetric ambient glow — NOT a linear highlight */
.glass-card::before {
  content: "";
  position: absolute;
  top: -40%;
  left: -20%; /* or right: -20% for opposite side */
  width: 70%;
  height: 120%;
  background: radial-gradient(
    ellipse at center,
    rgba(200, 210, 230, 0.08),
    transparent 55%
  );
  pointer-events: none;
}
```

The **asymmetric radial glow** is the key anti-AI-slop trick. Every glass card should have one, positioned differently per card to avoid visual repetition.

### Tints per surface

Each major glass card can carry a **subtle tint** in its ambient glow:

- **Balance hero** → cool blue tint (rgba(200, 210, 230, 0.08))
- **AI insight** → warm amber tint (rgba(200, 170, 110, 0.12))
- **Other premium cards** → neutral (white at very low opacity)

This creates unconscious color-coding without breaking monochromatism.

---

## 3. Typography

### Three voices, three fonts

| Role           | Font                           | Weights            | When to use                                                                                                           |
| -------------- | ------------------------------ | ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| **Display**    | Bricolage Grotesque (variable) | 300, 400, 500, 600 | Identity moments: balance number, user name, insight body, category name, card titles                                 |
| **Technical**  | JetBrains Mono                 | 300, 400, 500      | Instrumental signals: micro-labels, timestamps, status indicators, numeric metadata ("8 TX", "30D"), eyebrows         |
| **Functional** | Geist                          | 300, 400, 500      | Supporting text: paragraph body, forecast captions, input placeholder (rarely used — display font handles most cases) |

Load via Google Fonts:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,500;12..96,600&family=JetBrains+Mono:wght@300;400;500&family=Geist:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

### The two-voice principle

Bricolage and JetBrains Mono are **always in conversation**. A typical Home screen has:

- Greeting eyebrow in **Mono** → "BOA NOITE · 23:04" (timestamp makes it feel live)
- Greeting name in **Bricolage** → "Higor" (warm, identity)
- Balance label in **Mono** → "SALDO · SINCRONIZADO" (technical signal)
- Balance value in **Bricolage** → "R$ 12.450,80" (emotional, editorial)

This rhythmic alternation is the brand's typographic signature. Never collapse both into one voice.

### Type scale

Exact values. No improvising.

| Token        | Size | Weight | Font           | Line-height | Letter-spacing | Use                                                 |
| ------------ | ---- | ------ | -------------- | ----------- | -------------- | --------------------------------------------------- |
| `hero-xl`    | 58px | 500    | Bricolage      | 1.0         | -0.055em       | Main balance                                        |
| `hero-lg`    | 40px | 500    | Bricolage      | 1.05        | -0.04em        | Large screen titles                                 |
| `hero-md`    | 26px | 500    | Bricolage      | 1.1         | -0.035em       | User name, screen title                             |
| `hero-sm`    | 20px | 500    | Bricolage      | 1.2         | -0.03em        | Subtitles                                           |
| `body-lg`    | 17px | 400    | Bricolage      | 1.4         | -0.022em       | Insight body, prominent copy                        |
| `body-md`    | 15px | 400    | Bricolage      | 1.45        | -0.018em       | Main interactive text (input, button)               |
| `body-sm`    | 14px | 500    | Bricolage      | 1.5         | -0.015em       | Category names, list labels                         |
| `mono-lg`    | 13px | 400    | JetBrains Mono | 1.4         | 0              | Timestamps, inline technical                        |
| `mono-sm`    | 11px | 400    | JetBrains Mono | 1.3         | 0              | Metadata ("8 TX")                                   |
| `caption`    | 10px | 400    | JetBrains Mono | 1.3         | 0.2em          | UPPERCASE micro-labels ("SALDO", "ENTRADAS")        |
| `caption-xs` | 9px  | 500    | JetBrains Mono | 1.2         | 0.18em         | UPPERCASE tiny labels, period buttons ("7D", "30D") |

### Numbers: tabular always

Financial numbers MUST use `font-variant-numeric: tabular-nums` and `font-feature-settings: "tnum"`. Digits align vertically in lists. This is the detail that separates a finance app from a consumer app.

### Number rendering for currency

Currency values use a tripartite rendering:

```html
<span class="balance">
  <span class="currency">R$</span>12.450<span class="cents">,80</span>
</span>
```

```css
.balance {
  font-family: "Bricolage Grotesque";
  font-size: 58px;
  font-weight: 500;
  letter-spacing: -0.055em;
  font-variant-numeric: tabular-nums;
  color: var(--text-primary);
}
.balance .currency {
  font-family: "JetBrains Mono";
  font-size: 18px;
  font-weight: 400;
  color: var(--text-secondary);
  letter-spacing: 0;
  vertical-align: 17px;
  margin-right: 4px;
}
.balance .cents {
  font-family: "Bricolage Grotesque";
  font-size: 22px;
  font-weight: 400;
  color: var(--text-mute);
  letter-spacing: -0.02em;
  vertical-align: 14px;
}
```

The "R$" in monospace at smaller size is a deliberate two-voice moment. The cents are visually downgraded because they are financially insignificant; the main number commands the visual weight.

---

## 4. Spacing

**Base: 4px.** But we deliberately break the scale at specific moments for rhythm (22px, 26px). These are intentional, not arbitrary — they appear in premium apps and create distinctiveness.

### Standard scale

| Token      | Value | Use                                                                                |
| ---------- | ----- | ---------------------------------------------------------------------------------- |
| `space-1`  | 4px   | Minimum gap (icon-to-text contact)                                                 |
| `space-2`  | 8px   | Small gap (chip internal, tight stack)                                             |
| `space-3`  | 12px  | List item density                                                                  |
| `space-4`  | 16px  | Standard card internal padding                                                     |
| `space-5`  | 20px  | Glass card internal padding                                                        |
| `space-6`  | 22px  | **Non-standard** — glass card horizontal padding (breaks the 4px scale on purpose) |
| `space-7`  | 24px  | Screen edge padding, section gaps                                                  |
| `space-8`  | 32px  | Section separation                                                                 |
| `space-9`  | 48px  | Major section separation                                                           |
| `space-10` | 64px  | Dramatic separation (header → content)                                             |

### Edge padding

Screen horizontal padding: **22px** (not 24). This is deliberate — combined with cards that use `margin: 0 -6px`, the glass cards "overshoot" the edge padding by 4-6px, creating subtle asymmetry that distinguishes us from grid-rigid apps.

### Component heights

- **Button (primary CTA):** 56px
- **Button (secondary):** 48px
- **Input:** 48px
- **Tab bar pill:** 48px
- **List item min:** 56px
- **Bottom sheet handle:** 40x4px pill

---

## 5. Shape

### Border-radius

| Token         | Value | Use                                                        |
| ------------- | ----- | ---------------------------------------------------------- |
| `radius-xs`   | 6px   | Tiny badges, inline chips                                  |
| `radius-sm`   | 10px  | Inputs, small buttons, icon containers                     |
| `radius-md`   | 12px  | Standard buttons                                           |
| `radius-lg`   | 22px  | **Non-standard** — premium glass cards (insight, flow bar) |
| `radius-xl`   | 26px  | **Non-standard** — hero glass cards (balance)              |
| `radius-2xl`  | 28px  | Bottom sheets (top corners only)                           |
| `radius-full` | 999px | Pills, tab bar, avatar, AI input                           |

The non-standard values (22px, 26px) are intentional. They create visual rhythm that differs from apps using pure multiples of 4 or 8.

### Borders — always 1px

Never 2px or more. Use the semantic token tiers (`--border-subtle`, `--border-default`, `--border-strong`) based on need.

### Elevation: no shadows

Elevation is communicated by **background luminosity**, not shadow:

```
--bg-base (#06060A)
  └─ --bg-elevated (#0F1114)         → inputs, simple cards
      └─ --bg-elevated-2 (#12151A)   → modals, bottom sheets, icon containers
          └─ --bg-elevated-3 (#1A1D23) → hover / selected state
```

**Exceptions** where real shadows are used:

- **Glass hero cards:** `box-shadow: 0 20px 60px rgba(0,0,0,0.45)` — gives lift
- **Floating tab bar:** `box-shadow: 0 10px 30px rgba(0,0,0,0.5)`
- **Toast:** `box-shadow: 0 8px 24px rgba(0,0,0,0.4)`

---

## 6. Iconography

### Library: Lucide

`lucide-react` (web) or `lucide-react-native` (React Native).

**ALWAYS** set `strokeWidth={1.5}`. Default 2px is too heavy and screams "generic".

```jsx
<House size={20} strokeWidth={1.5} color="#F5F0E8" />
```

### Size scale

| Token      | Size    | Use                              |
| ---------- | ------- | -------------------------------- |
| `icon-xs`  | 12px    | With caption text, inline        |
| `icon-sm`  | 14-16px | With body text, inline           |
| `icon-md`  | 20px    | Default (list items, buttons)    |
| `icon-lg`  | 24px    | Category tiles, tab bar emphasis |
| `icon-xl`  | 32px    | Hero illustration                |
| `icon-2xl` | 48px    | Empty state                      |

### Icon colors

Inherits text color. Never colored. Opacity reflects hierarchy:

- Active: `var(--text-primary)` (100%)
- Inactive/secondary: `var(--text-secondary)` (55%)
- Decorative: `var(--text-hint)` (38%)

### Category icons

Categories are identified by **icon + name only**, never by color. All category icons are:

- Lucide outline icons
- 20px in lists, 24px in selection views
- 1.5px stroke
- Off-white color

**In lists:** bare icon next to name, no container.

**In selection (Nova Transação):** icon inside a 36×36 container:

- Default: `background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.055); border-radius: 10px`
- Selected: `background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14)`

### Custom brand glyph

There is **one** custom icon in the app (not Lucide): the **orbital glyph** — two arcs around a central sphere, echoing the logo's form. It appears only:

- On the AI insight card header
- On the splash screen (animated)
- As an avatar for the AI in chat messages

This is the brand's DNA inside the UI. Do not use it elsewhere.

```svg
<svg viewBox="0 0 24 24" fill="none">
  <path d="M5 10 Q12 3 19 10" stroke="#F5F0E8" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M5 14 Q12 21 19 14" stroke="#F5F0E8" stroke-width="1.5" stroke-linecap="round"/>
  <circle cx="12" cy="12" r="2.5" fill="#F5F0E8"/>
</svg>
```

---

## 7. Components

### Balance hero (Home)

The signature component. Glass card with:

- Cool blue tint in ambient glow
- Period toggle (7D / 30D / 1A) in top-right — mono font, pill container
- Balance number in `hero-xl`
- Delta badge below (positive/negative tint)
- **Sparkline** transbording the card's horizontal padding (negative margins)
- Sparkline has: fill gradient, path in `#F5F0E8`, terminal point with double ring ambient

### AI insight card

Premium glass card with:

- **Warm amber tint** in ambient glow (not cool blue — differentiates from balance)
- Header: custom orbital glyph + mono label ("SINAL · MODELO LOCAL") + live indicator with pulsing dot
- Body: `body-lg` (17px Bricolage) with one highlighted span in amber (`#E8D4A8`) with dashed underline
- Forecast footer: small Geist text with tiny chart-up icon prefix

### AI input pill

Floating rounded pill (not card):

- `background: var(--glass-input)` with `backdrop-filter: blur(18px)`
- 999px border-radius
- Left: pulsing dot (breathing animation)
- Center: placeholder text "diga o que você gastou…"
- Right: white mic button, 36x36, filled off-white with micro inner shadow

### Flow bar (in/out visualization)

Horizontal bar with two columns + divider:

- Left column: "ENTRADAS" label (caption token) + value (body-sm Bricolage)
- Vertical divider: 1px gradient vertical line (fades at top and bottom)
- Right column: "SAÍDAS" + value, right-aligned
- Optional: horizontal progress bar showing ratio at bottom

### Category row

List-based, no card wrapping:

- Icon 36x36 container + name + proportion bar + amount + count
- Divider: 1px `rgba(255,255,255,0.035)` between rows
- On tap: opacity 0.6

### Tab bar (floating)

Pill-shaped floating nav:

- `background: rgba(15, 17, 20, 0.7)` with `backdrop-filter: blur(40px) saturate(1.4)`
- Border 1px `rgba(255,255,255,0.08)`
- Border-radius 999px
- Inset highlight top + shadow lift
- Active tab: `background: var(--accent); color: var(--bg-base)`
- Inactive: icon only (no label); `color: var(--text-secondary)`

### Buttons

**Primary CTA:**

```css
height: 56px;
background: var(--accent);
color: var(--bg-base);
border-radius: 12px;
font: 500 15px Bricolage Grotesque;
letter-spacing: -0.015em;
/* Pressed: opacity 0.6 + scale(0.97) */
```

**Secondary:**

```css
height: 48px;
background: var(--glass-input);
border: 1px solid var(--border-strong);
color: var(--text-primary);
/* Pressed: opacity 0.6 (no scale) */
```

### Input

```css
height: 48px;
background: var(--bg-elevated);
border: 1px solid var(--border-default);
border-radius: 10px;
padding: 0 14px;
font: 400 15px Bricolage Grotesque;
color: var(--text-primary);
/* Focused: border-color: var(--border-strong) */
/* Error: border-color: var(--negative) */
```

Label ABOVE input: `caption` token (10px JetBrains Mono, uppercase, letter-spacing 0.2em, color `--text-hint`), 10px margin-bottom.

### Bottom sheet

```css
background: var(--bg-elevated-2);
border-radius: 28px 28px 0 0;
padding: 24px 22px;
/* Top handle: 40x4px pill at center, color var(--border-strong), margin-bottom 16px */
/* Overlay backdrop: rgba(0,0,0,0.6) */
/* Enter: slide up 400ms cubic-bezier(0.4, 0, 0.2, 1) */
```

---

## 8. Motion

### Philosophy

Motion is **functional, never decorative**. Three purposes only: indicate relation between elements, indicate state change, confirm action.

### Durations

| Token            | Value | Use                                     |
| ---------------- | ----- | --------------------------------------- |
| `motion-instant` | 100ms | Focus, micro-feedback, pressed down     |
| `motion-fast`    | 150ms | Pressed release, state changes          |
| `motion-medium`  | 250ms | Toasts, tooltips, toggles               |
| `motion-slow`    | 400ms | Modals, bottom sheets, stack navigation |
| `motion-splash`  | 600ms | Logo intro on app open                  |

### Easing

- **Default:** `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out) — 95% of cases
- **Splash only:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out expo)

### Recurring animations

**Pulse breathing** (live indicators, AI input dot):

```css
@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(0.9);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}
/* 2.4s infinite ease-in-out */
```

**Press feedback:**

- Universal: `opacity: 0.6` on touch
- Primary CTA: `opacity: 0.6 + transform: scale(0.97)`

**Staggered list reveal** (first mount only):

- Each row: fade in + translate-y(8px → 0)
- Stagger: 30ms between items
- Duration per item: 250ms

### Prohibited motion

- Bounce, elastic, spring-back animations
- Parallax scrolling
- Counting-up numbers (R$ 0 → R$ 12.450)
- Confetti, celebration effects
- Self-animating icons
- Loading dots in iMessage style
- Any animation longer than 400ms except splash

### Splash

Only "performative" moment:

1. 0ms: logo at `opacity: 0, scale: 0.9`
2. 0-600ms: fade + scale to 100%, ease-out-expo
3. 600-1000ms: logo holds
4. 1000-1400ms: cross-fade to Home/Login

Total: ~1.4s.

**Future:** orbital arcs rotate around the sphere (SVG animation). Requires custom implementation.

---

## 9. Technical microcopy

The brand voice in the UI is **technical, not friendly**. This is part of the "instrument" identity.

### Patterns

| Don't write               | Write instead                               |
| ------------------------- | ------------------------------------------- |
| "Bem-vindo de volta!"     | "Boa noite · 23:04"                         |
| "Saldo da conta"          | "SALDO · SINCRONIZADO"                      |
| "Sugestão"                | "SINAL · MODELO LOCAL"                      |
| "8 transações"            | "8 TX" (in tight contexts)                  |
| "Ver todas as categorias" | "30D → ver tudo"                            |
| "Carregando..."           | "•••" (or skeleton, never a verbose loader) |
| "Salvo!"                  | "✓ registrado" (lowercase, technical)       |
| "Oops, algo deu errado"   | "erro · tente novamente"                    |

### Live indicators

Status dots communicate liveness:

- Green pulsing dot: live feature (AI listening, sync active)
- Amber pulsing dot: warning state
- White pulsing dot: awaiting input

Labels in mono caps: "LIVE", "SYNC", "OFFLINE".

### Timestamps

Always present where data has temporal meaning. Format: `HH:MM` or relative ("há 2min"). Mono font.

---

## 10. Screen-level patterns

### Main screens (Home, Chat, Extrato, Groups)

MUST have:

- Atmospheric background (3-layer gradient + grain)
- At least one glass element (card or surface)
- Two-voice typography (Bricolage + Mono in combination)
- A live indicator somewhere (sync status, AI state)
- Floating tab bar with backdrop blur

### Secondary screens (SignIn, New Transaction, Profile detail, Category management)

CAN omit atmospheric background for simplicity. MUST still:

- Use the full type system
- Follow all component specs
- Keep the 22px edge padding
- Use glass surfaces where appropriate

---

## 11. How to use this document

### In v0 / Lovable / Bolt prompts

Paste sections 2 (Color), 3 (Typography), 5 (Shape), 6 (Iconography), 9 (Microcopy) at the top of every prompt. The atmospheric background snippet from section 2 is critical — most AI generators default to flat black without it.

Example prefix:

```
Use this design system. Dark mode only. Premium digital instrument aesthetic.
Background must be atmospheric (3-layer radial gradient mesh + grain overlay) — never flat black.
Typography: Bricolage Grotesque (display, weights 300-600), JetBrains Mono (technical labels, timestamps, weights 300-500), Geist (body weights 300-500).
Colors: [paste section 2 tokens]
Shape: [paste border-radius scale]
NO green/red on income/expense. NO colored category icons.
Glass cards use asymmetric radial glow, NOT inset linear highlight.
[...paste remaining sections...]
```

### In React Native implementation

Materialize tokens in `src/theme/index.ts`:

```ts
export const theme = {
  colors: {
    bgBase: "#06060A",
    bgElevated: "#0F1114",
    // ... etc
  },
  typography: {
    heroXl: { fontFamily: "BricolageGrotesque-Medium", fontSize: 58 /* ... */ },
    // ...
  },
  spacing: {
    /* ... */
  },
  radius: {
    /* ... */
  },
} as const;
```

Never use raw values inside components. Always `theme.colors.textPrimary`, never `'#F5F0E8'`.

### In design reviews

Before shipping any screen, run this checklist:

- [ ] Does the screen have atmospheric background (or is it a secondary screen that can skip)?
- [ ] Are there at least two voices (Bricolage + Mono) visible?
- [ ] Is there a live/status indicator somewhere?
- [ ] Do all icons use strokeWidth 1.5?
- [ ] Are all numbers using tabular-nums?
- [ ] Zero green on income, zero red on expense?
- [ ] Zero colored category icons?
- [ ] Glass cards use asymmetric glow, not linear highlight?
- [ ] Edge padding is 22px?
- [ ] Microcopy uses technical voice (timestamps, "TX", "sync", "live")?

### When this document evolves

Changes must be **subtractive or refining**, never additive. If you want to add a new color, ask: "is this replacing something or just adding?" If just adding, the answer is almost always no.

---

## 12. Reference aesthetic

When in doubt about direction, consult these products:

- **Apple Pro apps** (Logic, Final Cut, Blackmagic) — glass materiality, technical chrome
- **Linear** (dark mode) — precision, density, status indicators
- **Arc Browser** — premium, atmospheric, modern
- **Raycast** — refined, instrumental, keyboard-first
- **Teenage Engineering product pages** — typographic rhythm, monospaced voice
- **Things 3 (dark mode)** — hierarchy, restraint, detail precision

DO NOT reference:

- Nubank (popular, colored)
- Revolut (corporate blue)
- Cleo (gamified, playful)
- Any Brazilian bank app
- Generic "glassmorphism UI kit" designs

---

_KeeperMe Design System · v2.0 · Direction: Premium Digital Instrument_
