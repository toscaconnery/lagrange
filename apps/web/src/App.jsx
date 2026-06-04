import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { useState } from 'react'
import Home from './pages/Home'
import About from './pages/About'
import LinkShortener from './pages/LinkShortener'
// import LinkShorten from './pages/LinkShorten'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
// import './App.css'
// import './Pool.css'
// import Header from './components/header'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/linkshortener" element={<LinkShortener />} />
      </Routes>
    </BrowserRouter>
  );
}

// export default App
