export default function Pagination({ pagination, page, setPage }) {
  if (!pagination?.total || pagination.total <= 1) return null;

  const total = Math.min(pagination.total, 999);
  const delta = 2;
  const range = [];

  for (let i = Math.max(2, page - delta); i <= Math.min(total - 1, page + delta); i++) {
    range.push(i);
  }

  const pages = [1];
  if (range[0] > 2) pages.push('...');
  pages.push(...range);
  if (range[range.length - 1] < total - 1) pages.push('...');
  if (total > 1) pages.push(total);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="pagination">
      <button
        className="page-btn"
        disabled={page <= 1}
        onClick={() => { setPage(p => p - 1); scrollTop(); }}
      >
        ←
      </button>

      {pages.map((p, i) =>
        p === '...'
          ? <span key={`ellipsis-${i}`} style={{ color: 'var(--text3)', padding: '0 4px' }}>…</span>
          : <button
              key={p}
              className={`page-btn ${p === page ? 'active' : ''}`}
              onClick={() => { setPage(p); scrollTop(); }}
            >
              {p}
            </button>
      )}

      <button
        className="page-btn"
        disabled={!pagination.hasNext}
        onClick={() => { setPage(p => p + 1); scrollTop(); }}
      >
        →
      </button>
    </div>
  );
}
