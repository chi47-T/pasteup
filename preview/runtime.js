// runtime.js — 預覽頁（iframe 內）的執行程式
// 一個 iframe 放所有選取的區塊。每個區塊放在自己的 Shadow DOM 裡（樣式互不影響），
// host 用 display: contents，所以固定、黏住、100vh 都和一般頁面一樣運作。
//
// 外層（組合器）→ 預覽頁的訊息（postMessage，同網域）：
//   { type: 'lb:set', blocks: [{ id, category, relation?, accessoriesOff?: [n], extrasOn?: [n] }], scrollTo?: id, tail?: true }
//       依序顯示這些區塊。只會重建有變動的區塊，其他保持原狀（捲動位置不變）
//       tail: true 在最後一個區塊後面留一個畫面高的空白（單獨預覽一個區塊時，讓固定捲動能捲完）
//   { type: 'lb:tokens', vars: { '--lb-accent': '#376B6D', '--lb-radius': '0px', … } }
//   { type: 'lb:scrollTo', id }
//   { type: 'lb:preload', ids: [id] }      先把預覽檔抓進快取（滑鼠移到卡片上時用）
// 預覽頁 → 外層：
//   { type: 'lb:ready' }                    可以開始送 lb:set
//   { type: 'lb:rendered', ids, height }    畫好了；height 是整頁高度
//   { type: 'lb:error', id, message }
// 也可以直接用網址測試：page.html?blocks=header-a,hero-b,content-c&relation=overlay&tail=1
(function () {
  var script = document.currentScript;
  var BASE = (script && script.dataset.previews) || '../data/previews/';   // 預覽檔的位置
  var CSS_URL = (script && script.dataset.css) || 'base.css';
  var ORDER = { header: 0, hero: 1, content: 2, footer: 3 };
  var page = document.getElementById('lb-page');
  var cache = new Map();      // id → Promise<html>
  var mounted = new Map();    // id → { host, key, cleanups }
  var sheet = null, seq = 0, headerObs = null;

  function load(id) {
    if (!cache.has(id)) {
      cache.set(id, fetch(BASE + id + '.html').then(function (r) {
        if (!r.ok) throw new Error('找不到預覽檔 ' + id);
        return r.text();
      }).catch(function (e) { cache.delete(id); throw e; }));
    }
    return cache.get(id);
  }
  function baseSheet() {
    if (!sheet) sheet = fetch(CSS_URL).then(function (r) { return r.text(); }).then(function (css) {
      // 放進 @layer：Shadow DOM 的共用樣式排在元件自己的 <style> 之後，不分層的話會蓋掉元件的設定
      var s = new CSSStyleSheet(); s.replaceSync('@layer lb-base {' + css + '}'); return s;
    });
    return sheet;
  }
  function post(msg) { if (parent !== window) parent.postMessage(msg, location.origin === 'null' ? '*' : location.origin); }

  // 區塊的「狀態字串」：一樣就不用重建
  function keyOf(b, ctx) {
    return [b.id, b.category === 'hero' ? b.relation || '' : '', b.category === 'header' ? ctx.over : '',
      (b.accessoriesOff || []).join('.'), (b.extrasOn || []).join('.')].join('|');
  }
  function unmount(id) {
    var m = mounted.get(id); if (!m) return;
    m.cleanups.forEach(function (f) { try { f(); } catch (e) {} });
    m.host.remove(); mounted.delete(id);
  }
  function mount(b, html, css, ctx) {
    var host = document.createElement('div');
    host.className = 'lb-host'; host.dataset.id = b.id; host.dataset.category = b.category;
    var shadow = host.attachShadow({ mode: 'open' });
    shadow.adoptedStyleSheets = [css];
    // 腳本先拿出來，其餘放進 Shadow DOM
    var tpl = document.createElement('template'); tpl.innerHTML = html;
    var codes = [];
    tpl.content.querySelectorAll('script').forEach(function (s) { codes.push(s.textContent); s.remove(); });
    shadow.appendChild(tpl.content);
    var root = shadow.querySelector('.lb-root');
    if (!root) throw new Error('預覽檔沒有 lb-root：' + b.id);
    if (b.category === 'hero') root.setAttribute('data-header', b.relation || 'below');
    if (b.category === 'header' && ctx.over) root.setAttribute('data-over', ctx.over);
    (b.accessoriesOff || []).forEach(function (n) { root.querySelectorAll('[data-acc="' + n + '"]').forEach(function (el) { el.hidden = true; }); });
    (b.extrasOn || []).forEach(function (n) { root.querySelectorAll('[data-extra="' + n + '"]').forEach(function (el) { el.setAttribute('data-on', ''); }); });
    var cleanups = [];
    var m = { host: host, root: root, key: keyOf(b, ctx), cleanups: cleanups, codes: codes, extras: b.extrasOn || [] };
    return m;
  }
  // 腳本要等 host 放進頁面之後才執行（量得到尺寸）
  function run(m) {
    var c = { extras: m.extras, reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches, onCleanup: function (f) { m.cleanups.push(f); } };
    m.codes.forEach(function (code) {
      try { new Function('root', 'ctx', code)(m.root, c); } catch (e) { post({ type: 'lb:error', id: m.host.dataset.id, message: String(e) }); }
    });
    m.codes = [];
  }
  // 頁首高度 → --header-h（主視覺用它留出頂端空白或扣掉高度）
  function watchHeader() {
    if (headerObs) headerObs.disconnect();
    var h = null; mounted.forEach(function (m) { if (m.host.dataset.category === 'header') h = m.root; });
    var set = function () { document.documentElement.style.setProperty('--header-h', (h ? Math.round(h.getBoundingClientRect().height) : 0) + 'px'); };
    set();
    if (h) { headerObs = new ResizeObserver(set); headerObs.observe(h); }
  }

  function setBlocks(list, scrollTo, tail) {
    var my = ++seq;
    page.toggleAttribute('data-tail', !!tail);
    // 頁首放在主視覺之後的搭配（after）：頁首排在主視覺後面
    var hero = list.find(function (b) { return b.category === 'hero'; });
    var rel = hero && hero.relation;
    var ctx = { over: rel === 'overlay' || rel === 'inset' ? rel : '' };
    var ordered = list.slice().sort(function (a, b) {
      var oa = ORDER[a.category], ob = ORDER[b.category];
      if (rel === 'after') { if (a.category === 'header') oa = 1.5; if (b.category === 'header') ob = 1.5; }
      return oa - ob;   // sort 是穩定的，同類別維持傳入的順序
    });
    return Promise.all([baseSheet()].concat(ordered.map(function (b) {
      return load(b.id).catch(function (e) { post({ type: 'lb:error', id: b.id, message: String(e.message || e) }); return null; });
    }))).then(function (res) {
      if (my !== seq) return;               // 等待期間又收到新的清單，這一次作廢
      var css = res[0], keep = new Set();
      var fresh = [];
      ordered.forEach(function (b, i) {
        var html = res[i + 1]; if (html == null) return;
        var k = keyOf(b, ctx), m = mounted.get(b.id);
        if (!m || m.key !== k) {
          if (m) unmount(b.id);
          try { m = mount(b, html, css, ctx); } catch (e) { post({ type: 'lb:error', id: b.id, message: String(e.message || e) }); return; }
          mounted.set(b.id, m); fresh.push(m);
        }
        keep.add(b.id);
      });
      Array.from(mounted.keys()).forEach(function (id) { if (!keep.has(id)) unmount(id); });
      // 依順序放回頁面：位置正確的不動，避免重新觸發動畫
      var prev = null;
      ordered.forEach(function (b) {
        var m = mounted.get(b.id); if (!m) return;
        var want = prev ? prev.nextSibling : page.firstChild;
        if (want !== m.host) page.insertBefore(m.host, want);
        prev = m.host;
      });
      watchHeader();
      fresh.forEach(run);
      if (scrollTo) scroll(scrollTo);
      post({ type: 'lb:rendered', ids: ordered.map(function (b) { return b.id; }).filter(function (id) { return mounted.has(id); }), height: document.documentElement.scrollHeight });
    });
  }
  function scroll(id) {
    var m = mounted.get(id); if (!m) return;
    var y = m.root.getBoundingClientRect().top + scrollY;
    scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }

  addEventListener('message', function (e) {
    if (location.origin !== 'null' && e.origin !== location.origin) return;   // 只收同網域的訊息
    var d = e.data || {};
    if (d.type === 'lb:set') setBlocks(d.blocks || [], d.scrollTo, d.tail);
    else if (d.type === 'lb:tokens') Object.keys(d.vars || {}).forEach(function (k) {
      if (/^--(lb-[a-z0-9-]+)$/.test(k)) { if (d.vars[k] == null) document.documentElement.style.removeProperty(k); else document.documentElement.style.setProperty(k, d.vars[k]); }
    });
    else if (d.type === 'lb:scrollTo') scroll(d.id);
    else if (d.type === 'lb:preload') (d.ids || []).forEach(function (id) { load(id).catch(function () {}); });
  });

  // 網址測試：?blocks=a,b,c&relation=overlay&off=hero-x:0&extras=hero-x:1&tail=1
  var q = new URLSearchParams(location.search);
  if (q.get('blocks')) {
    var parse = function (s) { var o = {}; (s || '').split(',').filter(Boolean).forEach(function (p) { var kv = p.split(':'); (o[kv[0]] = o[kv[0]] || []).push(+kv[1]); }); return o; };
    var off = parse(q.get('off')), ex = parse(q.get('extras'));
    setBlocks(q.get('blocks').split(',').filter(Boolean).map(function (id) {
      var c = id.split('-')[0];
      return { id: id, category: ORDER[c] != null ? c : 'content', relation: c === 'hero' ? q.get('relation') || 'overlay' : undefined, accessoriesOff: off[id], extrasOn: ex[id] };
    }), undefined, q.get('tail') === '1');
  }
  window.lbPreview = { set: setBlocks, mounted: mounted };
  post({ type: 'lb:ready' });
})();
