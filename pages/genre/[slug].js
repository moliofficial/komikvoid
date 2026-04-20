import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Navbar from '../../components/Navbar';
import ComicCard from '../../components/ComicCard';
import Pagination from '../../components/Pagination';
import Footer from '../../components/Footer';

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  };
}

export async function getStaticProps() {
  return {
    props: {},
    revalidate: 60,
  };
}

export default function Genre() {
  const router = useRouter();
  const { slug } = router.query;
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    fetch(`/api/genre?slug=${slug}&page=${page}`)
      .then(r => r.json())
      .then(res => {
        if (res.status) { setData(res.data); setPagination(res.pagination); }
        else setError(res.message);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [slug, page]);

  return (
    <>
      <Head><title>Genre: {slug} — KomikVoid</title></Head>
      <Navbar />
      <div className="page-wrapper">
        <div className="section-header">
          <span className="section-title">🏷 Genre: {slug}</span>
          <div className="section-line" />
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
