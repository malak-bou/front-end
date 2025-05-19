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

});

// side barre

function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
}


function loadCourses() {
    const url = "https://backend-m6sm.onrender.com/courses/by-department";
    const token = localStorage.getItem('token');

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '../../index.html';
                throw new Error('Non authentifié. Veuillez vous connecter.');
            }
            throw new Error(`Erreur HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(courses => {
        const container = document.getElementById('courses-container');
        if (!container) return;

        container.innerHTML = '';

        if (!courses || courses.length === 0) {
            container.innerHTML = '<p>Aucun cours disponible pour le moment.</p>';
            return;
        }

        courses.forEach(course => {
            const card = document.createElement('div');
            card.classList.add('course-card');

            const isNew = isCourseNew(course.created_at);

            const photoMaterial = course.materials.find(material => material.file_category === 'photo');
            const imageUrl = photoMaterial ? `/courses/${course.id}/image` : null;

            const courseData = {
                id: course.id,
                departement: course.departement,
                image: course.image_url,
                title: course.title,
                teacher: instructorName,
                description: course.description || "Aucune description",
                field: course.domain,
                external_links: course.external_links,
                quiz_link: course.quiz_link,
                resources: {
                    record: null,
                    pptx: null,
                    pdf: null,
                    extraLinks: course.external_links || [],
                    quiz: null
                }
            };

            card.dataset.course = JSON.stringify(courseData);

            card.innerHTML = `
                ${isNew ? '<span class="badge">new</span>' : ''}
                <span class="department">${course.departement || 'Non spécifié'}</span> 
                <h3>${course.title}</h3>
                <p>${course.description || "Aucune description"}</p>
            `;

            card.addEventListener('click', () => {
                localStorage.setItem('selectedCourse', JSON.stringify(courseData));
                window.location.href = 'RH-course-mondep.html'; // ✅ Updated the path
            });

            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Erreur lors du chargement des cours:', error);
        const container = document.getElementById('courses-container');
        if (container) {
            container.innerHTML = `<p>Erreur lors du chargement des cours: ${error.message}</p>`;
        }
    });
}

loadCourses();


// Fonction pour vérifier si un cours est nouveau (moins d'une semaine)
function isCourseNew(createdAt) {
    if (!createdAt) return false;
    
    const courseDate = new Date(createdAt);
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return courseDate > oneWeekAgo;
}

// Function to update department filters
function updateDepartmentFilters(courses) {
    const departments = new Set(courses.map(course => course.departement));
    const radioInputs = document.querySelector('.radio-inputs');
    
    if (!radioInputs) return;

    // Keep the "Tous" option
    const allOption = radioInputs.querySelector('label.radio:first-child');
    radioInputs.innerHTML = '';
    radioInputs.appendChild(allOption);

    // Add department options
    departments.forEach(dept => {
        const label = document.createElement('label');
        label.className = 'radio';
        label.innerHTML = `
            <input type="radio" name="radio" value="${dept}">
            <span class="name">${dept}</span>
        `;
        radioInputs.appendChild(label);
    });

    // Reattach event listeners
    const domainFilters = radioInputs.querySelectorAll('input');
    domainFilters.forEach(filter => filter.addEventListener('change', filterCourses));
}

