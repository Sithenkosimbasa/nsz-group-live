# NSZ Group — nszgroup.co.za

Static site, hosted on Netlify (deploys automatically from `main`).

## Editing content

All pages are generated from two files:

- `_build/data.mjs` — contact details, services, **prices**, portfolio projects, FAQs
- `_build/build.mjs` — page templates and SEO / structured data

After editing, rebuild (needs Node 18+):

    node _build/build.mjs

This rewrites every page plus `sitemap.xml`, `robots.txt`, `llms.txt` and `llms-full.txt`.
Don't hand-edit the generated `index.html` files; changes there are overwritten on the next build.

## Structure

| Path | What |
|---|---|
| `/` | Home |
| `/services/` + `/services/{websites,ecommerce,branding,it-services}/` | Service pages |
| `/work/`, `/pricing/`, `/about/`, `/contact/`, `/privacy/` | Other pages |
| `assets/css/site.css` | All styles |
| `assets/js/contact.js` | Contact form (the only JavaScript on the site) |
| `assets/work/` | Portfolio screenshots (1200px + 640px JPEG) |
| `_redirects` | 301s from the old site's URLs |
| `_headers` | Security + caching headers |
| `llms.txt`, `llms-full.txt` | Plain-text summaries for AI assistants |

## Contact form

Uses Netlify Forms (`data-netlify="true"`). In Netlify: **Site configuration → Forms → enable form detection**,
then add an email notification. If forms are off, the form falls back to opening a pre-filled email.

## Run locally

    npx serve .        (or any static server — pages use root-relative paths, so open via http://, not file://)
