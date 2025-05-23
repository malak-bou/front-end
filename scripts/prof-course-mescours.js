// --- Dynamic Course Logic using localStorage and robust selectors ---
const course = JSON.parse(localStorage.getItem('selectedCourse'));
console.log("course:", course);

if (course) {
    renderCourseDetails(course);
}

let courseId = course.id ;

async function fetchCourseMaterials(courseId) {
    try {
        const response = await fetch(`https://backend-m6sm.onrender.com/courses/${courseId}`);
        if (!response.ok) {
            throw new Error("Échec de chargement du contenu.");
        }

        const courseData = await response.json();
        const materials = courseData.materials || [];
        const container = document.getElementById("course-resources");

        container.innerHTML = ""; // Clear previous content

        if (materials.length === 0) {
            container.innerHTML = "<p>Aucun contenu disponible pour ce cours.</p>";
            return;
        }

        materials.forEach((material) => {
            if (material.file_category === "material" && material.file_type === "application/pdf") {
                container.innerHTML += `
                <div style="margin-bottom: 20px; width: 100%; max-width: 800px;">
                    <div style="margin-top: 10px; text-align: center;">
                        <a href="${material.file_path}" target="_blank" class="btn-download">
                            <i class="fas fa-download"></i> Télécharger Support du cours 📄
                        </a>
                    </div>
                    <hr>
                </div>
                `;
            } else if (material.file_category === "record" && material.file_type.startsWith("video")) {
                container.innerHTML += `
                    <video controls width="70%" max-height="600px" style="margin-bottom: 20px;">
                        <source src="${material.file_path}" type="${material.file_type}">
                        Votre navigateur ne supporte pas la lecture vidéo.
                    </video>    
                `;
            }
        });

        // Afficher les informations de progression après le chargement des matériaux
        await displayCourseCompletionInfo(courseId);
    } catch (error) {
        console.error("Erreur:", error);
        document.getElementById("course-resources").innerHTML = "<p>Erreur de chargement du contenu du cours.</p>";
    }
}

async function fetchCourseProgress(courseId) {
    try {
        const response = await fetch(`https://backend-m6sm.onrender.com/courses/${courseId}/progress`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch course progress');
        }

        const data = await response.json();
        
        // Update progress in UI
        const progressElement = document.getElementById('course-progress');
        if (progressElement) {
            progressElement.innerHTML = `
                <div class="progress-info">
                    <p><strong>Progression:</strong> ${data.progress_details.progress_percent}</p>
                    <p><strong>Statut:</strong> ${data.progress_details.status}</p>
                    <p><strong>Dernier accès:</strong> ${data.progress_details.last_accessed}</p>
                </div>
            `;
        }

        // Update progress bar if it exists
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            progressBar.style.width = `${data.progress_details.progress_value}%`;
            progressBar.setAttribute('aria-valuenow', data.progress_details.progress_value);
        }

        return data;
    } catch (error) {
        console.error('Error fetching course progress:', error);
        throw error;
    }
}

function renderCourseDetails(course) {
    console.log('Info de course:', course.image);
    fetchCourseMaterials(course.id);
    document.getElementById('course-domain').innerHTML = `<strong>Département :</strong> <span style="color: purple; font-weight: bold;">${course.departement}</span>`;
    const courseImage = document.getElementById('course-image');
    courseImage.src = course.image;
    courseImage.alt = course.title;
    document.getElementById('course-title').innerHTML = `<strong>Nom du cours :</strong> ${course.title}`;
    document.getElementById('course-teacher').innerHTML = `<strong>Professeur :</strong> ${course.teacher}`;
    document.getElementById('course-description').innerHTML = `${course.description}`;

    // Display external links and quiz link
    const externalLinksDiv = document.getElementById('external-links');
    const quizLinkDiv = document.getElementById('quiz-link');

    if (course.external_links) {
        externalLinksDiv.innerHTML = `
            <p><strong>Liens externes :</strong> <a href="${course.external_links}" target="_blank">Cliquez ici</a></p>
        `;
    }
    console.log("external_links", course.external_links);

    if (course.quiz_link) {
        quizLinkDiv.innerHTML = `
            <p><strong>Quiz du cours :</strong> <a href="${course.quiz_link}" target="_blank">Accéder au quiz</a></p>
        `;
    }
    console.log("quiz_link", course.quiz_link);
}

const startCourseBtn = document.getElementById('start-course-btn');
const maincontent = document.getElementById('course-content');

startCourseBtn.addEventListener('click', async function() {
    // Show course content
    maincontent.style.display = 'block';
    startCourseBtn.style.display = 'none';
    document.getElementById('course-description').style.display = 'none';
    document.getElementById('course-image').style.display = 'none';
    document.getElementById('course-teacher').style.display = 'none';
    this.style.display = 'none';
    try {
        // Call the enrollment API
        const response = await fetch(`https://backend-m6sm.onrender.com/courses/${courseId}/enroll`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to enroll in course');
        }

        const data = await response.json();

        console.log('Enrollment response:', data);

        // Fetch course materials and progress
        await Promise.all([
            fetchCourseMaterials(courseId),
            fetchCourseProgress(courseId)
        ]);
    } catch (error) {
        console.log('Error enrolling in course:', error);
    }
});

const quitCourseBtn = document.getElementById('quit-course-btn');
// Quitter le cours
quitCourseBtn.addEventListener('click', function() {
    startCourseBtn.style.display = '';
    document.getElementById('course-content').style.display = 'none';
    document.getElementById('course-description').style.display = '';
    document.getElementById('course-image').style.display = '';
    document.getElementById('course-teacher').style.display = '';
});

const finishCourseBtn = document.getElementById('finish-course-btn');
// Finir le cours
finishCourseBtn.addEventListener('click', async function() {
    try {
        const courseId = course.id;
        

        const response = await fetch(`http://127.0.0.1:8000/courses/${courseId}/complete`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la complétion du cours');
        }

        const data = await response.json();
        alert('Félicitations ! Vous avez terminé ce cours !');
        window.location.href = 'mescours.html';
    } catch (error) {
        console.error('Erreur:', error);
        alert('Une erreur est survenue lors de la complétion du cours');
    }
});

async function displayCourseCompletionInfo(courseId) {
    try {
        const response = await fetch(`http://127.0.0.1:8000/courses/${courseId}/progress`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des informations du cours');
        }

        const data = await response.json();
        
        // Créer ou mettre à jour l'élément d'affichage
        let completionInfo = document.getElementById('completion-info');
        if (!completionInfo) {
            completionInfo = document.createElement('div');
            completionInfo.id = 'completion-info';
            completionInfo.style.cssText = `
                background-color: #f8f9fa;
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            `;
            document.getElementById('course-content').prepend(completionInfo);
        }

        completionInfo.innerHTML = `
            <h3 style="color: #2c3e50; margin-bottom: 15px;">Progression du cours</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                <div>
                    <p><strong>Statut:</strong> <span style="color: ${data.progress_details.is_completed ? '#27ae60' : '#f39c12'}">${data.progress_details.status}</span></p>
                    <p><strong>Progression:</strong> ${data.progress_details.progress_percent}</p>
                </div>
                <div>
                    <p><strong>Date de début:</strong> ${data.progress_details.enrollment_date}</p>
                    <p><strong>Dernier accès:</strong> ${data.progress_details.last_accessed}</p>
                </div>
            </div>
            <div style="margin-top: 15px;">
                <div style="width: 100%; background: #e9ecef; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${data.progress_details.progress_value}%; background: #4CAF50; height: 20px; border-radius: 10px; transition: width 0.3s ease;"></div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Erreur:', error);
    }
}

