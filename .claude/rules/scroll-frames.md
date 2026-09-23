# rules/scroll-frames.md

Tecnica per legare un video allo scroll: si scrolla e il video avanza fotogramma per
fotogramma su un canvas. È l'effetto dei siti prodotto (tipo Apple). Più leggero e robusto
di una scena WebGL vera quando il "movimento" è già girato in un video.

Questo file adatta una tecnica nota **al nostro stack e alle nostre regole**. Il motore è
collaudato; lo stile no. Qui c'è solo il come — proporzioni, tipografia e coreografia
restano decisioni del centerpiece (`rules/centerpiece-flow.md`) e del cliente, non di
questo file.

Vale insieme a `rules/webgl.md` (§7 sugli screenshot 3D vale anche qui) e a
`rules/motion.md` per la coreografia. Le **API** di GSAP/Lenis si recuperano via Context7,
non a memoria.

---

## 1. Quando usarla, e quando no

**Usala se** il movimento esiste come video — girato reale o generato con
`rules/ai-generation.md` (oggi la prima scelta di default, non solo un ripiego quando manca
un girato): una ripresa del mare, del prodotto che ruota, di un processo. Il video è la
sorgente, lo scroll è il controller, non importa da dove viene il video.

**Non usarla se** l'oggetto è interattivo (l'utente deve ruotarlo, configurarlo): quello è
un configuratore, va in WebGL — vedi `rules/webgl.md`. Un video su scroll è **cinema
controllato dallo scroll**, non interazione.

**Non è mai obbligatoria.** È una delle direzioni possibili per un centerpiece, non il
default di ogni home. Se emerge dallo scope del progetto (`rules/centerpiece-flow.md`),
bene; non imporla.

## 2. Cosa NON prendere dalla tecnica originale

La ricetta da cui viene questo file arriva con una "checklist premium" che è uno **stile
unico travestito da legge**: hero 12rem obbligatori, marquee gigante d'obbligo, testo solo
ai lati, 800vh di scroll fissi, counter che partono da zero. **Ignora tutto questo.** Sono
esattamente le scelte che il nostro CLAUDE.md §2 vieta: se funzionerebbero identiche su un
altro cliente, sono riempitivo. Proporzioni, tipografia e struttura nascono dal
centerpiece approvato e da `DESIGN.md`, non da una checklist.

## 3. Pipeline dei frame

Il video sorgente sta in `materiali/` (LFS). I frame estratti sono **output**, vanno in
`public/` e **non** in LFS — sono rigenerabili dal video.

Estrazione con ffmpeg, frame rate scelto in base alla durata:

```bash
# durata < 10s: fps originale, cap ~300 frame
# durata 10-30s: 10-15 fps
# durata 30s+: 5-10 fps
ffmpeg -i materiali/video/home-page.mp4 \
  -vf "fps=<FPS>,scale=1920:-1" \
  -c:v libwebp -quality 80 \
  public/frames/hero/frame_%04d.webp
```

**Budget frame — è un cancello, come il §6 del CLAUDE.md.** Il totale dei frame è peso che
l'utente scarica:

| Voce | Limite |
|---|---|
| Numero frame | 150-300 (mai oltre) |
| Larghezza | 1920px desktop, 1280px il set mobile |
| Peso totale del set | **< 8 MB** desktop, < 4 MB mobile |

Se sfori, riduci gli fps o la risoluzione. Un video da 36 MB non diventa 300 frame da
1920px: quello sarebbe decine di MB. Conta il totale prima di considerarlo fatto.

Genera **due set**: uno desktop (1920) e uno mobile ridotto (1280, meno frame). Si serve
quello giusto in base al viewport.

## 4. Nel nostro stack — React, non vanilla

La tecnica originale è un `index.html` vanilla con GSAP e Lenis da CDN. **Da noi no:** i
CDN violano il budget JS del §6 (niente controllo su versione e peso). Quindi:

- GSAP, ScrollTrigger e Lenis come **dipendenze npm**, importate nel componente. Versioni
  fissate nel lockfile.
- Un **componente client** dedicato (`"use client"`), caricato in **lazy** e fuori dal
  first load — vale la stessa regola del bundle 3D: mai nel bundle iniziale.
- Il canvas e la logica di scroll vivono nel componente; il resto della pagina resta
  server-rendered e leggibile senza JS.

## 5. Il motore — i pattern che valgono

Questi sono i pezzi tecnici che vale la pena tenere. Le firme esatte delle API vanno
verificate via Context7; qui c'è la logica, non il codice da copiare.

**Preloading a due fasi.** Carica i primi ~10 frame subito (primo paint veloce), poi il
resto in background con una barra di progresso. Il loader sparisce solo quando tutti i
frame necessari sono pronti — mai prima, o si vedono flash bianchi.

**Canvas in "padded cover".** Scala l'immagine con un fattore ~0.85 (tra 0.82 e 0.90):
cover pieno taglia il soggetto contro l'header, contain lascia bordi che non combaciano col
fondo. Campiona il colore di sfondo dai bordi del frame ogni ~20 frame e riempi il canvas
con quel colore *prima* di disegnare, così il bordo padded sparisce. Applica
`devicePixelRatio` alle dimensioni del canvas, o su schermi retina esce sfocato.

**Binding scroll-frame.** ScrollTrigger con `scrub` legato al contenitore; a ogni update
mappi il progresso sullo scroll all'indice del frame e ridisegni dentro `requestAnimationFrame`.
Ridisegna solo se l'indice è cambiato, mai a ogni evento.

**Lenis per lo smooth scroll**, agganciato a ScrollTrigger e al ticker di GSAP. È ciò che
fa sentire il tutto "esperienza" e non "pagina che scrolla".

## 6. Sicurezza e degrado — quello che alla ricetta originale manca del tutto

La tecnica originale non ha nulla di questo. Da noi è obbligatorio, ed è la parte che la
rende consegnabile a un'azienda vera e non solo bella in demo.

- **`prefers-reduced-motion`**: se attivo, **niente scroll-frame**. Si serve un poster
  statico o il video con controlli nativi. Non negoziabile — è accessibilità, e per la PA
  è legge.
- **Fallback senza JS**: la pagina deve avere senso anche se il componente non carica. Un
  `<video>` normale o un'immagine sotto il canvas, non un buco.
- **Tab non visibile**: ferma il loop, come per il 3D (`rules/webgl.md`).
- **Mobile**: set di frame ridotto, o — se il peso non rientra nel budget — si degrada a un
  `<video playsinline>` normale. Non caricare mai 8 MB di frame su una connessione mobile.
- **Memoria**: su mobile tieni i frame sotto i 150 e a 1280px, o Safari iOS scarica la tab.

## 7. Screenshot

Vale il §7 di `rules/webgl.md`: il canvas va catturato con `pnpm shots --gpu`, e lo stato
va portato a un frame deterministico prima dello scatto (esponi un hook che salta a un
indice fisso e ferma il loop). In headless il canvas può uscire nero o a metà animazione.

## 8. Checklist prima di dire che è finito

- [ ] Frame in `public/`, non in LFS; video sorgente in `materiali/`
- [ ] Set desktop e set mobile, entrambi entro il budget di peso
- [ ] GSAP/Lenis da npm, non da CDN; componente lazy fuori dal first load
- [ ] La pagina ha senso senza JS (fallback `<video>` o poster)
- [ ] `prefers-reduced-motion` serve la versione statica, verificato
- [ ] Loop fermo quando il tab non è visibile
- [ ] Nessun flash bianco: loader via solo a frame pronti
- [ ] Canvas nitido su retina (`devicePixelRatio` applicato)
- [ ] Screenshot catturati con `--gpu` a stato deterministico
- [ ] Nessuna delle proporzioni "premium" imposte: la forma viene dal centerpiece approvato
