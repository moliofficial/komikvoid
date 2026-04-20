import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ComicCard from '../components/ComicCard';
import Pagination from '../components/Pagination';
import Footer from '../components/Footer';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!q) return;
    setLoading(true);
    setError(null);
    fetch(`/api/search?q=${encodeURIComponent(q)}&page=${page}`)
      .then(r => r.json())
      .then(res => {
        if (res.status) { setData(res.data); setPagination(res.pagination); }
        else setError(res.message);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [q, page]);

  return (
    <>
      <Head><title>{q ? `Hasil: ${q}` : 'Cari'} — KomikVoid</title></Head>
      <Navbar />
      <div className="page-wrapper">
        <div className="section-header">
          <span className="section-title">🔍 Hasil: &quot;{q}&quot;</span>
          <div className="section-line" />
        </div>

        {loading && <div className="loading-screen"><div className="spinner" /><span>Mencari...</span></div>}
        {error && <div className="error-box">⚠ {error}</div>}
        {!loading && !error && data.length === 0 && q && (
          <div className="loading-screen">
            <span style={{ fontSize: 40 }}>😶</span>
            <span>Tidak ada hasil untuk &quot;{q}&quot;</span>
          </div>
        )}
        {!loading && !error && (
          <>
            <div className="card-grid">
              {data.map((item, i) => (
                <ComicCard key={i} item={item} onClick={() => router.push(`/komik/${item.slug}`)} />
              ))}
            </div>
            {data.length > 0 && <Pagination pagination={pagination} page={page} setPage={setPage} />}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
