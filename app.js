(function(){
  var rok=document.getElementById('rok'); if(rok) rok.textContent=new Date().getFullYear();

  // menu mobilne
  var burger=document.getElementById('burger'), nav=document.getElementById('nav');
  function zamknij(){nav.classList.remove('otwarte');burger.setAttribute('aria-expanded','false');burger.setAttribute('aria-label','Otwórz menu');document.body.style.overflow='';}
  burger.addEventListener('click',function(){
    var o=!nav.classList.contains('otwarte');
    nav.classList.toggle('otwarte',o);burger.setAttribute('aria-expanded',String(o));
    burger.setAttribute('aria-label',o?'Zamknij menu':'Otwórz menu');document.body.style.overflow=o?'hidden':'';
  });
  nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',zamknij)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')zamknij()});

  // aktywna dokładnie bieżąca sekcja w menu
  var linki=[].slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sekcje=linki.map(function(a){return document.querySelector(a.getAttribute('href'))}).filter(Boolean);
  function akt(){
    var y=window.scrollY+window.innerHeight*0.35, cur=null;
    sekcje.forEach(function(s){if(s.offsetTop<=y)cur=s});
    if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-4) cur=sekcje[sekcje.length-1];
    linki.forEach(function(a){a.classList.toggle('akt',cur&&a.getAttribute('href')==='#'+cur.id)});
  }

  // pasek z telefonem po przewinięciu pierwszego ekranu
  var pasek=document.getElementById('pasek'), hero=document.querySelector('.hero'), kontakt=document.getElementById('kontakt');
  function pas(){
    var r=kontakt.getBoundingClientRect();
    var pokaz=hero.getBoundingClientRect().bottom<0 && r.top>window.innerHeight*0.6;
    pasek.classList.toggle('widoczny',pokaz);
  }
  var t=false;
  window.addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(function(){akt();pas();t=false})}},{passive:true});
  akt();pas();

  // karuzele: palec (natywnie), mysz (przeciąganie), kropki
  document.querySelectorAll('[data-karuzela]').forEach(function(k){
    var navk=k.parentNode.querySelector('.karuzela-nav'), el=[].slice.call(k.children);
    if(navk){
      el.forEach(function(c,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Pokaż '+(i+1));b.addEventListener('click',function(){k.scrollTo({left:c.offsetLeft-k.offsetLeft,behavior:'smooth'})});navk.appendChild(b)});
      var kropki=[].slice.call(navk.children);
      var upd=function(){var i=Math.round(k.scrollLeft/(el[0].offsetWidth+parseFloat(getComputedStyle(k).columnGap||0)));kropki.forEach(function(b,j){b.setAttribute('aria-current',String(j===Math.min(i,kropki.length-1)))})};
      k.addEventListener('scroll',upd,{passive:true});upd();
    }
    var down=false,sx=0,sl=0,moved=false;
    k.addEventListener('mousedown',function(e){down=true;moved=false;sx=e.pageX;sl=k.scrollLeft});
    window.addEventListener('mousemove',function(e){if(!down)return;var dx=e.pageX-sx;if(Math.abs(dx)>5){moved=true;k.classList.add('ciagnie')}k.scrollLeft=sl-dx});
    window.addEventListener('mouseup',function(){if(!down)return;down=false;k.classList.remove('ciagnie');
      var w=el[0].offsetWidth+parseFloat(getComputedStyle(k).columnGap||0);k.scrollTo({left:Math.round(k.scrollLeft/w)*w,behavior:'smooth'})});
    k.addEventListener('click',function(e){if(moved){e.preventDefault();e.stopPropagation();moved=false}},true);
    k.addEventListener('dragstart',function(e){e.preventDefault()});
  });

  // formularz pokazowy
  var f=document.getElementById('formularz');
  f.addEventListener('submit',function(e){e.preventDefault();var i=document.getElementById('f-info');i.textContent='Dziękujemy. To wersja testowa - na gotowej stronie zapytanie trafi na info@edukacja2001.pl.';i.classList.add('ok')});
})();
