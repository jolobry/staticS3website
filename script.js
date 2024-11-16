// Lista obrazków tła
const backgrounds = [
    'url("background.png")',
    'url("background1.jpg")'
];

// Losowy wybór tła
const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

// Ustawienie tła
document.body.style.backgroundImage = randomBackground;
