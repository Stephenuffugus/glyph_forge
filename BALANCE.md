# Glyph Forge — Balance Reference

_All numbers reflect the current build. Re-run `node sim-run.js` after any change._

## Player

| Stat | Value | Notes |
|---|---|---|
| Starting / max HP | 50 | hard cap |
| Heal between encounters | +8 | up to maxHp |
| Starting deck size | 9 (starters) | one of each common rune |
| Hand size | 5 | refilled after each cast |
| Spell slot count | 3 | empty slots are skipped |
| Fluency mult | `1 + min(0.72, defeatedEnemies × 0.06)` | caps at ×1.72 after 12 wins |

## Enemy Stats

| Tier | ID | Name | Base HP | Scaled HP (at typical enc) | Threat | Tag |
|---|---|---|---|---|---|---|
| 1 | cinder | Cinder | 8 | 8 | 2 | shadow |
| 1 | wisp | Wisp | 10 | 10 | 2 | air |
| 1 | fenmote | Fenmote | 12 | 13 | 2 | earth |
| 2 | wight | Hollow Wight | 26 | ~32 | 3 | void |
| 2 | sirenshade | Sirenshade | 30 | ~36 | 3 | water |
| 3 | revenant | Brass Revenant | 52 | ~67 | 4 | order |
| 3 | glasswyrm | Glass Wyrm | 64 | ~83 | 4 | chaos |
| 4 | sovereign | The Sovereign | 210 | 336 | 5 | void |

HP scales: `baseHp × (1 + encounterIdx × 0.05)`. At encounter 12 (boss): ×1.6 → 336 HP.

## Rune Power Tiers

| Rarity | Count | Base Power Range | Effect Weight | Example |
|---|---|---|---|---|
| common   | 9 | 1–3 | minor or none | Stone (3) |
| uncommon | 9 | 0–2 | modifier (multiplier or repeat) | Surge (+50% neighbor) |
| rare     | 8 | 0–5 | strong conditional or scaling | Anchor, Pandemonium |
| mythic   | 4 | 0   | game-bending global effect | Singularity (× hand size) |

Element distribution: Fire 3 · Water 3 · Earth 3 · Air 3 · Void 3 · Light 3 · Shadow 3 · Order 5 · Chaos 4
Shape distribution: Bolt 2 · Wave 4 · Burst 4 · Pulse 4 · Sigil 7 · Spiral 6 · Chain 3

## Synergy Math

```
elementMult = 1 + (maxSameElementCount - 1) × 0.5    // 3-stack = ×2.0
shapeMult   = 1 + (maxSameShapeCount   - 1) × 0.25   // 3-stack = ×1.5
fluencyMult = 1 + min(0.72, defeatedEnemies × 0.06)  // caps at ×1.72
globalMult  = elementMult × shapeMult × (effect modifiers)
totalDamage = floor( Σ(perRuneDamage) × globalMult × (1 + spellRetrigger) × fluencyMult )
```

Example: Stone + Stone + Stone, fluency 0 (3× Earth, 3× Burst)
- Base: 3 × 3 = 9
- elementMult: 2.0, shapeMult: 1.5, fluencyMult: 1.0
- Final: 9 × 2.0 × 1.5 × 1.0 = **27**

Same combo after defeating 8 enemies (fluencyMult 1.48):
- 9 × 2.0 × 1.5 × 1.48 = **39**

## Damage Reference (validated by `test.js`)

| Spell | Damage (fluency 0) | Notes |
|---|---|---|
| Stone (alone) | 3 | baseline |
| Ember + Ember + Ember | 18 | 3-elem, 3-shape (Bolt) at ×3.0 |
| Stone + Stone + Stone | 27 | 3-elem, 3-shape (Burst) at ×3.0 |
| Stone + Echo | 6 | Echo doubles Stone's repeat |
| Stone + Echo + Echo | 11 | 2 Sigil resonance + 2 Order synergy |
| Stone + Twin | 9 | Twin gives +2 repeats to slot 0 |
| Ember + Surge + Ember | 20 | Surge buffs both neighbors +50% |
| Ember + Drop + Aurora | 15 | Aurora ×5 for 3 different elements |
| Ember + Singularity (hand=5) | 10 | base 2 × hand 5 |
| Ember + Singularity (hand=10) | 20 | base 2 × hand 10 |
| Recursion + Ember + Recursion | 33 | 2-stack Recursion = ×3, plus synergies |
| Ember + Ouroboros | 4 | spell casts twice (×2) |
| Tally + Tally + Triskelion | 82 | 3-Order all same → Triskel ×3 + synergies |
| **Singularity × 2 + Wildfire (hand=10)** | **1125** | the original broken combo |
| **Pandemonium + Singularity × 2 (hand=10)** | **3750** | the deepest broken combo found |

Same broken combo at fluency 1.72 (post-game): ~1935 damage.

## Win Rate Tests (synergy-aware greedy AI, 100 runs)

```
Win rate: 37/100 (37%)
Avg damage per spell: 19.7
Avg peak spell damage per run: 132 (max seen: 1225)
Avg total turns per run: 47

Loss distribution by encounter:
   8: ████        (4)  first tier-3
   9: ███████     (7)
  10: ████████    (8)
  11: █████████   (9)
  12: ███████████████████████████████████   (35) — The Sovereign
  13: WIN ████████████████████████████████████ (37)
```

The Sovereign is the dominant wall (35/63 losses occur there). This is correct — it should feel like a boss. Skilled human play with intentional deck-building and reward routing should hit 55–70%.

## Tuning Levers (in order of impact)

If win rate feels off post-launch, change in this order:

1. **Sovereign HP** (210 → 180 makes him much more killable; → 240 makes him brutal)
2. **Fluency rate** (`0.06` per win — bump to `0.08` for steeper curve, drop to `0.04` for harder)
3. **Player max HP** (50 → 60 for more forgiving mid-game)
4. **Between-encounter heal** (+8 → +10 for more sustain)
5. **Synergy multipliers** (0.5 elem / 0.25 shape — flatter curve if dropped)

DO NOT touch the mythic rune effects without re-running `sim-run.js`. They define the ceiling and a small change there cascades through the whole damage range.

## Variance Analysis

High outcome variance because draw matters. A single run can swing from:
- **Low**: 8-15 dmg average spells, slow grind, die at tier 3
- **High**: a stacked-mythic turn at encounter 11 for 800+ damage one-shots Glass Wyrm

This is intentional, Balatro-style. The variance is the dopamine. Daily Sigil mode (same seed for everyone, one attempt) is the antidote — it normalizes draws across players for direct comparison.

## Run Length

- Avg turns to clear: 47 (5–7 turns per encounter average)
- Avg session length: ~12–18 minutes
- Designed for one commute / coffee break per attempt
