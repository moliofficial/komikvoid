import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../components/Navbar';
import ComicCard from '../components/ComicCard';
import HeroSlider from '../components/HeroSlider';
import Footer from '../components/Footer';

export default function Home() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/home')
      .then(r => r.json())
      .then(res => {
        if (res.status) setData(res.data);
        else setError(res.message);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Head><title>KomikVoid — Baca Manga, Manhwa, Manhua</title></Head>
      <Navbar />
      <div className="page-wrapper">
        {loading && (
          <div className="loading-screen">
            <div className="spinner" />
            <span>Memuat KomikVoid...</span>
          </div>
        )}
        {error && <div className="error-box">⚠ {error}</div>}
        {data && (
          <>
            {data.slider?.length > 0 && <HeroSlider slides={data.slider} onDetail={(slug) => router.push(`/komik/${slug}`)} />}

            <section style={{ marginBottom: 40 }}>
              <div className="section-header">
                <span className="section-title">🔥 Populer</span>
                <div className="section-line" />
              </div>
              <div className="card-grid">
                {data.popular?.map((item, i) => (
                  <ComicCard key={i} item={item} onClick={() => router.push(`/komik/${item.slug}`)} />
                ))}
              </div>
            </section>

            <section>
              <div className="section-header">
                <span className="section-title">⚡ Terbaru</span>
                <div className="section-line" />
              </div>
              <div className="card-grid">
                {data.latest?.map((item, i) => (
                  <ComicCard key={i} item={item} onClick={() => router.push(`/komik/${item.slug}`)} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}
