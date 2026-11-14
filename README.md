# lightningres.com

The public website for LightningRes Pty Ltd. Plain HTML and CSS, with one small script for the Ask demo. There is no build step.

Everything that is deployed lives in `public/`. `brand/` holds the source brand files and is never deployed.

```
public/
  index.html                      one-page site
  ask.js                          types the Ask demo once that card is on screen
  terms.html                      policy drafts (marked for legal review in an HTML comment)
  privacy.html
  cancellation-and-refunds.html
  404.html
  styles.css                      the only stylesheet
  robots.txt, sitemap.xml
  assets/                         logo, LR mark, favicons, social share image
netlify.toml                      publish directory, apex redirect, security and cache headers
```

## Company details

The ABN, office address, phone number and email appear in `public/index.html` (the contact section and the JSON-LD block), `public/terms.html` and `public/privacy.html`. Stripe's review checks these details, so update every copy if any of them change:

```sh
grep -rn '88 703 055 029\|Severn Street\|0466&nbsp;622&nbsp;375\|+61466622375\|hello@lightningres.com' public
```

## Local preview

```sh
python3 -m http.server 8080 --directory public
# open http://localhost:8080
```

This does not apply the headers or redirects in `netlify.toml`. To preview with them:

```sh
npx netlify-cli dev --dir public
```

## Deploy

The live site is https://lightningres.netlify.app. Netlify deploys it from the public repository https://github.com/lightningres/website. Push to `main` on that repository to update the live site.

Netlify reads `netlify.toml`. The build command stays empty. The publish directory is `public`.

The custom domain is not connected yet. Add it later at the DNS registrar. `www.lightningres.com` will point at this Netlify site, and the bare domain `lightningres.com` will redirect to `www`. The redirects in `netlify.toml` already send `http://lightningres.com` and `https://lightningres.com` to `https://www.lightningres.com`.

The personal repository `AGENGINE2050/website` is not used.

## DNS records

Add these when the custom domain is connected. DNS stays with the current provider.

| Type | Host / name | Value | Notes |
| --- | --- | --- | --- |
| CNAME | `www` | `lightningres.netlify.app` | Primary domain |
| A | `@` (apex) | `75.2.60.5` | Netlify load balancer. If the provider supports ALIAS, ANAME, or a flattened CNAME, use `apex-loadbalancer.netlify.com` instead |

Also:

- Delete any **other** `A` or `AAAA` records on `@`, and any existing record on `www`. They conflict with the records above.
- If the domain has `CAA` records, add one that allows `letsencrypt.org`, or Netlify cannot issue the certificate.
- Confirm the values above against Netlify's dashboard, which shows the exact records for your site.

### Do not touch the Google Workspace email records

The domain already uses Google Workspace email. When editing DNS, **leave all of these exactly as they are**:

- `MX` records on `@` (Google's mail servers)
- `TXT` on `@` with the SPF policy (`v=spf1 include:_spf.google.com ...`)
- `TXT` on `google._domainkey` (DKIM)
- `TXT` on `_dmarc` (DMARC)
- Any `google-site-verification` `TXT` record

If you move DNS hosting to Netlify DNS instead, re-create every one of these records in Netlify **before** changing nameservers, or email will stop working.

## Headers and caching

`netlify.toml` sets these headers on every response:

- `Content-Security-Policy` allowing only the site's own origin (`'self'`)
- `Strict-Transport-Security`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` denying camera, microphone and geolocation

`Strict-Transport-Security` deliberately omits `includeSubDomains` and `preload`, so other subdomains are not affected. Add them only once every subdomain serves HTTPS.

Files in `/assets/` are cached for a year (`immutable`). **When you change an asset, give it a new file name** (for example `logo-v2.svg`) and update the references. Otherwise visitors keep the old copy.

## Brand assets

The files in `public/assets/` were generated from `brand/web-ready/logo-horizontal-on-dark.svg` without changing any logo paths or colours:

- `logo.svg`: the full logo with the navy background plate removed and the view box cropped. It is for navy backgrounds only.
- `mark.svg`: the LR mark's own two paths.
- `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`: the LR mark on a navy circle or square, matching the brand sheet.
- `og-image.png`: the 1200×630 social share image.

The site uses the system font stack. No web-licensed brand font was supplied.
