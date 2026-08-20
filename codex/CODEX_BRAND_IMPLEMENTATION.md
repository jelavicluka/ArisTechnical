# Aris Technical — Brand Implementation Brief for Codex

## Goal

Replace the current line/bracket logo in the Aris Technical header with the new angular "A" brand mark while preserving the website's existing dark, technical visual language.

The design should feel integrated into the current site, not like a separate branding layer.

## Existing design system

Use the current website tokens as the source of truth:

```css
--background: #09080d;
--ink: #09080d;
--white: #f4f1f8;
--muted-light: #a39dab;
--line: rgba(255, 255, 255, 0.075);
--line-strong: rgba(255, 255, 255, 0.13);
--violet: #a76cff;
--sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--mono: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
```

Do not introduce the blue/cyan colors from the earlier concept.

## Brand mark

The logo mark is an angular capital "A":

- Main shape: `#F4F1F8`
- Accent wedge: `#A76CFF`
- Background: transparent
- No bevels
- No gradients
- No 3D effects
- No drop shadow
- No outer glow in the logo artwork itself

The visual character should be geometric, clean and minimal.

Use:

- `src/assets/aris-technical-mark.svg` for the icon
- `src/assets/aris-technical-logo.svg` for a full horizontal lockup if needed

For the website header, prefer composing the mark plus live HTML text rather than using the full horizontal SVG. This preserves accessibility, responsiveness and consistency with the existing typography.

## Header implementation

The current header already contains:

- `.brand`
- `.brand-mark`
- `.brand-name`
- `<BrandMark />`

Replace the current `BrandMark()` implementation with the new mark SVG geometry.

Recommended React component:

```jsx
function BrandMark() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path
        d="M32 8 8 54h12.5L32 31.8 43.5 54H56L32 8Z"
        fill="currentColor"
      />
      <path
        d="M32 31.8 43.5 54H33.8L27.1 41.1 32 31.8Z"
        fill="var(--violet)"
      />
    </svg>
  )
}
```

Important: the current `.brand-mark svg` CSS applies `fill: none` and stroke styles. Those rules must be updated because the new mark is fill-based.

Change the logo-related CSS approximately to:

```css
.brand {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--white);
  text-decoration: none;
}

.brand-mark {
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  color: var(--white);
}

.brand-mark svg {
  width: 100%;
  height: 100%;
  display: block;
}

.brand-name {
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 15px;
  letter-spacing: 0.13em;
}

.brand-name strong {
  font-weight: 760;
}

.brand-name span {
  color: var(--muted-light);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
}
```

Keep the current live wordmark:

```jsx
<span className="brand-name">
  <strong>ARIS</strong>
  <span>TECHNICAL</span>
</span>
```

Do not replace this with raster text.

## Favicon

Use the standalone angular A mark.

Preferred source:

`src/assets/aris-technical-mark.svg`

Add to `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/aris-technical-mark.svg" />
```

Copy the mark into `public/aris-technical-mark.svg`.

Optionally generate PNG fallbacks later at:

- 32x32
- 48x48
- 180x180
- 192x192
- 512x512

Do not block implementation on PNG generation if SVG favicon support is sufficient for V1.

## Light-background variation

If a light-background version is ever needed:

- Main A: `#09080D`
- Accent wedge: `#A76CFF`
- ARIS wordmark: `#09080D`
- TECHNICAL text: muted dark gray

Do not use this variation on the current dark header.

## Spacing and sizing

Header mark target size: `38px × 38px`

Desktop gap between mark and wordmark: `12px`

Keep visual alignment vertically centered with the current 88px header.

At small/mobile breakpoints, preserve the mark and wordmark unless the available width requires hiding or simplifying the wordmark.

The favicon must remain recognizable at 32px.

## Accessibility

The wrapping brand anchor already carries:

```html
aria-label="Aris Technical home"
```

Keep that.

The decorative logo SVG should use:

```html
aria-hidden="true"
```

Do not duplicate visible logo text inside SVG accessibility labels when live text is already present.

## Do not change

Do not redesign the rest of the header.

Do not change:

- navigation
- header height
- button style
- page colors
- typography system
- spacing system
- hero layout
- violet accent token

This task is a branding integration, not a site redesign.

## Brand rationale

The angular A should communicate:

- precision
- structure
- technical expertise
- architecture
- automation/integration
- modern enterprise software

The violet accent ties it directly into the existing Aris Technical interface.

## Assets

Use these supplied files:

- `aris-technical-mark.svg`
- `aris-technical-mark-light.svg`
- `aris-technical-logo.svg`
- `aris-technical-logo-light.svg`

The dark-site version is the primary version.

## Acceptance criteria

Implementation is complete when:

1. The current bracket/line A logo is fully replaced.
2. The new angular A appears correctly in the header.
3. The mark uses off-white plus `#A76CFF`.
4. No blue/cyan remains in the logo.
5. The logo renders crisply at 38px.
6. The existing `ARIS TECHNICAL` live text remains aligned with the mark.
7. The favicon uses the new mark.
8. No other page styling changes unintentionally.
9. Mobile header behavior remains intact.
10. Build and lint pass.
