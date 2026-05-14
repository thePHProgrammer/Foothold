// hifi-tweaks.jsx — wires the Tweaks panel to the hi-fi lesson page

const HIFI_TWEAKS = /*EDITMODE-BEGIN*/ {
  fontSize: 16,
  theme: 'light',
  density: 'regular',
  jargon: 'plain',
  accent: '#D97757',
} /*EDITMODE-END*/

function HifiApp() {
  const [t, setTweak] = useTweaks(HIFI_TWEAKS)

  React.useEffect(() => {
    document.documentElement.style.setProperty('--fs', t.fontSize + 'px')
    document.body.dataset.theme = t.theme
    document.body.dataset.density = t.density
    document.body.dataset.jargon = t.jargon
    // Apply the accent live by overriding the brand vars
    const r = document.documentElement.style
    r.setProperty('--brand', t.accent)
    // derive a darker hover from the accent color
    const darker = shade(t.accent, -0.15)
    r.setProperty('--brand-strong', darker)
    r.setProperty('--brand-tint', tint(t.accent, 0.86))
    r.setProperty('--brand-ink', shade(t.accent, -0.55))
  }, [t.fontSize, t.theme, t.density, t.jargon, t.accent])

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Reading" />
      <TweakSlider
        label="Font size"
        value={t.fontSize}
        min={14}
        max={22}
        step={1}
        unit="px"
        onChange={(v) => setTweak('fontSize', v)}
      />
      <TweakRadio
        label="Density"
        value={t.density}
        options={['cozy', 'regular', 'roomy']}
        onChange={(v) => setTweak('density', v)}
      />

      <TweakSection label="Theme" />
      <TweakRadio
        label="Mode"
        value={t.theme}
        options={['light', 'dark', 'contrast']}
        onChange={(v) => setTweak('theme', v)}
      />

      <TweakSection label="Voice" />
      <TweakRadio
        label="Jargon"
        value={t.jargon}
        options={['plain', 'standard']}
        onChange={(v) => setTweak('jargon', v)}
      />

      <TweakSection label="Brand" />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={['#D97757', '#0B6E4F', '#1E40AF', '#7C3AED', '#111827']}
        onChange={(v) => setTweak('accent', v)}
      />
    </TweaksPanel>
  )
}

// Helpers: shade and tint a hex color by mixing toward black/white.
function hexToRgb(hex) {
  const h = hex.replace('#', '')
  const n =
    h.length === 3
      ? h.split('').map((c) => parseInt(c + c, 16))
      : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)]
  return n
}
function rgbToHex(r, g, b) {
  const c = (n) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0')
  return '#' + c(r) + c(g) + c(b)
}
function shade(hex, pct) {
  const [r, g, b] = hexToRgb(hex)
  const t = pct < 0 ? 0 : 255
  const p = Math.abs(pct)
  return rgbToHex(r + (t - r) * p, g + (t - g) * p, b + (t - b) * p)
}
function tint(hex, pct) {
  // pct toward white, 0..1
  return shade(hex, pct)
}

const root = ReactDOM.createRoot(document.getElementById('tweaks-root'))
root.render(<HifiApp />)
