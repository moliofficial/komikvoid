export default function ComicCard({ item, onClick }) {
  const typeClass =
    item.type?.toLowerCase().includes('manhwa') ? 'type-manhwa' :
    item.type?.toLowerCase().includes('manhua') ? 'type-manhua' : '';

  return (
    <div className="comic-card" onClick={onClick}>
      <div className="comic-card-thumb">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.thumb}
          alt={item.title}
          loading="lazy"
          onError={e => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='220' viewBox='0 0 160 220'%3E%3Crect width='160' height='220' fill='%230a1520'/%3E%3Ctext x='80' y='115' text-anchor='middle' fill='%23003366' font-size='36'%3E📚%3C/text%3E%3C/svg%3E";
          }}
        />
        {item.type && (
          <span className={`comic-card-type ${typeClass}`}>
            {item.type}
          </span>
        )}
        {item.score && (
          <span className="comic-card-score">★ {item.score}</span>
        )}
      </div>
      <div className="comic-card-info">
        <div className="comic-card-title">{item.title}</div>
        {item.chapter && <div className="comic-card-chapter">{item.chapter}</div>}
        {item.date && <div className="comic-card-date">{item.date}</div>}
      </div>
    </div>
  );
}
