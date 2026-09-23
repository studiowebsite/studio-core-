# Onboarding — studio-core

Per chi entra nel team e apre questo repo con Claude Code per la prima volta.

**Se sei Claude Code e stai leggendo questo file su richiesta dell'utente**: esegui i
passi in ordine, uno alla volta, verificando l'esito di ognuno prima di passare al
successivo. I passi marcati **[AUTOMATICO]** puoi eseguirli direttamente. I passi marcati
**[CHIEDI]** richiedono una credenziale, un accesso o una decisione che solo l'utente può
dare — fermati e chiedi, non indovinare né saltare. Alla fine mostra il riepilogo di
Step 8.

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

## 8. Riepilogo finale — mostra questo all'utente

Dopo aver eseguito gli step automatici, riporta uno stato per voce:

```
[ok/fallito] Node/pnpm/git/git-lfs — versioni verificate
[ok/fallito] pnpm install
[ok/fallito] Playwright — chromium + chrome installati
[ok/fallito] git lfs install
[da fare]    MCP (context7, chrome-devtools) — in attesa di credenziali dall'utente
[da fare]    Accesso ai repo cliente — in attesa di invito dallo studio
```

Il setup locale è completo quando le prime quattro righe sono `ok`. Le ultime due restano
`da fare` finché non arriva un input che solo l'utente può dare — non è un errore, è il
punto in cui la skill deve fermarsi e chiedere.
