import '../css/notfound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-container">
        <div className="notfound-card">
          <div className="notfound-icon">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" stroke="#6366f1" fill="rgba(99,102,241,0.08)" />
              <path d="M9.5 2.5c-1.5 1-2.5 2.5-2.5 4.5 0 2.8 2.2 5 5 5s5-2.2 5-5c0-2-1-3.5-2.5-4.5" stroke="#818cf8" />
              <path d="M7 8a5 5 0 0 0 10 0" stroke="#a5b4fc" />
              <line x1="9" y1="14" x2="9" y2="16" stroke="#6366f1" strokeWidth="1.2" />
              <line x1="15" y1="14" x2="15" y2="16" stroke="#6366f1" strokeWidth="1.2" />
              <path d="M9 18c.5.5 1.5 1 3 1s2.5-.5 3-1" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M3 12h2" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
              </path>
              <path d="M19 12h2" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="1s" repeatCount="indefinite" />
              </path>
              <path d="M12 21v2" stroke="#6366f1" strokeWidth="1" strokeLinecap="round" opacity="0.5">
                <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" begin="0.5s" repeatCount="indefinite" />
              </path>
            </svg>
          </div>

          <div className="notfound-code">404</div>
          <h1 className="notfound-title">Page Not Found</h1>
          <p className="notfound-desc">
            The page you are looking for doesn't exist or has been moved to a new address.
          </p>

          <div className="notfound-actions">
            <a href="/" className="notfound-btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Back to Home
            </a>
            <button
              className="notfound-btn-secondary"
              onClick={() => window.history.back()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Go Back
            </button>
          </div>
        </div>

        <div className="notfound-particles">
          <span className="particle p1"></span>
          <span className="particle p2"></span>
          <span className="particle p3"></span>
          <span className="particle p4"></span>
          <span className="particle p5"></span>
        </div>
      </div>
    </div>
  );
}