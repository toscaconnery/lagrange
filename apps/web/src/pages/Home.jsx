import Header from '../components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <div className="limit-wide">
        <section id="center" style={{ flexGrow: 1, padding: '80px 24px' }}>
          <h1>Welcome to Lagrange</h1>
          <p style={{ fontSize: '18px', color: 'var(--text)', maxWidth: '500px', margin: '0 auto' }}>
            Your all-in-one toolset — link shortener, expense ledger, and more.
          </p>
          <div style={{ marginTop: '40px', display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="/linky/shorten"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Shorten a Link
            </a>
            <a
              href="/expense-ledger"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                color: 'var(--text-h)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              Expense Ledger
            </a>
            <a
              href="/farm"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                color: 'var(--text-h)',
                textDecoration: 'none',
                fontWeight: 500,
              }}
            >
              My Plantations
            </a>
          </div>
        </section>
      </div>
    </>
  );
}