document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments nécessaires
    const searchInput = document.querySelector(".search-bar input");
    const courses = document.querySelectorAll(".course-card");
    const domainFilters = document.querySelectorAll(".category-filter input");

    // Fonction pour filtrer les cours en fonction de la recherche et du domaine
    function filterCourses() {
        const searchValue = searchInput.value.toLowerCase().trim();
        const selectedDomain = document.querySelector(".category-filter input:checked").value;

        courses.forEach(course => {
            const courseCategory = course.getAttribute("data-category");
            const courseText = course.textContent.toLowerCase();
            const matchesSearch = courseText.includes(searchValue);
            const matchesDomain = (selectedDomain === "All" || courseCategory === selectedDomain);

            course.style.display = (matchesSearch && matchesDomain) ? "block" : "none";
        });
    }

    // Événements pour déclencher le filtrage
    searchInput.addEventListener("input", filterCourses);
    domainFilters.forEach(filter => filter.addEventListener("change", filterCourses));

    // Appliquer le filtre au chargement
    filterCourses();
});

 // Nav barre
function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active");
}


document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments nécessaires
    const searchInput = document.querySelector(".search-bar input");
    const courses = document.querySelectorAll(".course-card");
    const domainFilters = document.querySelectorAll(".category-filter input");

    // Fonction pour filtrer les cours en fonction de la recherche et du domaine
    function filterCourses() {
        const searchValue = searchInput.value.toLowerCase().trim(); // Récupérer la valeur de recherche
        const selectedDomain = document.querySelector(".category-filter input:checked").value; // Récupérer le domaine sélectionné

        courses.forEach(course => {
            const courseCategory = course.getAttribute("data-category"); // Obtenir la catégorie du cours
            const courseText = course.textContent.toLowerCase(); // Convertir le texte du cours en minuscules
            const matchesSearch = courseText.includes(searchValue); // Vérifier si le texte correspond à la recherche
            const matchesDomain = (selectedDomain === "All" || courseCategory === selectedDomain); // Vérifier si la catégorie correspond

            course.style.display = (matchesSearch && matchesDomain) ? "block" : "none"; // Afficher ou masquer les cours
        });
    }

    // Ajouter les événements pour déclencher le filtrage
    searchInput.addEventListener("input", filterCourses);
    domainFilters.forEach(filter => filter.addEventListener("change", filterCourses));

    // Appliquer le filtre au chargement de la page
    filterCourses();
    
});


document.addEventListener("DOMContentLoaded", function () {
    const courses = document.querySelectorAll(".course-card");

    courses.forEach(course => {
        course.addEventListener("click", function () {
            const courseData = {
                title: this.getAttribute("data-title"),
                description: this.getAttribute("data-description"),
                teacher: this.getAttribute("data-teacher"),
                department: this.getAttribute("data-department"),
                mainContent: this.getAttribute("data-main-content"),
                type: this.getAttribute("data-type")
            };

            // Save course data in localStorage
            localStorage.setItem("selectedCourse", JSON.stringify(courseData));

            // Redirect to the course details page
            window.location.href = "../../pages/user/course.html";
        });
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const courses = document.querySelectorAll(".course-card");

    courses.forEach(course => {
        course.addEventListener("click", function () {
            const courseTitle = this.getAttribute("data-title");
            const courseSkills = this.getAttribute("data-skills") ? this.getAttribute("data-skills").split(",") : [];
            const startDate = new Date().toLocaleDateString();

            let userCourses = JSON.parse(localStorage.getItem("userCourses")) || [];

            // Vérifier si le cours est déjà suivi
            let existingCourse = userCourses.find(c => c.title === courseTitle);

            if (!existingCourse) {
                let newCourse = {
                    title: courseTitle,
                    progress: 0,
                    startDate: startDate,
                    endDate: "En cours...",
                    completed: false,
                    skills: courseSkills
                };

                userCourses.push(newCourse);
                localStorage.setItem("userCourses", JSON.stringify(userCourses));
            }

            alert(`Le cours "${courseTitle}" a été ajouté à votre suivi.`);
        });
    });
});
