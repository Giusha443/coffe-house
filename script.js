const menuIcon = document.getElementById("menuIcon");
const burgerMenu = document.getElementById("burgerMenu");
const burgerLinks = burgerMenu.querySelectorAll("a");

menuIcon.addEventListener("click", () => {
  menuIcon.classList.toggle("active");
  burgerMenu.classList.toggle("active");
});

burgerLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuIcon.classList.remove("active");
    burgerMenu.classList.remove("active");
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    menuIcon.classList.remove("active");
    burgerMenu.classList.remove("active");
  }
});
