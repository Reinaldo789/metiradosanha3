/* Menu e navegação. A lista de páginas vem de paginas.json:
   para criar ou renomear um item, edite apenas esse arquivo. */
const $ = s => document.querySelector(s);
const app = $('#app'), nav = $('#nav'), bg = $('#burger');
let MENUS = [];

const card = (m, i) => `<a class="card" href="#/${m.slug}/${i.slug}"><span class="kick">${m.titulo}</span><h3>${i.titulo}</h3><p class="mut">Funcionamento, sintomas e diagnóstico.</p></a>`;

function montarMenu() {
  $('#menu').innerHTML = MENUS.map(m => `<li><a class="top" href="#/${m.slug}">${m.titulo}</a><div class="sub"><div class="mega"><div class="intro"><span class="ico">${m.icone || ''}</span><h3>${m.titulo}</h3><p>${m.descricao || ''}</p><a class="all" href="#/${m.slug}">Ver todos →</a></div><div class="links">${m.itens.map(i => `<a href="#/${m.slug}/${i.slug}">${i.titulo}</a>`).join('')}</div></div></div></li>`).join('');
  const mob = () => matchMedia('(max-width:800px)').matches;
  document.querySelectorAll('#menu .top').forEach(t => t.addEventListener('click', e => {
    if (!mob()) return;
    e.preventDefault();
    const li = t.parentElement, aberto = li.classList.contains('open');
    document.querySelectorAll('#menu li.open').forEach(x => x.classList.remove('open'));
    if (!aberto) li.classList.add('open');
  }));
}

bg.onclick = () => {
  const o = nav.classList.toggle('open');
  bg.textContent = o ? '✕' : '☰';
  document.body.style.overflow = o ? 'hidden' : '';
};

function rota() {
  nav.classList.remove('open'); bg.textContent = '☰'; document.body.style.overflow = ''; scrollTo(0, 0);
  const [a, b] = location.hash.replace('#/', '').split('/');
  const M = MENUS.find(x => x.slug === a);
  if (!M) {
    const f = MENUS[0], fi = f.itens[0];
    app.innerHTML = `<div class="hero"><a class="big" href="#/${f.slug}/${fi.slug}"><span class="kick">Destaque</span><h1>Guia técnico de sistemas do veículo</h1><p class="mut">Elétrica, alimentação de combustível, sensores e atuadores, motor e chassi — tudo organizado em um só lugar.</p></a><div class="side">${MENUS.slice(1).map(m => `<a class="mini" href="#/${m.slug}"><span class="kick">Seção</span><h2>${m.titulo}</h2><p class="mut">${m.itens.length} tópicos</p></a>`).join('')}</div></div>`
      + MENUS.map(m => `<section class="sec"><h2>${m.titulo}</h2><div class="grid">${m.itens.slice(0, 4).map(i => card(m, i)).join('')}</div><p><a class="kick" href="#/${m.slug}">Ver todos →</a></p></section>`).join('');
    return;
  }
  const I = M.itens.find(x => x.slug === b);
  if (!I) {
    app.innerHTML = `<div class="crumb"><a href="#/">Início</a> › ${M.titulo}</div><h1>${M.titulo}</h1><div class="grid sec">${M.itens.map(i => card(M, i)).join('')}</div>`;
    return;
  }
  const k = M.itens.indexOf(I), p = M.itens[k - 1], n = M.itens[k + 1];
  const nav2 = `<div class="grid">${p ? `<a class="card" href="#/${M.slug}/${p.slug}">← ${p.titulo}</a>` : ''}${n ? `<a class="card" href="#/${M.slug}/${n.slug}">${n.titulo} →</a>` : ''}</div>`;
  const topo = `<div class="crumb"><a href="#/">Início</a> › <a href="#/${M.slug}">${M.titulo}</a> › ${I.titulo}</div><span class="kick">${M.titulo}</span><h1>${I.titulo}</h1>`;
  app.innerHTML = topo + '<p class="mut">Carregando…</p>';
  // O texto de cada página fica em conteudo/<menu>/<item>.html
  fetch(`conteudo/${M.slug}/${I.slug}.html`)
    .then(r => { if (!r.ok) throw 0; return r.text(); })
    .then(h => { if (location.hash.endsWith(`${M.slug}/${I.slug}`)) app.innerHTML = topo + `<article class="artigo">${h}</article>` + nav2; })
    .catch(() => { app.innerHTML = topo + '<p class="mut">Conteúdo em preparação.</p>' + nav2; });
}

fetch('paginas.json')
  .then(r => r.json())
  .then(d => { MENUS = d; montarMenu(); addEventListener('hashchange', rota); rota(); })
  .catch(() => { app.innerHTML = '<h1>Não foi possível carregar o menu</h1><p class="mut">Abra o site por um servidor (GitHub Pages ou <code>python -m http.server</code>); abrir o arquivo direto no navegador bloqueia o paginas.json.</p>'; });
