# rules/motion.md

Come si decide il movimento nei nostri siti. Questo file **non insegna** GSAP o le durate:
per quello ci sono le skill. Qui c'è ciò che le skill non sanno — il nostro metodo, la
gerarchia tra le fonti, e le regole di sicurezza che rendono un'animazione consegnabile a
un'azienda vera.

Vale insieme a `rules/webgl.md` (animazioni 3D) e `rules/scroll-frames.md` (video su scroll).

---

## 1. Chi comanda — la gerarchia

Tre fonti parlano di animazione. Si usano in quest'ordine, e **non si mescolano**:

1. **Questo file** — *se* animare, e le regole non negoziabili. Vince sempre.
2. **motion-design** (skill LottieFiles) — *cosa* animare e con che intento: coreografia,
   durate, gerarchia degli ingressi. Si consulta in fase di **piano**, prima del codice.
3. **Come scriverlo**, a seconda del compito (CLAUDE.md §3 decide la divisione):
   - scroll, pin, coreografie complesse → skill **gsap-\*** (GreenSock), versione
     verificata via Context7;
   - micro-interazioni semplici senza scroll (hover, stati, transizioni) → skill
     **anime-js**, che a sua volta impone di verificare l'API via Context7 a ogni uso —
     v4 ha riscritto la sintassi rispetto alla v3 diffusa a memoria.

`animate.md` di Impeccable **non è in questa lista**: è un rilevatore di slop. Le sue
segnalazioni si correggono, ma non detta la coreografia. Se contraddice questo file, vince
questo file.

Se due fonti dicono cose diverse, sali di livello: la fonte più in alto ha ragione. Non
implementare la media delle due.

## 2. Se animare — la domanda prima del come

Il movimento **guida l'attenzione o chiarisce una relazione**. Se non fa nessuna delle due,
è decorazione, e la decorazione invecchia male e rallenta la pagina.

Prima di ogni animazione, una domanda: *cosa capisce l'utente grazie a questo movimento che
non capirebbe senza?* Se la risposta è "niente, ma è carino", non si anima.

- Un ingresso in sequenza (label → titolo → corpo → CTA) **crea gerarchia**: dice in che
  ordine leggere. Legittimo.
- Un elemento che si muove per riempire il tempo **non dice niente**. Da togliere.

Il default è **fermo**. Il movimento si aggiunge dove serve, non si toglie dove avanza.

## 3. Regole non negoziabili

Queste vincono su qualsiasi skill o riferimento, incluse le "checklist premium" che arrivano
con le tecniche di terzi (vedi `rules/scroll-frames.md` §2).

- **Solo `transform` e `opacity`.** Sono accelerate dalla GPU. Animare `width`, `top`,
  `left`, `height` causa reflow e jank. Mai `transition-all`.
- **`prefers-reduced-motion` non è opzionale.** Se attivo: niente animazioni ambientali,
  niente scroll-jacking, niente parallasse. Gli ingressi si riducono a un fade breve o
  spariscono. È accessibilità, e per la PA è legge.
- **Niente allocazioni nel loop.** In un'animazione legata allo scroll o a `useFrame`, non
  creare oggetti dentro il frame: il garbage collector produce scatti periodici.
- **Il movimento non blocca il contenuto.** Testi, form e CTA sono utilizzabili anche
  durante o senza l'animazione. Un'entrata non deve ritardare la leggibilità.
- **Durate umane.** Ingressi 0.3–0.9s. Sotto i 0.2s non si percepiscono, sopra 1.2s
  annoiano. Micro-interazioni (hover) 0.15–0.25s.
- **Easing con intenzione**, non lineare per gli ingressi (sembra meccanico). L'API esatta
  la dà gsap-*; il principio è: decelerazione in uscita (`power2/3.out`) per gli ingressi.

## 4. Il problema screenshot — progettare per essere fotografabili

Questo lo sappiamo per averlo sbattuto in faccia: **`animations: 'disabled'` di Playwright
ferma le animazioni CSS, ma NON tocca GSAP, ScrollTrigger né il loop di render.** Se non
prevedi un modo per portare la scena a uno stato finale deterministico, non potrai mai
catturare il tuo lavoro in modo ripetibile — gli screenshot escono a metà transizione.

**Regola:** ogni pagina con animazione JS espone un hook di debug — una funzione globale
(es. `window.__seekAnimationsToEnd()`) che porta tutte le timeline e i trigger allo stato
finale e ferma il loop. Lo script di screenshot la chiama prima di scattare la pagina
intera, restando in fondo: in cima le animazioni legate allo scroll tornerebbero
all'inizio durante lo scatto. Limite noto: header e elementi fixed/sticky, in quella
cattura, finiscono disegnati a fondo pagina. Con `--viewport-only` invece non la chiama:
fotografa la prima schermata com'è all'apertura (dettagli in `scripts/shots.mts`).

Costa una riga se lo decidi all'inizio. È una rifattorizzazione se te ne accorgi dopo.
Vedi anche `rules/webgl.md` §7 per il caso del canvas.

## 5. Coreografia — il minimo, il resto è nella skill

Il dettaglio (sequenze, stagger, mappatura emotiva) sta in **motion-design**. Qui solo i
principi che non cambiano:

- **Stagger, non sincrono.** Gli elementi di un gruppo entrano sfalsati (0.1–0.15s l'uno
  dall'altro), non tutti insieme. Il sincrono sembra un blocco che appare; lo stagger
  guida l'occhio.
- **Una gerarchia per sezione.** L'ordine di ingresso rispecchia l'ordine di lettura:
  prima ciò che orienta (label, titolo), poi il dettaglio (corpo), infine l'azione (CTA).
- **Direzione coerente col significato**, non casuale. Se le cose "arrivano" da destra in
  una sezione, non farle arrivare da sinistra nella successiva senza un motivo.
- **Non ripetere lo stesso ingresso** su sezioni consecutive: diventa un tic. Ma nemmeno
  cambiarlo a ogni sezione per esibizione — la varietà serve al ritmo, non allo sfoggio.

## 6. Checklist prima di dire che è finito

- [ ] Ogni animazione risponde a "cosa fa capire?" — nessuna decorazione pura
- [ ] Solo `transform` e `opacity`; nessun `transition-all`
- [ ] `prefers-reduced-motion` verificato: la pagina funziona e ha senso senza movimento
- [ ] Hook di stato finale presente; screenshot ripetibili
- [ ] Durate tra 0.2 e 1.2s; easing non lineare sugli ingressi
- [ ] Nessuna allocazione nei loop di animazione
- [ ] Contenuto leggibile e usabile durante e senza l'animazione
- [ ] Nessuna proporzione o effetto imposto da una checklist di terzi: la forma viene dal piano
