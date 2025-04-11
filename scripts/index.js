document.addEventListener("DOMContentLoaded", function () {
    // Gestion du menu hamburger
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // // Gestion des boutons de connexion et d'inscription
    document.querySelector(".button2").addEventListener("click", function () {
        window.location.href = "pages/Sign-in.html";
    });

    document.querySelector(".button3").addEventListener("click", function () {
        window.location.href = "pages/log-in.html";
       
    });
    document.querySelector(".button1").addEventListener("click", function () {
        window.location.href = "pages/log-in.html";
    });
});
