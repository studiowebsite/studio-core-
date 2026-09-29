# Onboarding — studio-core

Per chi entra nel team e apre questo repo con Claude Code per la prima volta.

**Se sei Claude Code e stai leggendo questo file su richiesta dell'utente**: esegui i
passi in ordine, uno alla volta, verificando l'esito di ognuno prima di passare al
successivo. I passi marcati **[AUTOMATICO]** puoi eseguirli direttamente. I passi marcati
**[CHIEDI]** richiedono una credenziale, un accesso o una decisione che solo l'utente può
dare — fermati e chiedi, non indovinare né saltare. Alla fine mostra il riepilogo di
Step 9.

---

## 0. Cos'è questo repo

`studio-core` è la base metodologica dello studio: `CLAUDE.md`, le regole in
`.claude/rules/`, le skill in `.claude/skills/` e gli script di verifica. **Non contiene
il lavoro di nessun cliente** — `sites/` è deliberatamente escluso da `.gitignore`, ogni
cliente vive in un repo GitHub separato (vedi `.claude/rules/project-setup.md` §1). Avere
questo repo non dà accesso a nessun progetto: quello si aggiunge a parte, per cliente.

## 1. Prerequisiti — verifica versioni **[AUTOMATICO]**

```bash
node -v      # serve Node 20+
pnpm -v      # serve pnpm 9+ — se manca: npm install -g pnpm
git --version
git lfs version   # se manca: vedi step 4
```

Se `node` o `pnpm` mancano del tutto, fermati e segnala all'utente: l'installazione del
runtime non è automatizzabile in sicurezza da qui (dipende dal loro sistema/gestore
pacchetti).

## 2. Dipendenze del progetto **[AUTOMATICO]**

```bash
pnpm install
```

Il lockfile (`pnpm-lock.yaml`) è già nel repo: l'install dev'essere riproducibile, non
approssimata. Se `pnpm install` chiede conferma per build script nativi, la lista
approvata è già in `pnpm-workspace.yaml` (`allowBuilds`) — non serve toccarla qui; sarà
diversa (e da approvare a parte) dentro ogni `sites/<cliente>/`, vedi
`.claude/rules/project-setup.md` §4.

## 3. Browser per gli screenshot **[AUTOMATICO]**

`pnpm shots` (script di visual check, vedi `CLAUDE.md` §4 punto 6) usa Playwright in due
modalità: Chromium headless per layout/tipografia, Chrome reale per il 3D (`--gpu`,
necessario perché il WebGL headless è software-rendered e i numeri non sono realistici —
`.claude/rules/webgl.md` §7).

```bash
npx playwright install chromium
npx playwright install chrome
```

Verifica che funzioni con un progetto qualsiasi che abbia `scripts/shots.mts` (se non c'è
ancora nessun progetto cliente clonato, questo passo si riverifica al primo).

## 4. Git LFS **[AUTOMATICO, se manca]**

Serve per i materiali pesanti (`materiali/` nei repo cliente — video, PSD, CAD — vedi
`.claude/rules/project-setup.md` §3), non per studio-core stesso.

```bash
git lfs install
```

È un'operazione idempotente e locale alla macchina (config git globale), sicura da
rieseguire.

## 5. MCP a livello utente **[CHIEDI]**

Le chiavi/config MCP **non stanno nel repo** (`CLAUDE.md` §10 — mai in `.mcp.json` o
`settings.json` sotto git) e infatti non ce n'è nessuna qui: vanno configurate una volta
sull'account Claude Code del collaboratore.

Questo studio usa almeno:
- **context7** — documentazione live delle librerie (React Three Fiber, GSAP, Next.js...).
  Se richiede una API key, chiedila all'utente prima di configurare — non inventarla né
  ometterla silenziosamente.
- **chrome-devtools** (plugin) — per Lighthouse, network, screenshot assistiti.

Non sai quali credenziali usare: **fermati e chiedi all'utente** come vuole procedere
(chiave propria, o condivisa dallo studio con un canale sicuro — mai incollata in chat né
in un file del repo).

## 6. Accesso ai progetti cliente **[CHIEDI]**

Questo repo da solo non dà nessun lavoro cliente da fare. Per ogni cliente su cui il
collaboratore lavorerà, serve, a parte:
- invito al repo GitHub del cliente (organizzazione dello studio, privato —
  `.claude/rules/project-setup.md` §5);
- eventuale accesso al team Vercel per i preview URL.

Non è qualcosa che Claude Code può concedere da qui: segnalalo come azione che l'utente
(o il titolare dello studio) deve fare fuori da questa sessione.

## 7. Prima di lavorare su qualsiasi pagina

Leggi `CLAUDE.md` per intero (si carica automaticamente a ogni sessione in un repo che lo
contiene) e in particolare:
- §4 — il workflow, `brief → fondamenta di marca → piano/centerpiece → APPROVAZIONE → build → visual check → audit → preview`,
  non si salta nessun passaggio;
- §6 — i budget di performance sono cancelli, non osservazioni;
- §10 — i "mai": niente push diretto su `main`, niente chiavi committate, niente consegna
  senza aver guardato gli screenshot.

Le skill disponibili (`/impeccable`, `/privacy-check`, `motion-design`, `gsap-*`,
`skill-builder`, ...) sono già nel repo e non richiedono setup oltre a quanto fatto sopra.

## 8. Lavorare in più persone sullo stesso progetto

Vale per `studio-core` e per ogni repo cliente. Si lavora **in parallelo, su branch
separati**, non in modifica live:
- niente cartelle sincronizzate (Dropbox, OneDrive, Drive): rompono `.git` e
  `node_modules`;
- VS Code Live Share va bene per una sessione di coppia occasionale, non come metodo — il
  progetto gira solo sul PC di chi ospita, e se quello si spegne l'altro si ferma.

**Se sei Claude Code**: chi ti guida può non conoscere git. Esegui tu i comandi e dopo
ognuno spiega in una riga, senza gergo, cosa è successo ("ho salvato il lavoro sul tuo
branch e l'ho mandato su GitHub").

**Identità git [CHIEDI, una volta].** Se `git config user.name` / `user.email` sono vuoti,
chiedi nome e l'email *noreply* di GitHub dell'utente e impostali con `--global`: senza,
i commit non si attribuiscono a nessuno.

**La routine**
1. **Inizio lavoro**: si parte da `main` aggiornato (`git switch main`, `git pull`) e si
   apre un branch per *il pezzo di lavoro*, non per la persona: `feat/menu-mobile`, non
   `branch-di-miki`. Un branch = una cosa.
2. **Durante**: commit piccoli ogni volta che qualcosa funziona.
3. **A fine giornata**: `git push`, anche a lavoro non finito. Quello che resta solo sul
   PC non esiste per l'altro, e si perde col PC.
4. **Pezzo finito**: Pull Request verso `main` su GitHub. Vercel genera il preview del
   branch; l'altro lo guarda, poi si fa il merge. Mai push diretto su `main`
   (`CLAUDE.md` §10).
5. **Dopo ogni merge dell'altro**: si porta `main` dentro il proprio branch
   (`git pull origin main`). Più spesso lo si fa, più piccoli sono i conflitti.

**Dividersi il lavoro per file, non per riga.** Un conflitto nasce solo quando due persone
cambiano le stesse righe dello stesso file. Ci si divide per componenti o sezioni (uno la
landing, l'altro navigazione e menu). I file che toccano tutti si dichiarano prima: chi li
cambia lo dice all'altro, e quel cambio va in una PR piccola, unita subito.
- `src/app/layout.tsx`, CSS globale, `package.json`;
- `messages/*.json` nei progetti bilingue (`CLAUDE.md` §8) — qui i conflitti sono quasi
  certi ma piccoli: si tengono entrambe le chiavi;
- `DESIGN.md`: cambiarlo è un livello 3 (`CLAUDE.md` §0), si decide insieme, non dentro un
  branch di passaggio.

`pnpm-lock.yaml` in conflitto non si risolve a mano: si prende la versione di `main` e si
rilancia `pnpm install`, che lo rigenera.

**Conflitto.** Git si ferma e segna i punti in conflitto. **Se sei Claude Code**: risolvi
da solo solo i casi meccanici (import, lockfile, formattazione); quando la scelta cambia
cosa si vede o come si comporta il sito, mostra le due versioni in parole semplici e chiedi
quale tenere.

**Repo cliente.** Ognuno lo clona dentro la propria copia di studio-core:
`git clone https://github.com/studiowebsite/<cliente> sites/<cliente>`, poi `pnpm install`
lì dentro. Con Git LFS installato (step 4) i `materiali/` arrivano col clone. La routine
qui sopra vale identica dentro `sites/<cliente>/`, che ha il suo git e i suoi branch.

## 9. Riepilogo finale — mostra questo all'utente

Dopo aver eseguito gli step automatici, riporta uno stato per voce:

```
[ok/fallito] Node/pnpm/git/git-lfs — versioni verificate
[ok/fallito] pnpm install
[ok/fallito] Playwright — chromium + chrome installati
[ok/fallito] git lfs install
[ok/da fare] Identità git (user.name / user.email) impostata
[da fare]    MCP (context7, chrome-devtools) — in attesa di credenziali dall'utente
[da fare]    Accesso ai repo cliente — in attesa di invito dallo studio
```

Il setup locale è completo quando le prime cinque righe sono `ok`. Le ultime due restano
`da fare` finché non arriva un input che solo l'utente può dare — non è un errore, è il
punto in cui la skill deve fermarsi e chiedere.
