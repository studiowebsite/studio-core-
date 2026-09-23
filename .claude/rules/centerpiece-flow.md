# rules/centerpiece-flow.md

Come nasce la direzione visiva di una pagina dove il design è il punto — home page,
landing, qualsiasi pagina con 3D o motion significativo. Sostituisce un "piano di design a
parole" con qualcosa che si **vede e si vive** prima di costruire il resto.

Si applica dopo la fondamenta di marca (`CLAUDE.md` §4, passo 2) e prima del build. È il
gate di approvazione. **Prerequisito**: palette, font e logo sono già fissati in
`DESIGN.md` prima di arrivare qui — questo file non ridiscute token, solo interfaccia e
ritmo.

> **Nota di metodo — perché non ci sono più due concept.** Fino a poco tempo fa questo file
> descriveva due mockup opposti (A statico, B motion) mostrati insieme, per far scegliere al
> cliente se il motion valeva il suo costo. Quel confronto è stato tolto deliberatamente:
> per i clienti dove il 3D/motion è già parte dello scope (`CLAUDE.md` §1), si va dritti a
> costruire il centerpiece, non si spende tempo a dimostrare che una versione senza motion
> funzionerebbe comunque. Il prezzo di questa scelta: non c'è più un passaggio esplicito che
> verifichi "il motion guadagna il suo costo per questo cliente" prima di investire nel
> build — quella domanda va risposta a monte, allo scope del progetto e al brief, non più
> con un confronto costruito. La rete di sicurezza *tecnica* resta comunque obbligatoria e
> indipendente da questa scelta: `prefers-reduced-motion` (`rules/motion.md` §2, default
> fermo) e "la pagina funziona al 100% senza WebGL/JS" (`CLAUDE.md` §7) garantiscono che il
> sito regga anche a motion disattivato — solo, non lo si dimostra più con un mockup
> dedicato prima di costruire.

---

## Il principio

Il pezzo 3D o il video-scroll, quando è il motivo per cui il cliente ci ha scelti
(`CLAUDE.md` §1), è l'**elemento firma** della pagina — non una decorazione aggiunta sopra
un layout già deciso. Si costruisce **per primo**, come prototipo tecnico reale, e il resto
della pagina si progetta **intorno al suo ritmo**: quanto scroll richiede, dove si ferma per
leggere, dove il motion cede il passo al contenuto statico. Copy e densità si adattano al
tempo che il centerpiece impone, non il contrario.

**Anti-pattern esplicito, quello che questo file esiste per evitare**: costruire prima lo
scheletro della pagina — header, sezioni, layout — e incollarci poi un video o una scena 3D
come sfondo decorativo. Se il centerpiece arriva per ultimo, resta un pretesto invece che il
punto (`CLAUDE.md` §1: "il 3D è solo un pretesto per un sito lento" vale anche qui, un passo
prima).

## Due percorsi, a seconda dello scope

**Pagina con 3D o motion significativo** (deciso allo scope del progetto, non improvvisato
qui):

0. **Se il centerpiece è un video-scroll e manca (o non serve) un girato reale**: prima di
   costruire qualunque cosa, si discute insieme la direzione stilistica e si genera il
   video sorgente via `rules/ai-generation.md` — prompt con skill `artprompter`, generazione
   esterna, l'output rientra come materiale in `materiali/video/`. È oggi la via di default
   per il video-scroll, non un'eccezione. Se invece c'è già un girato reale scelto al brief,
   si parte direttamente da lì.
1. Si costruisce il **centerpiece** — la scena 3D (`rules/webgl.md`) o il video-scroll
   (`rules/scroll-frames.md`) — come prototipo tecnico **reale**, direttamente in `src/`,
   non come HTML disposable: è troppo costoso rifare da zero una scena 3D o una estrazione
   frame, quindi qui non si butta via come i vecchi mockup.
2. Gli asset del prototipo sono a **qualità di spike** — non ancora passati dalla pipeline
   definitiva (`webgl.md` §3 Blender → `@gltf-transform/cli`, o `scroll-frames.md` §3
   estrazione frame a budget). Bastano a provare fattibilità, ritmo, durata dello scroll,
   sensazione. Il prototipo è esplicitamente **flaggato come pre-pipeline**: non è il
   deliverable pesato, e non deve rispettare ancora i budget di `webgl.md` §3 /
   `scroll-frames.md` §3 — quelli si applicano prima dell'audit (`CLAUDE.md` §4, passo 7),
   non allo spike.
3. **Approvazione sul centerpiece funzionante** — si scrolla o si interagisce davvero, non
   è uno screenshot — prima di costruire il resto della pagina.
4. Solo dopo approvazione: il resto della pagina (sezioni, copy, densità, CTA) si progetta
   attorno al ritmo che il centerpiece impone. Il build (`CLAUDE.md` §4, passo 5) raffina
   gli asset dello spike attraverso la pipeline vera prima dell'audit.

**Pagina forte ma senza motion significativo** (design è il punto, ma non c'è 3D/video):

- Piano scritto — solo gerarchia, layout, elemento firma. Palette e font non si ridiscutono
  qui: vengono già dalla fondamenta di marca (`CLAUDE.md` §4, passo 2).

## Forma del prototipo del centerpiece

- Contenuti reali del brief dove ci sono (titoli, testi); placeholder dichiarati per il
  resto. Mai lorem ipsum: un prototipo con testo finto non fa vedere il ritmo vero.
- Non serve la scena/il video-scroll rifiniti al 100%: bastano gli elementi che provano il
  ritmo (durata dello scroll, punti di sosta, transizione al contenuto statico). Il dettaglio
  fine (coreografia §5 di `rules/motion.md`, texture finali, ombre) arriva nel build.
- Vive in `src/` fin dall'inizio, non in una cartella a parte da buttare — a differenza
  della fondamenta di marca (sotto), qui il lavoro **si accumula**, non si ricostruisce
  pulito dopo l'approvazione.

## `mockups/` — cosa ci vive ora

La cartella `mockups/` non contiene più due concept alternativi. Contiene
l'**esplorazione della fondamenta di marca** (`CLAUDE.md` §4, passo 2) — sacrificabile,
come prima:

- direzioni di logotipo, se lo studio lo disegna;
- swatch di palette derivate dal colore di marca;
- accoppiamenti display/body font.

Si mostrano per l'approvazione leggera del passo 2, prima di bloccare i token in
`DESIGN.md`. Il centerpiece vero e proprio (sopra) **non** vive qui: vive in `src/` perché
non è disposable.

## `mockups/DIREZIONE.md` — il registro della decisione

Sostituisce il vecchio `CONCEPTS.md`. Non è più una scheda di confronto fra due concept —
è il record di **cosa il centerpiece prova, cosa sacrifica, quale rischio è stato
accettato**. Si scrive quando il centerpiece è pronto per l'approvazione, non dopo:

```markdown
# Direzione — <Cliente>

Passo 3 di `rules/centerpiece-flow.md`. Fondamenta di marca già fissate in `DESIGN.md`
(<data>). Centerpiece: <scena 3D / video-scroll>, cosa mostra e perché è l'elemento firma
per questo cliente.

> **Approvato (<data>).**

## Cosa prova il centerpiece

- **Ritmo:** durata dello scroll, punti di sosta, dove cede il passo al contenuto statico.
- **Cosa vede per primo l'utente, e perché in quest'ordine.**
- **Elemento firma:** cosa lo rende non riproducibile identico su un altro cliente
  (`CLAUDE.md` §2).

## Cosa sacrifica — da dire onestamente

- ... (stessa disciplina del vecchio confronto A/B: nessun centerpiece fa tutto, dire cosa
  perde è più utile che venderlo)

## Rischio accettato

Nessun confronto esplicito con una versione senza motion è stato costruito per questo
cliente (`rules/centerpiece-flow.md`, nota di metodo in cima). Rete di sicurezza tecnica
verificata: `prefers-reduced-motion` servito, pagina funzionante senza WebGL/JS
(`CLAUDE.md` §7).

## Cosa serve prima di poter costruire il centerpiece

- [ ] ... (materiali reali mancanti: foto, video sorgente, CAD, dettagli operativi — vedi
      `CLAUDE.md` §5)
```

`DIREZIONE.md` resta in `mockups/` (o si sposta, ma non si cancella) anche dopo che il
centerpiece è stato rifinito nel build: è la memoria del perché si è scelta quella
direzione e di cosa si sapeva già dover sacrificare.

## Cosa non fare

- Costruire il centerpiece per ultimo, sopra un layout già deciso — è l'anti-pattern che
  questo file esiste per evitare.
- Trattare il prototipo dello spike come definitivo: gli asset **devono** passare dalla
  pipeline vera (`webgl.md` §3 / `scroll-frames.md` §3) prima dell'audit.
- Ridiscutere palette o font qui: sono già decisi alla fondamenta di marca. Se durante il
  centerpiece emerge che non vanno bene, si torna indietro al passo 2, non si aggiusta a
  margine.
- Riempire di lorem ipsum. Testi veri o placeholder dichiarati, mai finti.
- Saltare `mockups/DIREZIONE.md` o scriverlo solo a cose fatte — perde la funzione di
  registrare onestamente cosa si sacrifica e quale rischio si accetta.

## Dopo l'approvazione

Si rientra nel workflow normale del `CLAUDE.md` al passo Build (§4, passo 5). Da qui in poi
valgono `DESIGN.md` per i token, `rules/webgl.md` se c'è 3D, `rules/scroll-frames.md` se
c'è video-scroll, `rules/motion.md` per la coreografia fine. Il prototipo del centerpiece
non si butta: si rifinisce sul posto, in `src/`, attraverso la pipeline vera.
