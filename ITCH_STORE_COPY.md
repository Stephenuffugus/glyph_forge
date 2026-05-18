# itch.io listing — copy/paste ready

Create the page at https://itch.io/game/new (you need a free itch.io account).
Fill the fields below. Then paste the resulting URL into `GF_LINKS.itch` in
`index.html` (one line, ~line 1960) and run `tools/deploy.sh` — every CTA in the
game lights up automatically.

---

**Title:** `Glyph Forge`

**Project URL:** `glyph-forge`  → becomes `https://stephenuffugus.itch.io/glyph-forge`

**Short tagline / "Short description or tweet":**
> A pocket roguelite deckbuilder. Fuse runes into spells. Find what shouldn't work.

**Classification:** Game
**Kind of project:** HTML  *(playable in browser — see "Embed" below)*
**Release status:** Released

**Pricing:** `$0 or donate`  →  set **Suggested donation: `$4.00`**
- This is the "pay what you want" model. It answers "what's it worth?" by letting
  the market answer. You can raise the suggested amount or set a minimum later
  without breaking anything.

---

**Description (paste into the big text box):**

> **Glyph Forge** is a pocket roguelite deckbuilder where every spell is a rune fusion you build by hand. Slot two or three sigils, watch the damage resolve live, and chase the combos that *shouldn't* work.
>
> - **Tactile fusion** — no "play a card" abstraction. You see the spell assemble, rune by rune.
> - **Discovery is the progression** — find a combo and it's named in your codex forever. The codex *is* the meta-game.
> - **Big numbers are puzzles solved** — 1000+ damage spells exist, but only if you've figured out how to get there.
> - **One run ≈ 12–18 minutes** — 13 encounters, rising stakes, one boss who does not go quietly.
> - **Daily Sigil** — everyone gets the same deck, path and offers from today's seed. Compare results.
>
> Illuminated-manuscript art. Single-handed portrait play. Installs to your phone's home screen and **plays offline**.
>
> Free in your browser. If it eats an afternoon, name your price. ♦

**Embed options:**
- This is a single static HTML game. Easiest path: link the **live web version**
  (`https://stephenuffugus.github.io/glyph_forge/`) from the page, OR upload a
  zip of the project folder and set it as an **HTML** project with
  `index.html` as the launch file, viewport ~ `420 × 760`, "mobile friendly"
  and "fullscreen" enabled.

**Genre:** Role Playing / Card Game
**Tags:** `roguelike`, `deckbuilder`, `roguelite`, `card-game`, `pwa`, `mobile`, `pixelless`, `singleplayer`, `dark-fantasy`, `daily`

**Community:** Comments — on
**Cover image:** use `title-mark` art (630×500 recommended) once generated
**Screenshots:** title screen, a mid-fusion spell, a combo banner, the Sovereign

---

## After the page exists
1. Copy the page URL (e.g. `https://stephenuffugus.itch.io/glyph-forge`).
2. Open `index.html`, find `const GF_LINKS = {` (~line 1960), set:
   `itch: 'https://stephenuffugus.itch.io/glyph-forge'`
3. Run `bash tools/deploy.sh "wire itch link"`.
4. The "Pay-what-you-want on itch.io ↗" link appears on the title screen and the
   "Name your price ↗" / "Get the full codex ↗" buttons appear on win/lose.
