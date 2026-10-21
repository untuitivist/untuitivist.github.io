# Wiz Lee — Intelligence from Within

Bilingual research and engineering portfolio with an interactive universe, research areas, and six projects using original project media.

The site is intentionally framework-free:

- `index.html` is the homepage.
- `assets/site.css` contains the layout and visual system.
- `assets/app.js` manages language selection, project filtering, and accessible detail dialogs.
- `assets/projects.js` contains bilingual project details and media references.
- `assets/cosmos.js` and `assets/cosmos.css` preserve the original universe animation, with pause and reduced-motion support.
- `images/projects/` contains selected diagrams, photos, videos, and the user-provided WQB CLI poster.
- `assets/fonts/` contains self-hosted fonts and their licenses.
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

Then open `http://localhost:4173`. The default language is English. Use `?lang=zh` or `?lang=en` for a specific language. Project dialogs can be linked directly, for example `?lang=zh&project=arm`.

Run `npm run check` to check JavaScript syntax. Layout and interaction checks can be performed in the local browser without a build step.

Keep working screenshots, private source materials, and unused media in the ignored `local/` directory. Publish only selected media; preserve the original source files.
