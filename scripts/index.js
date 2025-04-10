document.addEventListener("DOMContentLoaded", function () {
    // Gestion du menu hamburger
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // Gestion des boutons de connexion et d'inscription
    document.querySelector(".button2").addEventListener("click", function () {
        window.location.href = "https://moumouh6.github.io/sign-in-/";
    });

    document.querySelector(".button3").addEventListener("click", function () {
        window.location.href = "https://moumouh6.github.io/Log-in/";
       
    });
    document.querySelector(".button1").addEventListener("click", function () {
        window.location.href = "https://moumouh6.github.io/Log-in/";
    });
});