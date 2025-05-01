document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const searchInput = document.querySelector(".search-wrapper .input");
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








document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    // Assure que la sidebar est fermée par défaut

    // **🔹 GESTION DE LA SIDEBAR 🔹**
  

  

    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            closeSidebar();
        }
    });
});
function scrollToCourses() {
    const coursesSection = document.querySelector(".course-container");
    if (coursesSection) {
        coursesSection.scrollIntoView({ behavior: "smooth" });
    }
}


    // Restaure l'état après un rechargement
 


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
        window.location.href = 'prof-course-mondep.html';
      });
    });
});