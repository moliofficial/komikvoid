import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const isActive = (path) => router.pathname === path || router.pathname.startsWith(path + '/');

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => router.push('/')}>
        KOMIK<span>VOID</span>
      </div>

      <div className="navbar-links">
        <button className={`nav-btn ${router.pathname === '/' ? 'active' : ''}`} onClick={() => router.push('/')}>
          Home
        </button>
        <button className={`nav-btn ${isActive('/browse') ? 'active' : ''}`} onClick={() => router.push('/browse')}>
          Browse
        </button>
        <button className={`nav-btn ${isActive('/browse') && router.query?.tab === 'manga' ? 'active' : ''}`} onClick={() => router.push('/browse?tab=manga')}>
          Manga
        </button>
        <button className={`nav-btn ${isActive('/browse') && router.query?.tab === 'manhwa' ? 'active' : ''}`} onClick={() => router.push('/browse?tab=manhwa')}>
          Manhwa
        </button>
        <button className={`nav-btn ${isActive('/browse') && router.query?.tab === 'manhua' ? 'active' : ''}`} onClick={() => router.push('/browse?tab=manhua')}>
          Manhua
        </button>
      </div>

      <form className="navbar-search" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Cari komik..."
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <button type="submit" aria-label="Cari">
          &#128269;
        </button>
      </form>
    </nav>
  );
}
