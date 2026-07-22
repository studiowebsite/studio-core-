# CLAUDE.md — Studio

Caricato in ogni sessione: deve restare corto. Qui sta solo ciò che è **specifico dello
studio** e ciò che **blocca la consegna**. Tutto il resto è delegato.

**Divisione dei ruoli — leggila una volta e non chiederla più:**

| Chi | Cosa possiede |
|---|---|
| **Questo file** | metodo, cancelli di consegna, 3D, vincoli operativi e legali |
| **Impeccable** (`/impeccable`) | qualità visiva, anti-pattern, critique, audit, detector |
| **`DESIGN.md`** | specifica dei token del progetto corrente (normativa) |
| **`.claude/rules/`** | approfondimenti, letti su richiesta |

Regola di conflitto: se questo file e Impeccable dicono cose diverse, **vince questo file**
— ma solo perché conosce il cliente e il 3D, non perché ha più gusto.

---

## 1. Chi siamo

Studio di web design **su misura**. Ogni cliente ha un'identità visiva che non deve poter
essere scambiata con quella di un altro cliente. Non produciamo varianti dello stesso sito.

Due specializzazioni tecniche:
- **Scene 3D interattive** (hero, storytelling, ambienti navigabili)
- **Configuratori di prodotto** (materiali, colori, varianti, prezzo dinamico)

Il resto del sito attorno al 3D deve essere impeccabile e veloce, altrimenti il 3D
diventa solo un pretesto per un sito lento.

## 2. Qualità visiva → Impeccable

Gli anti-pattern, i font vietati, il test anti-slop e il controllo del riflesso di
categoria sono **di Impeccable**, che li applica e li verifica meglio di quanto potrebbe
fare una lista qui. Non duplicarli.

Resta nostro un solo principio, perché è ciò che vendiamo:

> La direzione visiva nasce dal **mondo del cliente** — i suoi materiali, i suoi strumenti,
> il suo lessico, i suoi artefatti. Se una scelta funzionerebbe identica su un altro
> cliente, non è una scelta: è un riempitivo.

## 3. Stack

| Ambito | Scelta |
|---|---|
| Framework | Next.js (App Router) + TypeScript strict |
| Stile | Tailwind + token generati da `DESIGN.md` |
| Motion | GSAP + ScrollTrigger, Lenis, Framer Motion per micro-interazioni |
| 3D | React Three Fiber + drei; Theatre.js per animazioni scriptate |
| Asset 3D | glTF compresso Draco/Meshopt, texture KTX2 |
| CMS | Sanity (il cliente deve poter modificare i testi da solo) |
| Deploy | Vercel, preview URL per branch |

Non introdurre librerie fuori da questa lista senza chiedere. Ogni dipendenza in più
è peso che il cliente paga in performance.

**Chi comanda sui token.** `DESIGN.md` è la **specifica** — è lì che si decide un colore,
una scala tipografica, uno spacing. `design-tokens.ts` è la **implementazione**, e deriva
da `DESIGN.md`. Mai il contrario, mai un valore definito in due posti. Se devi cambiare un
token, cambialo in `DESIGN.md` e propaga.

**Chi comanda sul motion.** Tre fonti parlano di animazione: usale in quest'ordine e non
mescolarle.
1. `rules/motion.md` — le nostre regole, incluso lo screenshot delle animazioni. Vince.
2. **motion-design** (LottieFiles) — *cosa* animare e con che intento: durate, coreografia,
   gerarchia. Si consulta in fase di piano, prima di scrivere codice.
3. **gsap-\*** — *come* scriverlo. Riferimento API, in fase di build.

`animate.md` di Impeccable è un rilevatore di slop, non una guida: le sue segnalazioni si
correggono, ma non detta la coreografia.

**Documentazione — obbligatorio.** Prima di scrivere codice che usa R3F, drei, Three.js,
GSAP o Next.js, recupera i docs della **versione installata** via Context7. La conoscenza
di queste librerie invecchia male: le API cambiano tra minor release e l'errore tipico è
scrivere codice plausibile che fallisce a runtime. Non scrivere `<Canvas>` a memoria.

## 4. Workflow — non saltare passaggi

```
brief → piano di design → APPROVAZIONE → build → visual check → audit → preview
```

1. **Brief.** Le domande della sezione 5, tutte, prima di ogni altra cosa. Se manca una
   risposta essenziale, fermati e dillo. Non inventarla in silenzio.
2. **Piano di design.** `/impeccable shape` per la struttura, poi la direzione visiva:
   palette con nomi, font con ruoli precisi, e **l'elemento firma** — la cosa per cui
   questa pagina verrà ricordata. Rileggi il piano: è specifico di *questo* brief?
3. **Approvazione.** Il piano si mostra prima di costruire. Non si costruisce e basta.
4. **Build.** Segui il piano. Ogni valore deriva dai token, mai hardcoded nel componente.
   Il detector di Impeccable gira da solo a ogni Edit: se segnala, correggi subito.
5. **Visual check.** `pnpm shots` — cattura 390 / 768 / 1440 / 1920 in `.shots/<timestamp>/`.
   Con una scena 3D in pagina serve `pnpm shots --gpu`, altrimenti il canvas esce nero.
   Poi **guarda le immagini**. Critica quello che vedi, non quello che intendevi.
   Lo script segnala anche errori di console e richieste fallite: un layout rotto è spesso
   un font che non carica, non un problema di CSS.
6. **Audit.** `/impeccable critique` per la revisione visiva, `/impeccable audit` per la
   qualità tecnica. Poi i cancelli della sezione 6, che sono nostri.

## 5. Domande da fare subito — il progetto non parte senza

Se manca qualcosa, dillo esplicitamente e **fermati**: sono tutte cose che, se arrivano a
metà progetto, costringono a rifare il lavoro.

**Metà strategica → la copre `/impeccable init`**
Pubblico, scopo, positioning, personalità di marca, anti-reference, accessibilità, CTA.
Non ripetere quelle domande qui: lancia `init` e lascia che le faccia lui, meglio.

**Metà operativa e legale → nostra, e Impeccable non la conosce**

*Identità*
- Logo vettoriale (SVG o AI). Non un PNG.
- Font **con licenza web valida**. Il `.ttf` scaricato non è una licenza: le foundry
  vendono a pageview e su un sito aziendale l'esposizione legale è reale. Se manca, va a
  preventivo o si sceglie un'alternativa open.

*Contenuti*
- Testi e foto definitivi **prima del layout**. Il lorem ipsum sostituito a fine progetto
  rompe ogni volta tipografia e griglia. Se non ci sono, proponi tu i testi e falli
  approvare — ma non costruire su testo finto.

*Solo per i configuratori*
- File CAD del prodotto (STEP, IGES, SolidWorks). Se non esiste serve un 3D artist: è un
  costo, va detto prima, non assorbito.
- Elenco completo delle varianti reali (materiali, finiture, dimensioni, colori).
- **Regole di combinazione**: quali varianti sono incompatibili tra loro. Lo dimentica ogni
  cliente e determina metà dell'architettura dello stato — chiedilo sempre, esplicitamente.

*Tecnico e legale*
- Chi gestirà i contenuti dopo la consegna, e con che competenze?
- Domini, DNS, e chi ha gli accessi.
- Cookie banner, privacy, accessibilità obbligatoria (PA e grandi imprese).

## 6. Budget non negoziabili

**Questi sono cancelli, non diagnosi.** Gli strumenti di audit riportano numeri; qui un
numero sforato *impedisce la consegna*. È la differenza tra sapere come stai e non poter
consegnare male.

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

Queste regole valgono comunque, anche se una skill sul 3D dicesse altro: sono tarate sui
nostri budget e sui nostri clienti.

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

## 8. Copy

Copy in **italiano** salvo indicazione contraria; se il sito è bilingue, `hreflang`
corretto e traduzioni vere, mai automatiche non riviste. Un bottone dice cosa succede:
"Richiedi il preventivo", non "Invia" — e l'azione mantiene lo stesso nome per tutto il
flusso. Per il resto (chiarezza, gerarchia, microcopy) usa `/impeccable clarify`.

## 9. Quando leggere cosa

Non caricare tutto. Apri il file solo quando entri in quella fase:

| Fase | Dove |
|---|---|
| Direzione visiva, critica, audit | comandi `/impeccable` |
| Token del progetto | `DESIGN.md` |
| Qualsiasi cosa con `<Canvas>` | `rules/webgl.md` |
| Coreografia delle animazioni | `rules/motion.md` → skill `motion-design` |
| API di animazione | skill `gsap-*`, via Context7 per la versione |
| Scrittura componenti | `rules/code-style.md` |
| Consegna al cliente | `rules/client-handoff.md` |

## 10. Cosa non fare mai

- Partire senza le risposte della sezione 5
- Costruire prima di aver mostrato il piano di design
- Definire un token fuori da `DESIGN.md`
- Aggiungere una dipendenza senza chiedere
- Committare chiavi, token o credenziali. Stanno in `.env.local` (nel `.gitignore`) o nella
  config utente fuori dal repo — **mai** in `.mcp.json`, `settings.json` o in un file che
  finisce sotto git. Se un MCP vuole una chiave in chiaro, va configurato a livello utente,
  non di progetto
- Consegnare senza aver guardato gli screenshot
- Modificare `main` direttamente: si lavora su branch, il cliente approva sul preview URL
- Trattare un budget sforato come un'osservazione. È un cancello: si chiude.

---

*Da tenere allineato ogni volta che cambia una regola in `rules/` o in `DESIGN.md`.*
