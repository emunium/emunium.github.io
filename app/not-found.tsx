import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="not-found">
      <h1>This page moved.</h1>
      <p>Your work can continue. Open the documentation or use search to find a method, guide, or example.</p>
      <Link className="button button-primary" href="/docs/">
        Open documentation <span aria-hidden="true">&rarr;</span>
      </Link>
    </main>
  )
}
