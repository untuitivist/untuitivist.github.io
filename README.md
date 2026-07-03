# Intelligence from Within

Static personal homepage for research systems, embodied AI, and agent-native tooling.

The site is intentionally framework-free:

- `index.html` is the homepage.
- `assets/site.css` contains the layout and visual system.
- `assets/app.js` contains small progressive behavior.
- `card/index.html` is a public, embeddable profile card.
- `assets/embed-profile.js` renders the profile card into another site as an iframe.
- `.nojekyll` tells GitHub Pages to serve the static files directly.

Embed the profile card from another site:

```html
<iframe
  src="https://untuitivist.github.io/card/"
  title="Profile card for Wiz Lee"
  style="width:100%;height:520px;border:0;border-radius:8px;"
  loading="lazy">
</iframe>
```

Or use the small helper script:

```html
<div id="untuitivist-profile"></div>
<script
  src="https://untuitivist.github.io/assets/embed-profile.js"
  data-target="#untuitivist-profile"
  data-height="520">
</script>
```

Local example:

```text
http://localhost:4173/card/embed-example.html
```

Run locally:

```powershell
npm run dev
```

Then open `http://localhost:4173`.
