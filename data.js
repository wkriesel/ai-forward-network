/* Everything in this file is invented for the demo. No real educator, district,
   school, or attendee appears in this repo. Institutional domains use the
   reserved .example suffix. */
(function(){
  /* ---------- Domain intelligence: the seed layer ---------- */
  // Districts often run split identity: staff mail on one domain, Google
  // Workspace on a second one. Both are listed, on purpose.
  const DISTRICTS = [
    ['Harbor Unified','harborusd.example','harborlearns.example'],
    ['Mesa Verde USD','mesaverde.example','mvstudents.example'],
    ['Coastline Union HSD','coastlinehs.example',null],
    ['Laguna Ridge USD','lagunaridge.example','lrlearn.example'],
    ['Canyon Springs USD','canyonsprings.example',null],
    ['Orchard Valley SD','orchardvalley.example',null],
    ['Bayview USD','bayviewusd.example','bayviewgo.example'],
    ['Saddle Peak USD','saddlepeak.example',null],
    ['Fairhaven USD','fairhaven.example',null],
    ['Silverado USD','silverado.example',null]
  ];
  const SEED = {};
  DISTRICTS.forEach(([n, a, b]) => { SEED[a] = { track:'k12', org:n }; if (b) SEED[b] = { track:'k12', org:n + ' (Google domain)' }; });
  SEED['brightpathcharter.example'] = { track:'charter', org:'Brightpath Charter' };
  SEED['northstaracademy.example'] = { track:'charter', org:'North Star Academy' };

  const PERSONAL = ['gmail.com','yahoo.com','outlook.com','hotmail.com','icloud.com','aol.com','proton.me','personalmail.example'];
  const TRACK = { k12:'County K-12', charter:'County Charter', highered:'Higher Ed', guest:'Guest', partner:'Partner' };

  /* ---------- Waitlist + members ---------- */
  // status "pending" = the waitlist. Only staff can flip it to "active".
  const APPLICANTS = [
    { id:'u01', name:'Dana Whitfield',  email:'dwhitfield@harborusd.example',   role:'Instructional coach', applied:'Sep 02' },
    { id:'u02', name:'Marcus Lee',      email:'mlee@mvstudents.example',         role:'Assistant principal', applied:'Sep 03', contact:'marcus.lee@mesaverde.example' },
    { id:'u03', name:'Priya Raman',     email:'praman@lagunaridge.example',      role:'TOSA, technology',    applied:'Sep 03' },
    { id:'u04', name:'Gabe Ortiz',      email:'gortiz@brightpathcharter.example',role:'Director of ed tech', applied:'Sep 04' },
    { id:'u05', name:'Helen Cho',       email:'hcho@canyonsprings.example',      role:'Librarian',           applied:'Sep 05' },
    { id:'u06', name:'Ruth Adeyemi',    email:'radeyemi@stateuniversity.edu',    role:'Teacher-prep faculty',applied:'Sep 05' },
    // self-declared: domain unknown, picked "county public district"
    { id:'u07', name:'Tom Becker',      email:'tbecker@juniperusd.example',      role:'CTE teacher',         applied:'Sep 06', declared:'k12' },
    { id:'u08', name:'Lena Park',       email:'lpark@juniperusd.example',        role:'Counselor',           applied:'Sep 08', declared:'k12' },
    // reclassified: was stamped "guest" at sign-up; the domain was added to the seed later
    { id:'u09', name:'Sam Rivera',      email:'srivera@bayviewgo.example',       role:'Science teacher',     applied:'Aug 29', stamped:'guest' },
    // guest + partner applications
    { id:'u10', name:'Alex Morgan',     email:'alex@edtechsales.example',        role:'Account executive',   applied:'Sep 06', declared:'guest', reason:'Want to see what districts are asking for.', meeting:'Oct 16' },
    { id:'u11', name:'Jordan Ellis',    email:'jordan@learningnonprofit.example',role:'Program director',    applied:'Sep 07', declared:'partner', reason:'We run free family AI-literacy nights and want to co-host.' },
    { id:'u12', name:'Chris Nolan',     email:'chris.nolan@gmail.com',           role:'Teacher',             applied:'Sep 07', declared:'k12' }
  ];
  const MEMBERS = [
    { id:'m01', name:'Elena Vasquez', email:'evasquez@harborusd.example', role:'Director, innovation', track:'k12', xp:11 },
    { id:'m02', name:'Kofi Mensah',   email:'kmensah@saddlepeak.example', role:'Math teacher',          track:'k12', xp:7 },
    { id:'m03', name:'Ana Lopes',     email:'alopes@fairhaven.example',   role:'Principal',             track:'k12', xp:14 },
    { id:'m04', name:'Ben Carter',    email:'bcarter@northstaracademy.example', role:'Teacher',         track:'charter', xp:5 },
    { id:'m05', name:'Mia Torres',    email:'mtorres@silverado.example',  role:'SpEd coordinator',      track:'k12', xp:9 },
    { id:'m06', name:'Ivy Chen',      email:'ivy@learningpartners.example', role:'Nonprofit lead',      track:'partner', xp:6 }
  ];

  /* ---------- The program year ---------- */
  const MEETINGS = [
    { id:'2026-08-28', date:'Fri, Aug 28', topic:'How do you know if AI is helping?', sub:'Year kickoff: efficiency, engagement, empowerment', time:'8:30-11:30 am', room:'Room 101, County Ed Center', code:'SPARK' },
    { id:'2026-10-16', date:'Fri, Oct 16', topic:'Governance, security & vendor vetting', sub:'What to ask before a tool touches student data', time:'8:30-11:30 am', room:'Board Room, County Ed Center', code:'VETTED' },
    { id:'2026-12-11', date:'Fri, Dec 11', topic:'Specialized AI workflows', sub:'Three tracks: business & HR, special education, multilingual learners', time:'8:30-11:30 am', room:'Rooms 101-103', code:'TRACKS' },
    { id:'2027-01-08', date:'Fri, Jan 8',  topic:'Role-flexible applied AI', sub:'Everyday automation across roles', time:'8:30-11:30 am', room:'Room 101', code:'FLEX' },
    { id:'2027-02-05', date:'Fri, Feb 5',  topic:'AI in professional learning', sub:'Designing adaptive PD for adults', time:'8:30-11:30 am', room:'Room 101', code:'ADULT' },
    { id:'2027-03-05', date:'Fri, Mar 5',  topic:'Assignments AI can\'t do for them', sub:'Assessment redesign', time:'8:30-11:30 am', room:'Room 101', code:'REDESIGN' },
    { id:'2027-04-02', date:'Fri, Apr 2',  topic:'From doing to directing', sub:'Agentic workflows + builders showcase', time:'8:30-11:30 am', room:'Auditorium', code:'DIRECT' },
    { id:'2027-05-14', date:'Fri, May 14', topic:'Year-end reflection & impact showcase', sub:'What changed, with evidence', time:'8:30-11:30 am', room:'Auditorium', code:'IMPACT' }
  ];

  /* ---------- The 18-level ladder ---------- */
  const TIERS = [
    { key:'crawl',  name:'Crawl',  title:'Community Explorer', colors:['#8B5A2B','#B87333','#CC9933'] },
    { key:'walk',   name:'Walk',   title:'Vibe Builder',       colors:['#2E8B57','#00A86B','#3EB489'] },
    { key:'run',    name:'Run',    title:'Crowd Spark',        colors:['#008080','#0aa9b8','#0047AB'] },
    { key:'swim',   name:'Swim',   title:'Flow Catalyst',      colors:['#4B0082','#8A2BE2','#C21DC2'] },
    { key:'sprint', name:'Sprint', title:'Velocity Leader',    colors:['#DC143C','#FF4500','#E0A800'] },
    { key:'fly',    name:'Fly',    title:'Atmosphere Sovereign', colors:['#4fb3b3','#00A3AD','#B04FB0'] }
  ];
  // Member's ledger history before this month (docs at xpLedger/{uid}_{YYYY-MM}_{vector}).
  const LEDGER_SEED = [
    '2026-08_attend','2026-08_artifact','2026-08_advice',
    '2026-10_attend','2026-10_advice'
  ];

  const FEED = [
    { who:'Ana Lopes', role:'Principal', when:'2h', kind:'Artifact', text:'Built a parent-newsletter translator that keeps our school\'s voice. Cut a 3-hour Friday job to 25 minutes.', kudos:14 },
    { who:'Kofi Mensah', role:'Math teacher', when:'5h', kind:'Win', text:'Students wrote prompts that check AI\'s math instead of trusting it. Best discussion of the semester.', kudos:9 },
    { who:'Mia Torres', role:'SpEd coordinator', when:'1d', kind:'Advice', text:'Before you paste anything about a student into a tool, ask: would I put this on a postcard? If not, don\'t.', kudos:21 },
    { who:'Ivy Chen', role:'Partner', when:'2d', kind:'Event', text:'Free family AI night at three libraries next month. Flyers in Spanish, Vietnamese, and Korean in the links page.', kudos:7 }
  ];

  /* ---------- The summit ---------- */
  const STRANDS = [
    { id:'lead', name:'Leadership', color:'#1E3A5C' }, { id:'ped', name:'Pedagogy', color:'#E8813A' },
    { id:'tools', name:'Tools & builds', color:'#4f7562' }, { id:'data', name:'Data & privacy', color:'#7a4fa3' },
    { id:'well', name:'Wellbeing', color:'#c25b7a' }, { id:'work', name:'Workforce', color:'#2f7f8f' }
  ];
  const SESSIONS = [
    { id:'s1', t:'8:30',  strand:'lead',  title:'Opening keynote: the human advantage', who:'Dr. Renee Holloway', room:'Main hall' },
    { id:'s2', t:'9:45',  strand:'ped',   title:'Assignments that make thinking visible', who:'Kofi Mensah', room:'Room A' },
    { id:'s3', t:'9:45',  strand:'tools', title:'Build a classroom assistant in 40 minutes', who:'Priya Raman', room:'Lab 1' },
    { id:'s4', t:'9:45',  strand:'data',  title:'Vendor vetting: the ten questions', who:'Gabe Ortiz', room:'Room B' },
    { id:'s5', t:'11:00', strand:'well',  title:'AI and teacher time: where the hours go', who:'Helen Cho', room:'Room A' },
    { id:'s6', t:'11:00', strand:'work',  title:'Career pathways when entry-level work changes', who:'Ruth Adeyemi', room:'Room C' },
    { id:'s7', t:'11:00', strand:'lead',  title:'Writing a district AI guidance doc people read', who:'Elena Vasquez', room:'Room B' },
    { id:'s8', t:'1:00',  strand:'ped',   title:'Multilingual learners and AI translation', who:'Ana Lopes', room:'Room A' },
    { id:'s9', t:'1:00',  strand:'tools', title:'No-code automations for front offices', who:'Ben Carter', room:'Lab 1' },
    { id:'s10',t:'1:00',  strand:'data',  title:'Student data, consent, and the fine print', who:'Mia Torres', room:'Room C' },
    { id:'s11',t:'2:15',  strand:'lead',  title:'Closing: what will you try Monday?', who:'Student panel', room:'Main hall' }
  ];
  const QA = [
    { id:'q1', text:'How do we vet a free tool that has no data agreement at all?', votes:23 },
    { id:'q2', text:'What should a classroom AI policy say about drafts vs. final work?', votes:17 },
    { id:'q3', text:'Will any of this be on the state test?', votes:4 },
    { id:'q4', text:'Can students use the same tools at home if the district blocks them at school?', votes:12 }
  ];
  const TICKETS = { 'AIF-4821':'Dana Whitfield', 'AIF-1937':'Kofi Mensah', 'AIF-7264':'Helen Cho', 'AIF-3550':'Ruth Adeyemi' };

  window.DEMO = { DISTRICTS, SEED, PERSONAL, TRACK, APPLICANTS, MEMBERS, MEETINGS, TIERS, LEDGER_SEED, FEED, STRANDS, SESSIONS, QA, TICKETS,
    THIS_MONTH:'2026-12', THIS_MONTH_LABEL:'December', THIS_MONTH_CODE:'TRACKS', ME:{ id:'m02', name:'Kofi Mensah' } };
})();
