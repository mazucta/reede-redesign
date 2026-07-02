# Reede — concept redesign

An unofficial concept homepage for [reede.ee](https://reede.ee/), a Tallinn concept store
(streetwear, footwear, Estonian design). Built as an alternative design direction to pitch to
the owners — **not affiliated with or endorsed by Reede / Surfar OÜ.**

Static site, no build step. Open `index.html` or serve the folder:

```bash
python3 -m http.server 4602
# → http://localhost:4602
```

## Highlights

- **Bold street-editorial** design using Reede's own brand palette (white · ink `#262626` · electric blue `#0100ca`).
- **Unified photography treatment** — every product photo shares one grayscale-to-colour look, so mixed shots read as one shoot.
- **3D product viewer** — a rotatable, recolourable skateboard deck rendered in CSS 3D (drag to orbit, auto-spin, colourways).
- **Trilingual** — Estonian / English / Russian, with a persistent language switcher.
- **AI shopping assistant** — a scripted, multilingual chat widget (opening hours, delivery, sizing, products). Swap `reply()` for a call to an LLM backend to make it live.
- Motion via GSAP + Lenis, IntersectionObserver reveals, mobile-first, `prefers-reduced-motion` aware.

## Stack

Vanilla HTML/CSS/JS · GSAP + ScrollTrigger · Lenis (smooth scroll) · Google Fonts (Archivo, Spline Sans Mono).

## Notes

Imagery is placeholder / concept photography. Brand names, product names and prices are illustrative.
The skateboard deck graphic is an original homage inspired by art-series decks, rebranded to Reede.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
