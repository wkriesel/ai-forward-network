# AI Forward Network + Summit (demo)

A year-round network for educators building with AI. It runs monthly meetings, a member community with an XP ladder, and an annual summit with ticketing, check-in, and live Q&A, all from one app.

**Live demo:** https://wkriesel.github.io/ai-forward-network/

I built and ran the original for a county office of education serving 28 K-12 districts. This repo rebuilds it for my portfolio with invented data. **No real educator, district, attendee, or session lives here.** Institutional domains use the reserved `.example` suffix.

Use **View as** at the top of any page to switch between Visitor, Waitlisted, Member, and Staff.

## Take the tour

| Page | What it shows |
| --- | --- |
| [Join](https://wkriesel.github.io/ai-forward-network/join.html) | Type any email and watch it get sorted into district, charter, higher ed, or the application path. Personal mail never verifies. |
| [Admin](https://wkriesel.github.io/ai-forward-network/admin.html) | A waitlist with one-click "approve all domain-verified." Approve one person from an unknown district and the next colleague from that domain is auto-verified. Includes domain recategorization and CSV export. |
| [Meetings](https://wkriesel.github.io/ai-forward-network/meetings.html) | Topics are public. Times, rooms, and working `.ics` invites unlock on approval. Room-code check-in earns XP. |
| [Community](https://wkriesel.github.io/ai-forward-network/community.html) | The monthly 3-A ladder (Attend, Artifact, Advice). Try earning the same XP twice and watch the ledger refuse. |
| [Summit](https://wkriesel.github.io/ai-forward-network/summit.html) | Schedule by strand, an iPad check-in kiosk with badge printing, and live Q&A with voting and moderation. |
| [How it works](https://wkriesel.github.io/ai-forward-network/how-it-works.html) | Architecture, the security rules that carry the weight, and the design decisions. |

## Problems it solves

- **Split identity.** Many districts deliver mail on one domain and run Google sign-in on another. The system knows both, and it sends email to the address people actually read.
- **Approval without a bottleneck.** Everyone lands on a waitlist, but domain-verified educators clear in bulk. Staff review guests and partners one at a time.
- **A domain list that maintains itself.** Approvals teach new domains, with guardrails: personal mail can't be learned, and trust in one consultant never extends to their whole company.
- **Engagement you can't game.** XP lives in documents with predictable IDs, so the security rules make double-awarding impossible. No counters needed.
- **Room to grow.** A one-day summit app grew into a year-round platform without a rewrite. Every printed ticket and QR code kept working.

## How the real one was built

Static HTML, CSS, and native ES modules with no build step, served from Firebase Hosting as an installable PWA. Firebase Auth handles Google sign-in and email magic links. Firestore holds the data, behind least-privilege security rules. Transactional email handles confirmations and decisions.

## In this demo

Everything runs in the browser. localStorage stands in for Firestore, and the rules are simulated in JavaScript. Changes save to your browser only, and "Reset demo" in the footer starts over.

```
index.html          network front door
join.html           registration + live domain resolution
meetings.html       gated logistics, .ics export, room-code check-in
community.html      feed, kudos, 3-A XP ladder, pixel badges
summit.html         schedule, check-in kiosk, live Q&A
admin.html          waitlist, domain intelligence, roster export
how-it-works.html   architecture + decisions
data.js             all invented demo data
app.js              shared shell + simulated backend
style.css           design system
```

Built by [Wes Kriesel](https://github.com/wkriesel).
