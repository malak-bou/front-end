
// add formation button//
document.addEventListener("DOMContentLoaded", function () {
    let addButton = document.getElementById("add-formation");
    
    addButton.addEventListener("click", function () {
        let formSection = document.getElementById("formation-form"); // Assurez-vous que cet ID existe dans votre HTML
        formSection.scrollIntoView({ behavior: "smooth" });
    });
});




 // Nav barre


    // Ajouter les événements pour déclencher le filtrage
    searchInput.addEventListener("input", filterCourses);
    domainFilters.forEach(filter => filter.addEventListener("change", filterCourses));

    // Appliquer le filtre au chargement de la page
    filterCourses();

    // Fonction pour gérer l'affichage de la barre de navigation
   








   
