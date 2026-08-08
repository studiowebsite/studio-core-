# rules/seo.md

Fa parte del pavimento di mestiere quanto la tipografia o lo spacing (CLAUDE.md §2): il
cliente non lo chiede mai esplicitamente nel brief, lo dà per scontato — e se manca, se ne
accorge solo mesi dopo, quando chiede "perché su Google non ci troviamo?". Costruirlo
dall'inizio, pagina per pagina mentre si scrive la route, costa quasi niente con le
primitive di Next.js App Router. Ritrovarselo dopo la consegna costa rifare ogni pagina una
per una. **Si applica di default a ogni progetto**, salvo diversamente concordato col
cliente.

---

## 1. Baseline obbligatoria, per ogni pagina

- `generateMetadata` per ogni route: `title` con un pattern coerente in tutto il sito (mai
  lo stesso title su pagine diverse), `description` reale e specifica alla pagina, mai
  duplicata o troncata a caso.
- Open Graph + Twitter card con un'immagine reale per le pagine principali — non
  l'immagine placeholder di default del framework. È quello che il cliente vede quando
  incolla il link su LinkedIn o WhatsApp: se manca, il difetto è immediato e visibile.
- `canonical` esplicito su ogni pagina.
- *(progetti bilingue)* `hreflang` corretto per ogni lingua — meccanica in CLAUDE.md §8.

## 2. Sitemap e robots — a livello di progetto, non di pagina

- `sitemap.ts` **generato dalle route reali**, non scritto a mano: un sitemap statico si
  disallinea alla prima pagina aggiunta o tolta.
- `robots.ts` che esclude esplicitamente ciò che non va indicizzato (contenuti di
  anteprima/draft di Sanity, rotte di stato interno).

## 3. Configuratori — il canonical previene la duplicazione, non la crea

`rules/webgl.md` §6 mette lo stato nell'URL (`?modello=x200&finitura=noce`) — corretto per
condividere una configurazione, ma senza un canonical esplicito un crawler vede decine di
URL quasi identici come pagine distinte: contenuto duplicato che diluisce il
posizionamento invece di aiutarlo. Il canonical punta alla configurazione "base" (o alla
pagina del modello, non della singola variante), a meno che una variante specifica meriti
davvero una pagina indicizzabile a sé — decisione da prendere caso per caso, non di default.

## 4. 3D e motion — il contenuto indicizzabile non dipende dal canvas

CLAUDE.md §7 impone già che "la pagina funziona al 100% senza WebGL/JS" — quella regola
protegge l'accessibilità, e la **stessa garanzia protegge la SEO**: un crawler è, per
questo scopo, un browser senza JavaScript. Verifica concreta, non teorica: guarda l'HTML
servito dal server (view-source, non l'ispettore dopo l'idratazione) e controlla che il
testo essenziale della pagina sia lì — non solo un contenitore vuoto in attesa del canvas.

## 5. Structured data — dove il contenuto lo giustifica, non a tappeto

- `Organization` (o `LocalBusiness`) sulla home o sulla pagina "chi siamo".
- `Product` sulla pagina di un configuratore, se il modello dei dati lo supporta.

Non aggiungere schema.org ovunque per abitudine: vale lo stesso principio anti-riempitivo
di CLAUDE.md §2 — se un blocco di dati strutturati non descrive niente di specifico a
quella pagina, non aggiunge nulla, aggiunge solo peso da mantenere.

---

## Checklist

- [ ] Ogni pagina ha `title`/`description` propri, non duplicati tra route
- [ ] OG image reale sulle pagine principali, non il default del framework
- [ ] `canonical` impostato ovunque, incluse le pagine di configuratore (verso la
      variante/modello base, salvo decisione diversa e motivata)
- [ ] *(bilingue)* `hreflang` corretto per ogni lingua (CLAUDE.md §8)
- [ ] `sitemap.ts` e `robots.ts` presenti e coerenti con le route reali del progetto
- [ ] Contenuto essenziale leggibile dall'HTML server-rendered, verificato senza JS
- [ ] Structured data presente dove il tipo di contenuto lo giustifica, non ovunque
