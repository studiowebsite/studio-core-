# rules/project-setup.md

Come nasce **fisicamente** un progetto cliente: dove vive, come è strutturato, come va
online. Questo file esiste perché il workflow del CLAUDE.md parte da "brief" — cioè da un
progetto che *esiste già*. Qui c'è il passo prima: farlo esistere, senza improvvisare.

Ogni riga di questo file è una cosa che abbiamo sbagliato o improvvisato almeno una volta.

---

## 1. Repo cliente in `studio-core/sites/<cliente>/`, autonomo per copia

`studio-core` è la **base riutilizzabile** dello studio: metodo, regole, script, libreria di
riferimenti.

Ogni cliente vive in `studio-core/sites/<cliente>/`. Non eredita nulla per risalita —
niente symlink, niente riferimento al parent: alla creazione si **copia dentro**
`CLAUDE.md`, `.claude/` e `scripts/`, poi si inizializza lì un repo git proprio:

```bash
# dentro studio-core
mkdir -p sites/<cliente> && cd sites/<cliente>
cp ../../CLAUDE.md .
cp -r ../../.claude .
cp -r ../../scripts .
cp ../../.gitignore ../../.gitattributes .
git init
```

**Perché sotto `studio-core` invece che un repo indipendente fin da subito:** si lavora da
soli, su un solo PC — tenerli sotto la stessa radice è comodo (un editor aperto, un `cd` per
passare da un cliente all'altro, la libreria di riferimenti a portata di mano). Non è un
compromesso sull'isolamento, perché quello che conta è già garantito da altro:
- **git è separato per cliente** — `git init` proprio dentro `sites/<cliente>/`, non un
  submodule né una cartella dentro la storia di `studio-core`;
- **il lockfile è proprio** (§4) — le dipendenze del cliente non vivono nel lockfile della
  base.

Con questi due, la cartella condivisa non è il monorepo che preoccupava: non c'è una storia
git comune da cui un cliente potrebbe finire per vedere il lavoro di un altro.

**Quando si consegna al cliente, o si dà accesso a un collaboratore esterno — allora, non
prima — si estrae `sites/<cliente>/` fuori da `studio-core`.** Due strade:
- `git filter-repo` (o `filter-branch`) sulla history di `sites/<cliente>/`, se serve
  preservare i commit così com'è;
- altrimenti, più semplice: `mv sites/<cliente> ~/<cliente>` e `git remote add origin` +
  push. Si perde la storia locale pre-estrazione, ma per una consegna spesso è accettabile.

Finché il lavoro resta interno, `sites/<cliente>/` dentro `studio-core` è la posizione
normale del progetto — non uno stato provvisorio da correggere prima del tempo.

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

Il repo cliente nasce **già con il suo lockfile**: appena creato in `sites/<cliente>/`
(§1), si lancia lì `pnpm install` — subito, non "alla separazione". Con `sites/<cliente>/`
già un repo git a sé, e senza un `packages:` che lo aggreghi al workspace di studio-core,
non c'è nessuna separazione futura da cui far dipendere questo passo.

Perché non è rimandabile: se le dipendenze del cliente restassero anche solo per un po'
senza un `pnpm-lock.yaml` proprio, finirebbero implicitamente risolte contro il lockfile
della base — e chi apre `sites/<cliente>/` da solo, o Vercel al deploy, troverebbe un
`package.json` senza lockfile: l'install non è riproducibile, e si manifesta come "in
locale va, in preview no".

Se `pnpm install` chiede l'approvazione per pacchetti con build script nativi (`sharp`,
`@swc/core`, `@parcel/watcher`...), la lista va in `allowBuilds` dentro il
`pnpm-workspace.yaml` **del cliente** — non in quello di studio-core: ogni progetto
approva i propri. La config pnpm ha cambiato nome tra le release → verificala via
Context7, non a memoria.

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

- [ ] Repo cliente in `sites/<cliente>/`, con `.git` e lockfile propri, nome senza spazi
- [ ] Config di studio-core copiata (CLAUDE.md, .claude/, scripts/, .gitignore, .gitattributes)
- [ ] DESIGN.md e PRODUCT.md nel repo del cliente
- [ ] materiali/ e public/ separati; LFS solo su materiali/
- [ ] `pnpm install` lanciato súbito dentro `sites/<cliente>/`, non rimandato (§4)
- [ ] Repo GitHub privato, nell'organizzazione dello studio
- [ ] LFS verificato dopo il push (file veri, non puntatori)
- [ ] Diritti sui contenuti confermati prima di qualsiasi deploy pubblico
- [ ] studio-core torna pulito: non ha committato niente del cliente

**Il giorno dell'estrazione** (consegna al cliente, o accesso a un collaboratore esterno —
non alla nascita, vedi §1):

- [ ] `sites/<cliente>/` estratto fuori da `studio-core` (`git filter-repo` sulla history,
      oppure `mv` + nuovo `git remote add origin`)
