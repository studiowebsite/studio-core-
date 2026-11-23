# rules/dashboard.md

Grafici e dashboard: aree riservate, pagine di numeri, card KPI, un grafico dentro una
pagina normale. Lo strumento è **Bklit UI** (bklit.com): grafici React costruiti su d3 e
`motion`, distribuiti come registry shadcn — il CLI **copia il sorgente** nel progetto, il
codice diventa nostro. Componenti MIT; Bklit Studio (l'editor online) è proprietario, ma
lo usiamo solo per guardare e copiare valori.

Come si installa, compone e anima un grafico lo sanno le skill **`bklit-ui`** (base) e
**`bklit-ui-design`** (aspetto: pattern, barre, fade, loading). Questo file dice ciò che
le skill non sanno: dove Bklit si scontra con le nostre regole, e chi vince.

---

## 1. Chi comanda

1. **`DESIGN.md`** — i colori. Nessuna palette di Bklit entra in un sito cliente.
2. **CLAUDE.md e `rules/`** — budget, motion, accessibilità, degrado. Vincono sulle skill.
3. **Impeccable** — qualità visiva della pagina attorno ai grafici.
4. **`bklit-ui` / `bklit-ui-design`** — come si scrive il grafico e le sue regole di gusto
   (`bklit-ui-design/rules/taste.md`), valide finché non contraddicono i punti sopra.

Per le API di Bklit la fonte è il **sorgente installato** in `components/charts/`, non la
memoria né i docs: è codice copiato, può divergere dalla versione online. Per una chiamata
nuova a `motion` (es. `useReducedMotion`) → Context7, come per le altre librerie.

Un solo motore di grafici per progetto. Niente Recharts, Chart.js, Nivo accanto a Bklit:
due librerie di grafici sono due pesi e due stili.

## 2. Installazione nel progetto cliente

Bklit richiede shadcn: `components.json` e il CLI. shadcn per noi è **solo l'installatore**,
non un design system: non si adottano i suoi temi né i suoi componenti per abitudine.

1. Prima di tutto i token: in `globals.css` si definiscono, **derivati da `DESIGN.md`**,
   `--chart-1` … `--chart-5`, `--chart-positive`, `--chart-negative` e i colori di
   contorno (`--chart-grid`, `--chart-crosshair`, `--chart-label`, `--chart-background`,
   tooltip), per chiaro e — se il sito lo ha — scuro. Il registry **aggiunge solo i token
   mancanti**: se li definisci prima, Bklit usa i nostri. Se li dimentichi, arrivano i suoi
   default (indaco/viola, crosshair viola, verde/rosso Tailwind): è esattamente la "palette
   di default" vietata da CLAUDE.md §2.
2. `npx shadcn@latest init` se manca `components.json`. **Guarda il diff** di
   `globals.css` e `package.json` dopo l'init: le variabili di tema shadcn si allineano ai
   token di `DESIGN.md`, i pacchetti che non servono ai grafici si tolgono.
3. `npx shadcn@latest add @bklit/<grafico>` — dettagli nella skill `bklit-ui`. Mai gli
   item `*-example` (riscrivono `app/page.tsx`). Un secondo blocco `stat-card-*`
   sovrascrive file condivisi: si uniscono a mano.
4. Le dipendenze che il CLI aggiunge (`d3-*`, `motion`, `@base-ui/react`,
   `@number-flow/react`…) sono approvate **solo come dipendenze di Bklit**. Vedi §3 per
   `motion`.

## 3. Motion — una dipendenza, non un secondo sistema di animazione

`motion` arriva con Bklit perché i grafici lo usano dentro. **Non si importa `motion` per
animare il resto del sito**: lì vale la gerarchia di `rules/motion.md` (GSAP / anime.js).

Bklit e `rules/motion.md` non coincidono su tre punti, e vince `motion.md`:

- **Durata.** L'ingresso di default di Bklit è 1100 ms, fuori dall'intervallo di
  `motion.md` §3. Si imposta `animationDuration` dentro quell'intervallo, una volta sola
  per tutto il progetto (stesso valore su tutti i grafici, come chiede anche la skill).
- **`prefers-reduced-motion` è gestito solo in parte** (lo dice la skill stessa,
  `bklit-ui/rules/animation.md`): reveal delle linee/aree, crescita delle barre, ingressi
  di torta/anello/radar e scorrimento dei live chart **non** lo controllano. Ogni serie
  riceve `animate={!reduce}` con `useReducedMotion()`; i live chart vanno in `paused`.
  Non basta `animationDuration={0}`: le barre tornano allo stagger di default.
- **Animare solo se fa capire qualcosa** (`motion.md` §2). In una griglia di card l'ingresso
  di ogni grafico è rumore: di norma si tiene fermo e si anima solo il grafico principale.

**Screenshot ripetibili** (`motion.md` §4): `window.__seekAnimationsToEnd()` deve portare
anche i grafici allo stato finale — un flag globale che rende tutte le serie con
`animate={false}` e mette in pausa i live chart. Senza, `pnpm shots` fotografa barre a
metà crescita.

**Tab non visibile**: i live chart (`LiveLineChart`) hanno un loop rAF proprio → `paused`
su `visibilitychange`, come per il 3D (`rules/webgl.md` §4).

## 4. Peso e caricamento

Il budget JS di CLAUDE.md §6 vale anche per i grafici: d3 e `motion` non sono il bundle 3D,
**contano** nel JS iniziale se stanno nella prima schermata.

- Un grafico sotto la piega, o una dashboard dietro login, si carica con import dinamico.
- Il primo render non aspetta il grafico: spazio riservato con le stesse dimensioni (CLS),
  e per i dati in arrivo `status="loading"` del grafico stesso, non uno skeleton generico.
- Il peso si misura con `pnpm shots` dopo aver aggiunto i grafici, non si stima.
- Dataset da centinaia di punti, non decine di migliaia: oltre si campiona
  (`decimate-time-series` di `@bklit/chart-utils`).

## 5. Accessibilità e pagina senza JS

Un grafico SVG è muto per uno screen reader e per un crawler, e i grafici Bklit misurano il
contenitore nel browser: senza JS possono non disegnare niente.

- **Il numero che conta è testo nell'HTML**, server-rendered: il valore della KPI, il
  totale, la variazione ("+12% rispetto a ottobre"). Il grafico lo illustra, non lo
  sostituisce (stesso principio di CLAUDE.md §7 per il canvas).
- Ogni grafico ha un nome accessibile che dice cosa mostra (titolo visibile collegato, o
  `aria-label` con il riassunto). Per i grafici dove il dettaglio conta, i dati anche in
  forma di tabella (visibile o per screen reader).
- Il colore non è l'unico segnale: positivo/negativo anche con segno o testo, serie
  distinguibili anche senza colore quando sono più di due. Contrasto delle etichette degli
  assi dentro Accessibility 100 (CLAUDE.md §6).
- Tooltip solo al passaggio del mouse non bastano: il valore deve essere raggiungibile
  anche da tastiera o leggibile altrove nella pagina.

## 6. Dati

- Dati veri del cliente prima del layout, come i testi (CLAUDE.md §5). Se non ci sono
  ancora: dati di prova **dichiarati** e plausibili, mai numeri tondi finti o `123,456`.
- Una dashboard con dati di persone (clienti, ordini, utenti) è un trattamento: entra in
  `privacy-check` e, se è dietro login, l'accesso va deciso al brief.

## 7. Gusto — il minimo, il resto è nella skill

Le regole di `bklit-ui-design/rules/taste.md` vanno bene e si seguono: un solo strato
decorativo, sfondi che sussurrano, due toni e non arcobaleno, angoli delle barre coerenti
con `--radius`, sobrietà nelle griglie di card. In più, da noi:

- Gli effetti vistosi di Bklit (`glow`, barre 3D di vetro, gradienti tra tinte diverse)
  si usano solo se il piano li giustifica per *questo* cliente — altrimenti sono lo slop
  che Impeccable segnala.
- I colori delle serie hanno un significato (una serie = un colore, sempre lo stesso in
  tutta la dashboard), non si assegnano in ordine.

---

## Checklist

- [ ] Token `--chart-*` derivati da `DESIGN.md` **prima** del primo `shadcn add`; nessun
      default di Bklit rimasto (indaco, crosshair viola, verde/rosso Tailwind)
- [ ] Diff di `shadcn init` controllato: tema allineato a `DESIGN.md`, pacchetti inutili tolti
- [ ] Un solo motore di grafici; `motion` non usato fuori dai grafici
- [ ] `animationDuration` nell'intervallo di `motion.md` §3, uguale su tutti i grafici
- [ ] `prefers-reduced-motion`: `animate={!reduce}` su ogni serie, live chart in pausa — provato
- [ ] `__seekAnimationsToEnd()` ferma anche i grafici; screenshot ripetibili
- [ ] Live chart in pausa a tab non visibile
- [ ] Grafici sotto la piega o dietro login caricati in lazy; JS iniziale misurato con `pnpm shots`
- [ ] Numeri chiave leggibili come testo nell'HTML senza JS; ogni grafico con nome accessibile
- [ ] Colore mai unico segnale; valori raggiungibili anche senza mouse
- [ ] Dati veri o di prova dichiarati; dati personali passati da `privacy-check`
