# Steaz Domain Register

Single source of truth for all Steaz domains.

## Domains

| Domain | DNS | Purpose | Status | Notes |
|--------|-----|---------|--------|-------|
| `steaz.cloud` | Cloudflare Free | Front door — web platform | **Active** | Railway deploy live. Custom domain DNS pending. |
| `steaz.io` | Cloudflare Free | Base vanilla steaz experience | Acquired | The canonical, unthemed steaz. steaz.us is a themed clone of this. |
| `steaz.us` | Cloudflare Free | First steaz pack — themed clone of steaz.io with curated prompting overlay | Acquired | Flagship example of a theme pack (steaz pack) applied to a domain. More relaxed, tinted, glazed. |
| `steaz.life` | Cloudflare Free | Use case gallery — iframe host for community-curated experiences | Planned | Architecture designed, not built. |
| `steaz.uk` | Cloudflare Free | UK use case gallery — steaz.life counterpart + VIP launch for A & B | Acquired | Same iframe gallery pattern as steaz.life. Initial content: wake-up love-letter for VIP/influencers A & B. |
| `steaz.link` | Cloudflare Free | Navigation schemes portfolio — curation of steaz nav experiences | Acquired | Domain area on steaz.cloud. Holo-nav solar system is the first flagship scheme. |
| `dreamscapes` | Cloudflare Free | Flagship client — first use case | **Active** | Sibling repo. Outermost planet in the holo-nav. |

### Status Key

- **Active** — deployed and serving traffic
- **Acquired** — domain registered, DNS on Cloudflare, not yet serving
- **Planned** — domain registered, architecture designed, no deployment

## Architecture

```
steaz.cloud (Front Door / Marketplace)
  ├── serves: Hono/HTMX/Alpine web platform
  ├── hosts: steaz.link (navigation schemes portfolio)
  ├── hosts: theme packs / steaz packs
  ├── iframes content FROM → steaz.life (Use Case Gallery)
  └── iframes content FROM → steaz.uk  (UK Use Case Gallery)
       │
       └── use cases (each with own public domain URL, iframe-compatible)
            ├── dreamscapes (1st & primary, active)
            └── [future use cases]

steaz.io (vanilla steaz) ←── steaz.us (themed clone, first steaz pack)

steaz.link (nav schemes) → holo-nav solar system (flagship default)
```

**Sovereign Iframe Principle:** External content lives at its source domain. Steaz streams it in via iframes. Community ranking and safety layers are Steaz's value-add. Ownership stays external, safety layer stays internal.

**steaz.life + steaz.uk** are companion galleries — both accompany steaz.cloud by providing iframe-able, community-curated Steaz experiences. Each use case is its own public domain URL that can be iframed into either gallery. steaz.uk serves the UK audience; steaz.life is the primary/global gallery.

**steaz.us** is a themed clone of steaz.io — the first "steaz pack" in action. A steaz pack is a theme pack (wrapper construct) that bundles marketable domain entities. steaz.us demonstrates what happens when a steaz pack is applied to a domain: same content engine, different aesthetic overlay with curated prompting.

**steaz.link** is a domain area on steaz.cloud for the curation of navigation schemes. The holo-nav (spinning cosmic solar system domain switcher) is the first flagship navigation scheme, plugged in by default to vanilla steaz.

### Holo-Nav (Steaz-i-verse Domain Switcher)

Universal icon in the top-left of every Steaz experience. When activated, opens a floating SVG solar system showing the Steaz-i-verse cosmos. Six celestial bodies orbit a symbolic center:

| Orbit | Domain | Color | Role |
|-------|--------|-------|------|
| Sun | Steaz-i-verse | tron-cyan | Symbolic center |
| 1 | steaz.io | terminal-green | Base vanilla |
| 2 | steaz.us | cloud-gold | First steaz pack |
| 3 | steaz.cloud | tron-cyan | Front door |
| 4 | steaz.life | nebula-purple | Use case gallery |
| 5 | steaz.uk | cloud-rose | UK gallery + VIP |
| 6 | dreamscapes | star-white | Flagship client |

Lives in `@steaz/core` as `browser/holo-nav.js`. Layer 01 (Intuition/Astral), z-index 50.

## steaz.uk — Launch Intent

steaz.uk is the full UK use case gallery (same iframe pattern as steaz.life) AND carries two not-so-hidden easter eggs — personalized content for VIP/influencers:

- **"A" easter egg** — clearly marked, on-the-nose content prepared for person A
- **"B" easter egg** — clearly marked, on-the-nose content prepared for person B

These are intentionally easy to find — wake-up love-letters embedded inside a living gallery. The gallery is the vessel; the personal messages ride inside it.

## DNS Pending Actions

### steaz.cloud (Railway custom domain)

| Record | Type | Name | Value | Proxy |
|--------|------|------|-------|-------|
| 1 | CNAME | `@` | `bf2pqc60.up.railway.app` | OFF |
| 2 | TXT | `_railway-verify` | `railway-verify=railway-verify=e54aceea295de301db4c8a41bae266cd598c77ce326655604c74227712903a5a` | — |

### steaz.io

No DNS records configured yet. Will serve the base vanilla steaz experience (own deployment TBD).

### steaz.us

No DNS records configured yet. Will serve a themed clone of steaz.io (first steaz pack). Own deployment TBD.

### steaz.link

Domain area on steaz.cloud — may be a subdomain/path rather than requiring separate deployment. DNS TBD.

### steaz.uk

No deployment target yet. DNS records TBD when gallery/landing page is built and deployed. Same pattern as steaz.life — iframe-compatible, publicly linkable.

---

*Last updated: 2026-03-03*
