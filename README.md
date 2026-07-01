# All Star Sprinkler Systems, Inc. — Website

A fast, fully static, single-page marketing site for All Star Sprinkler Systems, Inc.
(Pineville & Alexandria, Louisiana). No build step, no dependencies — just HTML, CSS,
and JavaScript in one file plus optimized images.

## Structure

```
.
├── index.html        # The entire site (HTML + embedded CSS + JS)
├── images/           # Optimized JPEG photos + logo.png
├── vercel.json       # Caching headers + clean URLs
├── .vercelignore     # Keeps dev/reference files out of the deploy
└── README.md
```

`Screenshots/` and `.claude/` are local-only (excluded from deploys and git).

## Deploy to Vercel

Because this is a plain static site, Vercel needs **no framework preset and no build
command** — it serves the files as-is.

### Option A — Git (recommended)

1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. In the [Vercel dashboard](https://vercel.com/new), **Import** the repo.
3. Framework Preset: **Other**. Build Command: *(leave empty)*. Output Directory: `.` (root).
4. Click **Deploy**. Every future `git push` redeploys automatically.

### Option B — Vercel CLI

```bash
npm i -g vercel      # once
cd "All Star Sprinklers"
vercel               # preview deploy (follow the prompts)
vercel --prod        # promote to production
```

## Local preview

Any static server works, e.g.:

```bash
python3 -m http.server 3000
# then open http://localhost:3000
```

## Notes & next steps

- **Images** in `images/` are optimized JPEGs (~300–500 KB each; originals were ~3 MB PNGs).
  The logo is `images/logo.png` (transparent). Swap any file in place — keep the same
  filename and the page picks it up automatically.
- **Title font** uses Google Fonts *Bowlby One* as a free stand-in for Weed Man's licensed
  ZDS Display. To use the real face, license it from varsitytype.com and change the
  `--display` variable near the top of `index.html`.
- **Quote form** currently shows a confirmation alert. To capture leads, wire the
  `handleQuote()` function in `index.html` to a form endpoint (e.g. Formspree, Basin) or a
  serverless function.
- **Custom domain**: add it under Vercel → Project → Settings → Domains.
