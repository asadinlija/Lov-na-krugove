# Lov na krugove (Circle Hunt)

A browser game built with plain HTML, CSS and JavaScript (Canvas). You control a circle with the mouse: eat smaller circles to grow, and avoid the bigger ones.

## How to play

1. Enter a nickname and a color for your circle (both optional) and click **START**.
2. Move the mouse. Your circle follows the cursor at a constant speed.
3. Touching a circle that is **smaller than or equal to** yours eats it: your circle grows by 1 and your score goes up by 1.
4. Touching a **bigger** circle ends the game. Click **RESTART** to play again.

The game screen shows your current size, score and survival time. A new circle is spawned for every circle you eat, and the game always makes sure at least one edible circle is on the board.

## Features

- Nickname and circle color selection (any valid CSS color, e.g. `red`, `#ff8800`, `rgb(0, 128, 255)`; if the field is left empty the default red is used)
- Survival timer (time spent paused is not counted)
- Pause / resume button (top-right corner of the canvas)
- Light and dark theme toggle (top-right corner of the page)
- Short protection period (about 0.6 s) after each start or restart, during which touched circles are moved away instead of ending the game

## Running

No installation or build step is needed. Open [`index.html`](index.html) in a web browser.

The game uses the *Audiowide* font from Google Fonts, so an internet connection is needed to see it; without it the browser falls back to Arial.

## Project structure

```
├── index.html   page layout, inputs and the game canvas (1000×600)
├── index.js     game logic: movement, collisions, scoring, timer, pause, theme
└── style.css    styling
```

## Technologies

- HTML5 Canvas
- Vanilla JavaScript (no libraries or dependencies)
- CSS
