import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';

const BASE_SOURCE = 'https://komikindo.ch';

export default function Reader() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChapter = (chSlug) => {
    if (!chSlug) return;
    setLoading(true);
    setData(null);
    setError(null);
    const url = `${BASE_SOURCE}/${chSlug}/`;
    fetch(`/api/chapter?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(res => {
        if (res.status) setData(res.data);
        else setError(res.message);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchChapter(slug); }, [slug]);

  const goTo = (url) => {
    if (!url) return;
    const s = url.replace(/\/$/, '').split('/').pop();
    router.push(`/baca/${s}`);
  };

  return (
    <>
      <Head><title>{data?.title || 'Reader'} — KomikVoid</title></Head>
      <Navbar />
      <div className="page-wrapper">
        <div className="reader-container">
          <div className="reader-nav">
            <button className="back-btn" style={{ margin: 0 }} onClick={() => router.back()}>← Detail</button>
            <span className="reader-title">{data?.title}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginBottom: 20 }}>
            <button className="nav-arrow" onClick={() => goTo(data?.prev)} disabled={!data?.prev}>
              ← Prev
            </button>
            <button className="nav-arrow" onClick={() => goTo(data?.next)} disabled={!data?.next}>
              Next →
            </button>
          </div>

          {loading && <div className="loading-screen"><div className="spinner" /><span>Memuat chapter...</span></div>}
          {error && <div className="error-box">⚠ {error}</div>}
          {data && (
            <div className="reader-images">
              {data.images?.length > 0
                ? data.images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={i}
                      src={src}
                      alt={`Page ${i + 1}`}
                      className="reader-image"
                      loading="lazy"
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  ))
                : <div className="error-box">Tidak ada gambar ditemukan untuk chapter ini.</div>
              }
            </div>
          )}

          {data && (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, marginTop: 24 }}>
              <button className="nav-arrow" onClick={() => goTo(data?.prev)} disabled={!data?.prev}>
                ← Prev
              </button>
              <button className="nav-arrow" onClick={() => goTo(data?.next)} disabled={!data?.next}>
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
