// side barre

    // Fonction pour gérer l'affichage de la barre de navigation
function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
}

document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const languageSelect = document.getElementById("languageSelect");

    function toggleSection(sectionId) {
        const section = document.getElementById(sectionId);
        const arrow = document.querySelector(`[data-target="${sectionId}"] .arrow`);

        if (section.classList.contains("hidden")) {
            section.classList.remove("hidden");
            section.style.display = "block";
            arrow.style.transform = "rotate(180deg)";
        } else {
            section.classList.add("hidden");
            section.style.display = "none";
            arrow.style.transform = "rotate(0deg)";
        }
    }

    // Appliquer toggleSection sur chaque option
    document.querySelectorAll(".option").forEach(option => {
        option.addEventListener("click", () => {
            const sectionId = option.getAttribute("data-target");
            toggleSection(sectionId);
        });
    });
    
    

    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", darkModeToggle.checked ? "enabled" : "disabled");
    });

    languageSelect.value = localStorage.getItem("language") || "fr";
    languageSelect.addEventListener("change", () => {
        localStorage.setItem("language", languageSelect.value);
        alert("Langue changée en " + languageSelect.value);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    // Charger les infos stockées
    document.getElementById("nom").value = localStorage.getItem("nom") || "";
    document.getElementById("prenom").value = localStorage.getItem("prenom") || "";
    document.getElementById("email").value = localStorage.getItem("email") || "";
    document.getElementById("telephone").value = localStorage.getItem("telephone") || "";
    document.getElementById("password").value = localStorage.getItem("password") || "";

    // Fonction pour sauvegarder les informations
    window.saveUserInfo = function() {
        const nom = document.getElementById("nom").value;
        const prenom = document.getElementById("prenom").value;
        const email = document.getElementById("email").value;
        const telephone = document.getElementById("telephone").value;
        const password = document.getElementById("password").value;

        localStorage.setItem("nom", nom);
        localStorage.setItem("prenom", prenom);
        localStorage.setItem("email", email);
        localStorage.setItem("telephone", telephone);
        localStorage.setItem("password", password);

        alert("Informations enregistrées !");
    };


});


const togglePassword = document.querySelector(".toggle-password");
const passwordInput = document.getElementById("password");
const emailInput = document.getElementById("email");

if (togglePassword) {
    togglePassword.addEventListener("click", function () {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const icon = document.querySelector("i.fa-users");
    const dot = icon ? icon.querySelector(".notification-dot") : null;

    const hasPending = localStorage.getItem("hasPendingAccountRequests") === "true";

    if (dot) {
        dot.style.display = hasPending ? "block" : "none";
    }
});
