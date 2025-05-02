

document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const searchInput = document.querySelector(".group .input") || document.querySelector(".search-bar input");
    const courses = document.querySelectorAll(".course-card");
    const domainFilters = document.querySelectorAll(".radio-inputs input");
   

    // Fonction de filtrage
    function filterCourses() {
        const searchValue = searchInput?.value.toLowerCase().trim() || "";
        const selectedDomain = document.querySelector(".radio-inputs input:checked")?.nextElementSibling.textContent.trim() || "Tous";

        courses.forEach(course => {
            const courseCategory = course.querySelector(".department")?.textContent.trim() || "";
            const courseText = course.textContent.toLowerCase();
            const matchesSearch = courseText.includes(searchValue);
            const matchesDomain = (selectedDomain === "Tous" || courseCategory === selectedDomain);

            course.style.display = (matchesSearch && matchesDomain) ? "block" : "none";
        });
    }

    // Événements de recherche et de sélection
    if (searchInput) searchInput.addEventListener("input", filterCourses);
    domainFilters.forEach(filter => filter.addEventListener("change", filterCourses));

    // Appliquer le filtre au chargement
    filterCourses();

    // Gestion de la Sidebar
  

    // Fermer la sidebar en cliquant en dehors
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });

    // Agrandissement de l'image de profil
    const profilePic = document.querySelector(".profile");
    if (profilePic) {
        profilePic.addEventListener("click", function () {
            if (document.getElementById("profile-overlay")) return;

            const overlay = document.createElement("div");
            overlay.id = "profile-overlay";
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.background = "rgba(0, 0, 0, 0.7)";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.zIndex = "1000";

            const enlargedImg = document.createElement("img");
            enlargedImg.src = profilePic.src;
            enlargedImg.style.width = "200px";
            enlargedImg.style.height = "200px";
            enlargedImg.style.borderRadius = "50%";
            enlargedImg.style.border = "5px solid white";
            enlargedImg.style.cursor = "pointer";

            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", function () {
                document.body.removeChild(overlay);
            });
        });
    }

    // Désactiver les boutons "site-mzl"
    document.querySelectorAll(".site-mzl").forEach(button => {
        button.addEventListener("click", () => {
            alert("Cette page n'est pas accessible pour le moment !");
        });
    });
});
document.addEventListener("DOMContentLoaded", function () {
  

    // Gestion de la Recherche
    const searchInput = document.getElementById("searchInput");
    const courses = document.querySelectorAll(".course-card");

    function filterCourses() {
        const searchValue = searchInput.value.toLowerCase().trim();

        courses.forEach(course => {
            const courseText = course.textContent.toLowerCase();
            course.style.display = courseText.includes(searchValue) ? "block" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterCourses);
    }
});








   

  

function scrollToCourses() {
    const coursesSection = document.querySelector(".course-container");
    if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const filterSelect = document.getElementById("course-filter");
    const courses = document.querySelectorAll(".course-card");

    filterSelect.addEventListener("change", function () {
        const selectedCategory = filterSelect.value.toLowerCase(); // Récupère la valeur sélectionnée

        courses.forEach(course => {
            const category = course.querySelector(".department").textContent.trim().toLowerCase();
            
            // Afficher ou masquer en fonction de la sélection
            if (selectedCategory === "all" || category === selectedCategory) {
                course.style.display = "block"; // Afficher
            } else {
                course.style.display = "none"; // Masquer
            }
        });
    });
});
// pour see all
function showAllCourses() {
    const courses = document.querySelectorAll(".course-card");

    courses.forEach(course => {
        course.style.display = "block"; // Affiche tous les cours
    });

    // Réinitialiser le filtre à "All Courses"
    const filterSelect = document.getElementById("course-filter");
    if (filterSelect) {
        filterSelect.value = "all";
    }
}
function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
  }
 
  document.addEventListener("DOMContentLoaded", function () {
    const icon = document.querySelector("i.fa-users");
    const dot = icon ? icon.querySelector(".notification-dot") : null;

    const hasPending = localStorage.getItem("hasPendingAccountRequests") === "true";

    if (dot) {
        dot.style.display = hasPending ? "block" : "none";
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer les demandes depuis localStorage
    function getRequestsFromStorage() {
        const stored = localStorage.getItem('formationRequests');
        return stored ? JSON.parse(stored) : {};
    }

    // Fonction pour vérifier s'il y a des demandes de formation
    function checkFormationRequests() {
        const notificationDot = document.getElementById('formationNotificationDot');
        const requests = getRequestsFromStorage();
        
        // Vérifie si au moins un département a des demandes
        const hasRequests = Object.values(requests).some(count => count > 0);
        
        // Affiche ou cache la notification en fonction des demandes
        if (notificationDot) {
            notificationDot.style.display = hasRequests ? 'block' : 'none';
        }
    }

    // Vérifie les demandes au chargement de la page
    checkFormationRequests();

    // Vérifie périodiquement les nouvelles demandes
    setInterval(checkFormationRequests, 1000);
}); 