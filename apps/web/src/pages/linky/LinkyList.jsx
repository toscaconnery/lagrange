import '../../css/linkpage.css'

import { useEffect, useState } from 'react';
import { formatRelativeDate } from '../../utils/formatter';
import { toast } from 'sonner';

export default function LinksPage() {

  const defaultShortenedPath = 'ls'
  const host = `${window.location.origin}/${defaultShortenedPath}/`

  const [links, setLinks] = useState([])
  const [numberOfLinks, setNumberOfLinks] = useState('')

  const fetchShortenedList = async () => {
    try {
      const response = await fetch (`/api/v1/linky/get-shortened-link-list`);

      if (!response.ok) {
        setError('Link not found')
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();

      if (result?.data?.length) {
        const formattedResult = result.data.map(r => {
          return {
            ...r,
            full_short_link_url: `${host}${r.short_code}`
          }
        })
        setLinks(formattedResult)
        setNumberOfLinks(result.data.length)
      }
    } catch (error) {
      console.error('Failed to fetch shortened links:', error);
    }
  }

  const triggerCopy = (url) => {
    copy(url)
  }

  const copy = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  }

  useEffect(() => {
    fetchShortenedList()
  }, [])

  return (
    <div className="page">
      <div className="container">

        <header className="hero">
          <h1>Lagrange</h1>
          <p>Shorten and manage your links.</p>
        </header>

        <section className="header-link">
          <a href='/linky/shorten' className="display-as-plain-text">
            Shorten a link
          </a>
        </section>
        

        <section className="stats">
          <div className="stat-card">
            <span>Total Links</span>
            <strong>{numberOfLinks}</strong>
          </div>
        </section>

        <section className="links-section">

          <div className="section-header">
            <h2>Recent Links</h2>

            <input
              className="search"
              type="text"
              placeholder="Search links..."
            />
          </div>

          <div className="table">

            <div className="table-header text-left">
              <div>Original URL</div>
              <div>Shortened URL</div>
              <div>Created</div>
              <div></div>
            </div>

            {links.map(link => (
              <div
                key={link.id}
                className="table-row"
              >
                <div className="link-info text-left">
                  <div 
                    className="short-url"
                    onClick={() => triggerCopy(link.full_short_link_url)}
                  >
                    {link.full_short_link_url}
                  </div>

                  <div 
                    className="original-url"
                    onClick={() => triggerCopy(link.original_url)}
                  >
                    {link.original_url}
                  </div>
                </div>

                <div className="clicks text-left">
                  {link.title ? link.title : 'No title'}
                </div>

                <div className="created text-left">
                  {formatRelativeDate(link.created_at)}
                </div>

                <button className="menu-btn">
                  ⋯
                </button>
              </div>
            ))}

          </div>

        </section>

      </div>
    </div>
  );
}