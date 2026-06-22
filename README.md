# Sophie's Ocean Adventure

A bright aqua, full-screen ocean adventure for Sophie. The game teaches sea animal body parts in **English only**, uses a **sweet female voice** through the browser speech engine, and now uses the sea animal illustrations extracted from the uploaded coloring book.

## Main features

- English-only interface and learning content.
- Sea animal images from the coloring book: turtle, octopus, giant clam, starfish, seahorse, shark, crab, hammerhead shark, fish, and shrimp.
- Sweet feminine voice via the browser Speech Synthesis API.
- Full-screen play with a built-in fullscreen prompt.
- Practice mode with unlimited tries and kind feedback.
- Exam mode with a celebratory finish.
- Rewards: pearls, shells, starfish, golden bubbles, and ocean crowns.
- Treasure Room with saved progress.
- Responsive layout for desktop, tablet, and mobile.
- Desktop controls: arrow keys to move, Enter/Space for Action, H to repeat, F for full screen.
- Touch controls: on-screen arrows and Action/Listen buttons for phones and iPads.
- Dominant aqua / sea-water color palette.
- No external dependencies; ready for GitHub Pages.

## How to run locally

### Option 1
Open `index.html` directly in a browser.

### Option 2
Run a simple local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

## How to publish on GitHub Pages

1. Create a new repository on GitHub.
2. Upload all files from this folder.
3. Go to **Settings -> Pages**.
4. Under **Build and deployment**, choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Save and wait for the GitHub Pages link.

## Controls

### PC

- Arrow keys: move Sophie around the ocean map.
- Enter or Space: Action / enter animal area.
- H: repeat the current voice instruction during lessons.
- F: request full screen.

### Phone or iPad

- On-screen arrows: move.
- Action button: enter animal area.
- Listen button: repeat instructions.
- The game shows a fullscreen prompt when possible.

## Learning content

Animals included:

- Sea Turtle
- Octopus
- Giant Clam
- Starfish
- Seahorse
- Shark
- Crab
- Hammerhead Shark
- Fish
- Shrimp

Body parts include:

- shell
- flippers
- head
- tail
- body
- eyes
- mouth
- tentacles
- ridges
- arms
- snout
- fin
- teeth
- gills
- claws
- legs

## Notes about voice

The game uses `window.speechSynthesis`. Voice availability depends on the browser and device. The game tries to choose an English female voice automatically. If a clear female voice is not available on the device, the browser will use its closest English voice.

## Notes about full screen

The game is designed to be played in fullscreen mode. Browsers usually require a tap or click before entering fullscreen, so the game includes a fullscreen overlay and a Full Screen button. Some mobile browsers limit fullscreen APIs; in those cases, the game still uses the full visible viewport.

## Customization

To change the color palette, edit `src/styles.css` and modify the variables at the top.

To add animals or body parts, edit `ANIMALS` in `src/app.js`.

To adjust clickable body areas, edit each animal's `spots` values in `src/app.js`.

## Educational design

The design follows a gentle learning loop:

1. Listen.
2. Touch or identify.
3. Receive kind feedback.
4. Try again when needed.
5. Earn a treasure.
6. Review progress in the Treasure Room.

Practice is for learning. Exam is for celebrating what Sophie has learned.


## Nota de voz femenina más fluida

Esta versión conserva la base exacta del ZIP indicado por el usuario y solo añade mejoras de voz:
- velocidad más lenta;
- tono más suave;
- selector de voces disponibles;
- preferencia automática por voces femeninas/naturales en inglés.

La calidad final depende del navegador y del dispositivo. En Windows/Edge suele funcionar mejor con Jenny, Aria o Zira si están disponibles.


## 10 voice avatars

This version uses 10 selectable sweet voice avatars instead of showing a long list of system voices. Sophie can choose a character such as Luna, Maya, Sofia, Emma, Lily, Olivia, Ruby, Aria, Zoe, or Isla.

Each avatar uses a calm, higher, child-like speech profile and tries to match the best available feminine English voice on the device. The game cannot create a real child voice offline in GitHub Pages; for a truly human child voice, the next step would be replacing speech synthesis with recorded MP3 voice lines.


## Practice Levels and Exam Levels

This version adds structured progression:

- 6 practice levels.
- 5 exam levels.
- Each practice/exam shuffles different animals and body parts every time.
- Easy levels start with simple parts.
- Later levels include fins, tails, faces, claws, arms, special shapes, and mixed challenges.
- The free ocean map is still available for open exploration.


## Corrected levels patch

This version fixes the Practice Levels and Exam Levels buttons so they open correctly. It also reduces the voice avatars to 5 sweet female options and applies a full-screen fit layout so the whole game fits on the screen without needing to scroll down.

## Simple GitHub structure

This ZIP is ready for GitHub Pages with a minimal folder structure:

```text
index.html
app.js
styles.css
animals/
README.md
LICENSE
```

To publish:
1. Upload these files to a GitHub repository.
2. Go to Settings → Pages.
3. Choose Deploy from a branch.
4. Select the `main` branch and `/root`.
5. Open the GitHub Pages link.

## Flat GitHub structure

This version has **no folders at all**. Everything is in the repository root:

```text
index.html
app.js
styles.css
book_crab.png
book_fish.png
book_giant_clam.png
book_hammerhead_shark.png
book_octopus.png
book_seahorse.png
book_shark.png
book_shrimp.png
book_starfish.png
book_turtle.png
README.md
LICENSE
```

Upload all files directly to the root of your GitHub repository and enable GitHub Pages from the `main` branch, `/root`.
