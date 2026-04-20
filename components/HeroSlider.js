import { useState, useEffect } from 'react';

export default function HeroSlider({ slides, onDetail }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!slides?.length) return;
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides?.length) return null;
  const slide = slides[current];

  return (
    <div className="hero-slider">
      {slides.map((s, i) => (
        <div key={i} className={`hero-slide ${i === current ? 'active' : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={s.thumb}
            alt={s.title}
            onError={e => { e.target.style.opacity = 0; }}
          />
        </div>
      ))}

      <div className="hero-overlay">
        <div className="hero-content">
          {slide.type && <span className="hero-type">{slide.type}</span>}
          <h2 className="hero-title">{slide.title}</h2>
          {slide.score && <div className="hero-score">★ {slide.score}</div>}
          {slide.synopsis && <p className="hero-synopsis">{slide.synopsis}</p>}
          {slide.genres && <div className="hero-genres">🏷 {slide.genres}</div>}
          <button className="btn-primary" onClick={() => onDetail(slide.slug)}>
            ▶ Baca Sekarang
          </button>
        </div>
      </div>

      <div className="hero-nav">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`hero-dot ${i === current ? 'active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  );
}
