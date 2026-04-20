import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const BASE_SOURCE = 'https://komikindo.ch';

export default function KomikDetail() {
  const router = useRouter();
  const { slug } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    const url = `${BASE_SOURCE}/komik/${slug}/`;
    fetch(`/api/detail?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(res => {
        if (res.status) setData(res.data);
        else setError(res.message);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug]);

  const goChapter = (chSlug) => { router.push(`/baca/${chSlug}`); };

  return (
    <>
      <Head><title>{data?.title || 'Detail'} — KomikVoid</title></Head>
      <Navbar />
      <div className="page-wrapper">
        <button className="back-btn" onClick={() => router.back()}>← Kembali</button>

        {loading && <div className="loading-screen"><div className="spinner" /><span>Memuat detail...</span></div>}
        {error && <div className="error-box">⚠ {error}</div>}
        {data && (
          <>
            <div className="detail-layout">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.thumb}
                  alt={data.title}
                  className="detail-thumb"
                  onError={e => { e.target.src = '/placeholder.png'; }}
                />
              </div>
              <div className="detail-meta">
                <h1 className="detail-title">{data.title}</h1>

                {Object.keys(data.info).length > 0 && (
                  <div className="detail-info-grid">
                    {Object.entries(data.info).slice(0, 8).map(([k, v]) => (
                      <div className="detail-info-item" key={k}>
                        <div className="detail-info-label">{k.replace(/_/g, ' ')}</div>
                        <div className="detail-info-value">{v || '—'}</div>
                      </div>
                    ))}
                  </div>
                )}

                {data.genres?.length > 0 && (
                  <div>
                    <div className="section-header" style={{ marginBottom: 10 }}>
                      <span className="section-title" style={{ fontSize: 11 }}>Genre</span>
                    </div>
                    <div className="genre-tags">
                      {data.genres.map((g, i) => (
                        <span key={i} className="genre-tag" onClick={() => router.push(`/genre/${g.slug}`)}>
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {data.description && (
                  <div>
                    <div className="section-header" style={{ marginBottom: 10 }}>
                      <span className="section-title" style={{ fontSize: 11 }}>Sinopsis</span>
                    </div>
                    <p className="detail-desc">{data.description}</p>
                  </div>
                )}
              </div>
            </div>

            {data.chapters?.length > 0 && (
              <div style={{ marginTop: 36 }}>
                <div className="section-header">
                  <span className="section-title">📖 Chapter ({data.chapters.length})</span>
                  <div className="section-line" />
                </div>
                <div className="chapter-list">
                  {data.chapters.map((ch, i) => (
                    <div key={i} className="chapter-item" onClick={() => goChapter(ch.slug)}>
                      <span className="chapter-name">{ch.name}</span>
                      <span className="chapter-date">{ch.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
