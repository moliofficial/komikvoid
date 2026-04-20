import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ComicCard from '../components/ComicCard';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';

const TABS = [
  { key: 'latest', label: '⚡ Terbaru' },
  { key: 'colored', label: '🎨 Berwarna' },
  { key: 'manga', label: '🇯🇵 Manga' },
  { key: 'manhwa', label: '🇰🇷 Manhwa' },
  { key: 'manhua', label: '🇨🇳 Manhua' },
  { key: 'mangaList', label: '📚 Daftar Manga' },
];

export default function Browse() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('latest');
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`/api/list?type=${activeTab}&page=${page}`)
      .then(r => r.json())
      .then(res => {
        if (res.status) { setData(res.data); setPagination(res.pagination); }
        else setError(res.message);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeTab, page]);

  const changeTab = (tab) => { setActiveTab(tab); setPage(1); };

  return (
    <>
      <Head><title>Browse — KomikVoid</title></Head>
      <Navbar />
      <div className="page-wrapper">
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="section-title">Browse</span>
          <div className="section-line" />
        </div>

        <div className="tab-bar" style={{ marginTop: 16 }}>
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn ${activeTab === t.key ? 'active' : ''}`} onClick={() => changeTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {loading && <div className="loading-screen"><div className="spinner" /><span>Memuat...</span></div>}
        {error && <div className="error-box">⚠ {error}</div>}
        {!loading && !error && (
          <>
            <div className="card-grid">
              {data.map((item, i) => (
                <ComicCard key={i} item={item} onClick={() => router.push(`/komik/${item.slug}`)} />
              ))}
            </div>
            <Pagination pagination={pagination} page={page} setPage={setPage} />
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
