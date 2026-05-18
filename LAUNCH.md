# Glyph Forge — Launch Status

**Live URL (after the one step below):** https://stephenuffugus.github.io/glyph_forge/
**Repo:** https://github.com/Stephenuffugus/glyph_forge

---

## ✅ Done (by Claude)

- File structure cleaned — PWA wiring (`manifest.json` / `sw.js`) now resolves.
- Test + sim harnesses fixed and passing. Mechanics solid; balance as designed
  (~35–37% greedy-AI win rate, losses cluster on the boss → real-player ~55–70%).
- Game verified: all 30 DOM ids present, tags balanced, missing art degrades to
  unicode sigils gracefully (the game looks coherent with **zero** art).
- Monetization funnel built in (single file, doesn't break offline):
  - **Share** button on win/lose — native share on mobile, copy-to-clipboard
    fallback. Works now. This is the viral driver (especially Daily Sigil).
  - `GF_LINKS.itch` one-line config → lights up "pay-what-you-want" CTAs on
    title/victory/defeat. Hidden until set, so it never looks broken.
- `ART_SHOTLIST.md` — 39 prompts + exact filenames, batched so you can launch
  before all art is done.
- `tools/make-icons.mjs` — auto-generates PWA icons from `title-mark.png`.
- `tools/deploy.sh` — one-command redeploy.
- Pushed to GitHub. Pages serves from `main` branch root (`.nojekyll` set).

---

## 🔴 THE ONE THING ONLY YOU CAN DO (~20 seconds)

The repo's tokens are blocked from enabling Pages programmatically, so:

1. Open: **https://github.com/Stephenuffugus/glyph_forge/settings/pages**
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **`main`**, folder: **`/ (root)`** → **Save**.
4. Wait ~1 minute. The game is live at
   **https://stephenuffugus.github.io/glyph_forge/**

That's the launch. Everything after is optional upgrade.

After this, every `git push` (or `bash tools/deploy.sh`) auto-rebuilds the live
site — no further setup, ever.

---

## 💰 Make money (do right after it's live)

1. Create a free itch.io account → new project. Use **`ITCH_STORE_COPY.md`**
   (every field is filled in, copy-paste).
2. Pricing: **pay-what-you-want, suggested $4** (lets the market price it).
3. Copy your itch URL into `GF_LINKS.itch` in `index.html`, run
   `bash tools/deploy.sh "wire itch"`. The CTAs go live everywhere.
4. Post the **Daily Sigil** to social — that loop + the Share button is the
   free funnel that drives itch traffic.

---

## 🎨 Art (you, in parallel — does NOT block launch)

Work `ART_SHOTLIST.md` top-down. After **Batch A (14 images)** the whole first
act + store hero art is illustrated. Drop PNGs in `art-slots/`, run
`bash tools/deploy.sh`, refresh. When `title-mark.png` exists, tell Claude →
`npm i sharp && node tools/make-icons.mjs` generates the app icons.

---

## v1.1 backlog (after money starts)

- SFX (ink scratch / page turn / chime) — hooks noted in README.
- Firebase daily leaderboard (Daily Sigil already deterministic).
- Boss phase-2 mechanic (Sovereign currently just tanky).
- Optional: freemium gate (free Tier 1, paid full run) once you've played enough
  to know where the gate should sit. Higher revenue ceiling than PWYW.
