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

## I due mockup — concept opposti, non varianti

La regola che rende il confronto utile: i due mockup rispondono alla **stessa domanda del
brief in due modi divergenti**. Non due palette sullo stesso layout — due *mondi*.

Esempio, per un lido balneare:
- **A** — il mare è il protagonista: media immersivi a tutto schermo, il prodotto è
  l'esperienza.
- **B** — l'artigianato della cucina: editoriale, tipografico, il prodotto è la competenza.

Se i due mockup si somigliano, sono sbagliati: rifalli più lontani. La divergenza è il
punto — costringe a una scelta ragionata, e il *perché* di quella scelta è la direzione
del progetto.

## Forma: HTML statico navigabile

Non immagini. Pagine HTML che si scrollano davvero, così si sente il ritmo, il motion di
base, il comportamento. Ma **statiche e sacrificabili**:

- Un file per mockup, in `mockups/concept-a/` e `mockups/concept-b/`.
- Fuori dal codice di produzione: non in `src/`, non in `app/`. Sono da buttare.
- Contenuti reali del brief dove ci sono (titoli, testi), placeholder dichiarati per il
  resto. Mai riempire di lorem ipsum: un mockup con testo finto non fa vedere la tipografia
  vera.
- Motion accennato, non rifinito: bastano gli ingressi e un'idea dello scroll. Il 3D può
  essere un poster o un loop, non serve la scena vera in questa fase.
- Ogni mockup ha in cima un commento con il suo concept in una riga, così a distanza di
  giorni si sa cosa rappresentava.

**Non è codice di produzione riutilizzabile.** La tentazione di far diventare il mockup
scelto la base del sito è una trappola: è costruito per essere veloce, non giusto. Il
concept scelto si ricostruisce pulito nel progetto vero.

## Il flusso

1. Dal brief, definisci **due concept divergenti** e scrivili in una riga ciascuno.
   Mostrali prima di costruire: se il committente dice subito che una direzione è fuori
   strada, non sprecare tempo a costruirla.
2. Costruisci i due mockup HTML navigabili.
3. `pnpm shots` su entrambi, ai quattro viewport. Guardali affiancati.
4. Presentali **insieme**, con una riga onesta su cosa ciascuno sacrifica — nessun mockup
   fa tutto, e dire cosa perde è più utile che venderlo.
5. Il committente sceglie. Le uscite possibili sono tre:
   - **Uno dei due** → diventa la direzione, si ricostruisce pulito nel progetto.
   - **Un mix** → "il layout di A con il registro di B". Legittimo, e spesso è il risultato
     migliore. Si annota la sintesi prima di costruire.
   - **Nessuno dei due** → si parte da una **base fornita dal committente** (un riferimento,
     uno schizzo, un sito che gli piace). Da lì si fa un solo mockup mirato, non altri due.

## Cosa non fare

- Due mockup che sono lo stesso sito ridipinto. Se non divergono, non servono.
- Trattare il mockup come codice di produzione. È un modello, si butta.
- Costruire entrambi i concept quando il brief già esclude una direzione. Chiedi prima.
- Presentare un mockup nascondendone i difetti. La scelta si fa sui compromessi reali.
- Riempire di lorem ipsum. Testi veri o placeholder dichiarati, mai finti.

## Dopo la scelta

La direzione approvata rientra nel workflow normale del CLAUDE.md al passo build. Da qui
in poi valgono `DESIGN.md` per i token, `rules/webgl.md` se c'è 3D, `rules/motion.md` per
le animazioni. Il mockup ha fatto il suo lavoro: ha reso la scelta visibile. Ora si
costruisce sul serio.
