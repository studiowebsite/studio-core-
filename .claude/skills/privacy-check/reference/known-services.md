# Servizi terzi noti — giurisdizione e categoria

Punto di partenza per la Fase 1 di `privacy-check`, non fonte legale definitiva: i termini
dei servizi cambiano. Se un dettaglio è cambiato o manca un servizio che incontri spesso,
aggiorna questa tabella invece di ridedurla ogni volta da zero.

**Nota su "UE/extra-UE"**: molti fornitori USA offrono un'istanza/regione EU (es. Google
con la sua infrastruttura europea, Vercel con region `fra1`/`arn1`). "Extra-UE" qui indica
la sede legale della società capogruppo e il regime di trasferimento dati applicabile di
default, non necessariamente dove risiede fisicamente ogni singolo dato — quello va
verificato caso per caso quando conta.

| Servizio | Categoria | Cookie/storage tipici | Sede | Note |
|---|---|---|---|---|
| Google Analytics (GA4) | Statistiche | `_ga`, `_ga_<container>` (≈2 anni) | Extra-UE (Google LLC) | Parte sempre prima del consenso se non gated. Consent Mode v2 disponibile. |
| Google Tag Manager | Contenitore tag | nessuno proprio, veicola altri script | Extra-UE (Google LLC) | Non è di per sé un tracker, ma va gated come i tag che carica. |
| Google Fonts (via `<link>`/CDN) | Font esterni | nessun cookie, ma è una richiesta a dominio Google | Extra-UE | Self-hostabile con `next/font/google` (che compila i font in build, niente richiesta runtime) o `next/font/local`. |
| Google Maps Embed/JS API | Mappa | cookie di Google se caricato attivo | Extra-UE | Preferire embed statico/click-to-load finché non c'è consenso. |
| YouTube embed standard | Video | cookie di tracking YouTube/Google | Extra-UE | Alternativa: dominio `youtube-nocookie.com`, riduce ma non azzera il tracking. |
| Vimeo embed | Video | cookie Vimeo | Extra-UE (con infrastruttura EU parziale) | Verificare impostazioni privacy dell'embed (`dnt=1`). |
| Meta Pixel (Facebook/Instagram Ads) | Marketing | `_fbp`, `fr` | Extra-UE (Meta) | Sempre da gatare dietro consenso marketing esplicito. |
| TikTok Pixel | Marketing | cookie proprietari TikTok | Extra-UE | Come Meta Pixel. |
| LinkedIn Insight Tag | Marketing | `li_sugr`, `bcookie`, `UserMatchHistory` | Extra-UE (LinkedIn/Microsoft) | Come sopra. |
| Hotjar / Microsoft Clarity | Statistiche/heatmap | cookie di sessione + registrazione interazioni | Extra-UE | Clarity ha un tier gratuito molto usato: spesso dimenticato in fase di audit. |
| Vercel Analytics / Speed Insights | Statistiche | minimal, spesso senza cookie (via header) | Extra-UE (Vercel Inc.) — region di hosting configurabile | Verificare versione: alcune build sono cookieless by design, ma restano una richiesta di rete a terzi. |
| Sanity (CMS, se chiamato client-side) | Infrastruttura/contenuti | nessun cookie di tracking tipico | Extra-UE (Sanity Inc.), con CDN globale | Non è marketing/statistiche, ma è comunque un trasferimento dati (contenuti, non dati utente, salvo form collegati). |
| Iubenda (CMP) | Consent management | cookie di consenso proprio (necessario) | UE (Italia) | È il servizio che gestisce il consenso stesso — cookie tecnico, non va bloccato dal gate. |
| Stripe (checkout/pagamenti) | Pagamenti | cookie anti-frode (`__stripe_mid`, ecc.) | Extra-UE (Stripe Inc.), con entità EU per clienti UE | Necessario per la funzione, ma va comunque documentato: dati di pagamento e anti-frode. |
| Calendly / Typeform (embed) | Form/booking terzi | cookie propri del servizio embeddato | Extra-UE | L'imbed stesso è spesso già gated dietro un click, ma se auto-carica va trattato come iframe terzo. |
| Cloudflare (CDN/proxy, non analytics) | Infrastruttura | cookie di sicurezza (`__cf_bm`, ecc.) se attivo il bot management | Extra-UE (Cloudflare Inc.), con edge EU | Cookie tecnico/di sicurezza, normalmente non richiede consenso ma va comunque elencato nel documento. |

## Come classificare un servizio non in tabella

1. Cerca la sua pagina "Privacy" o "Subprocessors"/"Data Processing Addendum" ufficiale —
   di solito indica sede legale e regime di trasferimento.
2. Controlla se imposta cookie/localStorage ispezionando il traffico reale (Fase 1b della
   skill), non fidandoti della sola documentazione: il comportamento effettivo può
   differire.
3. Classifica come "statistiche" se misura comportamento aggregato, "marketing" se
   alimenta pubblicità/retargeting, "necessari" solo se il sito non funziona senza
   (pagamenti, autenticazione, CMP stesso).
4. In caso di dubbio tra "statistiche" e "marketing", classifica come marketing: la soglia
   di consenso richiesta è la stessa o più alta, mai sotto-stimare.
