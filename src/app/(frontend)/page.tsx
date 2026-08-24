export default function FoundationPage() {
  return (
    <main className="foundation-page">
      <div className="foundation-glow" aria-hidden="true" />
      <section>
        <img src="/aris-technical-mark.svg" alt="" width="42" height="42" />
        <p>Next.js + Payload migration</p>
        <h1>Content platform foundation</h1>
        <span>
          The isolated migration branch is ready for PostgreSQL, article publishing, media storage and
          secured administration.
        </span>
        <div>
          <a href="/admin">Open administration</a>
          <small>Database connection required for first administrator setup.</small>
        </div>
      </section>
    </main>
  )
}
