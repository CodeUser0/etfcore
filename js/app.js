const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");


menuBtn.addEventListener("click", (e) => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute(
    "class",
    isOpen ? "ri-close-line" : "ri-menu-3-line"
  );
});

navLinks.addEventListener("click", (e) => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-3-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

ScrollReveal().reveal(".header__content h1", {
  ...scrollRevealOption,
});
ScrollReveal().reveal("header form", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".service__card", {
  ...scrollRevealOption,
  interval: 500,
});

ScrollReveal().reveal(".experience__content .section__header", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".experience__content p", {
  ...scrollRevealOption,
  delay: 500,
});
ScrollReveal().reveal(".experience__btn", {
  ...scrollRevealOption,
  delay: 1000,
});
ScrollReveal().reveal(".experience__stats", {
  ...scrollRevealOption,
  delay: 1500,
});

document.addEventListener("DOMContentLoaded", function () {
  const swiper = new Swiper(".swiper", {
    slidesPerView: 2, // Number of slides visible at once
    spaceBetween: 20, // Spacing between slides
    loop: true, // Enable infinite scrolling

    pagination: {
      el: ".swiper-pagination",
      clickable: true, // Allows clicking to navigate
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    scrollbar: {
      el: ".swiper-scrollbar",
      draggable: true, // Allows dragging the scrollbar
    },
  });
});



ScrollReveal().reveal(".subscribe .section__header", {
  ...scrollRevealOption,
});
ScrollReveal().reveal(".subscribe form", {
  ...scrollRevealOption,
  delay: 500,
});
