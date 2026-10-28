const $=(s,e=document)=>e.querySelector(s);
const dirName=d=>d==='code'?'Програмування':'Вебдизайн';
const money=n=>n.toLocaleString('uk-UA')+' ₴';
let lastBtn=null;
// меню
document.querySelectorAll('#menu a').forEach(a=>{if(location.pathname.endsWith(a.getAttribute('href')))a.classList.add('on')});
$('#burger').onclick=()=>$('#menu').classList.toggle('show');
// картка курсу
const card=c=>`<article class="card"><img src="${c.img}" alt="Курс «${c.title}»" loading="lazy"><div class="cb"><span class="tag">${dirName(c.dir)}</span><h3>${c.title}</h3><p>${c.desc}</p><div class="meta"><span>${c.weeks} тижнів</span><span>${c.level}</span></div><div class="row"><b>${money(c.price)}</b><button class="btn s" data-id="${c.id}">Детальніше</button></div></div></article>`;
// модальне вікно
function openModal(html){const m=$('#modal');$('#mbody').innerHTML=html;m.hidden=false;$('.x',m).focus()}
function closeModal(){$('#modal').hidden=true;lastBtn&&lastBtn.focus()}
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal'||e.target.classList.contains('x'))closeModal()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#modal').hidden)closeModal()});
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-id],[data-img]');if(!b)return;lastBtn=b;
 if(b.dataset.id){const c=COURSES.find(x=>x.id==b.dataset.id);
  openModal(`<img src="${c.img}" alt=""><div class="mb"><span class="tag">${dirName(c.dir)}</span><h2>${c.title}</h2><p>${c.desc}</p><h3>Програма курсу</h3><ol>${c.program.map(p=>`<li>${p}</li>`).join('')}</ol><a class="btn" href="contact.html?course=${c.id}">Записатися · ${money(c.price)}</a></div>`)}
 else openModal(`<img src="${b.dataset.img}" alt="${b.dataset.t}"><div class="mb"><b>${b.dataset.t}</b></div>`)});
// головна
const fe=$('#featured');if(fe)fe.innerHTML=COURSES.filter(c=>[1,3,4].includes(c.id)).map(card).join('');
const g=$('#gallery');if(g)g.innerHTML=WORKS.map(w=>`<button data-img="${w.img}" data-t="${w.t}" aria-label="Відкрити: ${w.t}"><img src="${w.img}" alt="${w.t}" loading="lazy"></button>`).join('');
const ed=$('#editor');if(ed){const t='<i>const</i> student = {\n  name: "Ти",\n  goal: "<em>перша робота в IT</em>",\n  start: "<em>сьогодні</em>"\n};';let i=0;ed.style.whiteSpace='pre';
 const tick=()=>{ed.innerHTML=t.slice(0,i);if(++i<=t.length)setTimeout(tick,45)};
 matchMedia('(prefers-reduced-motion:reduce)').matches?ed.innerHTML=t:tick()}
// каталог: фільтр + пошук
const cat=$('#catalog');if(cat){let dir='all';const q=$('#q');
 const draw=()=>{const s=q.value.trim().toLowerCase();
  const l=COURSES.filter(c=>(dir==='all'||c.dir===dir)&&(c.title+c.desc).toLowerCase().includes(s));
  cat.innerHTML=l.length?l.map(card).join(''):'<p>Нічого не знайдено. Спробуйте інший запит або оберіть «Усі».</p>'};
 document.querySelectorAll('[data-dir]').forEach(b=>b.onclick=()=>{dir=b.dataset.dir;document.querySelectorAll('[data-dir]').forEach(x=>x.classList.toggle('on',x===b));draw()});
 q.oninput=draw;draw()}
// форми (заявки зберігаються в localStorage)
const sel=$('#course');if(sel){sel.innerHTML='<option value="">Оберіть курс</option>'+COURSES.map(c=>`<option value="${c.id}">${c.title}</option>`).join('');
 sel.value=new URLSearchParams(location.search).get('course')||''}
document.querySelectorAll('form[data-form]').forEach(f=>f.addEventListener('submit',e=>{e.preventDefault();
 const d=Object.fromEntries(new FormData(f));let err='';
 if((d.name||'').trim().length<2)err='Вкажіть імʼя (мінімум 2 літери).';
 else if(!/^\S+@\S+\.\S{2,}$/.test(d.email||''))err='Введіть коректну пошту, наприклад name@mail.com.';
 else if(f.dataset.form==='lead'&&!d.agree)err='Підтвердіть згоду на обробку даних.';
 $('.err',f).textContent=err;if(err)return;
 try{const l=JSON.parse(localStorage.getItem('pp-leads')||'[]');l.push({...d,date:new Date().toISOString()});localStorage.setItem('pp-leads',JSON.stringify(l))}catch(_){}
 f.innerHTML=`<p class="ok">Дякуємо, ${d.name.trim()}! Ми напишемо вам на ${d.email} протягом доби.</p>`}));
// FAQ
document.querySelectorAll('.faq button').forEach(b=>{b.setAttribute('aria-expanded','false');b.onclick=()=>{const o=b.classList.toggle('open');b.setAttribute('aria-expanded',o)}});

// відгуки, наставники, тарифи, лічильники
const rv=$('#reviews');if(rv){const n=+rv.dataset.n||REVIEWS.length;rv.innerHTML=REVIEWS.slice(0,n).map(r=>`<figure class="card q"><blockquote>«${r.text}»</blockquote><figcaption><b>${r.name}</b><br><span>${r.course}</span></figcaption></figure>`).join('')}
const tm=$('#team');if(tm)tm.innerHTML=TEAM.map(t=>`<article class="card"><img src="${t.img}" alt="${t.name}" loading="lazy"><div class="cb"><h3>${t.name}</h3><span class="tag">${t.role}</span><p>${t.bio}</p></div></article>`).join('');
const pl=$('#plans');if(pl)pl.innerHTML=PLANS.map(p=>`<article class="card plan${p.hot?' hot':''}"><div class="cb">${p.hot?'<span class="tag">Найпопулярніший</span>':''}<h3>${p.name}</h3><b class="big">${money(p.price)}</b><ul>${p.feat.map(f=>`<li>${f}</li>`).join('')}</ul><a class="btn${p.hot?'':' alt'}" href="contact.html">Обрати тариф</a></div></article>`).join('');
document.querySelectorAll('[data-count]').forEach(el=>{const to=+el.dataset.count,t0=performance.now(),run=t=>{const k=Math.min((t-t0)/1200,1);el.textContent=Math.round(to*k).toLocaleString('uk-UA')+(el.dataset.suf||'');if(k<1)requestAnimationFrame(run)};
 matchMedia('(prefers-reduced-motion:reduce)').matches?el.textContent=to.toLocaleString('uk-UA')+(el.dataset.suf||''):new IntersectionObserver((e,o)=>{if(e[0].isIntersecting){requestAnimationFrame(run);o.disconnect()}}).observe(el)});
