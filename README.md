# Hemant Kumar portfolio site

Served by GitHub Pages at <https://heman10x-ngu.github.io/>.

- `/` is v2: a static page (`index.html`, `style.css`, `theme.js`, `motion.js`) with no build step.
  Edit the HTML directly. Figures are inline SVG and take their colors from the CSS
  variables in `style.css`, so they follow the light and dark themes. `motion.js` plays
  each figure's reveal once on scroll; reduced-motion readers get static figures.
  `banner-knight.webp` is the header image, shown in grayscale until hovered or tapped.
- `/v1/` is the previous site, a compiled Vite build from the private `portfolio` repo,
  rebuilt with `PORTFOLIO_BASE=/v1/`.

To preview locally:

```bash
python3 -m http.server 8000
```
