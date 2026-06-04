import { useState } from 'react'
import reactLogo from '../assets/react.svg'
import viteLogo from '../assets/vite.svg'
import heroImg from '../assets/hero.png'
import '../css/app.css'
import '../css/linkshortener.css'

function LinkShortener() {
//   const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div>
          <h1>Link Shortener</h1>
          <p>
            Paste a long <code>URL</code> below and generate a shorter link.ss
          </p>
        </div>
        <input 
            class="url-input"
        />
        <button
          type="button"
          className="counter"
        //   onClick={() => setCount((count) => count + 1)}
        >
          Shorten URL
        </button>
      </section>



      <div className="ticks"></div>
    </>
  )
}

export default LinkShortener
