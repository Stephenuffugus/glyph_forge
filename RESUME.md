# RESUME — pick up here the moment you say "lets get started"

**Status: BUILD COMPLETE & SAFE.** `node test.js` green, `node sim-run.js`
verdict *"depth systems balanced; determinism holds"*, everything committed &
pushed to `main`. The game is fully playable, balanced, audible, juiced, and
documented. The whole prior build queue is done.

## Done & shipped (committed/pushed)
- All 6 deep-design phases (two-track engine, Sigils, relics, Champion, Rune
  Web, counter-boss). Content pack: 36 runes, 48 combos, 7 Sigils, 6
  Champions, 22 relics, 5 transmutations.
- **Balance tuned to clean verdict.** The 5 content-pack OP relics (+31..+35)
  + dead Low Lantern (−7.3) were sim-flagged and re-costed → every relic now
  Δ +5..+25, none dead/overpowered, determinism PASS. See `BALANCE.md`.
- **Synthesised Web Audio** (`GFAudio` IIFE, no asset files, mute button,
  Node-safe — inert in test/sim). Hooks: cast/combo/reward/hit/victory/
  defeat/tap.
- **Juice/polish** (3 batches): motion/haptic helpers + reduced-motion +
  44px taps; damage tiers + count-up + XMULT flash/shake + chip-damage HP
  bar; tap-tooltips (fixed real mobile bug) + slot/synergy/modal anims +
  relic rarity tokens.
- **Static-host deploy:** `tools/pack.sh` → `dist/` + `glyph-forge-hostinger.zip`
  + `tools/HOSTINGER-UPLOAD.md`. Test-play works regardless of codespace uptime.
- **Marketing + docs:** `ITCH_STORE_COPY.md` (rewritten), `DEVLOG.md`,
  `SOCIAL.md` (X/Reddit/Daily hooks/press/launch checklist), `LAUNCH.md`,
  `README.md`, `GAME_DESIGN_DEEP.md`, `BALANCE.md` — all synced to shipped.

## ▶ NEXT (no code queue left — these are launch/ops actions)

1. **Test-play.** Hostinger: `bash tools/pack.sh`, upload per
   `tools/HOSTINGER-UPLOAD.md`. Or codespace dev URL while it's awake:
   `https://cuddly-disco-r5pvxv4764xhw7r9-8000.app.github.dev` (say
   "restart the server" if 404; port 8000 is public).
2. **Publish.** Either go-live path in `LAUNCH.md` (Hostinger upload, or the
   ~20s GitHub Pages toggle). Then itch.io via `ITCH_STORE_COPY.md`, set
   `GF_LINKS.itch` (search the string in `index.html`), re-pack/redeploy.
3. **Promote.** `SOCIAL.md` is copy-paste ready; lead with the Daily Sigil.
4. **Art** (non-blocking): work `ART_SHOTLIST.md`, drop PNGs in `art-slots/`,
   re-pack or push. Hot-loads with graceful fallback.

## Discipline that must hold every commit
Single `<script>`; `node test.js` + `node sim-run.js` green; save key
`glyph-forge-v1` additive-only; baseline byte-identical with no Sigil/relics;
deterministic daily; `dist/` + zip are gitignored build artifacts. Commit per
coherent batch with the Co-Authored-By trailer.

## v1.1 backlog (post-money — see LAUNCH.md)
Boss phase-2; Sigil-spread tightening (37%↔67% optimal-AI, inside pass band);
deck-thinning; Firebase Daily leaderboard; optional freemium gate.
