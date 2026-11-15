/* Shared shell + the demo's simulated backend (localStorage stands in for Firestore). */
(function(){
  const D = DEMO;
  const store = {
    get(k, d){ try { const v = localStorage.getItem('aif.' + k); return v == null ? d : JSON.parse(v); } catch(e){ return d; } },
    set(k, v){ try { localStorage.setItem('aif.' + k, JSON.stringify(v)); } catch(e){} },
    del(k){ try { localStorage.removeItem('aif.' + k); } catch(e){} }
  };
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const $ = (s, el=document) => el.querySelector(s);
  const $$ = (s, el=document) => [...el.querySelectorAll(s)];
  function toast(msg){ $$('.toast').forEach(t => t.remove()); const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role','status'); t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2800); }

  /* ---------- who you're viewing as ---------- */
  const ROLES = { visitor:'Visitor', pending:'Waitlisted', member:'Member', staff:'Staff' };
  const role = () => store.get('role', 'visitor');
  const isMember = () => ['member','staff'].includes(role());
  const isStaff = () => role() === 'staff';

  /* ---------- domain intelligence: seed + learned layers ---------- */
  const domainOf = e => { const m = String(e || '').trim().toLowerCase().match(/^[^@\s]+@([^@\s]+\.[^@\s]+)$/); return m ? m[1] : null; };
  const learned = () => store.get('learned', {});
  function resolve(email){
    const d = domainOf(email);
    if (!d) return { domain:null, track:null, why:'Not an email address yet.' };
    if (D.PERSONAL.includes(d)) return { domain:d, track:null, personal:true, why:'Personal mail never resolves. One teacher on Gmail must not teach the system that Gmail is a district.' };
    const l = learned()[d];
    if (l) return ['k12','charter','highered'].includes(l.track)
      ? { domain:d, track:l.track, layer:'learned', org:l.org, why:'Learned from a staff approval. Learned beats seed.' }
      : { domain:d, track:null, layer:'learned', demoted:true, why:'Staff recategorized this domain as ' + l.track + ', so it goes to the application path.' };
    const s = D.SEED[d];
    if (s) return { domain:d, track:s.track, layer:'seed', org:s.org, why:'In the reviewed seed list.' };
    if (d.endsWith('.k12.example')) return { domain:d, track:'k12', layer:'rule', why:'Any *.k12 state domain counts as K-12.' };
    if (d.endsWith('.edu')) return { domain:d, track:'highered', layer:'rule', why:'Any .edu address counts as higher ed.' };
    return { domain:d, track:null, why:'Unknown domain. The applicant picks a bucket and waits for staff.' };
  }

  /* ---------- applicants (the waitlist) ---------- */
  function applicants(){
    const st = store.get('apps', {});
    return D.APPLICANTS.concat(store.get('extra', [])).map(a => Object.assign({ status:'pending' }, a, st[a.id] || {}));
  }
  function setApp(id, patch){ const st = store.get('apps', {}); st[id] = Object.assign(st[id] || {}, patch); store.set('apps', st); }

  /* ---------- downloads ---------- */
  function download(name, text, type){
    const b = new Blob([text], { type }); const a = document.createElement('a');
    a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function ics(meetings){
    const dt = (id, h, m) => id.replace(/-/g,'') + 'T' + String(h).padStart(2,'0') + String(m).padStart(2,'0') + '00';
    const ev = meetings.map(m => ['BEGIN:VEVENT','UID:' + m.id + '@ai-forward-demo','DTSTAMP:20260801T000000Z',
      'DTSTART;TZID=America/Los_Angeles:' + dt(m.id, 8, 30),'DTEND;TZID=America/Los_Angeles:' + dt(m.id, 11, 30),
      'SUMMARY:AI Forward Network: ' + m.topic,'LOCATION:' + m.room,'DESCRIPTION:' + m.sub + ' (demo event)','END:VEVENT'].join('\r\n'));
    return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//AI Forward Network demo//EN','CALSCALE:GREGORIAN'].concat(ev, ['END:VCALENDAR']).join('\r\n');
  }

  /* ---------- shell ---------- */
  function shell(opts){
    opts = opts || {};
    const page = location.pathname.split('/').pop() || 'index.html';
    const L = [['index.html','Network'],['meetings.html','Meetings'],['join.html','Join'],['community.html','Community'],['summit.html','Summit'],['admin.html','Admin','staff'],['how-it-works.html','How it works']];
    document.body.insertAdjacentHTML('afterbegin',
      `<div class="demo-bar">Demo build &middot; every person, district, and number here is invented &middot; <a href="https://github.com/wkriesel/ai-forward-network">source</a></div>
       <header class="top"><div class="top-in">
         <a class="brand" href="index.html"><span class="dot" aria-hidden="true">AI</span>AI Forward Network</a>
         <label class="viewas">View as <select id="viewas" aria-label="View the site as">${Object.entries(ROLES).map(([k,v]) => `<option value="${k}"${k===role()?' selected':''}>${v}</option>`).join('')}</select></label>
         <nav class="links" aria-label="Main">${L.map(([h,l,c]) => { const cls = [c, h===page ? 'current' : ''].filter(Boolean).join(' ');
           return `<a href="${h}"${cls?' class="'+cls+'"':''}${h===page?' aria-current="page"':''}>${l}</a>`; }).join('')}</nav>
       </div></header>`);
    document.body.insertAdjacentHTML('beforeend',
      `<footer>A portfolio rebuild of a year-round educator AI network and summit platform built for a county office of education.<br>
       Built by <a href="https://github.com/wkriesel">Wes Kriesel</a> &middot; Data saves to your browser only &middot; <button class="btn ghost sm" id="resetAll" style="margin-top:8px">Reset demo</button></footer>`);
    $('#viewas').addEventListener('change', e => { store.set('role', e.target.value); location.reload(); });
    $('#resetAll').addEventListener('click', () => { ['role','learned','apps','extra','ledger','kudos','qa','checked','posts','qahidden','mine','votes'].forEach(store.del); location.reload(); });
    if (opts.staffOnly && !isStaff()) {
      $('main').innerHTML = `<div class="card" style="max-width:560px"><p class="kicker">Staff only</p><h1 class="page">Admin is behind a role check</h1>
        <p class="muted" style="margin:8px 0 16px">In the real build, Firestore rules check a roles collection, plus two hardcoded owner accounts as a lockout safeguard. Here, switch "View as" to Staff.</p>
        <button class="btn navy" id="goStaff">View as Staff</button></div>`;
      $('#goStaff').addEventListener('click', () => { store.set('role','staff'); location.reload(); });
      return false;
    }
    return true;
  }

  window.APP = { store, esc, $, $$, toast, role, isMember, isStaff, ROLES, domainOf, resolve, learned, applicants, setApp, download, ics, shell };
})();
