# rules/project-setup.md

Come nasce **fisicamente** un progetto cliente: dove vive, come è strutturato, come va
online. Questo file esiste perché il workflow del CLAUDE.md parte da "brief" — cioè da un
progetto che *esiste già*. Qui c'è il passo prima: farlo esistere, senza improvvisare.

Ogni riga di questo file è una cosa che abbiamo sbagliato o improvvisato almeno una volta.

---

## 1. Un repo per cliente, fuori da studio-core

`studio-core` è la **base riutilizzabile** dello studio: metodo, regole, script, libreria di
riferimenti. Non contiene il lavoro dei clienti.

Ogni cliente è un **repo suo**, che parte da una copia di studio-core:

```bash
# dalla home, non dentro studio-core
mkdir ~/<cliente> && cd ~/<cliente>
cp ~/studio-core/CLAUDE.md .
cp -r ~/studio-core/.claude .
cp -r ~/studio-core/scripts .
cp ~/studio-core/.gitignore ~/studio-core/.gitattributes .
git init
```

**Perché separato e non un monorepo:** storia git pulita, accessi isolati, consegnabile a
fine progetto. Con un monorepo non puoi dare accesso a un cliente o a un collaboratore
senza dargli *tutto* — il tuo metodo e gli altri clienti inclusi. Non recuperabile dopo.

**Nome della cartella e del repo: senza spazi.** `re-del-sole`, non `Re del Sole`. Gli spazi
nei path rompono script, CLI e URL. Il nome leggibile va nel README, non nel filesystem.

## 2. Struttura interna del repo cliente

```
<cliente>/
├── CLAUDE.md · .claude/ · scripts/     ← eredìtati da studio-core
├── DESIGN.md · PRODUCT.md              ← generati da /impeccable init, qui non altrove
├── src/ · public/ · ...                ← il sito (Next.js)
├── materiali/                          ← sorgenti del cliente (vedi §3)
│   ├── README.md
│   ├── foto/ · video/ · documenti/ · reference/
└── mockups/                            ← concept di mockup-flow.md, sacrificabili
```

`DESIGN.md` e `PRODUCT.md` vivono **nel repo del cliente**, mai nella radice di studio-core.
Se `/impeccable init` li scrive altrove, spostali qui.

## 3. Materiali — sorgente vs output

Distinzione netta, sempre:

- **`materiali/`** = archivio sorgente del cliente (foto originali, video girato, PDF, CAD).
  Mai importato dal codice. È l'input.
- **`public/`** = output ottimizzato che il sito serve davvero (immagini compresse, frame
  estratti, poster). È generato dai materiali.

Chi modifica `public/` a mano perde la tracciabilità: si rigenera dai materiali, non si
edita.

**Binari pesanti → Git LFS**, e solo su `materiali/`:
- Video, PSD, CAD, PNG grandi in `materiali/` passano da LFS (repo leggero, file al sicuro).
- Gli output in `public/` restano blob git normali: un deploy che dipende dal checkout LFS
  è un punto di rottura in più. Meglio che Vercel non debba fare `lfs pull` per buildare.
- Il `README.md` in `materiali/` resta in git normale, leggibile nel diff.
- Attenzione alla quota LFS gratuita di GitHub (1 GB storage + 1 GB banda/mese). Ogni
  ri-export di un video è una versione nuova che si **somma**, non sostituisce.

## 4. Lockfile e autonomia

Un repo cliente separato deve avere il **suo** `pnpm-lock.yaml`. Se è nato dentro il
workspace di studio-core, le sue dipendenze vivevano nel lockfile della base — e chi clona,
o Vercel al deploy, trova un `package.json` senza lockfile: l'install non è riproducibile e
si manifesta come "in locale va, in preview no".

Alla separazione: togli il cliente dal `pnpm-workspace.yaml` di studio-core, sposta nel
progetto la config `allowBuilds` che era nella radice, poi `pnpm install` dentro il repo
cliente per generare il suo lockfile. La config pnpm ha cambiato nome tra le release →
verificala via Context7, non a memoria.

## 5. Online — GitHub e Vercel

**GitHub.** Il repo cliente sta nell'**organizzazione dello studio**, non nell'account
personale né in quello del cliente. Alla consegna lo trasferisci o dai accesso; finché il
lavoro è in corso la proprietà è dello studio. **Repo privato** sempre: il codice è tuo, e
Vercel pubblica il sito online anche da un repo privato.

Push: crea il repo vuoto su GitHub (no README/gitignore/license — li hai già), poi
`git remote add origin` + `git push -u origin main`. Con LFS: verifica `git lfs version`,
e dopo il push conferma che i binari siano saliti come file veri (`git lfs ls-files`, e su
GitHub la dimensione è reale, non un puntatore di poche righe).

**Vercel.** Login via GitHub, importa il repo, verifica che riconosca Next.js e la root
giusta. Da lì ogni branch ha un **preview URL** condivisibile: è così che il cliente
approva, non via screenshot.

## 6. Prima di pubblicare — il cancello legale

Un preview Vercel è **pubblico**: chiunque abbia il link vede il sito.

- **Diritti sui contenuti verificati.** Foto, testi e logo sono del cliente o di suoi
  fornitori con licenza d'uso? Le foto di un fotografo appartengono al fotografo, non
  automaticamente al cliente. Una conferma scritta prima di pubblicare.
- **Niente stock non licenziati online.** Finché ci sono placeholder presi dal web, il sito
  resta locale. Placeholder dichiarati (grigi con scritta), mai immagini di cui non hai i
  diritti.

Questo è parte delle domande di §5 del CLAUDE.md — la licenza dei contenuti. Se emerge qui
invece che al brief, il metodo ha fatto tardi.

## 7. Checklist di nascita

- [ ] Repo cliente separato, fuori da studio-core, nome senza spazi
- [ ] Config di studio-core copiata (CLAUDE.md, .claude/, scripts/, .gitignore, .gitattributes)
- [ ] DESIGN.md e PRODUCT.md nel repo del cliente
- [ ] materiali/ e public/ separati; LFS solo su materiali/
- [ ] Lockfile proprio generato; progetto fuori dal workspace di studio-core
- [ ] Repo GitHub privato, nell'organizzazione dello studio
- [ ] LFS verificato dopo il push (file veri, non puntatori)
- [ ] Diritti sui contenuti confermati prima di qualsiasi deploy pubblico
- [ ] studio-core torna pulito: non ha committato niente del cliente
