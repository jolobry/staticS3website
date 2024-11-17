// Lista obrazków tła
const backgrounds = [
    'url("background1.png")',
    'url("background2.png")'
];

// Losowy wybór tła
const randomBackground = backgrounds[Math.floor(Math.random() * backgrounds.length)];

// Ustawienie tła
document.body.style.backgroundImage = randomBackground;
