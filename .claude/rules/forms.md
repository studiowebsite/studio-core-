# rules/forms.md

Il form di contatto/preventivo è la conversione, non un dettaglio di copy. CLAUDE.md §8
decide come si **chiama** il bottone ("Richiedi il preventivo", non "Invia") — questo file
decide cosa c'è **dietro**: dove arriva la richiesta, cosa la protegge, cosa il cliente
riceve davvero. Lo strumento tecnico varia per progetto (coerente con quello che il cliente
già usa — un CRM, una casella email diretta); quello che segue **non varia mai**, qualunque
sia lo strumento scelto.

---

## 1. Cosa si decide al brief, non in build

**Dove devono arrivare le richieste** è una domanda operativa mancante da CLAUDE.md §5, va
aggiunta lì: email diretta del cliente? Un CRM che già usa? Improvvisarlo mentre si scrive
il form è come costruire su testi non definitivi — si rifà il lavoro quando emerge tardi.

Lo strumento tecnico (API route Next.js + servizio email transazionale, o un form handler
di terze parti) si sceglie di conseguenza, per progetto — non è imposto qui uno stack fisso
per tutti i clienti.

## 2. Requisiti non negoziabili, qualunque sia lo strumento

- **Verifica end-to-end prima della consegna.** Un invio di test reale che arriva davvero a
  destinazione — non "sembra collegato leggendo il codice". Un form rotto silenziosamente è
  il fallimento peggiore: nessuno se ne accorge finché il cliente non nota che non riceve
  contatti da settimane.
- **Anti-spam minimo sempre.** Un honeypot costa niente e ferma la maggioranza dei bot. Un
  livello ulteriore (rate limiting, verifica non invasiva) solo se il volume lo giustifica
  — mai un CAPTCHA visibile di default: costa conversione a un form che esiste per
  convertire.
- **Consenso GDPR esplicito.** Checkbox non pre-selezionata, collegata all'informativa
  privacy. Si intreccia con la skill `privacy-check` (CLAUDE.md §4.6): quando la esegui su
  un progetto con form, verifica **specificamente** il meccanismo di consenso del form, non
  solo i cookie.
- **Deliverability verificata**, se l'invio passa da un servizio email transazionale: SPF/
  DKIM del dominio del cliente configurati e testati. Senza, le email cadono in spam o nel
  nulla — silenziosamente, e può restare così per tutta la vita del sito senza che nessuno
  lo scopra.
- **Stati espliciti.** Successo, errore, invio in corso — visibili e leggibili. Stesso
  principio di CLAUDE.md §8: il form deve dire cosa è successo, non lasciare l'utente a
  chiedersi se ha funzionato.

## 3. Ownership dell'account

L'account del provider (servizio email, form handler, CRM collegato) va nel pacchetto di
consegna di `rules/client-handoff.md` §3 — quel file lo prevede già come "gestore form" tra
i servizi di terze parti. Qui vale solo il promemoria: va **verificato prima della
consegna** chi lo possiede, non scoperto il giorno stesso.

---

## Checklist

- [ ] Destinazione del form decisa al brief (CLAUDE.md §5), non improvvisata in build
- [ ] Test end-to-end eseguito: l'invio arriva davvero a destinazione
- [ ] Anti-spam minimo presente (honeypot)
- [ ] Consenso GDPR esplicito, verificato da `privacy-check`
- [ ] Deliverability verificata se email transazionale (SPF/DKIM)
- [ ] Stati di successo/errore/invio in corso visibili, coerenti con CLAUDE.md §8
- [ ] Account del provider incluso nel pacchetto di consegna (`client-handoff.md` §3)
