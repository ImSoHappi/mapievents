// CODIGO OPEN NAVBAR //

const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const links = document.querySelectorAll(".nav-links li");
const marker = document.querySelector(".marker");

// CODIGO PANEL //
panel = document.querySelector("#mainbox");
closePanel = document.querySelector("#closePanel");

hamburger.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  links.forEach(link => {
    link.classList.toggle("fade");
  });
});




