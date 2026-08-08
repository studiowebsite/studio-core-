# references/PATTERNS.md

Analisi trasversale di 15 progetti dal portfolio di **bycrawford.com** (Squarespace, studio
freelance USA/UK). Non è una libreria di riferimenti come `INDEX.md` — qui non ci sono
schede per sito, ma **pattern per problema di design**, estratti guardando cosa ricorre tra
registri istituzionali che nella nostra libreria attuale (34 dei 39 riferimenti "respirata")
non abbiamo quasi mai incontrato: industrial, enterprise, finance, security, energy, real
estate, medical, consulting.

## Selezione e metodo

**15 progetti**, scelti dopo aver mappato la tassonomia reale del portfolio (categorie e
pagine più vecchie, non solo la prima pagina di listing):

| # | Progetto | Settore | Ruolo nel campione |
|---|---|---|---|
| 1 | Trident LLC | Enterprise · cantieristica navale | istituzionale |
| 2 | Interdoor | Industrial · porte industriali | istituzionale |
| 3 | FLO-CORP | Manufacturing · strumentazione di flusso | istituzionale |
| 4 | Rescor | Security · protezione esecutiva | istituzionale |
| 5 | Renu Energy | Energy · solare (Caraibi) | istituzionale |
| 6 | Artorius | Finance · wealth management | istituzionale |
| 7 | Ashgrove Capital | Finance · private credit | istituzionale |
| 8 | Prova Health | Medical · formazione life sciences | istituzionale |
| 9 | Elmington | Real Estate · sviluppo immobiliare | istituzionale |
| 10 | Attune Consulting | Consulting · family wealth advisory | istituzionale |
| 11 | StrateSphere | Consulting · sviluppo internazionale | istituzionale |
| 12 | Spark AI | AI · consulenza per agenzie | contrasto |
| 13 | Loomia | Tech · elettronica flessibile | contrasto |
| 14 | Homebuilder AI | AI · sales training | contrasto |
| 15 | Silicon Hills Talent Partners | Tech · recruiting per AI startup | contrasto |

**Fonte per progetto:** la pagina case study su bycrawford.com/portfolio (copy, struttura,
sequenza sezioni) + lo screenshot statico integrale della pagina embedato nella case study
("here's how it looks"), scaricato ed esaminato come immagine. Per **Ashgrove Capital** e
**Loomia** ho anche verificato il sito live del cliente (ashgrovecap.com, loomia.com): la
sostanza dei pattern (stat immediate, loghi di autorità, registro) regge sul sito reale, non
solo nello screenshot di vendita dello studio.

**Limite tecnico, rispettato:** in questa sessione non avevo accesso a uno strumento di
browser live (chrome-devtools non risultava disponibile), quindi **non ho potuto verificare
dal vivo** sequenza di caricamento, comportamento allo scroll, hover, `prefers-reduced-motion`,
valori tipografici calcolati o peso del first load — né per i 13 progetti visti solo via
screenshot, né oltre il controllo testuale fatto per Ashgrove/Loomia. Ogni pattern che
dipenderebbe da questi aspetti è marcato **"da verificare sul sito reale"** qui sotto e non
è mai presentato come fatto accertato. È tutto Squarespace: le tecniche implementative sono
vincolate a quella piattaforma e non sono ciò che si estrae — quello che segue è composizione,
ritmo, struttura commerciale.

---

## A. Come si apre una home quando il prodotto è invisibile (servizi, B2B)

### Contesto reale al posto dello stock
**Dove:** Trident LLC (navi militari e da crociera vere, non stock generico di "cargo ship"),
Renu Energy (drone reale su isole caraibiche specifiche, non pannelli solari generici),
Rescor (skyline reale dietro silhouette, foto vere del team in missione).
**Meccanismo:** quando il servizio è astratto, l'unica cosa fotografabile è il *mondo* in cui
opera il cliente — non il servizio stesso. Una foto generica di "professionisti che stringono
la mano" non dice niente su quel cliente; una nave da guerra rifornita in mare aperto dice
"scala globale, posta in gioco alta" senza una parola.
**Quando usarlo:** ogni volta che il brief fornisce materiale fotografico reale del contesto
operativo (cantiere, impianto, sede) invece di foto di persone in ufficio — usarlo prima di
cercare stock.

### Headline-formula ripetuta tra sezioni
**Dove:** Trident LLC — "Built for *Success*", "Built for *Transformation*", "Built for
*Good*", "Built for *you*" in quattro sezioni diverse.
**Meccanismo:** una struttura sintattica fissa con una sola parola che cambia lega sezioni
tematicamente lontane (risultati commerciali, cambiamento di settore, responsabilità sociale)
sotto un'unica promessa di marca, senza bisogno di transizioni esplicite.
**Quando usarlo:** quando un cliente ha 3-4 messaggi scollegati da comunicare (prodotto,
valori, persone) e serve un filo conduttore verbale più che visivo.

### CTA segmentate per pubblico dentro l'hero stesso
**Dove:** Ashgrove Capital — tre pill "For Founders / For Sponsors / For Investors" affiancate
subito sotto la headline, prima di qualunque altro contenuto.
**Meccanismo:** quando il pubblico della home è strutturalmente eterogeneo (chi cerca credito,
chi lo fornisce, chi lo eroga), instradare subito evita una home "per tutti" che non parla a
nessuno in particolare — ogni visitatore si toglie dal percorso comune al primo scroll.
**Quando usarlo:** siti B2B con 2-3 tipi di visitatore chiaramente distinti e con bisogni
diversi (non varianti dello stesso bisogno).

**Riflesso di categoria — attenzione:** hero fotografico full-bleed + headline serif/sans in
overlay + un solo CTA "Discover/Get in touch" ricorre in **11 dei 15** siti del campione. È il
centro di gravità della categoria "sito di servizi B2B", non una scelta: se il piano per un
cliente arriva qui senza una ragione specifica del suo mondo, è un riempitivo (CLAUDE.md §2).

---

## B. Come si dimostra credibilità senza dichiararla

### Banda di statistiche subito sotto l'hero
**Dove:** Ashgrove Capital (2019 · 15 · EUR5-65M · 20 anni), FLO-CORP (24/7 · 35+ · 15+ · 5yr),
Rescor (500+ · 6 · 15+ · 40+), Prova Health (100.000+ clinici · 25+ aree · 50+ paesi), Silicon
Hills (1.2K+ · 92% · 40%).
**Meccanismo:** numeri grandi, zero spiegazione, posizionati **prima** di qualunque copy
persuasivo: il visitatore forma un giudizio di scala/serietà nei primi due secondi, prima
ancora di leggere cosa fa l'azienda. Funziona perché non chiede di essere creduto — il numero
non argomenta, occupa spazio con autorità.
**Quando usarlo:** quando il cliente ha davvero numeri verificabili (anni, clienti, volumi).
Con numeri arrotondati o inventati il pattern si rovescia contro la fiducia che dovrebbe creare.

**Riflesso di categoria — il più forte del campione:** presente esplicito in **5 progetti su
15** e in forma più diluita in altri 4 — oltre metà del campione istituzionale. È il pattern
da cui allontanarsi di default: se un cliente ha solo 2-3 numeri come tutti gli altri, la banda
statistica non lo distingue, lo confonde con la categoria.

### Autorità presa in prestito, non dichiarata
**Dove:** Prova Health (loghi Harvard, Johns Hopkins, Oxford, Cambridge come "faculty and
esperti", non come clienti), Spark AI (badge "Featured in Forbes/Business Insider" e loghi
M&S, Oxford come clienti misti a riconoscimenti stampa), Homebuilder AI (testimonial che
nominano "Microsoft Copilot", "Claude", "DeepSeek" come strumenti usati, non come clienti),
Loomia (loghi Ford, Analog Devices, Hyundai Cradle sul sito reale).
**Meccanismo:** quando il cliente non ha (o non può mostrare) i propri clienti — per
riservatezza, o perché è troppo piccolo — prende in prestito la reputazione di un terzo
riconoscibile: un'università, una testata, uno strumento noto citato di sfuggita. La fiducia
si trasferisce per associazione, non per dichiarazione diretta.
**Quando usarlo:** clienti B2B piccoli o vincolati da NDA che non possono nominare i propri
clienti diretti, ma hanno partnership, menzioni stampa o strumenti riconoscibili nel loro flusso.

### Bio del fondatore come sostituto delle metriche
**Dove:** Attune Consulting ("The Founder, Andy Stubblefield" — foto + citazione lunga),
Spark AI (sezione "Our Founders" con foto e link social dei due co-founder), Homebuilder AI
(la stessa persona ricompare in quasi ogni sezione della pagina).
**Meccanismo:** per un'attività personale o una boutique senza track record numerico
pubblicabile, la credibilità si sposta dall'azienda alla persona: una foto reale, una voce in
prima persona, un nome che si può cercare online. Sostituisce lo stat che l'azienda non ha.
**Quando usarlo:** consulenza individuale, coaching, boutique con meno di una decina di
persone — mai per un'azienda con più di un volto pubblico, diventerebbe arbitrario.

### Mappa o globo per rendere tangibile la scala
**Dove:** Rescor (globo scuro con pin e didascalia "Strategically Placed. Globally Trusted"),
Interdoor (mappa del Regno Unito con i punti di intervento).
**Meccanismo:** elencare sedi o paesi a parole è astratto; un punto su una mappa reale è
immediatamente leggibile come "presenza fisica qui" — funziona anche senza leggere una parola.
**Quando usarlo:** aziende con operatività multi-sede o multi-paese reale (non un ufficio
singolo con clienti sparsi).

---

## C. Come si struttura un case study / una pagina "cosa facciamo"

### Titolo come risultato, non come etichetta
**Dove:** Prova Health — le card di case study si intitolano "We trained the global staff of a
top diagnostics company on the basics of cancer care", non "Case Study: [Cliente]".
**Meccanismo:** il titolo stesso comunica il valore prima del click; un'etichetta neutra
("Case Study 3") costringe il lettore ad aprire per capire se vale il tempo.
**Quando usarlo:** sempre che il cliente permetta di descrivere l'esito in una frase, anche
senza nominare il proprio cliente per riservatezza.

### Diagramma geometrico per un metodo immateriale
**Dove:** StrateSphere (triangolo "People / Capability · Process · Technology"), Attune
Consulting (tre card numerate 01/02/03 con pattern lineari astratti generati, non foto, per
"Clarity / Alignment / Continuity").
**Meccanismo:** un metodo di consulenza non ha una forma fisica. Una figura geometrica semplice
(triangolo, cerchio, linee) gli dà una forma memorizzabile senza dover illustrare concetti
astratti con foto che finirebbero per essere decorative.
**Quando usarlo:** metodologie proprietarie a 3-4 componenti. Non forzarlo su un servizio a
singolo step: il diagramma deve rappresentare una relazione reale tra parti, non riempire spazio.

### Un solo elemento espanso in una lista di categorie
**Dove:** StrateSphere — lista di segmenti clienti (istituzioni accademiche, imprese,
contractor della difesa, agenzie governative...) dove solo una riga è espansa con foto e testo,
le altre restano chiuse.
**Meccanismo:** mostra la varietà dei segmenti serviti senza dover produrre una foto di qualità
per ciascuno — la riga espansa fa da "esempio rappresentativo" e implica che le altre
meriterebbero lo stesso trattamento se richiesto.
**Quando usarlo:** quando il cliente serve 5+ segmenti ma ha materiale fotografico buono solo
per uno o due.

---

## D. Come si chiede il contatto, e dove

### CTA ripetuta a intervalli fissi, sempre le stesse parole
**Dove:** Trident LLC — "Schedule a call" in nav, a metà pagina, e nel blocco finale "Start
your project", sempre la stessa dicitura (coerente con CLAUDE.md §8: stesso nome per tutto il
flusso). Pattern implicito nella maggioranza del campione.
**Meccanismo:** un visitatore che decide di agire a metà scroll non deve risalire alla nav né
indovinare se il CTA in fondo fa la stessa cosa di quello che ha già visto.
**Quando usarlo:** sempre, per pagine lunghe (scroll multiplo) con una singola azione di
conversione. Non introdurre una seconda dicitura per la "stessa" azione.

### Form che si ramifica invece di pagine separate
**Dove:** Ashgrove Capital (dropdown "For Founders / For Sponsors / For Investors" dentro il
form stesso), Renu Energy (dropdown "Subject" nel form di contatto).
**Meccanismo:** quando il pubblico è eterogeneo (§A) ma il volume non giustifica pagine di
contatto separate per audience, un singolo dropdown nel form instrada la richiesta lato back-end
senza moltiplicare l'architettura del sito.
**Quando usarlo:** 2-4 tipi di richiedente con lo stesso form (nome, email, messaggio) ma
destinatario o urgenza diversi internamente.

### Blocco contatto sempre "diverso" dal resto della pagina
**Dove:** Trident LLC (diagonale arancio/grigio che rompe la griglia rettangolare usata
ovunque), Ashgrove Capital (unico punto della pagina dove il colore teal scuro incontra il
crema chiaro del testo in un blocco form).
**Meccanismo:** un cambio di trattamento visivo — diagonale, cambio di colore netto, cambio di
grana — segnala "qui il registro cambia da leggere ad agire" più efficacemente di un titolo
"Contattaci" uguale al resto.
**Quando usarlo:** come chiusura di pagine lunghe con più sezioni informative prima del contatto.

---

## E. Che densità e che ritmo servono a un registro istituzionale

### Blocchi di colore alternati per scandire il ritmo verticale
**Dove:** Artorius (bande scuro/chiaro/scuro), StrateSphere (navy/bianco/navy), Renu Energy
(teal/bianco/teal), FLO-CORP (bianco/nero/bianco/rosso).
**Meccanismo:** senza bordi o cornici, un cambio di colore full-bleed tra una sezione e la
successiva segna dove finisce un argomento e comincia il prossimo — è il modo più economico
di dare respiro percepito anche in un layout compatto.
**Quando usarlo:** pagine con 5+ sezioni tematiche diverse, come alternativa a spaziatura
verticale enorme quando il registro non permette troppo vuoto (vedi sotto).

### La densità segue il decisore, non il settore
**Osservazione trasversale, non un singolo pattern:** Interdoor (buyer tecnico B2B, ingegnere
che confronta specifiche) è denso, compatto, tante tile per schermata. Attune Consulting
(HNWI, famiglie facoltose che valutano un advisor) è respirato, quasi quanto i riferimenti
"caldi" della nostra libreria attuale. Entrambi sono "istituzionali" per settore, ma il
registro visivo diverge per **chi decide**, non per il settore in sé. Prima di assumere che
"istituzionale = compatto", chiedersi chi legge: un tecnico che confronta opzioni vuole
densità informativa; un decisore che valuta una relazione di fiducia vuole spazio.

---

## F. Come si tratta la fotografia quando il cliente ha materiale mediocre o assente

### Illustrazione dataviz al posto della foto
**Dove:** Prova Health — hero con un'illustrazione a grafici/torta astratta invece di una foto
di formazione reale; Attune Consulting — pattern lineari generati per concetti astratti invece
di foto di repertorio.
**Meccanismo:** quando il servizio non produce niente di fotografabile (formazione, consulenza,
dati), un'illustrazione geometrica onesta batte una foto stock che mentirebbe sul contenuto
reale — il pubblico riconosce lo stock e lo sconta.
**Quando usarlo:** servizi puramente immateriali senza foto operative disponibili. Non è un
sostituto quando la foto reale esiste ma è di qualità mediocre: in quel caso trattamento
coerente (§ pavimento di mestiere, CLAUDE.md §2) batte l'illustrazione.

### Griglia di icone monocrome al posto di N foto
**Dove:** FLO-CORP (8 settori: Aerospace, Agricoltura, Chimica... tutti a icona, zero foto),
Interdoor (categorie prodotto a icona nella nav prodotti).
**Meccanismo:** quando servirebbero 8-10 foto di qualità omogenea per coprire tutti i settori
serviti — cosa che quasi nessun cliente ha — un sistema di icone coerente evita di mescolare
foto buone e foto scadenti nella stessa griglia, che sarebbe peggio di non averne nessuna.
**Quando usarlo:** liste di 6+ categorie/settori dove il cliente non ha fotografia completa e
omogenea per ciascuna.

### Foto vere di persone reali, anche tecnicamente imperfette
**Dove:** Rescor (team executive, foto da ritratto aziendale reale, non stock), Interdoor
(testimonial con nome, ruolo e azienda ma senza foto — l'assenza della foto non toglie
credibilità perché il nome e il ruolo sono reali e verificabili).
**Meccanismo:** l'autenticità (una persona verificabile, con nome e ruolo) conta più della
rifinitura tecnica dello scatto. Un ritratto aziendale leggermente rigido batte uno stock
patinato, perché il secondo è riconoscibile come falso a colpo d'occhio.
**Quando usarlo:** sempre che il cliente possa fornire foto reali di persone reali, anche non
professionali — preferirle sempre allo stock, coerente con `project-setup.md` §6 sui diritti.

---

## G. Come si costruisce gerarchia tipografica su contenuti noiosi

### Parola-chiave a colore dentro un titolo altrimenti neutro
**Dove:** Artorius ("**Bespoke** wealth management, crafted around you", "expert **wealth
management**, built around you" — la parola tematica è sempre nel colore di marca), Trident
LLC ("Built for *Success*" — la parola cambia stile, non dimensione).
**Meccanismo:** un secondo livello di enfasi ottenuto per colore o corsivo, non per scala
tipografica: permette di sottolineare *quale* parola porta il significato del titolo senza
dover ingrandire tutto il testo o spezzare la frase in due dimensioni diverse.
**Quando usarlo:** titoli lunghi (10+ parole) dove serve indicare all'occhio dove guardare
per primo, mantenendo una sola dimensione di font per tutta la frase.

### Il numero come elemento tipografico dominante
**Dove:** Ashgrove Capital ("2019", "15", "EUR5-65M", "20 YEARS" — i quattro numeri sono più
grandi di qualunque H1 della pagina), FLO-CORP, Rescor: stesso principio.
**Meccanismo:** in un contesto dove il contenuto è per forza descrittivo e poco visivo (servizi
B2B), il numero diventa l'unico elemento che può permettersi una scala tipografica enorme senza
sembrare gridato — perché un numero grande si legge come dato, non come slogan.
**Quando usarlo:** solo con numeri reali (§B) — un numero enorme e inventato è il modo più
veloce di perdere fiducia proprio nel momento in cui la si costruisce.

**Riflesso di categoria:** l'etichetta piccola, maiuscola, colorata sopra ogni titolo di
sezione ("• OUR APPROACH", "OUR SOLUTIONS", "• Our approach") ricorre in **quasi tutti i 15**
progetti. Da tenere presente come tic tipografico della categoria "sito di servizi
Squarespace": utile come funzione (orienta prima del titolo) ma, usata identica ovunque,
smette di distinguere un cliente dall'altro.

---

## 5 meccanismi più trasferibili al nostro stack

1. **Eyebrow label colorata sopra i titoli di sezione** (§G) — puro CSS/Tailwind, zero
   dipendenze, si deriva da `design-tokens.ts` come ogni altro colore. Va reinterpretato con
   il colore di marca del cliente, non copiato come tic.
2. **Parola-chiave enfatizzata a colore dentro un titolo** (§G) — un `<span>` con classe token,
   nessuna libreria. Utile ovunque serva indicare l'unica parola che conta in un titolo lungo.
3. **Form con select che instrada la richiesta** (§D) — un campo in più nello schema del form
   Sanity/Next, evita di dover progettare pagine di contatto separate per audience diverse.
4. **CTA segmentate per pubblico nell'hero** (§A) — utile in particolare per i nostri
   configuratori (`rules/webgl.md` §6): varianti di pubblico invece di varianti di prodotto,
   stesso principio di instradamento immediato.
5. **Diagramma geometrico animabile per un metodo a 3-4 componenti** (§C) — dove bycrawford usa
   un'immagine statica (limite Squarespace), il nostro stack può farlo con SVG/R3F animato in
   scroll (coerente con `rules/motion.md`), un salto di qualità reale sopra la fonte.

## 5 riflessi di categoria più forti — cosa non fare per default

1. **Banda di 3-4 statistiche subito sotto l'hero**, prima di ogni copy (§B) — il pattern più
   ricorrente e meno distintivo del campione. Usarlo solo se i numeri del cliente sono
   realmente sopra la media del suo settore, mai come riempitivo di default.
2. **Hero fotografico full-bleed + headline overlay + singolo CTA "Discover/Get in touch"**
   (§A) — presente in 11 progetti su 15. È la formula di default della categoria "sito di
   servizi B2B": la direzione va cercata altrove, non qui.
3. **Eyebrow label identica su ogni sezione** (§G) — funzionale ma, se non calibrata sul
   cliente (colore, voce, posizione), diventa il segnale più immediato di un sito "fatto con
   lo stampino".
4. **Griglia "Trusted by" di loghi clienti in bianco/grigio subito sotto la hero** (§B, non
   distinta sopra ma osservata in più della metà del campione oltre Spark AI/Loomia) — se il
   cliente non ha loghi di peso reale, meglio l'autorità presa in prestito (§B) che una
   griglia debole con nomi sconosciuti.
5. **Blocco FAQ ad accordion identico a fine pagina, prima del footer** — presente quasi
   ovunque nel campione indipendentemente dal settore (Trident, FLO-CORP, Silicon Hills...).
   Ha tutta l'aria di un blocco di default della piattaforma più che di una scelta di design:
   se lo si tiene, va ridisegnato sui token del progetto, non lasciato con l'aspetto generico
   con cui ricorre qui.
