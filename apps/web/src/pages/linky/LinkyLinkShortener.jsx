import { useState } from 'react'
import '../../css/app.css'
import '../../css/linkshortener.css'

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

      // setShortenedLink(data.shortCode);
    } catch (error) {
      console.error(error);
      alert('Unable to create short link');
    }
  };

  return (
    <>
      <div className="container">
        <div className="hero">
          <h1>Shorten your long links</h1>
          <p>
            Create memorable short URLs for your website,
            marketing campaigns, and social media.
          </p>
        </div>

        <div className="card">
          <div className="form-group">
            <label htmlFor="url">
              Destination URL
            </label>

            <input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/link"
              value={originalLink}
              onChange={(e) => setOriginalLink(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="slug">
              Custom Back-Half (Optional)
            </label>

            <div className="inline-input">
              <div className="short-url-prefix">
                {host}
              </div>

              <input
                className="short-url-prefix-input"
                id="slug"
                type="text"
                placeholder="my-link"
                value={shortenedLink}
                onChange={(e) => editShortenedLink(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="url">
              Title
            </label>

            <input
              id="url"
              type="url"
              placeholder="Link title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <button 
            className="button"
            onClick={submitShortenedLink}
          >
            Create Short Link
          </button>

          <div className="result">
            <div className="result-label">
              Your shortened URL
            </div>

            <div className="result-link">
              {host}{shortenedLink}
            </div>
          </div>

          <div className="bottom-navigation-link">
            <a href="/linky/list" className="no-text-decoration">
              <span>
                Go to shortened link list
              </span>
            </a>

          </div>

        </div>

        <div className="footer-note">
          Fast, simple, and reliable URL shortening.
        </div>
      </div>
    </>
  )
}

export default LinkyLinkShortener
