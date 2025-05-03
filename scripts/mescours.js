document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const searchInput = document.querySelector(".group .input") || document.querySelector(".search-bar input");
    const courses = document.querySelectorAll(".course-card");
    const domainFilters = document.querySelectorAll(".radio-inputs input");
   

    // Fonction de filtrage
   

    // Gestion de la Sidebar
  

    // Fermer la sidebar en cliquant en dehors
 

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
    // Sélection des éléments
    const searchInput = document.querySelector(".search-wrapper .input") || document.querySelector(".search-bar input");
    const courses = document.querySelectorAll(".course-card");
    const domainFilters = document.querySelectorAll(".radio-inputs input");
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");

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

});




document.addEventListener("DOMContentLoaded", function () {
    // Gestion de la Sidebar
  

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
    document.querySelectorAll('.course-card').forEach(card => {
      card.addEventListener('click', function () {
        // Build the course object based on the card's content or data attributes
        const courseObj = {
          domain: this.querySelector('.department')?.textContent || 'IT',
          image: this.querySelector('img')?.getAttribute('src') || '',
          title: this.querySelector('h3')?.textContent || '',
          teacher: this.querySelector('p')?.textContent.replace('By ', '') || '',
          description: 'Description à compléter...', // You may want to add a data-description attribute
          field: this.querySelector('.department')?.textContent || '',
          resources: {
            record: null,
            pptx: null,
            pdf: null,
            extraLinks: [],
            quiz: null
          }
        };
        localStorage.setItem('selectedCourse', JSON.stringify(courseObj));
        window.location.href = 'prof-course-mescours.html';
      });
    });
});
