# NSZ Group — Website

Static site. Plain HTML/CSS/JS, no build step.

## Files
- `index.html` — markup
- `styles.css` — all styles (glassmorphism, brand tokens in :root)
- `script.js` — nav, scroll reveal, count-up, mobile menu, demo contact form
- `assets/` — brand logos (colour + white)

## Run locally
Just open `index.html`, or serve the folder:
    python3 -m http.server 8000

## Deploy
Drag this folder into Netlify, or commit + push to a Git-connected Netlify/host.

## To finish
- Replace placeholder email / socials / stat numbers
- Wire the contact form to Supabase (or an email endpoint)
