

document.addEventListener("DOMContentLoaded", function () {
    // Function to handle 'Créer' button click
    document.querySelectorAll(".create").forEach(button => {
        button.addEventListener("click", function () {
            alert("Un nouveau compte a été créé !");
        });
    });

    // Function to handle 'Modifier' button click
    document.querySelectorAll(".modify").forEach(button => {
        button.addEventListener("click", function () {
            alert("Modification en cours !");
        });
    });

    // Function to handle 'Supprimer' button click
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", function () {
            if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
                this.closest("tr").remove();
                alert("Élément supprimé !");
            }
        });
    });
});

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




// agrandissement de limage 

document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments nécessaires
    const searchInput = document.querySelector(".search-bar input");
    const courses = document.querySelectorAll(".course-card");
    const domainFilters = document.querySelectorAll(".category-filter input");


    // Ajouter les événements pour déclencher le filtrage
    searchInput.addEventListener("input", filterCourses);
    domainFilters.forEach(filter => filter.addEventListener("change", filterCourses));

    // Appliquer le filtre au chargement de la page
    filterCourses();

    // Fonction pour gérer l'affichage de la barre de navigation
    function toggleNav() {
        document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
    }

    // Sélection de l'image de profil
    const profilePic = document.querySelector(".profile");

    // Ajouter un événement au clic sur l'image de profil
    profilePic.addEventListener("click", function () {
        // Créer une div pour l'overlay sombre
        const overlay = document.createElement("div");
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

        // Créer une image agrandie
        const enlargedImg = document.createElement("img");
        enlargedImg.src = profilePic.src;
        enlargedImg.style.width = "300px";
        enlargedImg.style.height = "300px";
        enlargedImg.style.borderRadius = "50%";
        enlargedImg.style.border = "5px solid white";
        enlargedImg.style.cursor = "pointer";

        // Ajouter l'image agrandie à l'overlay
        overlay.appendChild(enlargedImg);
        document.body.appendChild(overlay);

        // Ajouter un événement pour fermer l'image agrandie en cliquant sur l'overlay
        overlay.addEventListener("click", function () {
            document.body.removeChild(overlay);
        });
    });
});
