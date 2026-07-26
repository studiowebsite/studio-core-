# CLAUDE.md — Studio

Caricato in ogni sessione: qui solo ciò che è **specifico dello studio** e ciò che
**blocca la consegna**. Il resto è delegato. Il *perché* di ogni regola sta nei file
`rules/`, non qui.

| Chi | Cosa possiede |
|---|---|
| **Questo file** | metodo, cancelli di consegna, 3D, vincoli operativi e legali |
| **Impeccable** (`/impeccable`) | qualità visiva, anti-pattern, critique, audit, detector |
| **`DESIGN.md`** | token del progetto corrente (normativo) |
| **`.claude/rules/`** | approfondimenti, letti su richiesta |

Conflitto tra questo file e Impeccable → **vince questo file** (conosce il cliente e il 3D).

---

## 1. Chi siamo

Web design **su misura**. Ogni cliente ha un'identità non scambiabile con quella di un
altro — mai varianti dello stesso sito. Due specializzazioni: **scene 3D interattive** e
**configuratori di prodotto**. Il sito attorno al 3D dev'essere veloce, o il 3D è solo un
pretesto per un sito lento.

## 2. Direzione visiva

Anti-pattern, font vietati, test anti-slop, riflesso di categoria → **di Impeccable**. Non
duplicarli. Resta nostro un solo principio:

> La direzione nasce dal **mondo del cliente**. Se una scelta funzionerebbe identica su un
> altro cliente, è un riempitivo.

**Pavimento di mestiere** (minimo, non opinione):
- Colore: mai palette Tailwind di default; si deriva da un colore di marca.
- Tipografia: display e body font diversi; tracking stretto sui titoli, line-height ampio sul corpo.
- Ombre: stratificate e tinte, mai l'ombra piatta di default.
- Profondità: sistema di livelli (base → elevata → fluttuante).
- Immagini: trattamento coerente su tutte, mai foto nuda.
- Stati: hover, focus-visible, active su ogni elemento cliccabile; focus tastiera mai rimosso.
- Spacing: scala coerente, non passi a caso.
- Motion: solo `transform` e `opacity`, mai `transition-all`.

Il salto a "memorabile" è l'elemento firma (§4), dal cliente — non da questa lista.

## 3. Stack

| Ambito | Scelta |
|---|---|
| Framework | Next.js (App Router) + TypeScript strict |
| Stile | Tailwind + token da `DESIGN.md` |
| Motion | GSAP + ScrollTrigger, Lenis, Framer Motion (micro-interazioni) |
| 3D | React Three Fiber + drei; Theatre.js per animazioni scriptate |
| Asset 3D | glTF Draco/Meshopt, texture KTX2 |
| CMS | Sanity |
| Deploy | Vercel, preview URL per branch |

Nessuna libreria fuori lista senza chiedere: ogni dipendenza è peso che il cliente paga.

- **Token**: `DESIGN.md` decide, `design-tokens.ts` deriva. Mai un valore in due posti.
- **Motion**, in quest'ordine, senza mescolare: `rules/motion.md` (vince) → skill
  **motion-design** (cosa animare, in fase di piano) → skill **gsap-\*** (come, in build).
  `animate.md` di Impeccable rileva slop, non detta coreografia.
- **API**: prima di scrivere R3F, drei, Three.js, GSAP, Next.js → docs della versione
  installata via **Context7**. Mai `<Canvas>` a memoria.

## 4. Workflow — non saltare passaggi

`brief → piano/mockup → APPROVAZIONE → build → visual check → audit → preview`

1. **Brief.** Le domande di §5, tutte, prima di tutto. Se manca l'essenziale, fermati.
2. **Piano.** `/impeccable shape` per la struttura. **Home o pagina dove il design è il
   punto** → non un piano a parole ma **due mockup a concept opposti** (`rules/mockup-flow.md`):
   si sceglie guardando. Pagine secondarie → piano scritto: palette, font con ruoli, elemento
   firma. Specifico di *questo* brief?
3. **Approvazione.** Il piano/mockup si mostra prima di costruire.
4. **Build.** Ogni valore dai token, mai hardcoded. Il detector Impeccable gira a ogni Edit.
5. **Visual check.** `pnpm shots` (con 3D: `--gpu`). Poi **apri ogni PNG e analizzalo
   come immagine** — non basta produrlo, va guardato: è l'unico modo per criticare quello
   che c'è davvero e non quello che intendevi. Critica specifica coi numeri ("titolo 32px,
   il piano dice 24"; "gap 16, deve essere 24") → correggi → ricattura. Almeno due round;
   ci si ferma quando non restano differenze dal piano.
6. **Audit.** `/impeccable critique` + `/impeccable audit`. Poi i cancelli di §6.

## 5. Domande da fare subito — il progetto non parte senza

Se manca qualcosa, dillo e **fermati**: se arriva a metà progetto, si rifà il lavoro.

**Strategia** (pubblico, scopo, positioning, marca, anti-reference, CTA) → la copre
`/impeccable init`. Non ripeterla qui.

**Operativa e legale** (nostra, Impeccable non la conosce):
- Logo vettoriale, non PNG.
- Font con **licenza web valida** (il `.ttf` non è una licenza). Se manca → preventivo o open.
- Testi e foto **definitivi prima del layout**. Mai costruire su lorem ipsum.
- *Configuratori*: file CAD; elenco varianti reali; **regole di combinazione** (quali
  varianti sono incompatibili — determina metà dell'architettura, chiedilo sempre).
- Chi gestirà i contenuti dopo; domini/DNS e accessi; cookie/privacy/accessibilità PA.

**Setup del progetto** → `rules/project-setup.md`: dove vive il repo, chi possiede
l'organizzazione, privato/pubblico, materiali del cliente.

## 6. Budget — cancelli, non diagnosi

Un numero sforato **impedisce la consegna**. Non si consegna e si spiega dopo.

- LCP < 2.5s (4G mobile) · CLS < 0.1 · INP < 200ms
- JS iniziale < 180 kB gzip **escluso il bundle 3D** (3D sempre lazy, mai nel first load)
- Lighthouse: Performance ≥ 90 mobile, Accessibility 100

I numeri per il cliente vengono **solo** da `scripts/shots.mts` (Chromium pulito), mai dal
browser personale. L'MCP `chrome-devtools` serve per guardare, non per misurare. Lab dice
*perché*, campo (CrUX) dice *quanto conta*: si leggono insieme.

## 7. 3D e video-scroll

Dettaglio in `rules/webgl.md` (scene e configuratori) e `rules/scroll-frames.md` (video su
scroll). Le regole di quei file vincono anche su una futura skill: sono tarate sui nostri
budget. In sintesi, non negoziabile:

- Mai 3D/canvas bloccante above-the-fold: poster statico + lazy, entra quando è pronto.
- La pagina funziona al **100% senza WebGL/JS**: contenuti, form e conversioni mai dipendenti dal canvas.
- Budget asset: modello < 2 MB, texture ≤ 2048² KTX2. 60 fps desktop / 30 floor mobile.
- `prefers-reduced-motion` → versione statica, sempre. Loop fermo se il tab non è visibile.
- Configuratori: stato nell'URL, varianti precaricate, cambio istantaneo senza re-mount.
- Screenshot canvas: `--gpu`. fps misurati **solo** su browser reale, mai in headless.

## 8. Copy

Italiano salvo indicazione; se bilingue, `hreflang` corretto e traduzioni vere. Un bottone
dice cosa fa ("Richiedi il preventivo", non "Invia"), stesso nome per tutto il flusso. Il
resto → `/impeccable clarify`.

## 9. Quando leggere cosa

| Fase | Dove |
|---|---|
| Direzione, critica, audit | comandi `/impeccable` |
| Home / design forte | `rules/mockup-flow.md` |
| Token del progetto | `DESIGN.md` |
| `<Canvas>` / scene 3D | `rules/webgl.md` |
| Video su scroll | `rules/scroll-frames.md` |
| Coreografia motion | `rules/motion.md` → skill `motion-design` |
| API animazione | skill `gsap-*` (versione via Context7) |
| Nuovo progetto, setup | `rules/project-setup.md` |
| Consegna | `rules/client-handoff.md` *(da scrivere)* |

## 10. Mai

- Partire senza le risposte di §5, o costruire prima del piano/mockup approvato.
- Definire un token fuori da `DESIGN.md`. Aggiungere una dipendenza senza chiedere.
- Committare chiavi: stanno in `.env.local` o config utente, **mai** in `.mcp.json`,
  `settings.json` o sotto git. MCP che vuole una chiave → livello utente, non progetto.
- Consegnare senza aver guardato gli screenshot.
- Toccare `main` direttamente: si lavora su branch, il cliente approva sul preview URL.
- Trattare un budget sforato come un'osservazione. È un cancello: si chiude.

---
*Allineare a ogni cambio in `rules/` o `DESIGN.md`.*
