# rules/webgl.md

Regole per tutto ciò che monta un `<Canvas>`. Si legge **prima** di scrivere la scena,
non dopo che è lenta.

Queste regole vincono su qualsiasi skill o documentazione generica: sono tarate sui nostri
budget e sui nostri clienti. Per le **API** invece non fidarti di questo file né della
memoria — recupera i docs della versione installata via Context7. R3F, drei e Three.js
cambiano firma tra minor release.

---

## 1. La forcella: che tipo di 3D stai costruendo?

Prima di ogni decisione tecnica, stabilisci quale dei due è. Hanno cicli di vita opposti e
sbagliare qui costa una riscrittura.

| | **Scena interattiva** | **Configuratore** |
|---|---|---|
| Stato | posizione di scroll, tempo, cursore | combinazione di varianti |
| Cardinalità | uno stato continuo | N stati discreti, con vincoli |
| Asset | una scena, caricata una volta | molte varianti, caricate a richiesta |
| URL | irrilevante | **obbligatorio**: lo stato ci vive dentro |
| Fallimento tipico | jank allo scroll | attesa a ogni click |
| Se il 3D non parte | si perde atmosfera | **si perde la funzione** |

L'ultima riga è la più importante. Una hero 3D che non carica lascia un sito che funziona;
un configuratore che non carica lascia un cliente che non può scegliere il prodotto. Il
fallback di un configuratore non è un poster: è una **interfaccia alternativa** con foto
delle varianti e lo stesso form. Va progettata, non improvvisata.

---

## 2. Caricamento — dove muoiono i siti "innovativi"

**Mai 3D bloccante above-the-fold.** Il primo render della pagina non aspetta mai il canvas.

L'ordine corretto:

1. HTML e CSS arrivano, la pagina è leggibile e navigabile
2. Un **poster statico** occupa lo spazio del canvas — stesse dimensioni, nessun layout shift
3. Il bundle 3D si carica in lazy, fuori dal first load
4. La scena entra **in dissolvenza** quando è pronta, mai bruscamente

Il poster non è un placeholder grigio: è un frame reale della scena, esportato dalla scena
stessa. Se il 3D non partisse mai, quel poster deve reggere da solo.

**Il bundle 3D non entra mai nel first load.** Import dinamico, sempre. Se il chunk 3D
compare nel bundle iniziale, il budget di 180 kB della sezione 6 del `CLAUDE.md` è già
sforato e la consegna è bloccata.

**Niente spinner percentuali finti.** Se mostri una percentuale, deve venire dal progresso
reale del loader. Un'animazione di attesa onesta è meglio di un numero inventato.

---

## 3. Budget degli asset

Non negoziabili. Se non ci rientri, semplifica il modello — non chiedere deroghe.

| Voce | Limite |
|---|---|
| Modello singolo, compresso | **< 2 MB** |
| Texture | max 2048², **KTX2 obbligatorio** |
| Totale scena, prima interazione | < 4 MB |
| Draw call, desktop | < 100 |
| Draw call, mobile | < 50 |

**Pipeline obbligatoria per ogni asset:**

```
CAD / modello → Blender (pulizia, decimazione, UV, bake) →
gltf-transform (Draco o Meshopt + KTX2) → verifica peso → repo
```

Nessun `.glb` entra nel progetto senza essere passato da `gltf-transform`. Gli export
grezzi contengono sempre dati inutilizzati, normali ridondanti e texture PNG non compresse.

**Verifica sempre il risultato, non fidarti del comando:**

```bash
gltf-transform inspect modello.glb
```

Guarda triangoli, materiali, dimensione texture. Un modello da 1,9 MB con 300 draw call è
peggio di uno da 3 MB con 20.

---

## 4. Degrado — la pagina funziona senza WebGL

**Regola di fondo: contenuti, form e conversioni non dipendono mai dal canvas.** Se
disattivi il 3D, il sito deve continuare a vendere.

Il degrado è **esplicito e a gradini**, mai lasciato al caso:

| Condizione | Cosa servi |
|---|---|
| WebGL assente o context lost | versione statica completa |
| `deviceMemory` basso, mobile di fascia bassa | poster + eventuale video loop |
| `prefers-reduced-motion` | scena ferma, nessuna animazione ambientale |
| Batteria in risparmio energetico | frame rate ridotto o scena ferma |
| Tab non visibile | **loop di render fermo** |

L'ultima è quella che dimenticano tutti: una scena che continua a girare in un tab di
sfondo consuma batteria e CPU per niente. Sospendi il loop quando la pagina non è visibile.

**Gestisci il context lost.** Il browser può revocare il contesto WebGL in qualsiasi
momento (memoria, driver, sospensione). Se non lo intercetti, l'utente resta con un
rettangolo nero. Ascolta l'evento e ripiega sul poster.

---

## 5. Performance — i pavimenti

- **60 fps desktop**, **30 fps floor mobile**. Sotto, semplifica la scena.
- Se il frame rate non regge, il primo intervento è **ridurre draw call e complessità
  della scena**, non alzare le speranze. In ordine: unisci mesh, usa instancing, abbassa
  le texture, riduci le luci dinamiche, taglia il postprocessing.
- **Nessuna allocazione nel loop di render.** Niente oggetti nuovi, niente array, niente
  closure dentro il frame: il garbage collector produce jank periodico che sembra un
  problema di scena e non lo è.
- **Postprocessing con parsimonia.** Ogni passata è un render a schermo intero. Su mobile,
  di norma, zero.
- **Ombre**: preferisci il bake a quelle dinamiche. Un'ombra dinamica costa quanto un
  secondo render della scena.
- **Disposal**: geometrie, materiali e texture non si liberano da soli quando smonti un
  componente. Su un configuratore che cambia varianti di continuo, il leak si accumula
  fino al crash della tab. Verifica il conteggio in `renderer.info` durante lo sviluppo.

---

## 6. Configuratori — architettura dello stato

La parte che decide se il progetto sarà mantenibile.

**Lo stato vive nell'URL.** Non in `useState` locale. Motivi concreti: il cliente
condivide la configurazione con un collega, la incolla in una mail, la manda al venditore;
tu la indicizzi; il "torna indietro" del browser funziona.

```
/configuratore?modello=x200&finitura=noce&base=acciaio
```

**Le regole di combinazione vanno chieste al cliente prima di scrivere codice.** Sono la
domanda che nessun cliente offre spontaneamente (vedi `CLAUDE.md` §5) e determinano
l'architettura: se le varianti sono libere, basta un oggetto di stato; se ci sono
incompatibilità — "la finitura noce non esiste sul modello base" — serve una macchina a
stati con vincoli, e va progettata all'inizio.

Quando una combinazione è incompatibile, l'interfaccia **lo mostra prima del click**:
opzione disabilitata con motivo leggibile. Non un errore dopo.

**Il cambio variante è istantaneo.** Questo significa:
- le varianti si **precaricano** in background, per priorità (le più probabili prima)
- si cambia **materiale o mesh visibile**, non si rimonta la scena
- nessun `<Suspense>` che sbianca il canvas a ogni click
- se una variante non è ancora pronta, si mostra la precedente con un indicatore, mai il
  vuoto

**La camera non si resetta** quando cambi variante. L'utente stava guardando il dettaglio
del bracciolo: dopo il cambio colore deve ancora guardare quel bracciolo.

---

## 7. Screenshot e misura — quello che headless non può dirti

Chromium headless renderizza WebGL via **SwiftShader**, cioè in software. Le immagini
escono, ma sono lente e gli fps non hanno alcun rapporto con la realtà.

| Cosa | Come |
|---|---|
| Screenshot di una scena 3D | `pnpm shots --gpu` (`channel: 'chrome'`, GPU reale) |
| Layout e tipografia | Chromium headless, va benissimo |
| **fps** | **solo browser reale, su device reale** |

Un fps rilevato in headless **non entra mai in un report al cliente**.

**Progetta le animazioni perché siano fotografabili.** `animations: 'disabled'` di
Playwright ferma le animazioni CSS ma **non tocca GSAP, ScrollTrigger o il loop di
render**. Se non prevedi un modo per portare la scena a uno stato finale deterministico,
non potrai mai catturarla in modo ripetibile.

Esponi un hook di debug — una funzione globale che porta timeline e trigger allo stato
finale e ferma il loop — e chiamala dallo script prima dello screenshot. Costa una riga se
lo decidi all'inizio, è una rifattorizzazione se te ne accorgi dopo.

**Testa su device veri.** Un iPhone di tre anni fa e un Android di fascia media sono il
pubblico reale. Il tuo portatile non è un test.

---

## 8. Checklist prima di dire che è finito

- [ ] Il bundle 3D non compare nel first load
- [ ] La pagina funziona al 100% con WebGL disattivato
- [ ] Poster statico presente, stesse dimensioni del canvas, nessun layout shift
- [ ] Ogni asset passato da `gltf-transform`, verificato con `inspect`
- [ ] 60 fps desktop / 30 fps mobile, misurati su device reale
- [ ] Loop fermo quando il tab non è visibile
- [ ] `prefers-reduced-motion` rispettato
- [ ] Context lost gestito
- [ ] Nessun leak: `renderer.info` stabile dopo venti cambi variante
- [ ] *(configuratori)* stato nell'URL, condivisibile e ricaricabile
- [ ] *(configuratori)* combinazioni incompatibili disabilitate prima del click
- [ ] *(configuratori)* fallback non-3D che permette comunque di configurare e convertire
- [ ] Screenshot catturati con `--gpu`, non headless
