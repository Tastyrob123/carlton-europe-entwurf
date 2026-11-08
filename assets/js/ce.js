/* Carlton-Europe · Gestaltungsentwurf Tasty Studios. Kein Framework, nativer Scroll.
   Sichtbarkeit über IntersectionObserver, ein einziger Takt (rAF) für alles Scroll-Getriebene. */
(function(){
  'use strict';
  var d=document, w=window, html=d.documentElement;
  var $=function(s,c){return (c||d).querySelector(s)}, $$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
  var still=/[?&]nomotion/.test(location.search)||w.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fein=w.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if(still) html.classList.add('still');

  /* Auftakt */
  var bereit=function(){ html.classList.add('geladen'); };
  if(still) bereit(); else { w.addEventListener('load',function(){ setTimeout(bereit,350); }); setTimeout(bereit,2200); }

  /* Buchstaben-Aufbau */
  $$('[data-buchstaben]').forEach(function(el){
    var i=0;
    (function gehe(n){
      Array.prototype.slice.call(n.childNodes).forEach(function(k){
        if(k.nodeType===3){
          var f=d.createDocumentFragment();
          k.textContent.split(/(\s+)/).forEach(function(wort){
            if(!wort) return;
            if(/^\s+$/.test(wort)){ f.appendChild(d.createTextNode(' ')); return; }
            var a=d.createElement('span'); a.className='bst'; var b=d.createElement('span'); b.style.setProperty('--i',i++); b.textContent=wort; a.appendChild(b); f.appendChild(a);
          });
          n.replaceChild(f,k);
        } else if(k.nodeType===1 && k.tagName!=='BR') gehe(k);
      });
    })(el);
  });

  /* Einblenden, Vorhänge, Laufband */
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.target.classList.contains('laufband')){ e.target.classList.toggle('lebt',e.isIntersecting); return; }
      if(e.isIntersecting){ e.target.classList.add('da'); io.unobserve(e.target); }
    });
  },{rootMargin:'0px 0px -8% 0px',threshold:.08});
  $$('.rv,.vorhang,.laufband').forEach(function(el){ io.observe(el); });

  /* Zahlen zählen hoch */
  var zio=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting) return; zio.unobserve(e.target);
      var el=e.target, ziel=parseFloat(el.dataset.zahl), komma=(el.dataset.zahl.split('.')[1]||'').length, tsd=el.dataset.tsd!==undefined;
      var fmt=function(v){ var s=v.toFixed(komma); if(tsd) s=s.replace(/\B(?=(\d{3})+(?!\d))/g,'’'); return s; };
      if(still){ el.textContent=fmt(ziel); return; }
      var t0=null, dauer=1400, von=el.dataset.von?parseFloat(el.dataset.von):0;
      (function lauf(t){ if(!t0) t0=t; var p=Math.min(1,(t-t0)/dauer), q=1-Math.pow(1-p,3); el.textContent=fmt(von+(ziel-von)*q); if(p<1) requestAnimationFrame(lauf); })(performance.now());
    });
  },{threshold:.6});
  $$('[data-zahl]').forEach(function(el){ zio.observe(el); });

  /* Menü */
  var mb=$('.insel .menue');
  if(mb){ mb.addEventListener('click',function(){ var o=html.classList.toggle('offen'); mb.setAttribute('aria-expanded',o); });
    $$('.tafel a').forEach(function(a){ a.addEventListener('click',function(){ html.classList.remove('offen'); mb.setAttribute('aria-expanded',false); }); }); }

  /* Schalter (zwei Zustände eines Bildes) */
  $$('[data-schalter]').forEach(function(s){
    var ziel=d.getElementById(s.dataset.schalter), text=s.dataset.text?d.getElementById(s.dataset.text):null;
    $$('button',s).forEach(function(b,i){ b.addEventListener('click',function(){
      $$('button',s).forEach(function(x){ x.setAttribute('aria-pressed',x===b); });
      if(ziel) ziel.dataset.stand=i; if(text) text.textContent=b.dataset.satz||'';
    }); });
  });

  /* Lift: zeigt die Etage, in der man gerade steht */
  var lift=$('.lift');
  if(lift){
    var kab=$('.kabine',lift), punkte=$$('a',lift), kap=$$('[data-etage]');
    var setze=function(id){ punkte.forEach(function(a,i){ var an=a.getAttribute('href')==='#'+id; if(an){ a.setAttribute('aria-current','true'); kab.style.transform='translateY('+(i*40)+'px)'; } else a.removeAttribute('aria-current'); }); };
    var lio=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting) setze(e.target.id); }); },{rootMargin:'-45% 0px -45% 0px'});
    kap.forEach(function(k){ lio.observe(k); });
    var fahrt=$('#fahrt'); if(fahrt) new IntersectionObserver(function(es){ html.classList.toggle('im-lift',es[0].isIntersecting); },{rootMargin:'-30% 0px -30% 0px'}).observe(fahrt);
  }

  /* Tische: Liste steuert das Bild */
  $$('.tische').forEach(function(t){
    var li=$$('li',t), bi=$$('.stapel img',t);
    var zeig=function(i){ li.forEach(function(x,j){ x.classList.toggle('an',j===i); }); bi.forEach(function(x,j){ x.classList.toggle('an',j===i); }); };
    li.forEach(function(x,i){ var b=$('button',x); if(fein) x.addEventListener('mouseenter',function(){ zeig(i); }); b.addEventListener('click',function(){ zeig(i); }); b.addEventListener('focus',function(){ zeig(i); }); });
    zeig(0);
  });

  /* Zimmer-Finder */
  $$('.finder').forEach(function(f){
    var raster=d.getElementById(f.dataset.raster), karten=$$('[data-passt]',raster), stand=$('.stand b',f), wahl={};
    var rechne=function(){
      var n=0;
      karten.forEach(function(k){ var p=k.dataset.passt.split(' '), ok=true; for(var q in wahl){ if(wahl[q] && p.indexOf(wahl[q])<0) ok=false; } k.classList.toggle('aus',!ok); if(ok) n++; });
      var offen=!Object.keys(wahl).some(function(q){return wahl[q];});
      stand.textContent=offen?'Sechs Arten zu wohnen. Ihre Antworten grenzen sie ein.':(n===0?'Dazu passt keine Kategorie. Nehmen Sie eine Antwort zurück.':(n===1?'Eine Kategorie passt.':n+' Kategorien passen.'));
    };
    $$('.wahl',f).forEach(function(wl){ $$('.pille',wl).forEach(function(b){ b.addEventListener('click',function(){
      var an=b.getAttribute('aria-pressed')==='true'; $$('.pille',wl).forEach(function(x){ x.setAttribute('aria-pressed','false'); });
      if(!an){ b.setAttribute('aria-pressed','true'); wahl[wl.dataset.frage]=b.dataset.wert; } else wahl[wl.dataset.frage]='';
      rechne();
    }); }); });
    var r=$('.stand button',f); if(r) r.addEventListener('click',function(){ wahl={}; $$('.pille',f).forEach(function(x){ x.setAttribute('aria-pressed','false'); }); rechne(); });
    rechne();
  });

  /* Aufstieg durch die Kategorien (Regler) */
  $$('.aufstieg').forEach(function(a){
    var reg=$('.regler',a), bi=$$('.bild img',a), daten=JSON.parse($('script[type="application/json"]',a).textContent);
    var nr=$('.stufe',a), name=$('h3',a), text=$('p',a), chips=$('.chips',a), link=$('a.knopf',a);
    var zeig=function(i){ var x=daten[i]; bi.forEach(function(b,j){ b.classList.toggle('an',j===i); });
      nr.innerHTML=(i+1)+'<small>von '+daten.length+'</small>'; name.textContent=x.name; text.textContent=x.text;
      chips.innerHTML=x.mit.map(function(m){return '<li>'+m+'</li>';}).join(''); if(link&&x.link) link.setAttribute('href',x.link); reg.setAttribute('aria-valuetext',x.name); };
    reg.addEventListener('input',function(){ zeig(+reg.value); }); zeig(+reg.value);
  });

  /* Apartments: Preis nach Monat */
  $$('.saison').forEach(function(s){
    var p=JSON.parse($('script[type="application/json"]',s).textContent), mon=$$('.monate .pille',s), f=$$('.preise b',s), zeit=$('.preise .zeit',s);
    var zeig=function(i){ mon.forEach(function(b,j){ b.setAttribute('aria-pressed',j===i); }); var st=p.stufe[p.monat[i]]; f.forEach(function(b,j){ b.textContent='ab CHF '+st.preis[j]; }); zeit.textContent=p.hinweis[i]||st.zeit; };
    mon.forEach(function(b,i){ b.addEventListener('click',function(){ zeig(i); }); }); zeig(new Date().getMonth());
  });

  /* Säle nach Personenzahl */
  $$('.saele').forEach(function(s){
    var reg=$('.regler',s), zahl=$('.gross span',s), satz=$('.treffer',s), karten=$$('.saal',s);
    var zeig=function(){ var n=+reg.value, k=0, kl=null; zahl.textContent=n;
      karten.forEach(function(x){ var max=+x.dataset.max, ok=max>=n; x.classList.toggle('aus',!ok); if(ok){ k++; if(!kl||max<+kl.dataset.max) kl=x; } });
      satz.textContent=k===0?'Für diese Grösse fragen Sie uns direkt an.':(k===1?'Ein Saal fasst Ihre Runde: '+$('h3',kl).textContent+'.':k+' Säle fassen Ihre Runde. Am knappsten passt: '+$('h3',kl).textContent+'.'); };
    reg.addEventListener('input',zeig); zeig();
  });

  /* Anfrage: Daten gehen mit ins Buchungssystem des Hauses */
  var iso=function(t){ return t.getFullYear()+'-'+('0'+(t.getMonth()+1)).slice(-2)+'-'+('0'+t.getDate()).slice(-2); };
  $$('form[data-buchung]').forEach(function(f){
    var an=f.elements.an, ab=f.elements.ab, heute=new Date(), morgen=new Date(heute.getTime()+864e5);
    an.min=iso(heute); an.value=iso(heute); ab.min=iso(morgen); ab.value=iso(new Date(heute.getTime()+2*864e5));
    an.addEventListener('change',function(){ var t=new Date(an.value); if(isNaN(t)) return; var n=new Date(t.getTime()+864e5); ab.min=iso(n); if(ab.value<=an.value) ab.value=iso(n); });
    f.addEventListener('submit',function(e){ e.preventDefault(); var g=[]; for(var i=0;i<+f.elements.gaeste.value;i++) g.push('A');
      w.open('https://www.simplebooking.it/ibe2/hotel/4401?lang=DE&cur=CHF&in='+an.value+'&out='+ab.value+'&guests='+encodeURIComponent(g.join(',')),'_blank','noopener'); });
  });
  $$('form[data-post]').forEach(function(f){ f.addEventListener('submit',function(e){ e.preventDefault(); var z=[];
    $$('input,select,textarea',f).forEach(function(x){ if(x.value) z.push(x.dataset.name+': '+x.value); });
    if(document.documentElement.getAttribute('data-live')!=='1'){ /* Entwurf (Werkbank-Regel 12, 17.10.2026): kein Mailprogramm, ein Hinweis */
      var alt=f.querySelector('.formular__danke'); if(alt) alt.remove(); var d=document.createElement('p'); d.className='formular__danke formular__entwurf'; d.setAttribute('role','status');
      d.textContent='Das ist ein Entwurf von Tasty Studios: Diese Anfrage wurde nicht verschickt. Auf der fertigen Seite geht sie direkt an das Haus.'; f.appendChild(d); return; }
    location.href='mailto:info@carltoneurope.ch?subject='+encodeURIComponent(f.dataset.post)+'&body='+encodeURIComponent(z.join('\n')); }); });

  /* Fuss freilegen: Höhe einmal messen, bei zu hohem Fuss normal fliessen lassen */
  var fuss=$('.fuss');
  var messFuss=function(){ if(!fuss) return; var h=fuss.offsetHeight; if(h>w.innerHeight*.92){ fuss.classList.add('fliesst'); html.style.setProperty('--fuss','0px'); } else { fuss.classList.remove('fliesst'); html.style.setProperty('--fuss',h+'px'); } };
  messFuss(); w.addEventListener('load',messFuss); var rt; w.addEventListener('resize',function(){ clearTimeout(rt); rt=setTimeout(function(){ messFuss(); messStrecken(); },160); });

  /* Strecken (quer laufende, angeheftete Reihen) — ein Takt */
  var strecken=$$('.strecke').map(function(el){ return {el:el,bahn:$('.bahn',el),bal:$('.fortschritt i',el),weg:0,top:0,sicht:false,letzt:-1}; });
  var quer=function(){ return w.innerWidth>900 && !still; };
  function messStrecken(){ strecken.forEach(function(s){
    if(!quer()){ s.el.style.height=''; s.bahn.style.transform=''; s.weg=0; return; }
    s.weg=Math.max(0,s.bahn.scrollWidth-w.innerWidth); s.el.style.height=(w.innerHeight+s.weg)+'px'; s.top=s.el.getBoundingClientRect().top+w.scrollY; s.letzt=-1; }); }
  var sio=new IntersectionObserver(function(es){ es.forEach(function(e){ strecken.forEach(function(s){ if(s.el===e.target) s.sicht=e.isIntersecting; }); }); wecke(); });
  strecken.forEach(function(s){ sio.observe(s.el); });
  var laeuft=false;
  function takt(){ laeuft=false; var y=w.scrollY, wach=false;
    strecken.forEach(function(s){ if(!s.sicht||!s.weg) return; wach=true; var p=Math.min(1,Math.max(0,(y-s.top)/s.weg)); if(Math.abs(p-s.letzt)<.0004) return; s.letzt=p;
      s.bahn.style.transform='translate3d('+(-p*s.weg).toFixed(1)+'px,0,0)'; if(s.bal) s.bal.style.transform='scaleX('+p.toFixed(4)+')'; });
    if(wach) wecke(); }
  function wecke(){ if(!laeuft && strecken.some(function(s){return s.sicht&&s.weg;})){ laeuft=true; requestAnimationFrame(takt); } }
  if(strecken.length){ messStrecken(); w.addEventListener('load',function(){ messFuss(); messStrecken(); }); if(d.fonts&&d.fonts.ready) d.fonts.ready.then(messStrecken); }

  /* Zeiger und magnetische Knöpfe (nur Maus) */
  if(fein && !still){
    var z=d.createElement('div'); z.className='zeiger'; d.body.appendChild(z); var zx=0,zy=0,tx=0,ty=0,zl=false;
    var zt=function(){ zx+=(tx-zx)*.22; zy+=(ty-zy)*.22; z.style.transform='translate3d('+zx.toFixed(1)+'px,'+zy.toFixed(1)+'px,0)'; if(Math.abs(tx-zx)+Math.abs(ty-zy)>.3) requestAnimationFrame(zt); else zl=false; };
    w.addEventListener('pointermove',function(e){ tx=e.clientX; ty=e.clientY; z.classList.add('an'); if(!zl){ zl=true; requestAnimationFrame(zt); } },{passive:true});
    d.addEventListener('pointerover',function(e){ z.classList.toggle('gross',!!(e.target.closest&&e.target.closest('a,button,.pille,input[type=range]'))); },{passive:true});
    $$('.knopf:not(.klar)').forEach(function(k){
      k.addEventListener('pointermove',function(e){ var r=k.getBoundingClientRect(); k.style.transform='translate('+((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.28).toFixed(1)+'px)'; });
      k.addEventListener('pointerleave',function(){ k.style.transform=''; });
    });
  }
})();
