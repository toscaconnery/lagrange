import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import '../../css/app.css'
import '../../css/linkshortener.css'

function LinkyAccess() {
  const { shortCode } = useParams();
  const defaultShortenedPath = 'ls'

  const [originalLink, setOriginalLink] =  useState('');
  const [title, setTitle] = useState('Dummy Title');
  const [host, setHost] = useState(`${window.location.origin}/${defaultShortenedPath}/${shortCode}`)
  const [error, setError] = useState('')

  const fetchShortenedLink = async () => {
    try {
      setError('')
      console.log('--- fetching shortened link');

      if (!shortCode) {
        return;
      }

      const response = await fetch(`/api/v1/linky/get-shortened-link/${shortCode}`);

      if (!response.ok) {
        setError('Link not found')
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      if (!result.data.original_url) {
        setError('Link not found')
      } else {
        const data = result.data
        setTitle(data.title);
        setOriginalLink(data.original_url);

        window.location.replace(data.original_url);
      }

      // window.open(data.original_url, '_blank', 'noopener,noreferrer');
      // window.location.replace(data.original_url);

    } catch (error) {
      console.error('Failed to fetch shortened link:', error);
    }
  }
  
  const accessOriginalLink = () => {
    console.log('---- visit originalLink')
    if (!originalLink) {
      return;
    }

    window.open(originalLink, '_blank', 'noopener,noreferrer');
  }

  useEffect(() => {
    setError('')
    fetchShortenedLink()
  }, [])

  return (
    <>
      <div className="container">
        <div className="hero">
          <h1>Access URL</h1>
        </div>

        <div className="card min-width-card">

          {
            error && (
              <div className="result-error form-group">
                <div className="result-label">
                  Error
                </div>

                <div className="result-label">
                  {error}
                </div>

                <div 
                  className="result-link"
                  onClick={accessOriginalLink}
                >
                  {error}
                </div>
              </div>
            )
          }
          {
            !error && (
              <div className="result form-group">
                <div className="result-label">
                  Your original URL
                </div>

                <div className="result-label">
                  {error}
                </div>

                <div 
                  className="result-link"
                  onClick={accessOriginalLink}
                >
                  {originalLink}
                </div>
              </div>
            )
          }

          {
            title && (
              <div className="form-group">
                <label htmlFor="url">
                  Title
                </label>

                <div className="short-url-text">
                  {title}
                </div>
              </div>

            )
          }

          <div className="form-group">
            <label htmlFor="url">
              Shortened URL
            </label>

            <div className="short-url-text">
              {host}
            </div>
          </div>

          

          <button 
            className="button"
            onClick={accessOriginalLink}
          >
            Go To Original URL
          </button>
        </div>

        <div className="footer-note">
          Fast, simple, and reliable URL shortening.
        </div>
      </div>
    </>
  )
}

export default LinkyAccess
