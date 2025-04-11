
// Function to open/close the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    // Check the current width of the sidebar and adjust it
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; // Close the sidebar
    } else {
        sidebar.style.width = "250px"; // Open the sidebar
    }
}































document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const searchInput = document.querySelector(".group .input") || document.querySelector(".search-bar input");
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

    // Gestion de la Sidebar
    // if (toggleBtn && sidebar) {
    //     toggleBtn.addEventListener("click", function () {
    //         sidebar.classList.toggle("active");
    //     });
    // }

    // Fermer la sidebar en cliquant en dehors
    // document.addEventListener("click", function (event) {
    //     if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
    //         sidebar.classList.remove("active");
    //     }
    // });

    
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
    const profilePic = document.querySelector(".profile-pic");

    if (profilePic) {
        profilePic.addEventListener("click", function () {
            // Vérifier si l'overlay existe déjà
            if (document.getElementById("profile-overlay")) return;

            // Création de l'overlay
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

            // Image agrandie
            const enlargedImg = document.createElement("img");
            enlargedImg.src = profilePic.src;
            enlargedImg.style.width = "200px";
            enlargedImg.style.height = "200px";
            enlargedImg.style.borderRadius = "50%";
            enlargedImg.style.border = "5px solid white";
            enlargedImg.style.cursor = "pointer";

            // Ajout de l'image à l'overlay
            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);

            // Fermer l'overlay au clic
            overlay.addEventListener("click", function () {
                document.body.removeChild(overlay);
            });
        });
    }
});
