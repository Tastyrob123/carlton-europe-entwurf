/* Fehlermelder (R03), vor allem anderen: Skriptfehler in den Browser (ce_fehler, liest die Prüfung von Le Bureau) und an dessen Server-Teil.
   Netzfehler nie melden, höchstens 20 je Seite, eigener Fehlschlag wird nicht erneut gemeldet (wie Le Bureau). */
(function(){var zahl=0;function merk(t){t=String(t);window.MAISON_FEHLER=t;if(++zahl>20||/Load failed|access control|abort|NetworkError|Failed to fetch/i.test(t))return;
try{var a=JSON.parse(localStorage.getItem('ce_fehler')||'[]');a.push({zeit:new Date().toLocaleString('de-CH'),wo:'La Maison',text:t.slice(0,300)});localStorage.setItem('ce_fehler',JSON.stringify(a.slice(-12)))}catch(e){}
try{fetch('../control/api/b/fehler',{method:'POST',headers:{'Content-Type':'application/json','X-Studio':'1'},body:JSON.stringify({text:('La Maison · '+t).slice(0,600)}),keepalive:true}).catch(function(){})}catch(e){}}
window.addEventListener('error',function(e){if(e.target&&e.target.tagName==='SCRIPT'){window.MAISON_FEHLER='Die Datei '+e.target.getAttribute('src').split('?')[0]+' liess sich nicht laden.';return}merk((e.message||'Fehler')+' · '+(e.filename||'').split('/').pop()+':'+(e.lineno||''))},true);
window.addEventListener('unhandledrejection',function(e){merk('Versprechen: '+((e.reason&&e.reason.message)||e.reason))});
/* Startfehler-Tür (R04): ist maison.js beim Laden der Seite nicht durchgelaufen, sagt die Seite es, zeigt alles ohne Bewegung und führt zur Prüfung */
window.addEventListener('load',function(){if(window.MAISON_BEREIT)return;var t=document.getElementById('tuer');if(!t)return;
document.documentElement.classList.remove('js');document.getElementById('tuer-t').textContent=window.MAISON_FEHLER||'Das Programm der Seite ist nicht durchgelaufen.';t.hidden=false});})();
