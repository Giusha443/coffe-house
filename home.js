const carousel = document.getElementById("carousel");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const progressBars = document.querySelectorAll(".progress-fill");
let currentIndex = 0;
const totalSlides = 3;
let autoplayInterval;
let progressInterval;
let isPaused = false;

function updateCarousel() {
  carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
  updateProgressBars();
}

function updateProgressBars() {
  progressBars.forEach((bar, index) => {
    if (index === currentIndex) {
      bar.style.width = "0%";
    } else if (index < currentIndex) {
      bar.style.width = "100%";
    } else {
      bar.style.width = "0%";
    }
  });
}

function startProgress() {
  let progress = 0;
  progressInterval = setInterval(() => {
    if (!isPaused) {
      progress += 1;
      progressBars[currentIndex].style.width = `${progress}%`;
      if (progress >= 100) {
        nextSlide();
      }
    }
  }, 50);
}

function nextSlide() {
  clearInterval(progressInterval);
  currentIndex = (currentIndex + 1) % totalSlides;
  updateCarousel();
  startProgress();
}

function prevSlide() {
  clearInterval(progressInterval);
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateCarousel();
  startProgress();
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", prevSlide);

carousel.addEventListener("mouseenter", () => {
  isPaused = true;
});

carousel.addEventListener("mouseleave", () => {
  isPaused = false;
});

let touchStartX = 0;
let touchEndX = 0;

carousel.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
  isPaused = true;
});

carousel.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
  isPaused = false;
});

function handleSwipe() {
  if (touchEndX < touchStartX - 50) {
    nextSlide();
  }
  if (touchEndX > touchStartX + 50) {
    prevSlide();
  }
}

startProgress();
