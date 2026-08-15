---
name: anime-js
description: Use when writing or reviewing anime.js animations in a client site — hover states, focus/active transitions, simple entrance effects without scroll. Use when the user asks for anime.js, animejs, or a lightweight micro-interaction, not for ScrollTrigger, pinning, or complex sequencing (that's GSAP).
license: MIT
---

# anime.js — micro-interazioni

Skill minima, non vendorizzata: a differenza delle `gsap-*` (pacchetto ufficiale
GreenSock), qui non c'è documentazione API imbottita — perché anime.js **v4** (2024) ha
riscritto l'API rispetto alla v3 diffusa nella maggior parte del materiale di training
(niente più `anime({...})` globale; ora `import { animate, createTimeline, createScope }
from 'animejs'`, sintassi e nomi delle opzioni cambiati). Scrivere a memoria qui è il modo
più rapido di produrre codice v3 su un progetto che ha installato v4.

## Regola cardine

**Mai scrivere una chiamata anime.js a memoria.** Prima di ogni riga, verifica l'API della
versione installata via **Context7** (stesso principio di `CLAUDE.md` §3 per R3F/GSAP/
Next.js). Se Context7 non è disponibile, dillo esplicitamente invece di indovinare la
sintassi.

## Perimetro — quando questa skill, quando gsap-*

Deciso in `CLAUDE.md` §3 e `rules/motion.md` §1, non ridiscusso qui:

- **anime.js** → micro-interazioni senza scroll: hover, focus, stati, transizioni di UI,
  ingressi semplici di un singolo elemento o piccolo gruppo.
- **GSAP + ScrollTrigger + Lenis** (skill `gsap-*`) → tutto ciò che è scroll-linked, pin,
  scrub, o coreografia multi-step su più sezioni.

Se un'animazione che doveva essere "semplice" inizia a richiedere scroll o sequenze
complesse, è un segnale per passare a GSAP, non per far crescere anime.js oltre il suo
perimetro.

## Vale comunque, qualunque libreria

Le regole non negoziabili di `rules/motion.md` §3 non dipendono dallo strumento:

- Solo `transform` e `opacity`, mai proprietà di layout.
- `prefers-reduced-motion` rispettato — durata 0 o animazione saltata.
- Nessuna allocazione dentro un loop legato al frame.
- Hook di stato finale esposto se l'animazione deve essere fotografata (`motion.md` §4).

## Peso nel bundle

anime.js entra nel budget JS iniziale di `CLAUDE.md` §6 (180 kB gzip, 3D escluso) come
qualunque altra dipendenza. Verifica il peso reale della versione installata, non fidarti
della fama di "libreria leggera".
