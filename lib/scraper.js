import axios from 'axios';
import * as cheerio from 'cheerio';

const BASE_URL = 'https://komikindo.ch';
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,id;q=0.8',
  'Referer': BASE_URL + '/',
  'Upgrade-Insecure-Requests': '1',
  'Connection': 'keep-alive',
};

function extractSlug(url) {
  if (!url) return null;
  try { return url.replace(/\/$/, '').split('/').pop(); } catch { return null; }
}

function getImg(el, $) {
  return $(el).attr('data-src') || $(el).attr('data-lazy-src') || $(el).attr('src');
}

export async function home() {
  try {
    const { data } = await axios.get(BASE_URL, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);

    const slider = [];
    $('#slidtop .bigslider .owl-item:not(.cloned)').each((i, el) => {
      const tooltip = $(el).find('.stooltip');
      const title = tooltip.find('.title h4 a').text().trim();
      const url = tooltip.find('.title h4 a').attr('href');
      const thumb = getImg($(el).find('.odadingmang img'), $);
      const synopsis = tooltip.find('.ttls').text().trim();
      const genres = tooltip.find('.info span:contains("Genres")').text().replace('Genres', '').trim();
      const score = tooltip.find('.metadata .skor').text().trim();
      const type = tooltip.find('.metadata span').last().text().trim();
      if (url && !slider.find(s => s.url === url)) {
        slider.push({ title, url, slug: extractSlug(url), thumb, synopsis, genres, score, type });
      }
    });

    const popular = [];
    $('section.whites').each((i, section) => {
      if ($(section).find('h2').text().includes('Terpopuler')) {
        $(section).find('.animepost').each((j, el) => {
          const title = $(el).find('.tt h3 a').text().trim();
          const url = $(el).find('.animposx > a').attr('href') || $(el).find('.tt h3 a').attr('href');
          const thumb = getImg($(el).find('.limit img'), $);
          const chapter = $(el).find('.lsch a').text().trim();
          const date = $(el).find('.datech').text().trim();
          if (url) popular.push({ title, url, slug: extractSlug(url), thumb, chapter, date });
        });
      }
    });

    const latest = [];
    $('section.whites').each((i, section) => {
      if ($(section).find('h2').text().includes('Terbaru')) {
        $(section).find('.animepost').each((j, el) => {
          const topLink = $(el).find('.animepostxx-top a');
          const title = $(el).find('.tt h3').text().trim();
          const url = topLink.attr('href');
          const thumb = getImg($(el).find('.limietles img'), $);
          const score = $(el).find('.info-skroep .flex-skroep:has(.fa-star)').text().trim();
          const type = $(el).find('.info-skroep .flex-skroep:has(.typeflag)').text().trim();
          const chapters = [];
          $(el).find('.list-ch-skroep .lsch a').each((idx, ch) => {
            chapters.push({ name: $(ch).text().trim(), url: $(ch).attr('href'), slug: extractSlug($(ch).attr('href')) });
          });
          if (url) latest.push({ title, url, slug: extractSlug(url), thumb, score, type, chapters });
        });
      }
    });

    return { status: true, data: { slider, popular, latest } };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

async function scrapeListPage(url, page) {
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);
    const results = [];

    $('.film-list .animepost, .listupd .animepost').each((i, el) => {
      const title = $(el).find('.tt h3 a').text().trim();
      const itemUrl = $(el).find('.tt h3 a').attr('href') || $(el).find('a').first().attr('href');
      const thumb = getImg($(el).find('.limit img'), $);
      const chapter = $(el).find('.lsch a').text().trim();
      const date = $(el).find('.datech').text().trim();
      const score = $(el).find('.rating i').text().trim();
      const type = $(el).find('.typeflag').attr('class')?.replace('typeflag', '').trim();
      if (itemUrl) {
        results.push({ title, url: itemUrl, slug: extractSlug(itemUrl), thumb, type, chapter: chapter || undefined, date: date || undefined, score: score || undefined });
      }
    });

    const pagination = {
      current: parseInt($('.pagination .current').text()) || page,
      total: 1,
      hasNext: $('.pagination .next').length > 0,
    };
    const pages = [];
    $('.pagination .page-numbers').each((i, el) => { const v = parseInt($(el).text()); if (!isNaN(v)) pages.push(v); });
    if (pages.length > 0) pagination.total = Math.max(...pages);

    return { status: true, data: results, pagination };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function latest(page = 1) { return scrapeListPage(`${BASE_URL}/komik-terbaru/page/${page}/`, page); }
export async function colored(page = 1) { return scrapeListPage(`${BASE_URL}/komik-berwarna/page/${page}/`, page); }
export async function mangaList(page = 1) { return scrapeListPage(`${BASE_URL}/daftar-manga/page/${page}/`, page); }
export async function manga(page = 1) { return scrapeListPage(`${BASE_URL}/manga/page/${page}/`, page); }
export async function manhwa(page = 1) { return scrapeListPage(`${BASE_URL}/manhwa/page/${page}/`, page); }
export async function manhua(page = 1) { return scrapeListPage(`${BASE_URL}/manhua/page/${page}/`, page); }

export async function search(query, page = 1) {
  try {
    const url = `${BASE_URL}/page/${page}/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);
    const results = [];
    $('.film-list .animepost, .listupd .animepost').each((i, el) => {
      const title = $(el).find('.tt h3 a').text().trim();
      const itemUrl = $(el).find('.tt h3 a').attr('href') || $(el).find('a').first().attr('href');
      const thumb = getImg($(el).find('.limit img'), $);
      const score = $(el).find('.rating i').text().trim();
      const type = $(el).find('.typeflag').attr('class')?.replace('typeflag', '').trim();
      if (itemUrl) results.push({ title, url: itemUrl, slug: extractSlug(itemUrl), thumb, score, type });
    });
    const pagination = { current: parseInt($('.pagination .current').text()) || page, total: 1, hasNext: $('.pagination .next').length > 0 };
    const pages = [];
    $('.pagination .page-numbers').each((i, el) => { const v = parseInt($(el).text()); if (!isNaN(v)) pages.push(v); });
    if (pages.length > 0) pagination.total = Math.max(...pages);
    return { status: true, data: results, pagination };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function detail(url) {
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);
    const title = $('h1.entry-title').text().trim();
    const thumb = getImg($('.thumb img'), $);
    const description = $('.entry-content p').text().trim();
    const info = {};
    $('.spe span').each((i, el) => {
      const text = $(el).text().trim();
      if (text.includes(':')) {
        const [key, ...val] = text.split(':');
        info[key.trim().toLowerCase().replace(/\s+/g, '_')] = val.join(':').trim();
      }
    });
    const genres = [];
    $('.genre-info a, .spe span:contains("Genre") a').each((i, el) => {
      genres.push({ name: $(el).text().trim(), url: $(el).attr('href'), slug: extractSlug($(el).attr('href')) });
    });
    const chapters = [];
    const chapterItems = $('#chapterlist ul li, #chapter_list li');
    if (chapterItems.length > 0) {
      chapterItems.each((i, el) => {
        const a = $(el).find('a').first();
        const chUrl = a.attr('href');
        const date = $(el).find('.dt').text().trim();
        let name = $(el).find('.lchx, .chapternum').text().trim();
        if (!name) { const tempA = a.clone(); tempA.find('.dt').remove(); name = tempA.text().trim(); }
        if (chUrl) chapters.push({ name, url: chUrl, slug: extractSlug(chUrl), date });
      });
    } else {
      $('#chapter_list a, #chapterlist a').each((i, el) => {
        if ($(el).closest('.dt').length > 0) return;
        const chUrl = $(el).attr('href');
        const name = $(el).text().trim();
        if (chUrl) chapters.push({ name, url: chUrl, slug: extractSlug(chUrl), date: '' });
      });
    }
    return { status: true, data: { title, thumb, description, info, genres, chapters } };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function chapter(url) {
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);
    let mangaId = '';
    let nonce = '';
    $('script').each((i, el) => {
      const s = $(el).html();
      if (!s) return;
      if (s.includes('manga_id')) {
        const m = s.match(/manga_id\s*=\s*(\d+)/) || s.match(/manga_id\s*:\s*(\d+)/);
        if (m) mangaId = m[1];
      }
      if (s.includes('ki_dynamic_view')) {
        const m = s.match(/"ki_dynamic_view"\s*:\s*"(.*?)"/) || s.match(/ki_dynamic_view\s*:\s*'(.*?)'/);
        if (m) nonce = m[1];
      }
    });
    if (!mangaId) mangaId = $('.bookmark').attr('data-id') || $('[data-id]').attr('data-id');

    let images = [];
    if (mangaId && nonce) {
      try {
        const params = new URLSearchParams();
        params.append('action', 'ki_dynamic_view');
        params.append('post_id', mangaId);
        params.append('_ajax_nonce', nonce);
        const { data: ajaxData } = await axios.post(`${BASE_URL}/wp-admin/admin-ajax.php`, params, {
          headers: { ...HEADERS, 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest', 'Referer': url },
        });
        if (ajaxData?.images) images = ajaxData.images;
      } catch {}
    }
    if (images.length === 0) {
      $('script').each((i, el) => {
        const s = $(el).html();
        if (!s || !s.includes('ts_reader.run')) return;
        const m = s.match(/ts_reader\.run\((.*?)\);/);
        if (m) { try { const j = JSON.parse(m[1]); if (j.sources?.[0]?.images) images = j.sources[0].images; } catch {} }
      });
    }
    if (images.length === 0) {
      $('#chimg-auh img, #readerarea img').each((i, el) => {
        const src = getImg(el, $);
        if (src && !src.includes('data:image') && !src.includes('ads')) images.push(src);
      });
    }
    return {
      status: true,
      data: {
        title: $('.breadcrumb li:last-child').text().trim() || $('title').text().split('-')[0].trim(),
        images,
        prev: $('.nextprev a[rel="prev"]').attr('href') || null,
        next: $('.nextprev a[rel="next"]').attr('href') || null,
      },
    };
  } catch (error) {
    return { status: false, message: error.message };
  }
}

export async function getByGenre(slug, page = 1) {
  const url = page === 1 || page === '1' ? `${BASE_URL}/tema/${slug}/` : `${BASE_URL}/tema/${slug}/page/${page}/`;
  return scrapeListPage(url, page);
}
