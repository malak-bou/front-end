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
                    <div class="pdf-viewer">
                        <embed
                            src="${material.file_path}"
                            type="application/pdf"
                            width="100%"
                            height="500px"
                            style="border: 1px solid #ddd; border-radius: 8px;"
                        />
                    </div>
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
 finishCourseBtn.addEventListener('click', function() {
     alert('Vous avez terminé ce cours!');
     window.location.href = 'mescours.html';
     // Tu pourrais aussi ici envoyer une requête pour "marquer terminé" si tu as un backend
 });
 
 