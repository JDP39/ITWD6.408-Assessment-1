let slideIndex = 1;
let slideTimer;

function showSlide(index, automatic = false) {
    const slides = document.getElementsByClassName("mySlides");
    const dots = document.getElementsByClassName("dot");

    if (slides.length === 0) {
        return;
    }

    if (index > slides.length) {
        slideIndex = 1;
    } else if (index < 1) {
        slideIndex = slides.length;
    } else {
    slideIndex = index;
    }

    for (const slide of slides) {
        slide.style.opacity = "0";
        slide.style.pointerEvents = "none";
        slide.classList.remove("auto-fade");
    }

    for (const dot of dots) {
        dot.classList.remove("active");
    }

    slides[slideIndex - 1].style.opacity = "1";
    slides[slideIndex - 1].style.pointerEvents = "auto";
    if (automatic) {
        slides[slideIndex - 1].classList.add("auto-fade");
    }

    if (dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
}

function currentSlide(index) {
    showSlide(slideIndex = index, false);
    startSlideTimer();
}

function plusSlides(amount, automatic = false) {
    showSlide(slideIndex + amount, automatic);
    startSlideTimer();
}

function startSlideTimer() {
    window.clearTimeout(slideTimer);
    slideTimer = window.setTimeout(() => {
        plusSlides(1, true);
    }, 4000);
}

document.addEventListener("DOMContentLoaded", () => {
    showSlide(slideIndex);
    startSlideTimer();
});

window.currentSlide = currentSlide;
window.plusSlides = plusSlides;
