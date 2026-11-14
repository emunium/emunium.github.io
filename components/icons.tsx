import type { SVGProps } from 'react'
type Props = SVGProps<SVGSVGElement>
const common: Props = { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true }
export function Arrow(props: Props) { return <svg {...common} {...props}><path d="M4 12h16m-6-6 6 6-6 6" /></svg> }
export function CopyIcon(props: Props) { return <svg {...common} {...props}><rect x="8" y="8" width="12" height="12" rx="3" /><path d="M15 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h3" /></svg> }
export function CheckIcon(props: Props) { return <svg {...common} {...props}><path d="m5 12 4 4L19 6" /></svg> }
export function SunIcon(props: Props) { return <svg {...common} {...props}><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" /></svg> }
export function MoonIcon(props: Props) { return <svg {...common} {...props}><path d="M20.5 13.4A9 9 0 0 1 10.6 3.5a9 9 0 1 0 9.9 9.9Z" /></svg> }
export function WindowIcon(props: Props) { return <svg {...common} {...props}><rect x="3" y="4" width="18" height="16" rx="3" /><path d="M3 9h18M7 6.5h.01M10 6.5h.01" /></svg> }
export function BookIcon(props: Props) { return <svg {...common} {...props}><path d="M12 5v15M12 5C8 2 3 4 3 4v15s5-2 9 1c4-3 9-1 9-1V4s-5-2-9 1Z" /></svg> }
export function CodeIcon(props: Props) { return <svg {...common} {...props}><path d="m7 6-6 6 6 6m10-12 6 6-6 6M14 4l-4 16" /></svg> }
export function InputIcon(props: Props) { return <svg {...common} {...props}><rect x="6" y="2" width="12" height="20" rx="6" /><path d="M12 2v7M6 9h12" /></svg> }
