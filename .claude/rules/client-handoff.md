# rules/client-handoff.md

Come si chiude un progetto: non un click su "deploy", ma un passaggio di responsabilità —
del codice, del dominio, dei contenuti, della sicurezza. Questo file esiste perché fino ad
oggi il workflow del CLAUDE.md si fermava a "preview" (§4, passo 7): tutto quello che segue
— chi possiede cosa dopo, chi risponde se il sito va giù, cosa riceve davvero il cliente —
non aveva un metodo scritto. Si applica **dopo** l'audit (CLAUDE.md §4 passo 7) e **prima**
di considerare un progetto chiuso.

Non è un contratto legale — quello lo scrive chi si occupa della parte commerciale — è la
checklist tecnica e operativa che garantisce che nessun passaggio salti per la fretta
dell'ultimo giorno.

---

## 1. Prima di iniziare la consegna — i cancelli si verificano in produzione, non in preview

I numeri del CLAUDE.md §6 e delle rules 3D/motion sono stati misurati sul preview URL per
tutto il progetto. **Il dominio finale non è il preview URL**: cambia origin, spesso cambia
CDN/edge config, e per `privacy-check` cambia il dominio su cui i cookie vengono impostati.
Prima di dichiarare la consegna chiusa, tutti i cancelli vanno **ri-verificati sul dominio
di produzione reale**, dopo il cutover DNS (§2):

- [ ] `pnpm shots` (e `--gpu` se c'è 3D) sul dominio finale
- [ ] Lighthouse Performance ≥ 90 mobile, Accessibility 100, sul dominio finale
- [ ] `privacy-check` ri-eseguito sul dominio finale — un cookie banner testato in preview
      può comportarsi diversamente su un dominio con cookie di terze parti già presenti
- [ ] Budget JS/3D del CLAUDE.md §6 e webgl.md §3 ancora rispettati (un ultimo commit
      dell'ultimo giorno è la causa più comune di uno sforamento non visto)

Se uno di questi cancelli è rosso, **non si passa al cutover**. Si tornano ai passi 6-7 del
CLAUDE.md (visual check / audit), non si spedisce "quasi a posto".

## 2. Ordine delle operazioni

L'ordine conta: fare il cutover DNS prima di aver trasferito repo/CMS lascia il cliente con
un sito online che solo tu puoi modificare.

1. **Cancelli in produzione** verificati (§1) — sul dominio finale, prima che il cliente lo
   usi per davvero.
2. **Estrazione del repo** fuori da `studio-core`, se non già fatto — meccanica in
   `rules/project-setup.md` §1 e §7 ("Il giorno dell'estrazione"). Non ripetuta qui.
3. **Trasferimento o accesso GitHub** — il repo è nell'organizzazione dello studio
   (`project-setup.md` §5). Due strade, da concordare col cliente *prima* di questo
   momento, non all'ultimo giorno:
   - trasferimento pieno dell'ownership del repo all'org/account del cliente;
   - oppure il repo resta allo studio e il cliente riceve accesso in lettura/collaboratore
     — legittimo se lo studio mantiene un ruolo di manutenzione concordato.
4. **Trasferimento del progetto Vercel** (o collegamento del dominio del cliente a un
   progetto che lo studio continua a gestire) — stessa scelta del punto 3, deve restare
   coerente con essa.
5. **Segreti di produzione rigenerati, non trasferiti.** Ogni chiave API, secret CMS, token
   di terze parti usato in produzione va **rigenerato sotto il controllo di chi possiederà
   l'ambiente dopo** (CLAUDE.md §10 vale anche qui: mai chiavi committate, nemmeno in un
   messaggio di consegna). Se lo studio mantiene la gestione, le chiavi restano sue; se il
   cliente prende il controllo, le vecchie chiavi si revocano, non si condividono.
6. **Cutover DNS** — solo ora. TTL basso impostato in anticipo, non il giorno stesso.
7. **CMS (Sanity)**: il cliente (o chi gestirà i contenuti, CLAUDE.md §5) diventa membro del
   progetto Sanity con il ruolo giusto; se lo studio resta proprietario del progetto Sanity,
   va dichiarato esplicitamente, non lasciato implicito.
8. **Formazione contenuti**: una sessione, anche breve, su come si pubblica o modifica un
   contenuto in Sanity — non solo l'accesso. Chi è stato indicato al brief come responsabile
   dei contenuti (CLAUDE.md §5) deve uscirne effettivamente capace di farlo da solo.

## 3. Cosa riceve il cliente — il pacchetto di consegna

Non "l'accesso sparso in messaggi diversi". Un unico riepilogo scritto che elenca:

- URL di produzione e URL del progetto Vercel
- Repo: link e chi ne ha l'ownership dopo il punto 2.3
- Progetto Sanity: link e ruolo assegnato
- Registrar del dominio e chi ha accesso al DNS
- Ogni servizio di terze parti collegato (analytics, gestore form, font, mappe) e chi
  possiede l'account di ciascuno
- Materiali sorgente (`materiali/`, `project-setup.md` §3): restano allo studio o passano
  al cliente? Va deciso e scritto, non lasciato implicito — spesso sono file del
  fotografo/fornitore del cliente, non solo dello studio.

Se uno di questi punti non ha una risposta al momento della consegna, la consegna non è
completa: è un sito online senza che sia chiaro chi lo tiene in piedi.

## 4. Dopo la consegna — responsabilità esplicite, non presunte

Il rischio più comune qui non è tecnico: è che *nessuno* si senta responsabile del sito
dopo il lancio, perché non è mai stato deciso chi lo è. Da dichiarare per iscritto al
cliente, qualunque sia la risposta:

- **Patch di sicurezza e aggiornamento dipendenze.** Di default, dopo la consegna, non è
  compito dello studio a meno di un accordo di manutenzione esplicito. Il cliente deve
  saperlo: un sito Next.js non è "finito e statico", le sue dipendenze invecchiano.
- **Monitoraggio/uptime.** Se non c'è un contratto di manutenzione, nessuno guarda se il
  sito va giù. Dirlo chiaramente evita che il cliente lo dia per scontato.
- **Rollback.** Vercel mantiene lo storico dei deploy: tornare a una versione precedente è
  immediato da dashboard. Chi ha accesso al progetto Vercel dopo la consegna (§2.4) è
  l'unico che può farlo — assicurati che sappia che l'opzione esiste.
- **Backup dei contenuti.** Sanity versiona i documenti, ma un export periodico del
  dataset è una rete in più, specie senza un piano di manutenzione attivo. Vale la pena
  proporlo, anche come servizio a parte.

## 5. Se c'è un accordo di manutenzione — il processo, non solo la promessa

Quando la risposta di §4 non è "nessuno" ma "lo studio", quell'impegno ha bisogno di un
metodo, non di una promessa a voce fatta il giorno della consegna:

- **Cadenza delle patch.** Una frequenza dichiarata (es. mensile) per `pnpm audit` e
  l'aggiornamento delle dipendenze — non "quando capita". Un sito consegnato oggi e mai più
  toccato accumula vulnerabilità note allo stesso ritmo di qualunque altro progetto
  Next.js, manutenzione o no.
- **Cosa si intende per monitoraggio, detto esplicitamente.** Solo uptime (il sito
  risponde?) o anche errori applicativi? Sono impegni diversi — uno strumento di uptime
  monitoring copre il primo, uno di error tracking serve per il secondo. Non darli per
  equivalenti solo perché entrambi si chiamano "monitoraggio".
- **Tempi di risposta dichiarati.** Se il cliente segnala che il sito è giù, quanto passa
  prima che qualcuno guardi? Anche un "non garantito, ma in genere entro X ore" è meglio di
  nessun numero — è quello che il cliente assume comunque, dichiarato o no.
- **Un elenco di chi ha un accordo attivo.** Con `sites/<cliente>/` isolati per progetto
  (`project-setup.md` §1), non esiste un posto unico che dica quali clienti sono sotto
  manutenzione. Tienine una nota separata, anche minima — l'alternativa è dimenticare un
  impegno preso mesi prima.

Questo non sostituisce il contratto di manutenzione — dice solo cosa, tecnicamente, va
rispettato una volta che quel contratto esiste.

## 6. Retrospettiva — chiudere il ciclo di miglioramento

Il pacchetto di consegna (§3) chiude cosa riceve il cliente. Questo passo chiude il
**metodo**: appena la checklist di §7 è tutta spuntata, prima di considerare il progetto
finito, si chiede esplicitamente cosa è andato meno bene — non si aspetta che emerga da
solo al progetto successivo.

Tre domande, sempre le stesse, rivolte a chi ha commissionato il lavoro (lo studio, non il
cliente finale):

- Cosa in questo progetto ha richiesto più correzioni o giri del previsto?
- Cosa rifaresti in modo diverso se ripartissi da zero con lo stesso brief?
- C'è un'istruzione che avresti voluto darmi prima, e non l'hai data perché non sapevi che
  servisse?

Le risposte non restano nella conversazione né in questo file: si salvano come memoria di
tipo **feedback** nel sistema di memoria persistente. Un fix specifico di un progetto
chiuso non torna indietro sui progetti già consegnati (`project-setup.md` §1, "si corregge
in avanti") — ma il *metodo* che ne emerge (una domanda dimenticata al brief, un pattern di
codice da evitare, un modo di comunicare che lo studio preferisce) protegge ogni progetto
successivo, a partire dal prossimo.

Se la risposta è "niente da migliorare", si registra comunque: conferma che l'approccio
tenuto va bene, e vale quanto una correzione — non si scarta (vale lo stesso principio del
sistema di memoria: si registra da successo **e** da correzione, non solo da errore).

Non è un sondaggio di soddisfazione del cliente finale — quello, se serve, è commerciale e
non tecnico. È la revisione di come *questo assistente* ha lavorato sul progetto, con chi
lo ha diretto.

## 7. Checklist di consegna

- [ ] Cancelli (§1) verificati sul dominio di produzione, non solo in preview
- [ ] Repo estratto da `studio-core` (`project-setup.md` §1/§7)
- [ ] Ownership o accesso GitHub definiti e comunicati (§2.3)
- [ ] Progetto Vercel trasferito o collegato secondo la stessa scelta (§2.4)
- [ ] Segreti di produzione rigenerati sotto il controllo di chi li possiede dopo (§2.5)
- [ ] DNS cutover fatto con TTL basso preimpostato
- [ ] Accesso Sanity assegnato + formazione contenuti fatta, non solo promessa
- [ ] Pacchetto di consegna (§3) scritto e mandato, non sparso in chat
- [ ] Responsabilità post-consegna (§4) dichiarate esplicitamente, incluso se la risposta è
      "nessuna"
- [ ] *(se c'è manutenzione)* cadenza patch, monitoraggio e tempi di risposta (§5)
      dichiarati e concordati, non lasciati impliciti
- [ ] Retrospettiva fatta (§6): le tre domande poste, risposte salvate come memoria
      feedback — non lasciate solo nella conversazione
- [ ] Diritti sui contenuti già confermati (`project-setup.md` §6) — non si ridiscute qui,
      si verifica che sia ancora vero al momento della consegna
- [ ] `materiali/` — destino deciso (resta allo studio / passa al cliente) e comunicato
