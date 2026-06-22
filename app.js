const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
const spot = (x, y, w, h, shape = "ellipse") => ({ x, y, w, h, shape });
const poly = (x, y, w, h, points) => ({ x, y, w, h, shape: "poly", points });
const part = (id, name, spots) => ({ id, name, spots });
const NICKNAMES = ["Sophie", "Sophie", "Topito", "Topito", "Preciosa", "Preciosa", "Sophie", "Topito", "Preciosa", "Princesa"];
const nickname = () => sample(NICKNAMES);
const personalize = (text) => text.replaceAll("{name}", nickname());
const selectionPrompt = (partName, examNumber = null) => examNumber ? `Question ${examNumber}. ${nickname()}, touch the ${partName}.` : `${nickname()}, touch the ${partName}.`;
const familyLine = () => personalize(sample(FAMILY_LOVE_LINES));
const feedbackMarkup = (main, extra = "") => `
  <div class="feedback-main">${main}</div>
  ${extra ? `<div class="feedback-love">${extra}</div>` : ""}
`;

const safeStore = {
  get(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  },
  set(key, value) {
    try { localStorage.setItem(key, value); } catch (_) {}
  }
};

const DEVICE_MODE_KEY = "sophies-ocean-device-mode";
const DEVICE_MODES = {
  pc: {
    id: "pc",
    icon: "💻",
    title: "PC version",
    label: "PC",
    description: "Use the keyboard arrows to swim and Space or Enter to start the animal questions."
  },
  touch: {
    id: "touch",
    icon: "📱",
    title: "Cellphone / Tablet version",
    label: "Cellphone / Tablet",
    description: "Use big on-screen buttons: up, down, left, right, Action, and Listen."
  }
};

function defaultDeviceMode() {
  const saved = safeStore.get(DEVICE_MODE_KEY);
  if (DEVICE_MODES[saved]) return saved;
  const looksTouch = window.matchMedia?.("(pointer: coarse)")?.matches || window.innerWidth <= 900;
  return looksTouch ? "touch" : "pc";
}

const VOICE_PROFILE = {
  rate: 0.72,
  pitch: 1.03,
  volume: 1,
  minimumFallbackMs: 3400,
  fallbackMsPerChar: 165
};

const VOICE_AVATARS = [
  { id: "luna", emoji: "🐬", name: "Luna", accent: "Latina sweet", rate: 0.70, pitch: 1.18, prefer: ["samantha", "ava", "jenny", "aria", "zira", "google us english"] },
  { id: "sofia", emoji: "⭐", name: "Sofia", accent: "American little", rate: 0.72, pitch: 1.22, prefer: ["jenny", "aria", "samantha", "ava", "zira"] },
  { id: "emma", emoji: "🐢", name: "Emma", accent: "American soft", rate: 0.70, pitch: 1.12, prefer: ["samantha", "jenny", "aria", "ava"] },
  { id: "olivia", emoji: "🐚", name: "Olivia", accent: "English gentle", rate: 0.69, pitch: 1.13, prefer: ["serena", "emma", "sonia", "amy", "google uk english female"] },
  { id: "aria", emoji: "🐟", name: "Aria", accent: "American natural", rate: 0.71, pitch: 1.10, prefer: ["aria", "jenny", "samantha", "ava"] }
];

const selectedVoiceAvatar = () => {
  const saved = safeStore.get("sophies-ocean-voice-avatar");
  return VOICE_AVATARS.find(v => v.id === saved) || VOICE_AVATARS[0];
};

const DEFAULT_PROGRESS = {
  pearls: 0,
  shells: 0,
  starfish: 0,
  goldenBubbles: 0,
  crowns: 0,
  learned: {},
  exams: [],
  lastPlayed: null
};

const SWEET_PRAISE = [
  "Amazing, {name}! You found it!",
  "Great job, {name}! I am so proud of you!",
  "Wonderful, {name}! You are learning so fast!",
  "You did it, {name}! High five!",
  "Beautiful work, {name}!",
  "Fantastic, {name}! You are a wonderful ocean explorer!",
  "Hooray, {name}! That was excellent!",
  "Yes, {name}! You touched the right part!"
];

const KIND_SUPPORT = [
  "Good try, {name}. Let's look again.",
  "Almost, {name}! You can do it. Try one more time.",
  "That is okay, {name}. We are learning together.",
  "Take your time, {name}. Look carefully.",
  "Nice try, {name}. Let's keep going.",
  "I believe in you, {name}. Try again.",
  "Good try, {name}. Let's try again together.",
  "It's okay, {name}. You can do it.",
  "You are doing well, {name}. Let's keep learning together.",
  "No worries, {name}. Every try helps you learn."
];

const FAMILY_LOVE_LINES = [
  "Papa John and Mama Lizeth love you very much.",
  "Papi John and Mami Lizeth are cheering for you.",
  "Your dad John and your mom Lizeth believe in you.",
  "Papa John and Mama Lizeth are always on your team.",
  "Papi and Mami are proud of your effort, {name}.",
  "John and Lizeth love you and support you, {name}.",
  "Your family loves you, {name}, and learning takes practice.",
  "Papa John and Mama Lizeth know you can keep trying."
];

const ANIMALS = [
  {
    id: "turtle", name: "Sea Turtle", emoji: "🐢", x: 13, y: 27, image: "book_turtle.png", ratio: "1831 / 1674",
    parts: [
      part("head", "head", [poly(0, 6, 30, 36, "8% 53%, 16% 24%, 37% 8%, 65% 6%, 90% 22%, 100% 47%, 93% 70%, 73% 88%, 44% 99%, 18% 88%")]),
      part("eye", "eye", [poly(2, 4, 19, 16, "14% 55%, 22% 25%, 45% 5%, 74% 9%, 92% 31%, 91% 59%, 78% 83%, 46% 96%, 19% 84%")]),
      part("mouth", "mouth", [poly(2, 23, 14, 10, "4% 63%, 19% 48%, 37% 42%, 58% 48%, 80% 55%, 99% 65%, 77% 77%, 54% 82%, 31% 79%, 10% 72%")]),
      part("shell", "shell", [poly(30, 18, 59, 57, "13% 8%, 39% 0%, 66% 3%, 89% 15%, 100% 39%, 98% 66%, 84% 89%, 59% 100%, 28% 97%, 6% 80%, 0% 54%, 3% 28%")]),
      part("front flippers", "front flippers", [poly(34, 2, 40, 22, "4% 57%, 15% 28%, 38% 3%, 74% 8%, 100% 31%, 86% 58%, 58% 82%, 24% 99%"), poly(39, 62, 29, 36, "6% 10%, 38% 0%, 75% 8%, 100% 32%, 94% 59%, 72% 84%, 39% 100%, 11% 83%, 0% 48%")]),
      part("back flippers", "back flippers", [poly(76, 22, 19, 18, "4% 53%, 30% 16%, 66% 1%, 96% 23%, 100% 61%, 74% 93%, 33% 100%, 7% 81%"), poly(75, 68, 24, 20, "1% 44%, 23% 12%, 59% 0%, 95% 21%, 100% 58%, 74% 90%, 31% 100%, 5% 80%")]),
      part("tail", "tail", [poly(84, 21, 12, 12, "10% 60%, 41% 8%, 88% 20%, 100% 60%, 81% 100%, 30% 94%")])
    ]
  },
  {
    id: "octopus", name: "Octopus", emoji: "🐙", x: 37, y: 24, image: "book_octopus.png", ratio: "1844 / 1597",
    parts: [
      part("mantle", "mantle", [poly(42, 0, 46, 39, "12% 100%, 3% 80%, 0% 49%, 6% 20%, 23% 2%, 53% 0%, 80% 7%, 96% 26%, 100% 53%, 95% 80%, 85% 100%")]),
      part("eyes", "eyes", [poly(37, 26, 24, 15, "3% 58%, 13% 20%, 36% 3%, 63% 7%, 84% 27%, 97% 59%, 87% 86%, 61% 100%, 30% 96%, 11% 79%")]),
      part("mouth", "mouth", [poly(42, 43, 16, 10, "9% 56%, 25% 22%, 58% 8%, 89% 27%, 97% 62%, 76% 90%, 39% 100%, 14% 82%")]),
      part("left arms", "left arms", [poly(0, 38, 34, 52, "7% 13%, 21% 0%, 43% 7%, 51% 28%, 42% 48%, 23% 67%, 7% 92%, 0% 100%, 0% 54%") , poly(18, 52, 22, 32, "30% 0%, 57% 10%, 77% 30%, 83% 55%, 72% 84%, 49% 100%, 20% 87%, 6% 59%, 12% 27%")]),
      part("middle arms", "middle arms", [poly(34, 53, 38, 43, "17% 0%, 46% 4%, 75% 18%, 93% 40%, 100% 70%, 84% 94%, 54% 100%, 27% 95%, 9% 75%, 0% 42%")]),
      part("right arms", "right arms", [poly(69, 40, 30, 48, "0% 31%, 12% 10%, 36% 0%, 62% 10%, 82% 30%, 98% 63%, 99% 100%, 75% 90%, 55% 63%, 40% 40%, 16% 41%")])
    ]
  },
  {
    id: "giant_clam", name: "Giant Clam", emoji: "🦪", x: 62, y: 24, image: "book_giant_clam.png", ratio: "1844 / 1568",
    parts: [
      part("top shell", "top shell", [poly(8, 2, 84, 28, "0% 79%, 10% 25%, 22% 8%, 38% 0%, 51% 10%, 65% 0%, 80% 9%, 92% 24%, 100% 79%, 82% 71%, 67% 54%, 50% 64%, 32% 54%, 17% 70%")]),
      part("bottom shell", "bottom shell", [poly(5, 54, 88, 36, "7% 0%, 24% 12%, 40% 28%, 52% 24%, 64% 12%, 82% 0%, 100% 30%, 94% 68%, 78% 100%, 50% 88%, 22% 100%, 3% 72%, 0% 34%")]),
      part("eyes", "eyes", [poly(36, 43, 30, 18, "4% 62%, 14% 24%, 34% 5%, 64% 3%, 89% 20%, 100% 56%, 92% 81%, 67% 98%, 37% 100%, 11% 85%")]),
      part("mouth", "mouth", [poly(29, 67, 40, 16, "4% 60%, 18% 33%, 40% 17%, 61% 15%, 82% 28%, 100% 58%, 83% 82%, 58% 95%, 34% 100%, 11% 84%")]),
      part("ridges", "ridges", [poly(4, 2, 92, 40, "0% 58%, 7% 28%, 17% 8%, 30% 0%, 43% 12%, 54% 0%, 65% 11%, 76% 0%, 89% 11%, 100% 36%, 98% 63%, 82% 53%, 68% 34%, 53% 46%, 39% 34%, 23% 53%, 8% 62%")])
    ]
  },
  {
    id: "starfish", name: "Starfish", emoji: "⭐", x: 85, y: 28, image: "book_starfish.png", ratio: "1802 / 1773",
    parts: [
      part("top arm", "top arm", [poly(39, 0, 25, 32, "46% 0%, 66% 18%, 82% 47%, 72% 88%, 48% 100%, 27% 85%, 18% 48%, 31% 18%")]),
      part("left arm", "left arm", [poly(4, 22, 33, 27, "0% 49%, 23% 15%, 61% 0%, 100% 16%, 80% 52%, 48% 78%, 17% 100%")]),
      part("right arm", "right arm", [poly(62, 24, 33, 26, "0% 19%, 40% 0%, 79% 14%, 100% 51%, 81% 90%, 47% 78%, 14% 55%")]),
      part("bottom left arm", "bottom left arm", [poly(20, 62, 25, 34, "18% 0%, 50% 11%, 74% 35%, 100% 77%, 77% 100%, 39% 93%, 7% 71%, 0% 34%")]),
      part("bottom right arm", "bottom right arm", [poly(59, 62, 25, 34, "0% 77%, 23% 35%, 50% 11%, 82% 0%, 100% 34%, 92% 71%, 60% 93%, 23% 100%")]),
      part("center body", "center body", [poly(28, 25, 44, 43, "16% 13%, 42% 0%, 71% 8%, 93% 29%, 100% 56%, 88% 84%, 61% 100%, 28% 95%, 7% 73%, 0% 42%")]),
      part("mouth", "mouth", [poly(39, 47, 20, 12, "16% 65%, 28% 28%, 52% 0%, 79% 27%, 87% 63%, 73% 92%, 42% 100%, 22% 83%")])
    ]
  },
  {
    id: "seahorse", name: "Seahorse", emoji: "🐴", x: 18, y: 60, image: "book_seahorse.png", ratio: "982 / 2020",
    parts: [
      part("crown", "crown", [poly(19, 0, 24, 10, "2% 78%, 10% 35%, 25% 7%, 39% 33%, 55% 0%, 71% 36%, 85% 9%, 100% 34%, 96% 72%, 74% 100%, 54% 83%, 31% 100%, 14% 84%")]),
      part("eye", "eye", [poly(26, 5, 18, 12, "8% 62%, 21% 22%, 42% 2%, 70% 9%, 91% 32%, 96% 62%, 81% 89%, 52% 100%, 25% 90%")]),
      part("snout", "snout", [poly(54, 18, 34, 14, "0% 49%, 18% 18%, 61% 8%, 100% 27%, 98% 76%, 56% 95%, 17% 84%")]),
      part("neck", "neck", [poly(31, 23, 24, 16, "17% 2%, 57% 0%, 91% 24%, 87% 76%, 51% 100%, 15% 81%, 0% 41%")]),
      part("belly", "belly", [poly(28, 36, 48, 32, "11% 6%, 39% 0%, 65% 8%, 86% 26%, 99% 56%, 96% 82%, 76% 98%, 43% 100%, 16% 88%, 1% 62%")]),
      part("fin", "fin", [poly(2, 44, 36, 18, "0% 46%, 20% 9%, 59% 0%, 100% 33%, 85% 73%, 49% 100%, 12% 82%")]),
      part("tail", "tail", [poly(40, 78, 50, 20, "7% 20%, 31% 0%, 65% 1%, 92% 19%, 100% 52%, 87% 86%, 57% 100%, 25% 91%, 3% 66%")])
    ]
  },
  {
    id: "shark", name: "Shark", emoji: "🦈", x: 43, y: 60, image: "book_shark.png", ratio: "1929 / 1629",
    parts: [
      part("tail", "tail", [poly(0, 34, 24, 30, "3% 56%, 25% 18%, 55% 2%, 83% 6%, 100% 24%, 89% 50%, 98% 79%, 83% 97%, 52% 88%, 27% 73%")]),
      part("dorsal fin", "dorsal fin", [poly(47, 0, 20, 25, "2% 98%, 16% 52%, 33% 20%, 55% 0%, 79% 18%, 100% 72%, 74% 86%, 42% 94%")]),
      part("side fin", "side fin", [poly(74, 65, 20, 21, "0% 52%, 18% 17%, 45% 1%, 76% 12%, 100% 52%, 73% 88%, 38% 100%, 10% 81%")]),
      part("eye", "eye", [poly(69, 22, 11, 10, "14% 63%, 24% 22%, 51% 2%, 80% 16%, 96% 50%, 82% 83%, 48% 100%, 20% 83%")]),
      part("mouth", "mouth", [poly(68, 49, 28, 12, "4% 64%, 14% 27%, 39% 9%, 67% 0%, 93% 15%, 100% 53%, 89% 87%, 62% 100%, 32% 97%, 10% 84%")]),
      part("teeth", "teeth", [poly(69, 46, 23, 18, "4% 26%, 21% 1%, 38% 22%, 55% 0%, 73% 22%, 89% 3%, 97% 40%, 87% 71%, 69% 95%, 43% 100%, 22% 80%, 8% 58%")]),
      part("gills", "gills", [poly(51, 30, 14, 18, "17% 1%, 44% 12%, 58% 32%, 70% 59%, 58% 87%, 36% 100%, 15% 83%, 0% 48%")]),
      part("body", "body", [poly(21, 14, 58, 55, "1% 66%, 6% 35%, 18% 13%, 40% 1%, 69% 1%, 93% 15%, 100% 44%, 93% 74%, 75% 92%, 46% 100%, 18% 94%, 4% 80%")])
    ]
  },
  {
    id: "crab", name: "Crab", emoji: "🦀", x: 68, y: 61, image: "book_crab.png", ratio: "1932 / 1542",
    parts: [
      part("left claw", "left claw", [poly(0, 12, 28, 38, "4% 67%, 12% 24%, 34% 1%, 61% 0%, 86% 20%, 100% 53%, 84% 76%, 57% 92%, 30% 100%, 10% 86%")]),
      part("right claw", "right claw", [poly(72, 12, 28, 38, "0% 53%, 14% 20%, 39% 0%, 66% 1%, 88% 24%, 96% 67%, 90% 86%, 70% 100%, 43% 92%, 16% 76%")]),
      part("eyes", "eyes", [poly(37, 0, 27, 23, "8% 69%, 18% 26%, 38% 4%, 63% 0%, 84% 18%, 96% 54%, 87% 84%, 60% 100%, 31% 95%, 13% 82%")]),
      part("shell", "shell", [poly(28, 34, 43, 37, "4% 57%, 11% 20%, 33% 0%, 67% 0%, 89% 18%, 96% 56%, 87% 84%, 64% 100%, 35% 99%, 12% 84%")]),
      part("left legs", "left legs", [poly(0, 54, 31, 37, "0% 45%, 12% 17%, 37% 0%, 65% 14%, 88% 39%, 100% 72%, 75% 90%, 40% 100%, 10% 86%")]),
      part("right legs", "right legs", [poly(68, 54, 31, 37, "0% 72%, 12% 39%, 35% 14%, 63% 0%, 88% 17%, 100% 45%, 90% 86%, 60% 100%, 25% 90%")])
    ]
  },
  {
    id: "hammerhead_shark", name: "Hammerhead Shark", emoji: "🦈", x: 88, y: 61, image: "book_hammerhead_shark.png", ratio: "1631 / 2109",
    parts: [
      part("hammer head", "hammer head", [poly(18, 0, 69, 22, "1% 54%, 10% 19%, 26% 0%, 74% 0%, 91% 17%, 100% 54%, 90% 86%, 72% 100%, 27% 100%, 10% 84%")]),
      part("left eye", "left eye", [poly(14, 2, 18, 12, "11% 68%, 23% 27%, 48% 2%, 75% 13%, 92% 48%, 83% 82%, 51% 100%, 20% 88%")]),
      part("right eye", "right eye", [poly(72, 2, 18, 12, "7% 48%, 24% 13%, 52% 2%, 77% 27%, 89% 68%, 80% 88%, 49% 100%, 17% 82%")]),
      part("mouth", "mouth", [poly(39, 12, 26, 10, "8% 64%, 18% 28%, 43% 7%, 71% 4%, 93% 25%, 100% 62%, 88% 88%, 64% 100%, 34% 96%, 12% 83%")]),
      part("gills", "gills", [poly(56, 28, 13, 14, "18% 2%, 47% 11%, 63% 34%, 74% 61%, 59% 91%, 35% 100%, 12% 84%, 0% 47%")]),
      part("dorsal fin", "dorsal fin", [poly(60, 52, 28, 17, "0% 98%, 10% 45%, 34% 3%, 63% 0%, 87% 18%, 100% 61%, 83% 81%, 45% 95%")]),
      part("side fin", "side fin", [poly(39, 55, 20, 15, "0% 57%, 20% 14%, 49% 0%, 79% 16%, 100% 58%, 77% 92%, 42% 100%, 15% 80%")]),
      part("tail", "tail", [poly(7, 80, 44, 18, "4% 53%, 23% 21%, 56% 0%, 88% 9%, 100% 43%, 89% 79%, 56% 100%, 24% 86%, 7% 71%")])
    ]
  },
  {
    id: "fish", name: "Fish", emoji: "🐟", x: 30, y: 84, image: "book_fish.png", ratio: "1918 / 1223",
    parts: [
      part("tail", "tail", [poly(0, 18, 27, 41, "0% 49%, 18% 17%, 53% 0%, 88% 14%, 100% 50%, 89% 86%, 53% 100%, 18% 83%")]),
      part("dorsal fin", "dorsal fin", [poly(34, 8, 22, 18, "0% 100%, 18% 54%, 37% 18%, 58% 0%, 79% 18%, 100% 74%, 72% 86%, 36% 95%")]),
      part("side fin", "side fin", [poly(38, 32, 30, 26, "0% 55%, 15% 23%, 42% 0%, 77% 8%, 100% 44%, 87% 79%, 51% 100%, 17% 85%")]),
      part("eye", "eye", [poly(74, 11, 16, 19, "13% 67%, 24% 26%, 44% 2%, 70% 6%, 89% 27%, 96% 58%, 86% 86%, 60% 100%, 28% 94%")]),
      part("mouth", "mouth", [poly(78, 52, 18, 16, "8% 58%, 18% 24%, 40% 8%, 69% 6%, 91% 25%, 100% 60%, 86% 88%, 54% 100%, 24% 89%")]),
      part("body", "body", [poly(24, 8, 58, 70, "0% 49%, 7% 18%, 25% 0%, 71% 0%, 93% 18%, 100% 51%, 94% 82%, 70% 100%, 26% 98%, 7% 81%")]),
      part("scales", "scales", [poly(29, 17, 44, 46, "5% 54%, 12% 21%, 30% 3%, 63% 0%, 89% 17%, 98% 48%, 91% 81%, 67% 97%, 34% 100%, 12% 83%")])
    ]
  },
  {
    id: "shrimp", name: "Shrimp", emoji: "🦐", x: 56, y: 86, image: "book_shrimp.png", ratio: "1725 / 1878",
    parts: [
      part("left claw", "left claw", [poly(2, 3, 30, 31, "4% 73%, 11% 31%, 32% 4%, 59% 0%, 86% 20%, 100% 55%, 82% 77%, 58% 91%, 29% 100%, 10% 88%")]),
      part("right claw", "right claw", [poly(63, 0, 30, 31, "0% 55%, 14% 20%, 41% 0%, 68% 4%, 89% 31%, 96% 73%, 90% 88%, 71% 100%, 42% 91%, 18% 77%")]),
      part("antennae", "antennae", [poly(28, 0, 18, 28, "44% 100%, 37% 68%, 29% 43%, 17% 20%, 0% 0%, 27% 7%, 48% 28%, 60% 57%, 69% 85%, 64% 100%"), poly(42, 0, 18, 28, "38% 100%, 34% 82%, 39% 56%, 46% 28%, 57% 7%, 83% 0%, 67% 20%, 55% 43%, 46% 68%, 40% 100%")]),
      part("eyes", "eyes", [poly(31, 28, 31, 18, "7% 59%, 16% 23%, 34% 4%, 62% 0%, 88% 20%, 100% 55%, 91% 84%, 65% 100%, 34% 96%, 12% 83%")]),
      part("body", "body", [poly(22, 26, 42, 36, "8% 22%, 35% 0%, 63% 3%, 90% 22%, 100% 53%, 92% 82%, 68% 100%, 34% 98%, 9% 79%, 0% 49%")]),
      part("legs", "legs", [poly(12, 52, 28, 25, "0% 51%, 18% 15%, 45% 0%, 78% 10%, 100% 42%, 82% 81%, 45% 100%, 12% 86%"), poly(63, 48, 28, 25, "0% 41%, 22% 10%, 55% 0%, 82% 15%, 100% 51%, 88% 86%, 55% 100%, 18% 81%")]),
      part("tail", "tail", [poly(45, 80, 34, 18, "4% 47%, 20% 14%, 50% 0%, 82% 13%, 100% 48%, 83% 84%, 49% 100%, 18% 84%")])
    ]
  }
];


const PRACTICE_LEVELS = [
  {
    id: "level_1_friends",
    title: "Level 1: Ocean Friends",
    badge: "🐢",
    description: "Head, eyes, shell, tail, mouth.",
    rounds: 7,
    reward: { pearls: 4, shells: 1 },
    items: [
      { animal: "turtle", parts: ["head", "eye", "shell", "tail"] },
      { animal: "fish", parts: ["eye", "mouth", "tail"] },
      { animal: "seahorse", parts: ["eye", "snout", "tail"] }
    ]
  },
  {
    id: "level_2_fins_tails",
    title: "Level 2: Fins and Tails",
    badge: "🐟",
    description: "Fins, tails, flippers.",
    rounds: 8,
    reward: { pearls: 5, shells: 1 },
    items: [
      { animal: "turtle", parts: ["front flippers", "back flippers", "tail"] },
      { animal: "shark", parts: ["tail", "dorsal fin", "side fin"] },
      { animal: "fish", parts: ["tail", "dorsal fin", "side fin"] },
      { animal: "seahorse", parts: ["fin", "tail"] }
    ]
  },
  {
    id: "level_3_faces",
    title: "Level 3: Ocean Faces",
    badge: "😊",
    description: "Eyes, mouths, teeth, gills.",
    rounds: 9,
    reward: { pearls: 6, shells: 1 },
    items: [
      { animal: "octopus", parts: ["eyes", "mouth"] },
      { animal: "shark", parts: ["eye", "mouth", "teeth", "gills"] },
      { animal: "hammerhead_shark", parts: ["left eye", "right eye", "mouth", "gills"] },
      { animal: "seahorse", parts: ["eye", "snout"] },
      { animal: "fish", parts: ["eye", "mouth"] }
    ]
  },
  {
    id: "level_4_arms_claws",
    title: "Level 4: Arms, Legs, and Claws",
    badge: "🦀",
    description: "Claws, legs, octopus arms.",
    rounds: 10,
    reward: { pearls: 7, shells: 2 },
    items: [
      { animal: "crab", parts: ["left claw", "right claw", "left legs", "right legs", "eyes", "shell"] },
      { animal: "shrimp", parts: ["left claw", "right claw", "antennae", "legs", "tail"] },
      { animal: "octopus", parts: ["left arms", "middle arms", "right arms"] }
    ]
  },
  {
    id: "level_5_shapes",
    title: "Level 5: Special Shapes",
    badge: "⭐",
    description: "Starfish, clam, hammerhead.",
    rounds: 11,
    reward: { pearls: 8, shells: 2, goldenBubbles: 1 },
    items: [
      { animal: "starfish", parts: ["top arm", "left arm", "right arm", "bottom left arm", "bottom right arm", "center body", "mouth"] },
      { animal: "giant_clam", parts: ["top shell", "bottom shell", "eyes", "mouth", "ridges"] },
      { animal: "hammerhead_shark", parts: ["hammer head", "dorsal fin", "side fin", "tail"] }
    ]
  },
  {
    id: "level_6_big_mix",
    title: "Level 6: Big Ocean Mix",
    badge: "👑",
    description: "Mixed animals every time.",
    rounds: 12,
    reward: { pearls: 10, shells: 2, goldenBubbles: 2 },
    items: [
      { animal: "turtle" },
      { animal: "octopus" },
      { animal: "giant_clam" },
      { animal: "starfish" },
      { animal: "seahorse" },
      { animal: "shark" },
      { animal: "crab" },
      { animal: "hammerhead_shark" },
      { animal: "fish" },
      { animal: "shrimp" }
    ]
  }
];

const EXAM_LEVELS = [
  {
    id: "exam_1_easy",
    title: "Exam 1: Little Ocean Star",
    badge: "⭐",
    description: "Easy body parts.",
    rounds: 8,
    pass: 5,
    reward: { pearls: 6, shells: 1, crowns: 1 },
    items: [
      { animal: "turtle", parts: ["head", "eye", "shell", "tail"] },
      { animal: "fish", parts: ["eye", "mouth", "tail"] },
      { animal: "seahorse", parts: ["eye", "snout", "tail"] }
    ]
  },
  {
    id: "exam_2_swimmer",
    title: "Exam 2: Ocean Swimmer",
    badge: "🐬",
    description: "Fins, tails, flippers.",
    rounds: 10,
    pass: 7,
    reward: { pearls: 8, shells: 1, crowns: 1 },
    items: [
      { animal: "turtle", parts: ["front flippers", "back flippers", "tail", "shell"] },
      { animal: "shark", parts: ["tail", "dorsal fin", "side fin", "gills"] },
      { animal: "fish", parts: ["tail", "dorsal fin", "side fin", "scales"] },
      { animal: "seahorse", parts: ["fin", "tail", "belly"] }
    ]
  },
  {
    id: "exam_3_faces_claws",
    title: "Exam 3: Faces and Claws",
    badge: "🦀",
    description: "Faces, claws, legs, arms.",
    rounds: 12,
    pass: 8,
    reward: { pearls: 10, shells: 2, goldenBubbles: 1, crowns: 1 },
    items: [
      { animal: "octopus", parts: ["mantle", "eyes", "mouth", "left arms", "middle arms", "right arms"] },
      { animal: "crab", parts: ["left claw", "right claw", "eyes", "shell", "left legs", "right legs"] },
      { animal: "shrimp", parts: ["left claw", "right claw", "antennae", "eyes", "legs", "tail"] },
      { animal: "shark", parts: ["eye", "mouth", "teeth", "gills"] }
    ]
  },
  {
    id: "exam_4_special",
    title: "Exam 4: Special Ocean Shapes",
    badge: "🦪",
    description: "Special ocean shapes.",
    rounds: 12,
    pass: 8,
    reward: { pearls: 12, shells: 2, goldenBubbles: 1, crowns: 1 },
    items: [
      { animal: "giant_clam", parts: ["top shell", "bottom shell", "eyes", "mouth", "ridges"] },
      { animal: "starfish", parts: ["top arm", "left arm", "right arm", "bottom left arm", "bottom right arm", "center body"] },
      { animal: "hammerhead_shark", parts: ["hammer head", "left eye", "right eye", "mouth", "dorsal fin", "side fin", "tail"] }
    ]
  },
  {
    id: "exam_5_big_final",
    title: "Exam 5: Big Ocean Crown",
    badge: "👑",
    description: "Final mixed challenge.",
    rounds: 15,
    pass: 10,
    reward: { pearls: 15, shells: 3, goldenBubbles: 2, crowns: 2 },
    items: [
      { animal: "turtle" },
      { animal: "octopus" },
      { animal: "giant_clam" },
      { animal: "starfish" },
      { animal: "seahorse" },
      { animal: "shark" },
      { animal: "crab" },
      { animal: "hammerhead_shark" },
      { animal: "fish" },
      { animal: "shrimp" }
    ]
  }
];

function animalById(id) {
  return ANIMALS.find(animal => animal.id === id);
}

function buildQuestionPool(level) {
  const pool = [];
  for (const item of level.items) {
    const animal = animalById(item.animal);
    if (!animal) continue;
    const allowed = item.parts?.length ? item.parts : animal.parts.map(p => p.id);
    for (const partId of allowed) {
      const partItem = animal.parts.find(p => p.id === partId);
      if (partItem) pool.push({ animal, part: partItem });
    }
  }
  return shuffle(pool);
}

function buildQuestionQueue(level) {
  const pool = buildQuestionPool(level);
  if (!pool.length) return [];
  const queue = [];
  while (queue.length < level.rounds) {
    queue.push(...shuffle(pool));
  }
  return queue.slice(0, level.rounds);
}

function applyReward(progress, reward = {}) {
  progress.pearls += reward.pearls || 0;
  progress.shells += reward.shells || 0;
  progress.goldenBubbles += reward.goldenBubbles || 0;
  progress.crowns += reward.crowns || 0;
}


function levelAnimalIds(level) {
  return [...new Set((level?.items || []).map(item => item.animal))];
}

function buildAnimalQuestionQueue(animal, level = null, count = 5) {
  const levelItem = level?.items?.find(item => item.animal === animal.id);
  const allowed = levelItem?.parts?.length ? levelItem.parts : animal.parts.map(p => p.id);
  const partItems = allowed.map(id => animal.parts.find(p => p.id === id)).filter(Boolean);
  const source = partItems.length ? partItems : animal.parts;
  const queue = [];
  while (queue.length < count) queue.push(...shuffle(source));
  return queue.slice(0, count).map(part => ({ animal, part }));
}

const app = {
  root: $("#app"),
  screen: "menu",
  mode: "practice",
  deviceMode: defaultDeviceMode(),
  player: { x: 50, y: 50 },
  progress: loadProgress(),
  currentAnimal: ANIMALS[0],
  currentPart: null,
  currentPracticeLevel: null,
  currentExamLevel: null,
  activeOceanAnimalIds: [],
  completedOceanAnimals: {},
  currentAnimalQueue: [],
  animalQuestionIndex: 0,
  mapReturnMessage: "",
  autoOpenLock: false,
  oceanQuestionTotal: 0,
  practiceQueue: [],
  practiceIndex: 0,
  attempts: 0,
  sessionCorrect: 0,
  examQuestions: [],
  examIndex: 0,
  examScore: 0,
  voices: [],
  femaleVoice: null,
  wrongStreak: 0,
  fullscreenAccepted: false,
  answerBusy: false,
  init() {
    this.setupResponsiveViewport();
    this.applyDeviceMode();
    this.refreshVoices();
    if (window.speechSynthesis?.addEventListener) {
      window.speechSynthesis.addEventListener("voiceschanged", () => this.refreshVoices());
    }
    document.addEventListener("fullscreenchange", () => this.syncFullscreenLock());
    this.renderMenu();
    this.bindGlobalKeys();
    this.syncFullscreenLock();
  },
  setupResponsiveViewport() {
    const updateViewport = () => {
      const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      document.documentElement.style.setProperty("--real-vh", `${vh * 0.01}px`);
      document.documentElement.style.setProperty("--real-vw", `${vw * 0.01}px`);
      document.body.dataset.orientation = vw > vh ? "landscape" : "portrait";
      document.body.dataset.viewportSize = vw <= 380 ? "tiny" : vw <= 520 ? "phone" : vw <= 900 ? "tablet" : "desktop";
    };
    updateViewport();
    window.addEventListener("resize", updateViewport, { passive: true });
    window.addEventListener("orientationchange", () => setTimeout(updateViewport, 160), { passive: true });
  },
  refreshVoices() {
    this.voices = window.speechSynthesis?.getVoices?.() || [];
    const profile = selectedVoiceAvatar();
    const englishVoices = this.voices.filter(v => (v.lang || "").toLowerCase().startsWith("en"));

    const scoreVoice = (voice) => {
      const name = `${voice.name || ""} ${voice.voiceURI || ""}`.toLowerCase();
      let score = 0;

      profile.prefer.forEach((token, index) => {
        if (name.includes(token)) score += 80 - index * 5;
      });

      if (profile.accent.toLowerCase().includes("american") && (voice.lang || "").toLowerCase().startsWith("en-us")) score += 22;
      if (profile.accent.toLowerCase().includes("english") && (voice.lang || "").toLowerCase().startsWith("en-gb")) score += 22;
      if (profile.accent.toLowerCase().includes("latina") && (voice.lang || "").toLowerCase().startsWith("en-us")) score += 16;

      ["natural", "neural", "premium", "enhanced", "online"].forEach(token => {
        if (name.includes(token)) score += 18;
      });

      ["samantha", "ava", "jenny", "aria", "zira", "serena", "emma", "sonia", "amy", "google us english", "google uk english female"].forEach(token => {
        if (name.includes(token)) score += 18;
      });

      ["male", "daniel", "david", "mark", "george", "fred", "alex"].forEach(token => {
        if (name.includes(token)) score -= 40;
      });

      return score;
    };

    this.femaleVoice = englishVoices.sort((a, b) => scoreVoice(b) - scoreVoice(a))[0] || null;
    this.renderVoiceAvatarsIfOpen?.();
  },
  isFullscreen() {
    return !!document.fullscreenElement || this.fullscreenAccepted;
  },
  async requestFullscreen() {
    const el = document.documentElement;
    if (document.fullscreenElement || this.fullscreenAccepted) return true;
    try {
      if (el.requestFullscreen) await el.requestFullscreen();
      else this.fullscreenAccepted = true;
      if (!document.fullscreenElement && !el.requestFullscreen) this.fullscreenAccepted = true;
      return true;
    } catch (_) {
      this.fullscreenAccepted = true;
      return false;
    } finally {
      setTimeout(() => this.syncFullscreenLock(), 60);
    }
  },
  syncFullscreenLock() {
    const existing = $("#fullscreenLock");
    if (this.isFullscreen()) {
      existing?.remove();
      return;
    }
    if (existing) return;
    const lock = document.createElement("div");
    lock.id = "fullscreenLock";
    lock.className = "fullscreen-lock";
    lock.innerHTML = `
      <div class="fullscreen-card">
        <div class="fullscreen-icon">🫧</div>
        <h2>Full Screen Mode</h2>
        <p>This game is designed to be played in full screen.</p>
        <p class="small-note">Tap the button below to continue in a big, beautiful ocean view.</p>
        <button class="btn primary" id="enterFullscreenBtn">⛶ Enter Full Screen</button>
      </div>
    `;
    document.body.appendChild(lock);
    $("#enterFullscreenBtn", lock).addEventListener("click", async () => {
      await this.requestFullscreen();
      this.syncFullscreenLock();
    });
  },
  speak(text, opts = {}) {
    return new Promise((resolve) => {
      if (!window.speechSynthesis) {
        setTimeout(resolve, opts.fallbackMs ?? VOICE_PROFILE.minimumFallbackMs);
        return;
      }

      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "en-US";
      const profile = selectedVoiceAvatar();
      utter.pitch = opts.pitch ?? profile.pitch ?? VOICE_PROFILE.pitch;
      utter.rate = opts.rate ?? profile.rate ?? VOICE_PROFILE.rate;
      utter.volume = opts.volume ?? VOICE_PROFILE.volume;
      if (this.femaleVoice) utter.voice = this.femaleVoice;

      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        resolve();
      };

      utter.onend = finish;
      utter.onerror = finish;
      window.speechSynthesis.cancel();

      setTimeout(() => {
        try { window.speechSynthesis.speak(utter); } catch (_) { finish(); }
      }, opts.preDelay ?? 120);

      setTimeout(
        finish,
        opts.maxMs ?? Math.max(VOICE_PROFILE.minimumFallbackMs, text.length * VOICE_PROFILE.fallbackMsPerChar)
      );
    });
  },
  pause(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },
  chirp(type = "good") {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const gain = ctx.createGain();
      gain.connect(ctx.destination);
      gain.gain.value = 0.055;
      const notes = type === "good" ? [523.25, 659.25, 783.99] : [392, 440];
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(gain);
        const start = ctx.currentTime + i * 0.11;
        osc.start(start);
        osc.stop(start + 0.12);
      });
      setTimeout(() => ctx.close(), 700);
    } catch (_) {}
  },
  save() {
    this.progress.lastPlayed = new Date().toISOString();
    localStorage.setItem("sophies-ocean-adventure-progress", JSON.stringify(this.progress));
  },
  render(html) {
    this.applyDeviceMode();
    this.root.innerHTML = html;
    this.syncFullscreenLock();
  },
  applyDeviceMode() {
    document.body.dataset.deviceMode = this.deviceMode;
  },
  setDeviceMode(mode) {
    if (!DEVICE_MODES[mode]) return;
    this.deviceMode = mode;
    safeStore.set(DEVICE_MODE_KEY, mode);
    this.applyDeviceMode();
    this.renderDevicePickerIfOpen();
  },
  deviceModeLabel() {
    return DEVICE_MODES[this.deviceMode]?.label || DEVICE_MODES.pc.label;
  },
  renderDevicePickerIfOpen() {
    const grid = $("#deviceModeGrid");
    if (!grid) return;
    grid.innerHTML = Object.values(DEVICE_MODES).map(mode => `
      <button class="device-card ${mode.id === this.deviceMode ? "selected" : ""}" data-device-mode="${mode.id}" type="button" aria-pressed="${mode.id === this.deviceMode}">
        <span class="device-icon">${mode.icon}</span>
        <strong>${mode.title}</strong>
        <small>${mode.description}</small>
      </button>
    `).join("");
    const note = $("#deviceModeNote");
    if (note) {
      note.textContent = this.deviceMode === "touch"
        ? "Selected: Cellphone / Tablet. The ocean map will show movement buttons."
        : "Selected: PC. The ocean map will use keyboard arrows.";
    }
  },
  bindDevicePicker() {
    const grid = $("#deviceModeGrid");
    if (!grid) return;
    this.renderDevicePickerIfOpen();
    grid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-device-mode]");
      if (!card) return;
      this.setDeviceMode(card.dataset.deviceMode);
      const message = this.deviceMode === "touch"
        ? "Cellphone and tablet version selected. Use the big arrows to swim."
        : "PC version selected. Use the keyboard arrows to swim.";
      this.speak(message);
    });
  },
  commonTopbar(title = "") {
    return `
      <div class="topbar">
        <div class="badges">
          <span class="badge">🐚 ${this.progress.shells}</span>
          <span class="badge">🫧 ${this.progress.goldenBubbles}</span>
          <span class="badge">⚪ ${this.progress.pearls}</span>
          <span class="badge">⭐ ${this.progress.starfish}</span>
          <span class="badge">👑 ${this.progress.crowns}</span>
        </div>
        <div class="badges">
          ${title ? `<span class="badge">${title}</span>` : ""}
          <span class="badge device-badge">${DEVICE_MODES[this.deviceMode]?.icon || "💻"} ${this.deviceModeLabel()}</span>
          <button class="btn small" data-action="repeat">🔊 Listen</button>
          <button class="btn small" data-action="fullscreen">⛶ Full Screen</button>
          <button class="btn small" data-screen="menu">🏠 Home</button>
        </div>
      </div>
    `;
  },
  renderVoiceAvatarsIfOpen() {
    const grid = $("#voiceAvatarGrid");
    if (!grid) return;

    const selected = selectedVoiceAvatar();
    grid.innerHTML = VOICE_AVATARS.map(profile => `
      <button class="voice-avatar ${profile.id === selected.id ? "selected" : ""}" data-voice-avatar="${profile.id}" type="button" aria-label="${profile.name} voice">
        <span class="voice-avatar-emoji">${profile.emoji}</span>
        <strong>${profile.name}</strong>
        <small>${profile.accent}</small>
      </button>
    `).join("");
  },
  bindVoicePicker() {
    const grid = $("#voiceAvatarGrid");
    const test = $("#testVoiceBtn");
    if (!grid) return;

    this.renderVoiceAvatarsIfOpen();

    grid.addEventListener("click", (event) => {
      const card = event.target.closest("[data-voice-avatar]");
      if (!card) return;
      safeStore.set("sophies-ocean-voice-avatar", card.dataset.voiceAvatar);
      this.refreshVoices();
      this.renderVoiceAvatarsIfOpen();
      const profile = selectedVoiceAvatar();
      this.speak(`Hi Sophie, I am ${profile.name}. I will help you learn with a sweet ocean voice.`);
    });

    test?.addEventListener("click", () => {
      const profile = selectedVoiceAvatar();
      this.speak(`Hi Sophie, Topito. I am ${profile.name}. Let's learn together calmly.`);
    });
  },
  bindSharedButtons(repeatMessage) {
    $$('[data-screen="menu"]').forEach(btn => btn.addEventListener("click", () => this.renderMenu()));
    $$('[data-action="repeat"]').forEach(btn => btn.addEventListener("click", () => this.speak(repeatMessage)));
    $$('[data-action="fullscreen"]').forEach(btn => btn.addEventListener("click", async () => {
      await this.requestFullscreen();
      this.syncFullscreenLock();
    }));
  },
  async startMode(mode) {
    this.mode = mode;
    await this.requestFullscreen();
    if (mode === "exam") this.renderExamLevels();
    else this.renderPracticeLevels();
  },
  currentOceanConfig() {
    return this.mode === "exam" ? this.currentExamLevel : this.currentPracticeLevel;
  },
  currentOceanAnimals() {
    if (!this.activeOceanAnimalIds.length) return ANIMALS;
    return ANIMALS.filter(animal => this.activeOceanAnimalIds.includes(animal.id));
  },
  resetOceanSession() {
    this.completedOceanAnimals = {};
    this.currentAnimalQueue = [];
    this.animalQuestionIndex = 0;
    this.mapReturnMessage = "";
    this.autoOpenLock = false;
    this.player = { x: 50, y: 50 };
    if (this.mode === "exam") this.examScore = 0;
  },
  openOcean(level, mode) {
    this.mode = mode;
    if (mode === "exam") {
      this.currentExamLevel = level;
      this.currentPracticeLevel = null;
    } else {
      this.currentPracticeLevel = level;
      this.currentExamLevel = null;
    }
    this.activeOceanAnimalIds = levelAnimalIds(level);
    this.oceanQuestionTotal = this.activeOceanAnimalIds.length * 5;
    this.resetOceanSession();
    this.renderMap();
  },
  finishAnimalVisit() {
    this.completedOceanAnimals[this.currentAnimal.id] = true;
    this.currentAnimalQueue = [];
    this.animalQuestionIndex = 0;
    const completed = Object.keys(this.completedOceanAnimals).length;
    const total = this.activeOceanAnimalIds.length;
    if (completed >= total) {
      if (this.mode === "exam") this.finishExam();
      else this.finishPracticeLevel();
      return;
    }
    this.player = { x: 50, y: 50 };
    this.mapReturnMessage = `Great job, ${nickname()}! You finished ${this.currentAnimal.name}. Swim to another animal.`;
    this.renderMap();
  },
  renderMenu() {
    this.screen = "menu";
    this.render(`
      <section class="screen ocean-bubbles">
        <div class="panel menu-card">
          <div class="logo-animal book-logo" aria-hidden="true">
            <img src="book_seahorse.png" alt="" />
          </div>
          <div>
            <h1>Sophie's Ocean Adventure</h1>
            <p class="subtitle">A sweet sea-learning game with real book animals</p>
            <p class="story">
              Explore a bright aqua ocean, meet sea animals from Sophie's coloring book, learn their body parts in English, and collect lovely treasures.
            </p>
            <div class="feature-list">
              <span class="feature-pill">Book illustrations</span>
              <span class="feature-pill">Calm female voice</span>
              <span class="feature-pill">Full screen play</span>
              <span class="feature-pill">Practice + Exam</span>
            </div>
            <div class="device-panel">
              <label>Choose how Sophie will play before starting:</label>
              <div id="deviceModeGrid" class="device-mode-grid" aria-label="Device version selection"></div>
              <small id="deviceModeNote"></small>
            </div>
            <div class="voice-panel">
              <label>Choose a sweet little voice avatar:</label>
              <div id="voiceAvatarGrid" class="voice-avatar-grid" aria-label="Voice avatar selection"></div>
              <button class="btn small" id="testVoiceBtn" type="button">🔊 Test selected avatar</button>
              <small>Choose one of 5 sweet female voice avatars. Each one uses the best soft voice available on this device.</small>
            </div>
            <div class="btn-row" style="margin-top:18px">
              <button class="btn primary" data-start="practice">🐬 Practice Levels</button>
              <button class="btn sun" data-start="exam">👑 Exam Levels</button>
              <button class="btn coral" data-screen="treasure">🎁 Treasure Room</button>
            </div>
            <p class="story fullscreen-note">
              This game plays in full screen. Choose PC for keyboard arrows, or Cellphone / Tablet for on-screen movement buttons.
            </p>
          </div>
        </div>
      </section>
    `);
    this.bindDevicePicker();
    this.bindVoicePicker();
    $$('[data-start]').forEach(btn => btn.addEventListener("click", () => this.startMode(btn.dataset.start)));
    $('[data-screen="treasure"]').addEventListener("click", async () => {
      await this.requestFullscreen();
      this.renderTreasureRoom();
    });
    this.speak("Hi Sophie! Welcome to your ocean adventure.");
  },
  renderPracticeLevels() {
    this.screen = "practiceLevels";
    this.render(`
      <section class="screen ocean-bubbles compact-screen">
        ${this.commonTopbar("Practice Oceans")}
        <div class="panel level-panel fit-panel">
          <h1>Practice Oceans</h1>
          <p class="subtitle compact-subtitle">Choose an ocean. Sophie will swim, find animals, answer 5 questions for each animal, and then return to the ocean map.</p>
          <div class="level-grid">
            ${PRACTICE_LEVELS.map(level => `
              <button class="level-card" data-practice-level="${level.id}">
                <span class="level-badge">${level.badge}</span>
                <strong>${level.title.replace(/^Level \d+: /, "")}</strong>
                <span>${level.description}</span>
                <small>${levelAnimalIds(level).length} animals · 5 questions each</small>
              </button>
            `).join("")}
          </div>
          <div class="btn-row compact-actions">
            <button class="btn" data-screen="map">🌊 Ocean</button>
            <button class="btn sun" data-screen="exam-levels">👑 Exam Oceans</button>
          </div>
        </div>
      </section>
    `);
    $$("[data-practice-level]").forEach(btn => btn.addEventListener("click", () => this.startPracticeLevel(btn.dataset.practiceLevel)));
    $$('[data-screen="menu"]').forEach(btn => btn.addEventListener("click", () => this.renderMenu()));
    $$('[data-screen="exam-levels"]').forEach(btn => btn.addEventListener("click", () => this.renderExamLevels()));
    this.bindSharedButtons("Choose a practice ocean, Sophie.");
    this.speak("Choose a practice ocean, Sophie.");
  },
  startPracticeLevel(levelId) {
    const level = PRACTICE_LEVELS.find(item => item.id === levelId) || PRACTICE_LEVELS[0];
    this.openOcean(level, "practice");
  },
  finishPracticeLevel() {
    const level = this.currentPracticeLevel || PRACTICE_LEVELS[0];
    applyReward(this.progress, level.reward);
    this.progress.starfish += 1;
    this.save();
    this.render(`
      <section class="screen ocean-bubbles">
        <div class="panel exam-summary fit-panel">
          <h1>🎉 Ocean Complete!</h1>
          <p class="subtitle">${level.badge} ${level.title}</p>
          <div class="prompt-card">${Object.keys(this.completedOceanAnimals).length} animals explored</div>
          <p class="story">Sophie swam across the whole ocean, visited the animals, and answered 5 questions for each one.</p>
          <div class="family-cheer">${familyLine()}</div>
          <div class="btn-row" style="justify-content:center">
            <button class="btn primary" data-screen="practice-levels">🐬 More Practice Oceans</button>
            <button class="btn sun" data-screen="exam-levels">👑 Exam Oceans</button>
            <button class="btn coral" data-screen="treasure">🎁 Treasure Room</button>
            <button class="btn" data-screen="menu">🏠 Home</button>
          </div>
        </div>
        ${celebrationMarkup(Object.keys(this.completedOceanAnimals).length * 5, this.oceanQuestionTotal)}
      </section>
    `);
    $('[data-screen="practice-levels"]')?.addEventListener("click", () => this.renderPracticeLevels());
    $('[data-screen="exam-levels"]')?.addEventListener("click", () => this.renderExamLevels());
    $('[data-screen="treasure"]')?.addEventListener("click", () => this.renderTreasureRoom());
    $('[data-screen="menu"]')?.addEventListener("click", () => this.renderMenu());
    this.speak(`Ocean complete. Wonderful work, ${nickname()}!`);
  },
  renderExamLevels() {
    this.screen = "examLevels";
    this.render(`
      <section class="screen ocean-bubbles compact-screen">
        ${this.commonTopbar("Exam Oceans")}
        <div class="panel level-panel fit-panel">
          <h1>Exam Oceans</h1>
          <p class="subtitle compact-subtitle">Choose an ocean exam. Sophie swims in the ocean, meets the animals, and answers 5 exam questions for each animal.</p>
          <div class="level-grid exam-level-grid">
            ${EXAM_LEVELS.map(level => `
              <button class="level-card exam-card" data-exam-level="${level.id}">
                <span class="level-badge">${level.badge}</span>
                <strong>${level.title.replace(/^Exam \d+: /, "")}</strong>
                <span>${level.description}</span>
                <small>${levelAnimalIds(level).length} animals · 5 questions each</small>
              </button>
            `).join("")}
          </div>
          <div class="btn-row compact-actions">
            <button class="btn primary" data-screen="practice-levels">🐬 Practice Oceans</button>
            <button class="btn" data-screen="menu">🏠 Home</button>
          </div>
        </div>
      </section>
    `);
    $$("[data-exam-level]").forEach(btn => btn.addEventListener("click", () => this.startExamLevel(btn.dataset.examLevel)));
    $$('[data-screen="practice-levels"]').forEach(btn => btn.addEventListener("click", () => this.renderPracticeLevels()));
    $$('[data-screen="menu"]').forEach(btn => btn.addEventListener("click", () => this.renderMenu()));
    this.bindSharedButtons("Choose an exam ocean, Sophie.");
    this.speak("Choose an exam ocean, Sophie.");
  },
  startExamLevel(levelId) {
    const level = EXAM_LEVELS.find(item => item.id === levelId) || EXAM_LEVELS[0];
    this.openOcean(level, "exam");
  },

  renderMap() {
    this.screen = "map";
    const level = this.currentOceanConfig();
    const animals = this.currentOceanAnimals();
    const completed = Object.keys(this.completedOceanAnimals).length;
    const title = level ? `${level.title}` : "Ocean Map";
    const helpMessage = this.mapReturnMessage || `Swim to an animal. When Sophie gets close, the questions will open automatically.`;
    this.render(`
      <section class="screen ocean-bubbles">
        ${this.commonTopbar(title)}
        <div class="game-area" id="mapArea" role="application" aria-label="Ocean map">
          <div class="map-sea ${this.mode === "exam" ? "exam-sea" : "practice-sea"}"></div>
          <div class="wave one"></div><div class="wave two"></div><div class="wave three"></div>
          ${animals.map(a => `
            <button class="zone image-zone${this.completedOceanAnimals[a.id] ? " done" : ""}" data-animal="${a.id}" style="left:${a.x}%;top:${a.y}%">
              <img class="zone-thumb" src="${a.image}" alt="" />
              <span>${a.name}</span>
              ${this.completedOceanAnimals[a.id] ? `<small>✓ done</small>` : `<small>5 questions</small>`}
            </button>
          `).join("")}
          <div class="player" id="player" style="left:${this.player.x}%;top:${this.player.y}%">👧</div>
          <div class="map-help">
            <div class="bubble-panel" id="nearestText">Move near an animal to begin.</div>
            <div class="bubble-panel device-help">${this.deviceMode === "touch" ? "Use ⬆️⬇️⬅️➡️ + Action" : "Use keyboard arrows + Space/Enter"}</div>
            <div class="bubble-panel">${completed}/${animals.length} animals completed in this ocean.</div>
          </div>
        </div>
        ${this.touchControls()}
      </section>
    `);
    this.updateNearest();
    $$('[data-animal]').forEach(btn => btn.addEventListener("click", () => this.openAnimal(btn.dataset.animal, this.mode)));
    this.bindTouchControls();
    this.bindSharedButtons(helpMessage);
    this.speak(helpMessage);
    this.mapReturnMessage = "";
  },

  touchControls() {
    return `
      <div class="touch-controls" aria-label="Touch movement controls">
        <button class="up" data-dir="up" aria-label="Up">⬆️</button>
        <button class="left" data-dir="left" aria-label="Left">⬅️</button>
        <button class="down" data-dir="down" aria-label="Down">⬇️</button>
        <button class="right" data-dir="right" aria-label="Right">➡️</button>
      </div>
      <div class="action-pad" aria-label="Touch action controls">
        <button data-touch-action="interact">⭐<br>Action</button>
        <button data-touch-action="help">🔊<br>Listen</button>
      </div>
    `;
  },
  bindTouchControls() {
    $$('[data-dir]').forEach(btn => {
      let interval = null;
      const move = () => this.movePlayer(btn.dataset.dir);
      btn.addEventListener("pointerdown", (e) => { e.preventDefault(); move(); interval = setInterval(move, 110); });
      ["pointerup", "pointerleave", "pointercancel"].forEach(type => btn.addEventListener(type, () => clearInterval(interval)));
    });
    $$('[data-touch-action="interact"]').forEach(btn => btn.addEventListener("click", () => this.interactNearest()));
    $$('[data-touch-action="help"]').forEach(btn => btn.addEventListener("click", () => this.speak(this.deviceMode === "touch" ? "Use the big arrow buttons to swim to an animal. Then press Action." : "Use the keyboard arrows to swim to an animal. Then press Space or Enter.")));
  },
  movePlayer(dir) {
    if (this.screen !== "map") return;
    const step = 3.5;
    if (dir === "left") this.player.x -= step;
    if (dir === "right") this.player.x += step;
    if (dir === "up") this.player.y -= step;
    if (dir === "down") this.player.y += step;
    this.player.x = clamp(this.player.x, 5, 95);
    this.player.y = clamp(this.player.y, 8, 92);
    const player = $("#player");
    if (player) { player.style.left = `${this.player.x}%`; player.style.top = `${this.player.y}%`; }
    this.updateNearest();
  },
  nearestAnimal() {
    let best = null;
    let bestDistance = Infinity;
    for (const animal of this.currentOceanAnimals()) {
      const dx = this.player.x - animal.x;
      const dy = this.player.y - animal.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < bestDistance) { best = animal; bestDistance = d; }
    }
    return { animal: best, distance: bestDistance };
  },
  updateNearest() {
    const { animal, distance } = this.nearestAnimal();
    if (!animal) return;
    $$('[data-animal]').forEach(btn => btn.classList.toggle("near", btn.dataset.animal === animal.id && distance < 13));
    const text = $("#nearestText");
    if (text) {
      text.innerHTML = this.completedOceanAnimals[animal.id]
        ? `${animal.emoji} ${animal.name} is done. Swim to another animal.`
        : distance < 13 ? `${animal.emoji} ${animal.name} is ready. Sophie is close!` : (this.deviceMode === "touch" ? `Use the big arrows to move near a sea animal.` : `Use the keyboard arrows to move near a sea animal.`);
    }
    if (distance < 10 && !this.completedOceanAnimals[animal.id] && !this.autoOpenLock) {
      this.autoOpenLock = true;
      setTimeout(() => {
        this.autoOpenLock = false;
        const current = this.nearestAnimal();
        if (this.screen === "map" && current.animal?.id === animal.id && current.distance < 10 && !this.completedOceanAnimals[animal.id]) {
          this.openAnimal(animal.id, this.mode);
        }
      }, 150);
    }
  },

  interactNearest() {
    if (this.screen !== "map") return;
    const { animal, distance } = this.nearestAnimal();
    if (animal && distance < 15 && !this.completedOceanAnimals[animal.id]) this.openAnimal(animal.id, this.mode);
    else this.speak("Swim a little closer.");
  },
  openAnimal(animalId, mode = "practice") {
    this.mode = mode;
    this.currentAnimal = ANIMALS.find(a => a.id === animalId) || ANIMALS[0];
    this.sessionCorrect = 0;
    const ocean = this.currentOceanConfig();
    this.currentAnimalQueue = buildAnimalQuestionQueue(this.currentAnimal, ocean, 5);
    this.animalQuestionIndex = 0;
    this.attempts = 0;
    if (mode === "exam") {
      this.examQuestions = this.currentAnimalQueue;
      this.examIndex = 0;
      this.nextExamQuestion(true);
    } else {
      this.nextQuestion();
      this.renderLesson();
    }
  },
  nextQuestion() {
    this.attempts = 0;
    if (this.currentAnimalQueue.length) {
      const q = this.currentAnimalQueue[this.animalQuestionIndex] || this.currentAnimalQueue[0];
      this.currentAnimal = q.animal;
      this.currentPart = q.part;
      return;
    }
    const unseen = this.currentAnimal.parts.filter(p => !this.progress.learned[`${this.currentAnimal.id}:${p.id}`]);
    this.currentPart = sample(unseen.length ? unseen : this.currentAnimal.parts);
  },
  renderLesson() {
    this.screen = "lesson";
    const animal = this.currentAnimal;
    const part = this.currentPart;
    this.render(`
      <section class="screen ocean-bubbles">
        ${this.commonTopbar(this.currentPracticeLevel ? `${this.currentPracticeLevel.title} · ${this.currentAnimal.name} · ${this.animalQuestionIndex + 1}/${this.currentAnimalQueue.length || 5}` : "Practice")}
        <div class="game-area">
          <div class="lesson-layout">
            ${bookAnimalStage(animal, part, true)}
            <aside class="lesson-panel">
              <h2 class="animal-title">${animal.emoji} ${animal.name}</h2>
              <div class="prompt-card" id="promptCard">Touch the ${part.name}.</div>
              <div class="feedback" id="feedback">${feedbackMarkup("Listen, look carefully, and try.")}</div>
              <div class="parts-note">${this.currentPracticeLevel ? `Answer the 5 questions for this animal. After that, Sophie returns to the ocean and keeps swimming.` : "First listen, then touch the glowing body part. After your answer, the voice will cheer you on before the next activity."}</div>
              <div class="word-list">
                ${animal.parts.map(p => `<span class="word-chip${p.id === part.id ? " active" : ""}">${p.name}</span>`).join("")}
              </div>
              <div class="btn-row">
                <button class="btn primary" data-action="repeat">🔊 Listen again</button>
                <button class="btn sun" data-action="hint">💡 Hint</button>
                <button class="btn" data-screen="map">🌊 Ocean</button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    `);
    this.bindLessonEvents();
    const voicePrompt = selectionPrompt(part.name);
    this.bindSharedButtons(voicePrompt);
    $$('[data-screen="map"]').forEach(btn => btn.addEventListener("click", () => this.renderMap()));
    $$('[data-action="hint"]').forEach(btn => btn.addEventListener("click", () => this.showHint(true)));
    this.speak(voicePrompt);
  },
  syncOverlayState(partId, className, add = true) {
    $$(`.hotspot-shape[data-part="${partId}"]`).forEach(el => el.classList.toggle(className, add));
    $$(`.hotspot[data-part="${partId}"]`).forEach(el => el.classList.toggle(className, add));
  },
  bindLessonEvents() {
    $$('.hotspot').forEach(el => {
      el.setAttribute("tabindex", "0");
      el.addEventListener("click", () => this.answerPart(el.dataset.part));
      el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") this.answerPart(el.dataset.part); });
      el.addEventListener("mouseenter", () => this.syncOverlayState(el.dataset.part, "hovering", true));
      el.addEventListener("mouseleave", () => this.syncOverlayState(el.dataset.part, "hovering", false));
      el.addEventListener("focus", () => this.syncOverlayState(el.dataset.part, "hovering", true));
      el.addEventListener("blur", () => this.syncOverlayState(el.dataset.part, "hovering", false));
    });
  },
  setHotspotsEnabled(enabled) {
    $$('.hotspot').forEach(el => {
      el.disabled = !enabled;
      el.classList.toggle("disabled", !enabled);
    });
  },
  async answerPart(partId) {
    if (!this.currentPart || this.answerBusy) return;
    this.answerBusy = true;
    this.setHotspotsEnabled(false);
    const target = this.currentPart.id;
    const feedback = $("#feedback");
    const clicked = $(`.hotspot[data-part="${partId}"]`);
    if (partId === target) {
      this.syncOverlayState(partId, "correct", true);
      const praise = personalize(sample(SWEET_PRAISE));
      this.wrongStreak = 0;
      feedback.className = "feedback good";
      feedback.innerHTML = feedbackMarkup(praise);
      this.chirp("good");
      this.addCorrectReward();
      this.showReward(sample(["🐚", "⚪", "⭐", "🫧", "🎈"]), praise);
      await this.speak(praise);
      await this.pause(420);
      this.answerBusy = false;
      if (this.mode === "exam") this.nextExamQuestion();
      else if (this.currentPracticeLevel && this.currentAnimalQueue.length) {
        this.animalQuestionIndex++;
        if (this.animalQuestionIndex >= this.currentAnimalQueue.length) this.finishAnimalVisit();
        else { this.nextQuestion(); this.renderLesson(); }
      }
      else { this.nextQuestion(); this.renderLesson(); }
    } else {
      if (clicked) this.syncOverlayState(partId, "wrong", true);
      this.attempts++;
      this.wrongStreak = (this.wrongStreak || 0) + 1;
      const support = personalize(sample(KIND_SUPPORT));
      const needsFamilySupport = this.attempts >= 2 || this.wrongStreak >= 3;
      const extra = needsFamilySupport ? familyLine() : "";
      const spokenSupport = extra ? `${support} ${extra}` : support;
      feedback.className = "feedback try";
      feedback.innerHTML = feedbackMarkup(support, extra);
      this.chirp("try");
      if (this.mode !== "exam" && this.attempts >= 2) this.showHint(false);
      setTimeout(() => this.syncOverlayState(partId, "wrong", false), 650);
      await this.speak(spokenSupport, { rate: 0.70, pitch: 1.02 });
      await this.pause(420);
      this.answerBusy = false;
      if (this.mode === "exam") this.nextExamQuestion();
      else this.setHotspotsEnabled(true);
    }
  },
  showHint(speak = true) {
    this.syncOverlayState(this.currentPart.id, "hint", true);
    if (speak) this.speak(`Look for the ${this.currentPart.name}. It is glowing now.`);
    setTimeout(() => this.syncOverlayState(this.currentPart.id, "hint", false), 2600);
  },
  addCorrectReward() {
    this.sessionCorrect++;
    this.progress.pearls++;
    this.progress.learned[`${this.currentAnimal.id}:${this.currentPart.id}`] = true;
    if (this.sessionCorrect % 3 === 0) this.progress.shells++;
    const animalComplete = this.currentAnimal.parts.every(p => this.progress.learned[`${this.currentAnimal.id}:${p.id}`]);
    const marker = `${this.currentAnimal.id}:complete`;
    if (animalComplete && !this.progress.learned[marker]) {
      this.progress.learned[marker] = true;
      this.progress.starfish++;
    }
    this.save();
  },
  showReward(symbol, message = "Great job!") {
    const stage = $("#animalStage") || $(".screen");
    if (!stage) return;
    const div = document.createElement("div");
    div.className = "big-cheer";
    const friend = sample(["🐬", "🐢", "🐙", "🐟", "🦀", "🦐"]);
    div.innerHTML = `
      <div class="big-cheer-balloons"><span>🎈</span><span>🫧</span><span>🎈</span><span>⭐</span><span>${symbol}</span></div>
      <div class="big-cheer-message"><span class="friend">${friend}</span>${message}</div>
    `;
    stage.appendChild(div);
    setTimeout(() => div.remove(), 2400);
  },
  startExam() {
    this.renderExamLevels();
  },
  nextExamQuestion(first = false) {
    if (!first) this.examIndex++;
    if (this.examIndex >= this.examQuestions.length) {
      this.completedOceanAnimals[this.currentAnimal.id] = true;
      const finished = Object.keys(this.completedOceanAnimals).length >= this.activeOceanAnimalIds.length;
      if (finished) return this.finishExam();
      this.player = { x: 50, y: 50 };
      this.mapReturnMessage = `Great work, ${nickname()}! You finished the ${this.currentAnimal.name} exam. Swim to the next animal.`;
      return this.renderMap();
    }
    const q = this.examQuestions[this.examIndex];
    this.currentAnimal = q.animal;
    this.currentPart = q.part;
    this.renderExamQuestion();
  },

  renderExamQuestion() {
    this.screen = "lesson";
    const animal = this.currentAnimal;
    const part = this.currentPart;
    this.render(`
      <section class="screen ocean-bubbles">
        ${this.commonTopbar(`${this.currentExamLevel ? this.currentExamLevel.title : "Ocean Exam"} · ${this.currentAnimal.name} · ${this.examIndex + 1}/${this.examQuestions.length}`)}
        <div class="game-area">
          <div class="lesson-layout">
            ${bookAnimalStage(animal, part, false)}
            <aside class="lesson-panel">
              <h2 class="animal-title">${animal.emoji} ${animal.name}</h2>
              <div class="prompt-card">Touch the ${part.name}.</div>
              <div class="feedback" id="feedback">${feedbackMarkup("You can do it, Sophie!")}</div>
              <div class="badge" style="text-align:center">⭐ Ocean Score: ${this.examScore}/${this.oceanQuestionTotal || this.examQuestions.length}<br><small>This animal: ${this.examIndex + 1}/${this.examQuestions.length}</small></div>
              <div class="word-list">${animal.parts.map(p => `<span class="word-chip${p.id === part.id ? " active" : ""}">${p.name}</span>`).join("")}</div>
              <div class="btn-row">
                <button class="btn primary" data-action="repeat">🔊 Listen again</button>
                <button class="btn" data-screen="map">🌊 Ocean</button>
              </div>
            </aside>
          </div>
        </div>
      </section>
    `);
    this.bindLessonEvents();
    const voicePrompt = selectionPrompt(part.name, this.examIndex + 1);
    this.bindSharedButtons(voicePrompt);
    $$('[data-screen="map"]').forEach(btn => btn.addEventListener("click", () => this.renderMap()));
    const originalAnswer = this.answerPart.bind(this);
    this.answerPart = (partId) => {
      const isCorrect = partId === this.currentPart.id;
      if (isCorrect) this.examScore++;
      originalAnswer(partId);
      this.answerPart = originalAnswer;
    };
    this.speak(voicePrompt);
  },
  finishExam() {
    const score = this.examScore;
    const total = this.oceanQuestionTotal || this.examQuestions.length;
    const level = this.currentExamLevel || EXAM_LEVELS[0];
    const passTarget = Math.max(1, Math.ceil(total * 0.7));
    const passed = score >= passTarget;
    this.progress.exams.push({ level: level.id, score, total, date: new Date().toISOString() });
    applyReward(this.progress, level.reward);
    if (!passed) this.progress.goldenBubbles += 1;
    this.save();
    this.render(`
      <section class="screen ocean-bubbles">
        <div class="panel exam-summary fit-panel">
          <h1>${passed ? "🎉 Ocean Exam Complete!" : "🌟 Ocean Exam Finished!"}</h1>
          <p class="subtitle">${level.badge} ${level.title}</p>
          <div class="prompt-card">⭐ ${score}/${total}</div>
          <p class="story">
            ${passed ? "Sophie finished the whole exam ocean and earned a new crown!" : "Sophie finished the ocean exam. She can practice more and try again later."}
          </p>
          <div class="family-cheer">${passed ? "Papa John and Mama Lizeth are so happy for you, Sophie!" : familyLine()}</div>
          <div class="btn-row" style="justify-content:center">
            <button class="btn primary" data-screen="practice-levels">🐬 Practice Oceans</button>
            <button class="btn sun" data-screen="exam-levels">👑 More Exam Oceans</button>
            <button class="btn coral" data-screen="treasure">🎁 Treasure Room</button>
            <button class="btn" data-screen="menu">🏠 Home</button>
          </div>
        </div>
        ${celebrationMarkup(score, total)}
      </section>
    `);
    $('[data-screen="practice-levels"]')?.addEventListener("click", () => this.renderPracticeLevels());
    $('[data-screen="exam-levels"]')?.addEventListener("click", () => this.renderExamLevels());
    $('[data-screen="treasure"]')?.addEventListener("click", () => this.renderTreasureRoom());
    $('[data-screen="menu"]')?.addEventListener("click", () => this.renderMenu());
    this.speak(passed ? `Ocean exam complete. Great job, ${nickname()}!` : `Good effort, ${nickname()}. Let's keep practicing.`);
  },

  renderTreasureRoom() {
    this.screen = "treasure";
    const rows = ANIMALS.map(a => {
      const learned = a.parts.filter(p => this.progress.learned[`${a.id}:${p.id}`]).length;
      return `<tr><td><img class="tiny-animal" src="${a.image}" alt="" /> ${a.name}</td><td>${learned}/${a.parts.length}</td><td>${learned === a.parts.length ? "⭐" : "🫧"}</td></tr>`;
    }).join("");
    this.render(`
      <section class="screen ocean-bubbles">
        <div class="panel">
          <h1>🎁 Sophie's Treasure Room</h1>
          <p class="subtitle">Every treasure celebrates learning.</p>
          <div class="treasure-grid">
            <div class="treasure-card"><span class="icon">⚪</span>Pearls<br>${this.progress.pearls}</div>
            <div class="treasure-card"><span class="icon">🐚</span>Shells<br>${this.progress.shells}</div>
            <div class="treasure-card"><span class="icon">⭐</span>Starfish<br>${this.progress.starfish}</div>
            <div class="treasure-card"><span class="icon">🫧</span>Golden bubbles<br>${this.progress.goldenBubbles}</div>
            <div class="treasure-card"><span class="icon">👑</span>Ocean crowns<br>${this.progress.crowns}</div>
          </div>
          <h2>Learning Progress</h2>
          <table class="progress-table">
            <thead><tr><th>Animal</th><th>Parts learned</th><th>Badge</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <div class="btn-row" style="margin-top:18px">
            <button class="btn primary" data-screen="practice-levels">🐬 Practice Levels</button>
            <button class="btn sun" data-start="exam">👑 Exam Levels</button>
            <button class="btn" data-screen="menu">🏠 Home</button>
            <button class="btn coral" data-reset="true">🧽 Reset progress</button>
          </div>
        </div>
      </section>
    `);
    $('[data-screen="practice-levels"]')?.addEventListener("click", () => this.renderPracticeLevels());
    $('[data-screen="map"]')?.addEventListener("click", () => this.renderMap());
    $('[data-screen="menu"]').addEventListener("click", () => this.renderMenu());
    $('[data-start="exam"]').addEventListener("click", () => this.startMode("exam"));
    $('[data-reset="true"]').addEventListener("click", () => {
      if (confirm("Reset Sophie's treasures and progress?")) {
        this.progress = structuredClone(DEFAULT_PROGRESS);
        this.save();
        this.renderTreasureRoom();
      }
    });
    this.speak("Welcome to your treasure room.");
  },
  bindGlobalKeys() {
    window.addEventListener("keydown", (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Enter"].includes(e.key)) e.preventDefault();
      if (this.screen === "map") {
        if (e.key === "ArrowLeft") this.movePlayer("left");
        if (e.key === "ArrowRight") this.movePlayer("right");
        if (e.key === "ArrowUp") this.movePlayer("up");
        if (e.key === "ArrowDown") this.movePlayer("down");
        if (e.key === " " || e.key === "Enter") this.interactNearest();
      }
      if (e.key?.toLowerCase() === "h" && this.screen === "lesson") {
        this.speak(`Touch the ${this.currentPart.name}.`);
      }
      if (e.key?.toLowerCase() === "f") {
        this.requestFullscreen();
      }
    });
  }
};

function loadProgress() {
  try {
    const raw = localStorage.getItem("sophies-ocean-adventure-progress");
    if (!raw) return structuredClone(DEFAULT_PROGRESS);
    return { ...structuredClone(DEFAULT_PROGRESS), ...JSON.parse(raw) };
  } catch (_) {
    return structuredClone(DEFAULT_PROGRESS);
  }
}

function svgShapeMarkup(spot, className) {
  if (spot.shape === "poly" && spot.points) {
    const pts = spot.points.split(",").map(pair => {
      const [px, py] = pair.trim().split(/\s+/).map(v => parseFloat(v));
      const x = spot.x + (spot.w * px / 100);
      const y = spot.y + (spot.h * py / 100);
      return `${x},${y}`;
    }).join(" ");
    return `<polygon class="${className}" data-part="${spot.part}" points="${pts}" />`;
  }
  const cx = spot.x + spot.w / 2;
  const cy = spot.y + spot.h / 2;
  const rx = spot.w / 2;
  const ry = spot.h / 2;
  return `<ellipse class="${className}" data-part="${spot.part}" cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" />`;
}

function bookAnimalStage(animal, currentPart = null, revealTarget = false) {
  const hotspots = animal.parts.flatMap(partItem => partItem.spots.map((sp, index) => ({ ...sp, part: partItem.id, label: partItem.name, index, isTarget: revealTarget && currentPart && currentPart.id === partItem.id })));
  return `
    <div class="animal-stage book-stage" id="animalStage">
      <div class="book-card" style="aspect-ratio:${animal.ratio}">
        <img class="book-animal" src="${animal.image}" alt="${animal.name}" draggable="false" />
        <svg class="hotspot-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          ${hotspots.map(spot => svgShapeMarkup(spot, `hotspot-shape ${spot.shape || "ellipse"} ${spot.isTarget ? "target-part" : ""}`)).join("")}
        </svg>
        <div class="hotspot-click-layer">
          ${hotspots.map(spot => `
            <button class="hotspot ${spot.shape || "ellipse"} ${spot.isTarget ? "target-part" : ""}" data-part="${spot.part}" aria-label="${spot.label}" title="${spot.label}"
              style="left:${spot.x}%;top:${spot.y}%;width:${spot.w}%;height:${spot.h}%;${spot.points ? `--clip-path: polygon(${spot.points});` : ""}"></button>
          `).join("")}
        </div>
      </div>
    </div>
  `;
}

function celebrationMarkup(score, total) {
  const balloons = ["🎈", "🎈", "🎈", "🫧", "⭐", "🐬", "🐢", "🐙", "🪸"];
  const cheerAnimals = [
    "🐬 Dolphin says: Great job, Sophie!",
    "🐢 Turtle says: Keep shining, Sophie!",
    "🐙 Octopus says: Wonderful learning!"
  ];
  return `
    <div class="celebration-layer">
      <div class="celebration-floaters">${Array.from({ length: 34 }, () => `<span style="left:${Math.random()*100}%; animation-delay:${Math.random()*1.6}s">${sample(balloons)}</span>`).join("")}</div>
      <div class="celebration-buddies">
        ${cheerAnimals.map(line => `<div class="cheer-bubble">${line}</div>`).join("")}
      </div>
      <div class="celebration-love">Papa John and Mama Lizeth love you and support you every day, Sophie!</div>
    </div>
  `;
}

window.addEventListener("load", () => app.init());
