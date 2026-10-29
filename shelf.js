(function () {
  'use strict';
  const S = window.SHELF || { line: [], guest: [], lineKeys: [], guestKeys: [], next: {} };
  // 棚ごとの合言葉。ひらいた状態は端末に残す。
  const SHELVES = {
    line: { store: 'baiko-shelf-line', keys: S.lineKeys || [], wrong: '合言葉がちがうようです。公式LINEの5つ目のメッセージを、もう一度ご確認ください。' },
    guest: { store: 'baiko-shelf-guest', keys: S.guestKeys || [], wrong: '合言葉がちがうようです。説明会の最後の画面を、もう一度ご確認ください。' }
  };
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

  function el(tag, cls, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // state: 'open' 公開中 / 'locked' 合言葉待ち / 'pending' 準備中
  const BADGE = { open: '公開中', pending: '準備中' };
  const LOCK = {
    line: { badge: '合言葉でひらく', when: '' },
    guest: { badge: '参加者限定', when: '説明会で合言葉をお伝えします' }
  };

  function book(item, index, state, shelf) {
    const li = el('li', 'book is-' + state);
    li.style.setProperty('--i', index);
    const spine = el('span', 'book-spine');
    spine.append(el('span', 'book-num', NUMS[index] || String(index + 1)));
    const body = el('div', 'book-body');
    const top = el('div', 'book-top');
    const badge = state === 'locked' ? LOCK[shelf].badge : item.always ? 'いつでも' : BADGE[state];
    top.append(el('span', 'book-badge', badge), el('span', 'book-kind', item.kind || '特典'));
    body.append(top);
    body.append(el('h3', 'book-title', item.title));
    body.append(el('p', 'book-note', item.note || ''));

    const foot = el('div', 'book-foot');
    if (state === 'open') {
      const a = el('a', 'book-open', (item.cta || 'ひらく') + ' →');
      a.href = item.url; a.target = '_blank'; a.rel = 'noopener noreferrer';
      a.setAttribute('aria-label', item.title + 'を' + (item.cta || 'ひらく'));
      foot.append(a);
    } else if (state === 'locked') {
      if (LOCK[shelf].when) foot.append(el('p', 'book-when', LOCK[shelf].when));
      const back = el('a', 'book-back', '合言葉を入れる ↑');
      back.href = '#key-form-' + shelf;
      foot.append(back);
    } else {
      foot.append(el('p', 'book-when', '準備ができ次第、ここと公式LINEでお届けします'));
    }
    body.append(foot);
    li.append(spine, body);
    return li;
  }

  const opened = { line: store(SHELVES.line.store) === '1', guest: store(SHELVES.guest.store) === '1' };

  function stateOf(item, shelf) {
    if (item.always) return 'open';
    if (!opened[shelf]) return 'locked';
    return item.url ? 'open' : 'pending';
  }

  function render() {
    const counts = {};
    for (const shelf of ['line', 'guest']) {
      const list = document.getElementById('books-' + shelf);
      list.textContent = '';
      const offset = shelf === 'line' ? 0 : S.line.length;
      let ready = 0;
      S[shelf].forEach((item, i) => {
        const state = stateOf(item, shelf);
        if (state === 'open') ready++;
        list.append(book(item, offset + i, state, shelf));
      });
      counts[shelf] = ready;
      document.getElementById('key-form-' + shelf).hidden = opened[shelf];
      document.getElementById('shelf-' + shelf).classList.toggle('is-open', opened[shelf]);
    }

    document.getElementById('line-count').textContent = opened.line
      ? '今ひらける ' + counts.line + ' / ' + S.line.length
      : '合言葉でひらく';
    document.getElementById('guest-count').textContent = opened.guest
      ? '今ひらける ' + counts.guest + ' / ' + S.guest.length
      : '全' + S.guest.length + '特典';
    document.getElementById('line-note').textContent = opened.line
      ? '合言葉でひらきました。いつでも見返せます。'
      : '友だち追加から届く5つ目のLINEで、合言葉をお伝えします。';
    document.getElementById('guest-note').textContent = opened.guest
      ? '合言葉でひらきました。ご参加ありがとうございました。'
      : '11/11（水）の説明会の最後に、合言葉をご案内します。';
  }

  async function digest(text) {
    const norm = text.normalize('NFKC').replace(/[\s　]/g, '');
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('baiko-shelf:' + norm));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function bindKey(shelf) {
    const conf = SHELVES[shelf];
    const form = document.getElementById('key-form-' + shelf);
    const input = document.getElementById('key-input-' + shelf);
    const msg = document.getElementById('key-msg-' + shelf);
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const value = input.value.trim();
      if (!value) { msg.textContent = '合言葉を入れてください。'; return; }
      let ok = false;
      try { ok = conf.keys.includes(await digest(value)); } catch (e) { ok = false; }
      if (ok) {
        opened[shelf] = true;
        store(conf.store, '1');
        msg.textContent = '';
        document.getElementById('shelf-' + shelf).classList.add('just-opened');
        render();
      } else {
        msg.textContent = conf.wrong;
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
  bindKey('line');
  bindKey('guest');
  intro();
})();
