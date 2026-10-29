(function () {
  'use strict';
  const S = window.SHELF || { line: [], guest: [], keys: [], next: {} };
  const STORE_KEY = 'baiko-shelf-guest';
  const INTRO_KEY = 'baiko-shelf-intro';
  const NUMS = ['一', '二', '三', '四', '五', '六', '七', '八', '九'];

  // 日本時間の「今」。確認用に ?now=2026-11-08T21:00 で日時を差し替えられる。
  function jst(iso) { return new Date(iso + ':00+09:00'); }
  const nowParam = new URLSearchParams(location.search).get('now');
  const now = nowParam ? jst(nowParam) : new Date();

  function store(key, value) {
    try {
      if (value === undefined) return localStorage.getItem(key);
      localStorage.setItem(key, value);
    } catch (e) { return null; }
  }
  function session(key, value) {
    try {
      if (value === undefined) return sessionStorage.getItem(key);
      sessionStorage.setItem(key, value);
    } catch (e) { return null; }
  }

  function dateLabel(iso) {
    const w = '日月火水木金土'[new Date(jst(iso).getTime() + 9 * 3600e3).getUTCDay()];
    return Number(iso.slice(5, 7)) + '/' + Number(iso.slice(8, 10)) + '（' + w + '）' + iso.slice(11, 16);
  }

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // state: 'open' 公開中 / 'soon' 公開日待ち / 'locked' 合言葉待ち / 'pending' 準備中
  const BADGE = { open: '公開中', soon: '未公開', locked: '参加者限定', pending: '準備中' };

  function book(item, index, state) {
    const li = el('li', 'book is-' + state);
    li.style.setProperty('--i', index);
    const spine = el('span', 'book-spine');
    spine.append(el('span', 'book-num', NUMS[index] || String(index + 1)));
    const body = el('div', 'book-body');
    const top = el('div', 'book-top');
    top.append(el('span', 'book-badge', item.always && state === 'open' ? 'いつでも' : BADGE[state]), el('span', 'book-kind', item.kind || '特典'));
    body.append(top);
    body.append(el('h3', 'book-title', item.title));
    body.append(el('p', 'book-note', item.note || ''));

    const foot = el('div', 'book-foot');
    if (state === 'open') {
      const a = el('a', 'book-open', (item.cta || 'ひらく') + ' →');
      a.href = item.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', item.title + 'を' + (item.cta || 'ひらく'));
      foot.append(a);
    } else if (state === 'soon') {
      const when = el('p', 'book-when');
      when.append(el('b', '', dateLabel(item.opens)), document.createTextNode(' に公開'));
      foot.append(when);
    } else if (state === 'locked') {
      foot.append(el('p', 'book-when', '説明会で合言葉をお伝えします'));
      const back = el('a', 'book-back', '合言葉を入れる ↑');
      back.href = '#key-form';
      foot.append(back);
    } else {
      foot.append(el('p', 'book-when', '準備ができ次第、ここと公式LINEでお届けします'));
    }
    body.append(foot);
    li.append(spine, body);
    return li;
  }

  let guestOpen = store(STORE_KEY) === '1';

  function render() {
    const lineList = document.getElementById('books-line');
    const guestList = document.getElementById('books-guest');
    lineList.textContent = '';
    guestList.textContent = '';

    let lineOpen = 0;
    S.line.forEach((item, i) => {
      const isOpen = item.always || now >= jst(item.opens);
      if (isOpen) lineOpen++;
      lineList.append(book(item, i, isOpen ? 'open' : 'soon'));
    });
    let guestReady = 0;
    S.guest.forEach((item, i) => {
      const state = !guestOpen ? 'locked' : item.url ? 'open' : 'pending';
      if (state === 'open') guestReady++;
      guestList.append(book(item, S.line.length + i, state));
    });

    document.getElementById('line-count').textContent = '今ひらける ' + lineOpen + ' / ' + S.line.length;
    document.getElementById('guest-count').textContent = guestOpen
      ? '今ひらける ' + guestReady + ' / ' + S.guest.length
      : '全' + S.guest.length + '特典';

    document.getElementById('key-form').hidden = guestOpen;
    document.getElementById('guest-note').textContent = guestOpen
      ? '合言葉でひらきました。ご参加ありがとうございました。'
      : '11/11（水）の説明会の最後に、合言葉をご案内します。';
    document.getElementById('shelf-guest').classList.toggle('is-open', guestOpen);
  }

  async function digest(text) {
    const norm = text.normalize('NFKC').replace(/[\s　]/g, '');
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('baiko-shelf:' + norm));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function bindKey() {
    const form = document.getElementById('key-form');
    const input = document.getElementById('key-input');
    const msg = document.getElementById('key-msg');
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const value = input.value.trim();
      if (!value) { msg.textContent = '合言葉を入れてください。'; return; }
      let ok = false;
      try { ok = (S.keys || []).includes(await digest(value)); } catch (e) { ok = false; }
      if (ok) {
        guestOpen = true;
        store(STORE_KEY, '1');
        msg.textContent = '';
        document.getElementById('shelf-guest').classList.add('just-opened');
        render();
      } else {
        msg.textContent = '合言葉がちがうようです。説明会の最後の画面を、もう一度ご確認ください。';
        form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      }
    });
  }

  function renderNext() {
    const n = S.next || {};
    const pick = n.online && now < jst(n.online.until) ? n.online : n.visit;
    const cta = document.getElementById('cta');
    if (pick) {
      document.getElementById('next-title').textContent = pick.title || '';
      cta.textContent = '';
      const label = el('span', 'cta-label');
      pick.label.split('\n').forEach(line => label.append(el('span', '', line)));
      cta.append(label, el('span', 'cta-arrow', '→'));
      cta.href = pick.url;
      document.getElementById('cta-note').textContent = pick.note || '';
    } else {
      cta.hidden = true;
    }
    document.getElementById('line-link').href = S.lineUrl || '#';
  }

  // 入り口：題名が短く浮かぶだけ。初回のみ、タップで飛ばせる。
  function intro() {
    const box = document.getElementById('intro');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const done = () => {
      if (!box.isConnected) return;
      box.classList.add('out');
      document.body.classList.add('ready');
      setTimeout(() => box.remove(), 500);
    };
    if (reduce || session(INTRO_KEY)) { box.remove(); document.body.classList.add('ready'); return; }
    session(INTRO_KEY, '1');
    document.body.classList.add('intro-play');
    box.addEventListener('click', done, { once: true });
    setTimeout(done, 1000);
  }

  render();
  renderNext();
  bindKey();
  intro();
})();
