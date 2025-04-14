document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const searchInput = document.querySelector(".search-wrapper .input");
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
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", function () {
            sidebar.classList.toggle("active");
        });
    }

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
    // Gestion de la Sidebar
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("toggleSidebar");
    const closeBtn = document.getElementById("closeSidebar");

    if (openBtn && closeBtn && sidebar) {
        openBtn.addEventListener("click", function () {
            sidebar.classList.add("active");
        });

        closeBtn.addEventListener("click", function () {
            sidebar.classList.remove("active");
        });

        document.addEventListener("click", function (event) {
            if (!sidebar.contains(event.target) && !openBtn.contains(event.target)) {
                sidebar.classList.remove("active");
            }
        });
    }

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
document.getElementById("toggleSidebar").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("hidden");
});

document.getElementById("closeSidebar").addEventListener("click", function () {
    document.getElementById("sidebar").classList.add("hidden");
});
document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".sidebar-menu li a");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
});
document.getElementById('toggleSidebar').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
});
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
}
document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebar");
    const closeBtn = document.getElementById("closeSidebar");

    // **🔹 FERME LA SIDEBAR AU CHARGEMENT 🔹**
    sidebar.classList.remove("open"); // Assure que la sidebar est fermée par défaut

    // **🔹 GESTION DE LA SIDEBAR 🔹**
    function toggleSidebar() {
        sidebar.classList.toggle("open");
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
    }

    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleSidebar);
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", closeSidebar);
    }

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
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll(".sidebar a");

    links.forEach(link => {
        link.addEventListener("click", function () {
            links.forEach(l => l.classList.remove("active"));
            this.classList.add("active");

            // Sauvegarde l'état dans le stockage local
            localStorage.setItem("activeLink", this.getAttribute("href"));
        });
    });

    // Restaure l'état après un rechargement
    const activeLink = localStorage.getItem("activeLink");
    if (activeLink) {
        links.forEach(link => {
            if (link.getAttribute("href") === activeLink) {
                link.classList.add("active");
            }
        });
    }
});
