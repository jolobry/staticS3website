// Tablica z obrazkami
const images = [
    'images/background1.png',
    'images/background2.png',
];

// Indeks aktualnego obrazka
let currentImageIndex = 0;

function changeBackgroundImage() {
    // Ustaw obrazek jako tło
    document.body.style.backgroundImage = `url('${images[currentImageIndex]}')`;

    // Przejdź do następnego obrazka, wróć do początku na końcu
    currentImageIndex = (currentImageIndex + 1) % images.length;
}

// Zmień obrazek natychmiast po załadowaniu strony
changeBackgroundImage();

// Zmieniaj obrazek co 10 sekund
setInterval(changeBackgroundImage, 10000);
