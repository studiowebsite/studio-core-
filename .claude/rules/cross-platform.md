# rules/cross-platform.md

Lo studio lavora su Windows e su Mac. Un sito che su un PC è giusto e sull'altro è rotto
ha un bug del sito, non del PC. Questo file esiste perché è successo (Giovanni Mulè,
settembre 2026): due difetti evidenti su Windows, invisibili sul Mac — e invisibili anche
a `pnpm shots`, che fotografava sempre "da Mac" su qualunque PC.

---

## 1. Strumenti — lo stesso comando su ogni PC

- **Script del progetto solo in Node** (`scripts/*.mts`). Mai `python3`, comandi solo
  bash, `rm -rf` o `cp` dentro gli script del `package.json`: su Windows di norma non ci
  sono o fanno altro, e il comando "funziona" solo sul PC di chi l'ha scritto.
- **Mockup e pagine statiche si aprono con `pnpm serve <cartella>`**, mai con doppio
  clic. Da `file://` Chrome blocca fetch e moduli verso altri file locali: ciò che ne
  dipende sparisce, e sparisce solo per chi apre il file in quel modo. `pnpm shots`
  rifiuta un indirizzo `file:`.
- **Nomi dei comandi**: prima di aggiungerne uno al `package.json`, verifica che pnpm non
  ne abbia già uno con quel nome — il suo ha la precedenza e il tuo non parte mai
  (`pnpm doctor` è il caso che ci è capitato).

## 2. Versioni — fissate, in un posto solo

| Cosa | Dove si fissa |
|---|---|
| Node | `.node-version` |
| pnpm | `"packageManager": "pnpm@<versione esatta>"` nel `package.json` |
| Playwright | `devDependencies`, versione esatta senza `^` né `~` |

- Playwright esatto non è pignoleria: la sua versione decide quale browser usa `shots`.
  Due PC con Playwright diversi fotografano con browser diversi, e le catture non si
  possono confrontare.
- pnpm dalla 11 in poi (o corepack) scarica e usa da solo la versione del
  `packageManager`: nessuno deve allinearla a mano. Ma si lancia **dalla cartella del
  progetto**, non con `--dir` da un altro progetto: gira la versione del progetto da cui
  parti, e se l'altro ne vuole un'altra pnpm si ferma.
- **`pnpm verifica-pc`** controlla tutto questo — più git, LFS e i browser, aperti
  davvero — e dice come sistemare. Si lancia all'onboarding e ogni volta che "da me si
  vede diverso".

## 3. Codice — le trappole che su Mac non si vedono

- **Barra di scorrimento.** Windows: classica, toglie circa 15px alla pagina. Mac: sovrapposta,
  0px. `innerWidth` e `100vw` la includono; lo spazio vero della pagina è
  `document.documentElement.clientWidth` (in CSS `100%`). Esempio reale: un SVG con
  `viewBox` largo `innerWidth` dentro un contenitore largo `100%` si rimpicciolisce
  dell'1% su Windows e a fondo pagina finisce decine di px fuori posto. Per decidere un
  layout in JS si usa `matchMedia`, che coincide con le media query CSS.
- **Finestre basse.** Un portatile Windows con ridimensionamento al 125% mostra circa
  1536×730; un MacBook Air circa 1470×830. Hero a `100svh` e ciò che sborda si provano sul
  basso, non solo su un monitor grande.
- **Font.** `-webkit-font-smoothing` agisce solo su Mac, e i pesi sottili a corpo grande
  su Windows escono diversi: si guardano nella cattura Windows, non si danno per buoni.
- **Maiuscole nei nomi dei file.** Mac e Windows non distinguono `Hero.tsx` da `hero.tsx`,
  Vercel (Linux) sì: un import con le maiuscole sbagliate funziona su entrambi i PC e
  rompe il build del preview. Stesso nome, stesse maiuscole, sempre.
- **Fine riga**: le fissa `.gitattributes` (LF). Non si cambia per progetto.

## 4. Visual check

- `pnpm shots` scatta profili con barra classica di Windows (`03-laptop`, `04-desktop`,
  `05-laptop-win`) e con barra sovrapposta (`01-mobile`, `02-tablet`, `06-macbook`), e
  scrive quanti px toglie la barra. Se un profilo classic segna 0px, la cattura non è "da
  Windows": lo segnala tra i problemi, e quella cattura non vale.
- **Su Mac** (barre di sistema sovrapposte) la cattura a pagina intera dei profili
  Windows non è affidabile: durante lo scatto la pagina torna per un momento larga
  quanto la finestra e si ridispone "da Mac". `shots` se ne accorge e lo scrive tra i
  problemi. Allora per il caso Windows si usa `pnpm shots --viewport-only` (la prima
  schermata resta valida anche su Mac), oppure la cattura intera la fa chi è su Windows.
  Verificato simulando le barre sovrapposte su Chrome per Windows, non ancora su un Mac.
- Limite noto: su una pagina più corta della finestra Windows non mostrerebbe la barra,
  ma i profili classic la tengono comunque (15px in meno).
- **Un difetto visto su un PC e non sull'altro si riproduce prima con `shots`** sul
  profilo giusto, poi si corregge. Mai correggere a occhio sul PC di chi lo vede: senza
  la cattura non sai se l'hai risolto o spostato.

## Checklist

- [ ] Nessuno script del progetto dipende da Python, bash o comandi solo-Mac
- [ ] `.node-version`, `packageManager` e Playwright esatto presenti; `pnpm verifica-pc`
      senza errori su ogni PC che lavora al progetto
- [ ] Nessun `innerWidth` / `100vw` usato come larghezza della pagina
- [ ] Catture guardate anche sui profili Windows (03–05) e MacBook (06), non solo su uno
- [ ] Mockup condivisi aperti con `pnpm serve`, non con doppio clic
