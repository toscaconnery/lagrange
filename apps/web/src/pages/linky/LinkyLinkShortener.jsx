import { useState } from 'react'
import '../../css/linkshortener.css'
import { toast } from 'sonner';

function LinkyLinkShortener() {
  const defaultShortenedPath = 'ls'

  const [originalLink, setOriginalLink] =  useState('');
  const [shortenedLink, setShortenedLink] = useState('');
  const [title, setTitle] = useState('');
  const [host, setHost] = useState(`${window.location.origin}/${defaultShortenedPath}`)

  const editShortenedLink = (link) => {
    console.log('link : ', link)
    setShortenedLink(link)
  }

  const submitShortenedLink = async () => {
    try {
      if (!originalLink.trim()) {
        alert('Please enter a URL');
        return;
      }

      const response = await fetch('/api/v1/linky/shorten-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originalLink: originalLink,
          shortCode: shortenedLink || null,
          title: title || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create short link');
      }

      const data = await response.json();

      console.log('---> data result : ', data)

      toast.success('URL copied to clipboard');

      await new Promise(resolve => setTimeout(resolve, 1000));

      window.location.replace('/linky/list');
    } catch (error) {
      console.error(error);
      alert('Unable to create short link');
    }
  };

  return (
    <div className="shortener-page">
      <div className="shortener-container">
        <header className="shortener-hero">
          <h1>Shorten your long links</h1>
          <p>
            Create memorable short URLs for your website,
            marketing campaigns, and social media.
          </p>
        </header>

        <div className="shortener-card">
          <div className="form-row">
            <label>
              Destination URL
              <input
                type="url"
                placeholder="https://example.com/very/long/link"
                value={originalLink}
                onChange={(e) => setOriginalLink(e.target.value)}
                required
              />
            </label>
          </div>

          <div className="form-row">
            <label>
              Custom Back-Half (Optional)
              <div className="inline-input-group">
                <span className="url-prefix">{host}</span>
                <input
                  type="text"
                  placeholder="my-link"
                  value={shortenedLink}
                  onChange={(e) => editShortenedLink(e.target.value)}
                />
              </div>
            </label>
          </div>

          <div className="form-row">
            <label>
              Title
              <input
                type="text"
                placeholder="Link title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
          </div>

          <button 
            className="btn-submit"
            onClick={submitShortenedLink}
          >
            Create Short Link
          </button>

          <div className="shortener-result">
            <div className="shortener-result-label">
              Your shortened URL
            </div>
            <div className="shortener-result-link">
              {host}/{shortenedLink}
            </div>
          </div>

          <div className="shortener-nav-link">
            <a href="/linky/list">
              <span>Go to shortened link list &rarr;</span>
            </a>
          </div>
        </div>

        <p className="shortener-footer-note">
          Fast, simple, and reliable URL shortening.
        </p>
      </div>
    </div>
  )
}

export default LinkyLinkShortener