document.addEventListener("DOMContentLoaded", function () {
    // Gestion de la Recherche
    const searchInput = document.getElementById("searchInput");

    function filterCourses() {
        const searchValue = searchInput.value.toLowerCase().trim();
        const courses = document.querySelectorAll(".course-card");

        courses.forEach(course => {
            const courseText = course.textContent.toLowerCase();
            course.style.display = courseText.includes(searchValue) ? "block" : "none";
        });
    }

    if (searchInput) {
        searchInput.addEventListener("input", filterCourses);
    }
});

function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active");
}

function loadCourses() {
    const url = "https://backend-m6sm.onrender.com/dashboard/prof/";
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

            // Trouver les matériaux par catégorie
            const photoMaterial = course.materials.find(material => material.file_category === 'photo');
            const pdfMaterial = course.materials.find(material => material.file_category === 'material');
            const recordMaterial = course.materials.find(material => material.file_category === 'record');

            // Récupérer les informations du professeur
            const instructor = course.instructor || {};
            const instructorName = instructor.nom && instructor.prenom 
                ? `${instructor.prenom} ${instructor.nom}`
                : 'Non spécifié';

            // Préparer les données du cours pour le stockage
            const courseData = {
                id: course.id,
                title: course.title,
                description: course.description || "Aucune description",
                departement: course.departement || "Non spécifié",
                created_at: course.created_at,
                updated_at: course.updated_at,
                image: course.image_url,
                external_links: course.external_links,
                quiz_link: course.quiz_link,
                instructor: {
                    id: instructor.id,
                    nom: instructor.nom,
                    prenom: instructor.prenom,
                    email: instructor.email,
                    departement: instructor.departement
                },
                materials: {
                    photo: photoMaterial ? {
                        id: photoMaterial.id,
                        file_name: photoMaterial.file_name,
                        file_path: photoMaterial.file_path,
                        file_type: photoMaterial.file_type
                    } : null,
                    pdf: pdfMaterial ? {
                        id: pdfMaterial.id,
                        file_name: pdfMaterial.file_name,
                        file_path: pdfMaterial.file_path,
                        file_type: pdfMaterial.file_type
                    } : null,
                    record: recordMaterial ? {
                        id: recordMaterial.id,
                        file_name: recordMaterial.file_name,
                        file_path: recordMaterial.file_path,
                        file_type: recordMaterial.file_type
                    } : null
                }
            };

            // Stocker les données dans l'attribut data du card
            card.dataset.course = JSON.stringify(courseData);

            card.innerHTML = `
                ${isNew ? '<span class="badge">new</span>' : ''}
                <span class="department">${course.departement || 'Non spécifié'}</span> 
                <h3>${course.title}</h3>
                <p>${course.description || "Aucune description"}</p>
            `;

            // Ajouter l'événement de clic
            card.addEventListener('click', () => {
                // Stocker les données complètes du cours dans localStorage
                localStorage.setItem('selectedCourse', JSON.stringify(courseData));
                // Rediriger vers la page de détail du cours
                window.location.href = '../pages/prof-course-mescours.html';
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


