# rules/mockup-flow.md

Come nasce la direzione visiva di una pagina dove il design è il punto — home page,
landing, qualsiasi pagina con 3D o motion significativo. Sostituisce il "piano di design a
parole" con qualcosa che si **vede** prima di costruire.

Si applica dopo il brief (§5 del CLAUDE.md) e prima del build. È il gate di approvazione.

---

## Il principio

Un piano scritto — palette, font, concept — non fa vedere niente. Per una pagina dove il
movimento e il 3D sono metà dell'effetto, l'approvazione su carta è cieca. Quindi:
**due mockup navigabili, si sceglie insieme, e se nessuno convince si parte da una base
che fornisce il committente.**

## I due mockup — asse fisso: statico vs motion

**L'asse di confronto è fisso, per scelta dello studio: Concept A non ha motion
significativo, Concept B lo ha dall'inizio.** Non è un compromesso stilistico — è la
domanda operativa che questo studio deve sempre porsi prima di investire in build, dato
che 3D e motion sono una delle due specializzazioni dichiarate (`CLAUDE.md` §1): **per
questo cliente, il movimento guadagna il suo costo, o l'esperienza regge già senza?**
Fissare l'asse permette di rispondere sempre alla stessa domanda in modo comparabile da
progetto a progetto, invece di scoprirlo a metà build.

**A e B condividono le stesse funzioni e la stessa struttura informativa.** Vengono dal
brief, non dal designer, e non sono materia di scelta tra i due concept: stesse sezioni,
stessi contenuti, stesso form, stesse CTA. Quello che diverge — e deve divergere
davvero — è **l'interfaccia**: gerarchia visiva (cosa emerge per primo), ritmo (quanto in
fretta si arriva al punto), cosa viene prima, densità (quanto si mostra per schermata),
navigazione (come ci si muove dentro la pagina), e presenza o assenza di motion
significativo.

- **Concept A — statico.** Deve convincere e vendere con **zero animazione ambientale**:
  tipografia, fotografia, copy e gerarchia portano il 100% della persuasione. Non è il
  mockup "povero" — è la prova che, tolto ogni movimento, il sito funziona ancora (di
  fatto, è già la versione che la pagina finale dovrà mostrare sotto
  `prefers-reduced-motion`).
- **Concept B — motion dall'inizio, non aggiunto dopo.** Il movimento deve superare il
  test di `rules/motion.md` §2 già in fase di mockup: *cosa capisce l'utente grazie a
  questo movimento che non capirebbe senza?* Se la risposta è "niente, ma è più
  impressionante", B è costruito male — non è un concept motion, è A con un filtro sopra.
  In B il motion è spesso anche l'occasione per un ritmo diverso (scroll più lungo,
  rivelazione progressiva dei contenuti) — non solo ingressi animati sopra il layout di A.

**Il criterio per dire che sono davvero due mockup, e non uno travestito, non è "hanno
contenuti diversi" — non li hanno, ed è corretto così, vengono dallo stesso brief. È:
l'utente li vive in modo diverso. Stessa informazione, esperienza distinta.** Se togli il
motion da B e resta identico ad A nell'ordine, nella densità e nella navigazione, non hai
due interfacce: hai un layout con un filtro sopra. Va rifatto divergere sull'esperienza,
mai sul contenuto — quello resta unico, dal brief.

## Forma: HTML statico navigabile

Non immagini. Pagine HTML che si scrollano davvero, così si sente il ritmo, il motion di
base, il comportamento. Ma **statiche e sacrificabili**:

- Un file per mockup, in `mockups/concept-a/` (statico) e `mockups/concept-b/` (motion).
- Fuori dal codice di produzione: non in `src/`, non in `app/`. Sono da buttare.
- Contenuti reali del brief dove ci sono (titoli, testi), placeholder dichiarati per il
  resto. Mai riempire di lorem ipsum: un mockup con testo finto non fa vedere la tipografia
  vera.
- In B, motion accennato, non rifinito: bastano gli ingressi e un'idea dello scroll. Il 3D
  può essere un poster o un loop, non serve la scena vera in questa fase.
- Ogni mockup ha in cima un commento con il suo concept in una riga, così a distanza di
  giorni si sa cosa rappresentava.

**Non è codice di produzione riutilizzabile.** La tentazione di far diventare il mockup
scelto la base del sito è una trappola: è costruito per essere veloce, non giusto. Il
concept scelto si ricostruisce pulito nel progetto vero.

**Se dopo la scelta il committente vuole spingere ancora sulla motion di B** (è successo:
un concept scelto può ricevere un ulteriore giro di raffinamento collaborativo prima del
build vero, es. `concept-b` → `concept-b-motion` come cartella successiva) — è legittimo e
non serve un terzo mockup da zero: si itera sullo stesso concept già scelto, si aggiorna
`CONCEPTS.md` con la nota di quale versione è quella finale.

## CONCEPTS.md — la scheda di confronto obbligatoria

**Ogni progetto che passa da questo flusso produce `mockups/CONCEPTS.md`.** Non è
opzionale e non è solo per uso interno: è il documento che si mostra insieme ai due
mockup, e resta come registro della decisione anche dopo che gli HTML vengono buttati.
Si scrive in due tempi:

1. **Prima di costruire** — la parte alta: le due righe di interfaccia (§ sotto), per
   farle validare al committente prima di spendere tempo sull'HTML.
2. **Dopo aver costruito** — il resto, mano a mano che il confronto si chiarisce.

Struttura, ripresa da un caso reale che ha funzionato:

```markdown
# Concept — <Cliente>

Passo 1 di `rules/mockup-flow.md`: A statico, B motion, sulla stessa struttura
informativa del brief — stesse funzioni, stessi contenuti, stessa gerarchia di importanza.
Divergono nell'interfaccia: come si vive la pagina, non cosa dice. Se l'approccio non
convince già in una riga, si aggiusta prima di costruire l'HTML.

> **Direzione scelta (<data>): `<cartella>`.** Nota qui se B è stato ulteriormente
> raffinato dopo la scelta (es. concept-b → concept-b-motion) e quale versione è finale.

## A — «<titolo dell'esperienza in una riga>»

> Come si vive: cosa vede per primo l'utente, in una frase.

- **Cosa vede per primo:** ...
- **Ritmo e densità:** quanto in fretta si arriva al punto, quanto si mostra per
  schermata
- **Come naviga:** ...
- **Il motion:** assente di proposito — perché in A deve reggere senza.
- **Cosa ricorda, dopo:** ...
- **Elemento firma:** ...
- **Cosa sacrifica — da dire onestamente:** ...
- **Rischio:** ...

## B — «<titolo dell'esperienza in una riga>»

(stessa struttura di A, stessi contenuti; **Il motion** qui descrive cosa fa capire il
movimento che la sola gerarchia statica non farebbe capire — non "più impressionante", ma
"più chiaro")

---

## Perché sono opposti (e non due palette dello stesso sito)

| | A — statico | B — motion |
|---|---|---|
| Cosa vede per primo | ... | ... |
| Quanto tempo chiede | ... | ... |
| Come naviga | ... | ... |
| Cosa ricorda, dopo | ... | ... |
| Motion | assente, di proposito | ... (cosa fa capire) |
| Se sbagliamo | ... | ... |

## Esiti possibili (`rules/mockup-flow.md`)

1. Uno dei due → diventa la direzione.
2. Un mix → si annota la sintesi prima di costruire.
3. Nessuno dei due → si parte da una base fornita dal committente.

## Cosa serve prima di poter costruire i mockup

- [ ] ... (materiali reali mancanti: foto, testi grezzi, dettagli operativi — vedi
      `CLAUDE.md` §5)
```

La tabella "Perché sono opposti" e la checklist prerequisiti non sono decorazione: sono
quello che rende la presentazione onesta invece che una vendita — vedi "Cosa non fare"
sotto.

## Il flusso

1. Dal brief, definisci **le due interfacce** (stessa struttura informativa, gerarchia,
   ritmo, densità e navigazione diverse) e scrivile in `CONCEPTS.md`, una riga ciascuna.
   Mostrale prima di costruire: se il committente dice subito che un approccio è fuori
   strada, non sprecare tempo a costruirlo.
2. Costruisci i due mockup HTML navigabili — A statico, B motion.
3. `pnpm shots` su entrambi, ai quattro viewport. Guardali affiancati.
4. Completa `CONCEPTS.md`: cosa vede per primo, ritmo, navigazione, elemento firma, e
   soprattutto cosa ciascuno sacrifica — nessun mockup fa tutto, e dire cosa perde è più
   utile che venderlo.
5. Presentali **insieme**, con `CONCEPTS.md` come traccia della conversazione.
6. Il committente sceglie. Le uscite possibili sono tre:
   - **Uno dei due** → diventa la direzione, si ricostruisce pulito nel progetto.
   - **Un mix** → "il layout di A con il registro di B". Legittimo, e spesso è il risultato
     migliore. Si annota la sintesi in `CONCEPTS.md` prima di costruire.
   - **Nessuno dei due** → si parte da una **base fornita dal committente** (un riferimento,
     uno schizzo, un sito che gli piace). Da lì si fa un solo mockup mirato, non altri due.
7. Annota la direzione scelta in cima a `CONCEPTS.md`, con la data.

## Cosa non fare

- Costruire B come "A con le animazioni sopra" — l'asse tecnico è fisso, l'interfaccia no:
  se gerarchia, ritmo, densità e navigazione sono gli stessi di A tolta la motion, sono lo
  stesso mockup travestito. Non serve un contenuto diverso — quello è identico per
  costruzione — serve un'esperienza diversa.
- Mettere motion in B senza materiale che la giustifichi (nessun dato, nessuna foto,
  nessun prodotto da mostrare in movimento) solo per rispettare l'asse — in quel caso il
  motion non supera il test di `rules/motion.md` §2, e va ripensato cosa anima B.
- Trattare il mockup come codice di produzione. È un modello, si butta.
- Saltare `CONCEPTS.md` o scriverlo solo a scelta fatta — perde la funzione di far validare
  l'interfaccia prima di costruire.
- Presentare un mockup nascondendone i difetti. La scelta si fa sui compromessi reali.
- Riempire di lorem ipsum. Testi veri o placeholder dichiarati, mai finti.

## Dopo la scelta

La direzione approvata rientra nel workflow normale del CLAUDE.md al passo build. Da qui
in poi valgono `DESIGN.md` per i token, `rules/webgl.md` se c'è 3D, `rules/motion.md` per
le animazioni. `CONCEPTS.md` resta in `mockups/` (o si sposta, ma non si cancella) anche
quando gli HTML vengono rimossi: è la memoria del perché si è scelta quella direzione. Il
mockup ha fatto il suo lavoro: ha reso la scelta visibile. Ora si costruisce sul serio.
