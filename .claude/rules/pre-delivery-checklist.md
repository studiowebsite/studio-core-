# rules/pre-delivery-checklist.md

L'indice dei cancelli, non una fonte nuova. Ogni numero e ogni checklist di questo file
vive già altrove — CLAUDE.md §6, `webgl.md` §8, `motion.md` §6, `scroll-frames.md` §8 — e
lì resta: **questo file non introduce né duplica un solo numero** (vale lo stesso principio
di CLAUDE.md §7: "un numero in due posti è un numero che diverge"). Esiste solo perché
quei cancelli sono sparsi in 4-5 file diversi, e sotto la scadenza dell'ultimo giorno è
facile spuntarne quattro su cinque e consegnare lo stesso.

Si usa **una volta**, al passo "Audit" del workflow (CLAUDE.md §4, punto 6) — dopo il
visual check, prima di mostrare il preview al cliente per l'approvazione. Non è un
sostituto del visual check umano (CLAUDE.md §4 punto 5: si aprono i PNG e si guardano), che
resta un passo separato e precedente.

Per il cancello equivalente **dopo** l'approvazione — la ri-verifica sullo stesso tipo di
numeri ma sul dominio di produzione reale, al momento della consegna — vedi
`rules/client-handoff.md` §1. Stesso principio, momento diverso: qui si audita il preview,
lì si audita ciò che il cliente userà davvero.

Il template CI (`.github/workflows/ci.yml`, `project-setup.md` §1) copre solo la fetta
automatizzabile — lint e build a ogni push — senza dipendere dal ricordarsi di lanciarla.
Non sostituisce questo file: build e lint verdi non dicono niente su budget, visual check o
privacy, che restano giudizio umano.

---

## Sempre — ogni progetto, senza eccezioni

- [ ] `pnpm shots` eseguito e ogni PNG **guardato**, non solo prodotto (CLAUDE.md §4.5)
- [ ] Budget del CLAUDE.md §6 rispettati: LCP, CLS, INP, JS iniziale < 180 kB gzip (bundle
      3D escluso), Lighthouse Performance ≥ 90 mobile, Accessibility 100 — misurati da
      `scripts/shots.mts`, mai dal browser personale
- [ ] `/impeccable critique` eseguito
- [ ] `/impeccable audit` eseguito
- [ ] skill `privacy-check` eseguita (trattamenti dati, cookie, consenso — incluso il
      consenso specifico del form, se presente, `rules/forms.md` §2)
- [ ] Checklist SEO rispettata (`rules/seo.md`): metadata per pagina, sitemap/robots,
      canonical, contenuto leggibile senza JS
- [ ] *(se c'è un form)* checklist `rules/forms.md` rispettata: invio testato end-to-end,
      anti-spam, deliverability, stati di successo/errore
- [ ] Diritti sui contenuti confermati (`project-setup.md` §6) — se ci sono ancora
      placeholder non dichiarati o stock non licenziati, non si passa oltre

## Se il progetto monta un `<Canvas>` (scena 3D o configuratore)

Checklist intera: `webgl.md` §8. In sintesi, i punti che si dimenticano più spesso:

- [ ] Bundle 3D assente dal first load (import dinamico verificato, non solo scritto)
- [ ] Pagina funziona al 100% con WebGL disattivato
- [ ] I due tetti di `webgl.md` §3 rispettati **separatamente** — prima interazione < 4 MB,
      precarico varianti nel suo tetto, mai sommati
- [ ] fps misurati su **device reale**, non headless (`webgl.md` §7) — un numero headless
      non entra in un report al cliente
- [ ] Gradini di degrado provati davvero: scende sotto soglia, non risale da solo
- [ ] Context lost gestito; loop fermo a tab non visibile
- [ ] *(configuratori)* stato nell'URL; combinazioni incompatibili disabilitate prima del
      click; fallback non-3D che permette comunque di configurare e convertire
- [ ] *(configuratori)* regole di combinazione coperte da test Playwright (`webgl.md` §6),
      non solo verificate a mano
- [ ] Screenshot 3D catturati con `pnpm shots --gpu`, non in headless semplice

## Se il progetto ha animazioni JS significative (GSAP, ScrollTrigger, anime.js)

Checklist intera: `motion.md` §6. In sintesi:

- [ ] Ogni animazione risponde a "cosa fa capire?" (`motion.md` §2) — nessuna decorazione
- [ ] Solo `transform`/`opacity`; nessun `transition-all`
- [ ] `prefers-reduced-motion` verificato: pagina funziona e ha senso senza movimento
- [ ] Hook di stato finale presente (`window.__seekAnimationsToEnd()` o equivalente) —
      altrimenti gli screenshot sopra sono a metà transizione senza che tu lo sappia
- [ ] Nessuna allocazione nei loop di animazione

## Se il progetto ha video legato allo scroll

Checklist intera: `scroll-frames.md` §8. In sintesi:

- [ ] Set frame desktop e mobile entro il budget di peso (`scroll-frames.md` §3)
- [ ] GSAP/Lenis da npm, componente lazy fuori dal first load
- [ ] Fallback senza JS presente (`<video>` o poster, non un buco)
- [ ] `prefers-reduced-motion` serve la versione statica
- [ ] Nessun flash bianco: loader via solo a frame pronti

---

**Se una riga qualsiasi resta rossa, non si passa al passo "preview" del CLAUDE.md.** Si
torna al build. Un cancello sforato non è un'osservazione da annotare per dopo — CLAUDE.md
§10 lo dice già per i budget, e vale per ogni riga di questo indice.
