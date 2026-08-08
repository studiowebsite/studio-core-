# Template — PRIVACY-TRATTAMENTI.md

Compila con i dati reali rilevati in Fase 1. Non lasciare sezioni vuote silenziosamente:
se una categoria non ha voci, scrivi "Nessuno rilevato" invece di ometterla — un'assenza
dichiarata vale come fatto, un'assenza silenziosa sembra una svista.

```markdown
# Trattamenti dati — <Cliente>

Documento fattuale generato da `/privacy-check` il <data>. Elenca cosa il sito fa
tecnicamente con i dati — non è un'informativa privacy e non sostituisce una valutazione
legale. Da consegnare al titolare del trattamento o al suo legale come base per scrivere
l'informativa e la cookie policy.

**Titolare del trattamento:** <Cliente> — non lo studio che ha realizzato il sito.

**URL verificato/i:** <lista pagine controllate>, il <data>.

---

## 1. Servizi esterni rilevati

| Servizio | Dominio | Scopo | Sede (UE/extra-UE) | Parte prima del consenso? |
|---|---|---|---|---|
| ... | ... | ... | ... | Sì/No |

## 2. Cookie impostati

| Nome | Durata | Impostato da | Tipo (tecnico/statistiche/marketing) |
|---|---|---|---|
| ... | ... | ... | ... |

## 3. localStorage / sessionStorage

| Chiave | Impostata da | Contenuto (se noto) |
|---|---|---|
| ... | ... | ... |

## 4. Form e destinazione dati

| Form | Dati raccolti | Dove arrivano | Servizio terzo coinvolto |
|---|---|---|---|
| ... | ... | ... | ... |

## 5. Font e asset esterni

- <font/servizio>: self-hostato / caricato da CDN esterna (<dominio>)

## 6. Verdetto tecnico

- **Banner cookie necessario:** Sì/No — <motivo puntuale>
- **Informativa privacy necessaria:** Sì/No — <motivo puntuale>

## 7. Problemi rilevati (prima della Fase 3)

1. <problema, gravità, cosa implica>
2. ...

## 8. Fix implementati (dopo la Fase 3, se eseguita)

- [ ] Consent gate installato — script terzi caricano solo dopo consenso per categoria
- [ ] Font self-hostati: <elenco>
- [ ] Embed sostituiti con alternative senza cookie: <elenco>
- [ ] Pagina privacy creata: <path>, linkata nel footer
- [ ] Riverifica post-implementazione: nessuna richiesta terza parte prima del consenso
      (confermato il <data>)

---

*Questo documento non dichiara il sito conforme al GDPR: accerta i fatti tecnici. La
valutazione di conformità e il testo legale (informativa, cookie policy) restano a carico
del titolare e del suo legale.*
```
