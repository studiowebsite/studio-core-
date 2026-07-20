# CLAUDE.md — Studio

Questo file viene caricato in ogni sessione. Deve restare corto.
I dettagli stanno in `.claude/rules/` e vanno letti **solo quando servono** (vedi "Quando leggere cosa").

---

## 1. Chi siamo

Studio di web design **su misura**. Ogni cliente ha un'identità visiva che non deve poter
essere scambiata con quella di un altro cliente. Non produciamo varianti dello stesso sito.

Due specializzazioni tecniche:
- **Scene 3D interattive** (hero, storytelling, ambienti navigabili)
- **Configuratori di prodotto** (materiali, colori, varianti, prezzo dinamico)

Il resto del sito attorno al 3D deve essere impeccabile e veloce, altrimenti il 3D
diventa solo un pretesto per un sito lento.

## 2. La regola che vale più di tutte

**Nessuna decisione visiva per default.** Se una scelta (palette, font, layout, griglia,
animazione) è quella che faresti su un qualsiasi altro progetto, non è una scelta:
è un riempitivo. Rifallo.

Segnali di allarme — se il design contiene questi elementi senza una ragione presa dal
brief, è da rifare:
- fondo crema con serif alto contrasto e accento terracotta
- fondo quasi-nero con un solo accento acido
- numerazione `01 / 02 / 03` su contenuti che non sono una sequenza reale
- gradient su numero grande + label piccola nell'hero
- font di sistema o le solite tre Google Fonts

La direzione visiva nasce dal **mondo del cliente**: i suoi materiali, i suoi strumenti,
il suo lessico, i suoi artefatti. Da lì escono le scelte specifiche.

## 3. Stack

| Ambito | Scelta |
|---|---|
| Framework | Next.js (App Router) + TypeScript strict |
| Stile | Tailwind + token per progetto in `design-tokens.ts` |
| Motion | GSAP + ScrollTrigger, Lenis, Framer Motion per micro-interazioni |
| 3D | React Three Fiber + drei; Theatre.js per animazioni scriptate |
| Asset 3D | glTF compresso Draco/Meshopt, texture KTX2 |
| CMS | Sanity (il cliente deve poter modificare i testi da solo) |
| Deploy | Vercel, preview URL per branch |

Non introdurre librerie fuori da questa lista senza chiedere. Ogni dipendenza in più
è peso che il cliente paga in performance.

**Documentazione — obbligatorio.** Prima di scrivere codice che usa R3F, drei, Three.js,
GSAP o Next.js, recupera i docs della **versione installata** via Context7. La conoscenza
di queste librerie invecchia male: le API cambiano tra minor release e l'errore tipico è
scrivere codice plausibile che fallisce a runtime. Non scrivere `<Canvas>` a memoria.

## 4. Workflow — non saltare passaggi

```
brief → piano di design → APPROVAZIONE → build → visual check → audit → preview
```

1. **Brief.** Fai le domande della sezione 5, tutte, prima di ogni altra cosa.
   Se manca una risposta essenziale, fermati e dillo. Non inventarlo in silenzio.
2. **Piano di design.** Prima di scrivere codice, produci: palette 4-6 hex con nome, due o
   tre font con ruoli precisi, concept di layout con wireframe ASCII, e **l'elemento
   firma** — la cosa per cui questa pagina verrà ricordata. Poi rileggi il piano e chiediti
   se è specifico di *questo* brief. Se no, correggilo e dì cosa hai cambiato e perché.
3. **Approvazione.** Il piano si mostra prima di costruire. Non si costruisce e basta.
4. **Build.** Segui il piano alla lettera. Ogni colore e ogni valore tipografico deriva
   dai token, mai hardcoded nel componente.
5. **Visual check.** `pnpm shots` — cattura 390 / 768 / 1440 / 1920 in `.shots/<timestamp>/`.
   Con una scena 3D in pagina serve `pnpm shots --gpu`, altrimenti il canvas esce nero.
   Poi **guarda le immagini**. Critica quello che vedi, non quello che intendevi.
   Lo script segnala anche errori di console e richieste fallite: un layout rotto è spesso
   un font che non carica, non un problema di CSS.
6. **Audit.** Performance, accessibilità, SEO. Vedi budget sotto.

## 5. Domande da fare subito — il progetto non parte senza

Alla prima sessione su un nuovo cliente, **chiedi queste cose prima di qualsiasi altra cosa.**
Non dedurle, non riempirle di ipotesi, non rimandarle a dopo. Se manca qualcosa, dillo
esplicitamente e fermati: sono tutte cose che, se arrivano a metà progetto, costringono a
rifare il lavoro.

**Brief**
- Chi è il pubblico reale? (non "le aziende" — chi decide, chi firma)
- Qual è l'**unica** azione che il sito deve produrre?
- Due o tre concorrenti a cui **non** dovete somigliare, e perché.

**Identità**
- Logo vettoriale (SVG o AI). Non un PNG.
- Font **con licenza web valida**. Il file `.ttf` scaricato non è una licenza: le foundry
  vendono a pageview e su un sito aziendale l'esposizione legale è reale. Se la licenza
  non c'è, va messa a preventivo o si sceglie un'alternativa open.
- Palette e vincoli di brand esistenti, se ci sono.

**Contenuti**
- Testi definitivi e foto definitive, **prima del layout**.
- Il lorem ipsum sostituito a fine progetto rompe ogni volta la tipografia e la griglia.
  Se i testi non ci sono, scrivili tu come proposta e falli approvare — ma non costruire
  su testo finto.

**Solo per i configuratori**
- File CAD del prodotto (STEP, IGES, SolidWorks). Se non esiste, serve un 3D artist:
  è un costo, va detto prima, non assorbito.
- Elenco completo delle varianti reali (materiali, finiture, dimensioni, colori).
- **Regole di combinazione**: quali varianti sono incompatibili tra loro. Questo punto lo
  dimentica ogni cliente e determina metà dell'architettura dello stato — chiedilo sempre
  in modo esplicito.

**Tecnico**
- Chi gestirà i contenuti dopo la consegna, e con che competenze?
- Domini, DNS, e chi ha gli accessi.
- Vincoli legali: cookie banner, privacy, accessibilità obbligatoria (PA e grandi imprese).

## 6. Budget non negoziabili

Se un numero sfora, il lavoro non è finito. Non si consegna e si spiega dopo.

- LCP < 2.5s su 4G simulata, mobile
- CLS < 0.1
- INP < 200ms
- JS iniziale < 180 kB gzip **escluso il bundle 3D**
- Bundle 3D caricato in lazy, mai nel first load
- Lighthouse: Performance ≥ 90 mobile, Accessibility 100

**Dove si misura.** I numeri che finiscono in un report al cliente arrivano **solo** dallo
script CLI (`scripts/shots.mts`): profilo Chromium pulito, nessuna estensione, throttling
dichiarato. Mai dal browser personale — le estensioni gonfiano l'LCP anche di 5x e
producono insight fantasma. L'MCP `chrome-devtools` serve per **guardare** (screenshot,
ispezione, debug interattivo), non per misurare.

**Lab e campo si leggono insieme.** Il dato lab dice *perché*, il campo (CrUX) dice
*quanto conta*. Lab pessimo + campo buono = problema della macchina di test. Il contrario
= problema vero che il tuo hardware sta nascondendo.

## 7. 3D — regole di sopravvivenza

Il 3D è dove muoiono i siti "innovativi". Vincoli:

- **Mai 3D bloccante above-the-fold.** Sempre poster statico + `<Suspense>`, la scena
  entra quando è pronta.
- **Budget asset**: modello < 2 MB compresso, texture max 2048², KTX2 obbligatorio.
- **Degrado esplicito**: se il device non regge (WebGL assente, `deviceMemory` basso,
  mobile di fascia bassa), si serve la versione statica. La pagina deve funzionare al 100%
  senza WebGL — contenuti, form e conversioni non dipendono mai dal canvas.
- **60 fps desktop, 30 fps floor mobile.** Se non ci arrivi, semplifica la scena, non
  sperare che passi.
- `prefers-reduced-motion` ferma le animazioni ambientali, sempre.
- **Configuratori**: lo stato delle varianti sta nell'URL (condivisibile, indicizzabile),
  le varianti si precaricano, il cambio materiale è istantaneo — nessun re-mount della scena.

**Screenshot e fps delle scene 3D.** Chromium headless renderizza WebGL via SwiftShader,
cioè in software: le immagini escono, ma gli fps non hanno alcun rapporto con la realtà.
Quindi screenshot con `channel: 'chrome'` (GPU reale, stessa versione dei clienti), e
misura degli fps **solo** su browser reale. Un fps rilevato in headless non va mai in un
report.

## 8. Pavimento di qualità (implicito, non da annunciare)

Responsive fino a 360px. Focus da tastiera visibile e non rimosso. Contrasto WCAG AA.
Reduced motion rispettato. Immagini con dimensioni dichiarate. Nessun layout shift.
Testi alternativi veri, non "immagine".

## 9. Copy

Le parole sono materiale di design. Voce attiva, sentence case, niente riempitivi.
Un bottone dice cosa succede: "Richiedi il preventivo", non "Invia".
L'azione mantiene lo stesso nome per tutto il flusso. Gli errori spiegano cosa è successo
e come si risolve, senza scusarsi. Copy in italiano salvo indicazione contraria; se il sito
è bilingue, `hreflang` corretto e traduzioni vere, mai automatiche non riviste.

## 10. Quando leggere cosa

Non caricare tutto. Apri il file solo quando entri in quella fase:

| Fase | File |
|---|---|
| Nuovo progetto, direzione visiva | `rules/design-system.md` |
| Scrittura componenti | `rules/code-style.md` |
| Animazioni e scroll | `rules/motion.md` |
| Qualsiasi cosa con `<Canvas>` | `rules/webgl.md` |
| Ottimizzazione | `rules/performance.md` |
| Audit finale | `rules/accessibility.md`, `rules/seo.md` |
| Consegna al cliente | `rules/client-handoff.md` |

## 11. Cosa non fare mai

- Partire senza le risposte della sezione 5
- Costruire prima di aver mostrato il piano di design
- Aggiungere una dipendenza senza chiedere
- Committare chiavi, token o credenziali. Stanno in `.env.local` (nel `.gitignore`) o nella
  config utente fuori dal repo — **mai** in `.mcp.json`, `settings.json` o in un file che
  finisce sotto git. Se un MCP vuole una chiave in chiaro, va configurato a livello utente,
  non di progetto
- Consegnare senza aver guardato gli screenshot
- Modificare `main` direttamente: si lavora su branch, il cliente approva sul preview URL
- Dire che è finito quando un budget è sforato

---

*Ultimo aggiornamento: da tenere allineato ogni volta che una regola cambia in `rules/`.*
