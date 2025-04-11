document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");

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

   
});
