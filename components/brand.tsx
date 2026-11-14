export function Brand({ compact = false }: { compact?: boolean }) {
  return <span className="brand">
    <img className="brand-mark" src="/brand/logo.svg" width={52} height={28} alt="" aria-hidden="true" />
    <span className="brand-name">emunium</span>
    {!compact && <span className="brand-tag">docs</span>}
  </span>
}
