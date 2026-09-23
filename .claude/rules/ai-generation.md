# rules/ai-generation.md

Da dove viene il video o l'immagine sorgente del centerpiece, quando non è un girato o uno
scatto reale del cliente. La skill globale **`artprompter`** trasforma una direzione
stilistica in prompt ottimizzati per i generatori (Nano Banana, Gemini image, GPT Image,
Seedance, Dreamina, Jimeng, Doubao...) — questo file dice **quando** usarla nel nostro
metodo, cosa entra e cosa non entra nel suo perimetro, e il cancello legale che la
accompagna sempre.

Vale insieme a `rules/centerpiece-flow.md` (dove nel flusso si inserisce) e
`rules/scroll-frames.md` (la pipeline che riceve il video generato). Non duplica i budget
di peso/frame di `scroll-frames.md` §3: quelli restano l'unica fonte, si applicano identici
a un video generato o girato.

---

## 1. Perimetro — dove entra, dove no

**Prima scelta, non ripiego**, per:
- il video sorgente del centerpiece video-scroll (`rules/scroll-frames.md`) — si genera
  anche quando si potrebbe girare davvero, per velocità e controllo pieno sulla direzione;
- immagini di mood/reference usate durante la fondamenta di marca (`CLAUDE.md` §4.2) e la
  discussione di direzione del centerpiece — materiale di lavoro, non necessariamente il
  deliverable finale.

**Resta fuori dal perimetro** (altre regole vincono):
- **Logo.** Resta lavoro vettoriale (Figma o equivalente) — un generatore di immagini non
  produce un file vettoriale pulito e ridisegnabile, e il logo è l'asset che il cliente userà
  per anni fuori dal sito.
- **Modelli 3D.** Un video o un'immagine generata non produce geometria utilizzabile: la
  pipeline resta CAD/Blender → `@gltf-transform/cli` (`rules/webgl.md` §3). L'AI può
  ispirare mood o texture di riferimento, non sostituisce la pipeline.
- **Fotografia documentaria dove l'autenticità è il punto** — foto del team, dello
  stabilimento reale, di un cantiere in corso: lì il valore è che sia vero, e un'immagine
  sintetica lo vanifica. Resta materiale reale del cliente, salvo una sua esplicita
  preferenza diversa dichiarata al brief.

Nel dubbio se un asset ricade qui o nella fotografia documentaria: chiedilo al brief
(`CLAUDE.md` §5), non deciderlo in build.

## 2. Il processo

1. **Discussione della direzione stilistica**, prima di scrivere un prompt. Riusa la
   fondamenta di marca già fissata (`DESIGN.md`: palette, mood, coppia font) — la direzione
   del centerpiece non si inventa a parte, deriva dagli stessi token. Vale lo stesso
   principio di `CLAUDE.md` §2: se il prompt funzionerebbe identico per un altro cliente, è
   un riempitivo, va rifatto più specifico al suo mondo.
2. **Generazione dei prompt** — skill `artprompter`, uno o più prompt per lo strumento
   scelto, coerenti con la direzione discussa al punto 1.
3. **Generazione esterna** — chi guida il progetto lancia i prompt nel generatore, produce
   le clip/immagini candidate. Non è un passo di questo assistente: l'output torna in
   conversazione per essere valutato.
4. **Rientro nel progetto come materiali.** L'output scelto entra in `materiali/video/` o
   `materiali/foto/` (`rules/project-setup.md` §3) — stessa distinzione sorgente/output di
   sempre. Da lì la pipeline normale produce ciò che finisce in `public/`: estrazione frame
   a budget per `scroll-frames.md` §3, o uso diretto se è un'immagine.

## 3. Cancello legale — disclosure e diritti, non negoziabile

Un video generato non è un girato del cliente: due obblighi, sempre, prima che diventi
parte della consegna.

- **Disclosure esplicita al cliente.** Il cliente sa che il centerpiece (o l'asset) è
  generato da AI, non un girato/scatto reale, e lo approva esplicitamente — stesso spirito
  di `rules/project-setup.md` §6 ("niente stock non licenziato online"): un contenuto
  sintetico non dichiarato è lo stesso rischio di fiducia di un'immagine senza diritti,
  anche se qui il rischio è la trasparenza col cliente più che il diritto d'autore di terzi.
- **Diritti d'uso commerciale verificati per lo strumento specifico usato.** Non tutti i
  generatori concedono automaticamente pieno uso commerciale per un sito consegnato a un
  cliente pagante — va controllato per progetto, sullo strumento realmente usato, non
  assunto per categoria ("i generatori AI vanno bene" non è una verifica).
- Questi due punti entrano nel cancello legale già esistente di `rules/project-setup.md` §6
  — si verificano **prima** di qualunque deploy pubblico, non alla consegna.

## Checklist

- [ ] Direzione stilistica discussa e derivata da `DESIGN.md`, non inventata a parte
- [ ] Prompt generati con `artprompter`, specifici al mondo del cliente (non riempitivo)
- [ ] Output scelto in `materiali/` (video o foto), non direttamente in `public/`
- [ ] Se video: passato dalla pipeline di `scroll-frames.md` §3, stessi budget di un girato
- [ ] Cliente informato che l'asset è generato da AI, e ha approvato esplicitamente
- [ ] Diritti d'uso commerciale dello strumento specifico verificati per questo progetto
- [ ] Se l'asset è fotografia documentaria (team, sede, cantiere) — non è passato da qui,
      è materiale reale del cliente
