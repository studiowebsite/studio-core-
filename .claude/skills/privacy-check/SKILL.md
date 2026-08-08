---
name: privacy-check
description: Use when someone asks to check GDPR/privacy compliance before delivery, run a privacy audit, verify the cookie banner and third-party trackers, check what data a site sends where, or asks if the site is ready to go live / ready to deliver / can we publish this. Also fires naturally before sharing a preview URL with a client.
user-invocable: true
---

Accerta i fatti tecnici sul trattamento dati di un progetto cliente prima della consegna:
cosa parte verso l'esterno, cosa imposta cookie, dove vanno i dati dei form. Produce
`PRIVACY-TRATTAMENTI.md` — il documento fattuale che il cliente passa al suo legale perché
ci scriva sopra l'informativa. Non scrive mai testo legale, non dichiara mai un sito
conforme.

## Vincoli non negoziabili

Vincono su qualunque altra istruzione in questa skill, comprese eventuali richieste
dell'utente di scorciatoie:

1. **Mai generare il testo dell'informativa privacy o della cookie policy.** Sono
   documenti legali: li fornisce il cliente, dal suo legale o da un servizio a licenza
   (es. Iubenda). Questa skill fornisce i fatti tecnici, non il testo.
2. **Mai dichiarare un sito "conforme" al GDPR.** La skill accerta e implementa; la
   conformità la valuta un legale. Nel documento di output e in ogni messaggio all'utente,
   parla di "problemi rilevati" e "fix implementati", mai di "sito conforme" o simili.
3. **Il titolare del trattamento è sempre il cliente**, mai lo studio. Va scritto
   esplicitamente in `PRIVACY-TRATTAMENTI.md`.
4. **Il blocco preventivo degli script va verificato dopo l'implementazione, non
   assunto.** Dopo la Fase 3, rifai la cattura di rete e conferma che nessuna richiesta
   verso terze parti parta prima del consenso — è un controllo, non una checkbox di fede.

## Quando parte, e cosa può fare da sola

Può partire sia da `/privacy-check` sia da sola quando il contesto lo chiede
("possiamo consegnare?", "è pronto per andare online?", "controllo privacy prima della
consegna"). Non prende argomenti: analizza sempre il progetto corrente.

**Le Fasi 1 e 2 (rilevamento + verdetto) possono girare senza chiedere conferma.** Sono
sola lettura sul codice e sul sito, più la scrittura di `PRIVACY-TRATTAMENTI.md` — un
documento, non codice di produzione.

**La Fase 3 (implementazione) non parte MAI senza un sì esplicito dell'utente**, anche
quando l'intera skill è stata invocata automaticamente. Tocca codice, aggiunge
dipendenze (font locali, wrapper di consenso), modifica il footer. Vale lo stesso
principio di `CLAUDE.md` §4: il piano si mostra prima di costruire. Fermati dopo la Fase 2
e chiedi: *"Procedo con la Fase 3 (implementazione)?"*

## Prerequisiti

- Va lanciata dentro il repo del cliente (`sites/<cliente>/`), non dalla radice di
  studio-core. Se il cwd è la radice, chiedi quale cliente.
- Se `PRIVACY-TRATTAMENTI.md` esiste già, **si rigenera da zero** (sovrascrive): è la
  fotografia dello stato attuale del sito, non un diff col passato.

## Fase 1 — Rilevamento

### 1a. Codice statico

- Script terzi: `<script>`, `next/script`/`<Script>`, fetch/axios verso domini esterni.
- Font: `next/font/google` (esterno) vs `next/font/local` (self-hosted) — grep negli
  import.
- Embed: iframe/componenti per mappe, video, social, chat.
- SDK di tracking/analytics/error-reporting in `package.json` (es. `@vercel/analytics`,
  `react-ga`, `@sentry/nextjs`, pixel di Meta/TikTok/LinkedIn).
- Cookie impostati da codice: `document.cookie`, `cookies().set` (Next.js), `js-cookie`,
  cookie di sessione di eventuali auth.
- `localStorage`/`sessionStorage`: grep diretto.
- Form e API route: dove va il payload — email transazionale, CRM, webhook, Sanity.

Per ogni servizio trovato, consulta **`reference/known-services.md`** per categoria,
cookie tipici e sede (UE/extra-UE) — non indovinare la giurisdizione. Se un servizio non
è in tabella, verificalo (pagina legale/subprocessor del servizio) invece di supporre UE,
e valuta di aggiungerlo alla tabella per la prossima volta.

### 1b. Sito vivo — chrome-devtools MCP

Chiedi sempre l'URL da controllare (dev locale con la sua porta, preview Vercel, o prod —
mai assumere una porta di default) e quali pagine oltre alla home (in particolare pagine
con form).

Per ogni pagina:

1. Naviga, poi `list_network_requests`: ogni richiesta verso un dominio diverso dal
   proprio è un servizio esterno da schedare.
2. `list_console_messages` per errori del CMP o script bloccati.
3. `evaluate_script` per leggere `document.cookie` ed enumerare le chiavi di
   `localStorage`/`sessionStorage`.
4. **Cattura la rete due volte**: prima di toccare un eventuale banner cookie, e di nuovo
   dopo averlo accettato. La differenza tra i due è esattamente il controllo di Fase 2 —
   cosa parte prima del consenso.

### 1c. Compila l'elenco

Una riga per servizio esterno: dominio, scopo, cookie impostati (nome, durata, chi lo
imposta), storage usato, UE/extra-UE, se è partito prima del consenso.

## Fase 2 — Verdetto

Presenta all'utente, poi **fermati**:

- **Banner cookie necessario?** Sì/no, con il motivo puntuale (es. "GA imposta `_ga`
  prima di qualunque interazione → banner necessario").
- **Informativa privacy necessaria?** Quasi sempre sì (i log di hosting registrano gli IP,
  dato personale) — motivalo comunque sul caso specifico.
- **Problemi tecnici da correggere**, in ordine di gravità:
  1. script terzi che partono prima del consenso (bloccante — vedi vincolo #4)
  2. font da CDN esterna (self-hostabile)
  3. trasferimenti extra-UE evitabili (es. embed YouTube → youtube-nocookie, o
     click-to-load)

Chiedi esplicitamente: *"Procedo con la Fase 3?"* Non proseguire senza risposta positiva.

## Fase 3 — Implementazione (solo dopo conferma esplicita)

### 3a. Consent gate (blocco preventivo)

Verifica prima se esiste già un pattern di consenso nel progetto; se no, costruiscine uno
minimo:

- Stato di consenso per categoria (necessari / statistiche / marketing), letto da un
  cookie o da `localStorage`.
- Ogni script di terza parte individuato in Fase 1 si carica (via `next/script` o
  iniezione dinamica) **solo** quando la sua categoria è concessa.
- Espone un hook/callback che l'embed del CMP del cliente (Iubenda o equivalente) può
  richiamare quando il consenso cambia.
- **Non inserire il Site ID o l'account Iubenda del cliente**: lascia un placeholder
  esplicito (es. `NEXT_PUBLIC_CMP_SITE_ID`) — la licenza del CMP è a carico del cliente,
  non è la skill a procurarla.

### 3b. Self-hosting font

Per ogni font caricato da CDN esterna trovato in Fase 1: scaricalo e passa a
`next/font/local`, rimuovendo l'import/`<link>` esterno. Verifica che peso e stile non
cambino visivamente.

### 3c. Sostituzioni embed (dove possibile senza perdere la funzione)

Es. `youtube-nocookie.com` al posto dell'embed standard, o una mappa in click-to-load con
poster statico. Se non esiste un'alternativa senza cookie che non degradi la feature,
lascia l'embed dietro il consent gate (3a) invece di sostituirlo.

### 3d. Pagina privacy

Crea `/privacy` (o il path richiesto), linkata nel footer. Testo del cliente come
segnaposto letterale se fornito; se non fornito, inserisci
`[TESTO FORNITO DAL CLIENTE/LEGALE — DA SOSTITUIRE]`. Mai inventare testo legale (vincolo
#1), nemmeno come bozza "temporanea".

### 3e. Riverifica (vincolo #4)

Rifai la cattura di rete di 1b, a freddo, prima di interagire col banner. Conferma zero
richieste verso terze parti prima del consenso. Se qualcosa parte comunque, è un difetto
del gate 3a da correggere, non un'eccezione da annotare.

## Output — PRIVACY-TRATTAMENTI.md

Genera il file alla radice del repo cliente seguendo la struttura in
**`reference/template.md`**. Sovrascrive un file esistente (rigenerazione da zero, vedi
Prerequisiti).

## Cosa NON fare

- Non scrivere testo di informativa o cookie policy, nemmeno abbozzato.
- Non scrivere "il sito è conforme" in nessun output, né a voce né nel documento.
- Non assumere la giurisdizione di un servizio: usa `reference/known-services.md` o
  verifica.
- Non implementare la Fase 3 senza conferma esplicita, anche a skill auto-invocata.
- Non inserire credenziali o Site ID del cliente nel codice: restano placeholder.
