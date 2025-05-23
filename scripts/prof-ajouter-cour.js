document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const token = localStorage.getItem('token'); // Get the authentication token

    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if no token
        return;
    }
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get form values
        const title = document.getElementById('course-name').value;
        const description = document.getElementById('description').value;
        const departement = document.getElementById('department').value;
        const external_links = document.getElementById('links').value;
        const quiz_link = document.getElementById('quiz-link').value;
        const course_photo = document.getElementById('course-image').files[0];
        const course_material = document.getElementById('pdf').files[0];
        const course_record = document.getElementById('record').files[0];

        // Validate required fields
        if (!title || !description || !departement) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Récupérez d'abord les fichiers
const course_pdf = document.getElementById('pdf').files[0];
const course_video = document.getElementById('record').files[0];

// Créez le FormData
const formData = new FormData();
formData.append('title', title);
formData.append('description', description);
formData.append('departement', departement);
formData.append('course_image', course_photo);  // Nom exact attendu par l'API
formData.append('course_pdf', course_pdf);      // Nom exact attendu par l'API

// Ajoutez les champs optionnels s'ils sont remplis
if (external_links) formData.append('external_links', external_links);
if (quiz_link) formData.append('quiz_link', quiz_link);
if (course_video) formData.append('course_video', course_video);

// Ajoutez le token d'authentification
const token = localStorage.getItem('token');

// Envoyez la requête
try {
    const response = await fetch('http://127.0.0.1:8000/courses/', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    let data = null;
    let errorText = '';
    try {
        data = await response.json();
    } catch (jsonErr) {
        errorText = await response.text();
    }

    if (!response.ok) {
        if (data && data.detail) {
            alert('Erreur lors de la création du cours : ' + data.detail);
        } else if (data) {
            alert('Erreur lors de la création du cours : ' + JSON.stringify(data));
        } else {
            alert('Erreur lors de la création du cours : ' + errorText);
        }
        return;
    }

    alert('Cours ajouté avec succès !');
    window.location.href = 'mescours.html';
} catch (error) {
    alert('Erreur réseau ou serveur : ' + error.message);
}

    // Handle cancel button
    const cancelButton = document.querySelector('.cancel');
    cancelButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Voulez-vous vraiment annuler la création du cours ?')) {
            window.location.href = 'mescours.html';
        }
    });

    // Preview image before upload
    const imageInput = document.getElementById('course-image');
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Veuillez sélectionner une image valide');
                imageInput.value = '';
                return;
            }
        }
    });

    // Validate PDF file
    const pdfInput = document.getElementById('pdf');
    pdfInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                alert('Veuillez sélectionner un fichier PDF valide');
                pdfInput.value = '';
                return;
            }
        }
    });

    // Validate record file
    const recordInput = document.getElementById('record');
    recordInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['audio/', 'video/'];
            if (!validTypes.some(type => file.type.startsWith(type))) {
                alert('Veuillez sélectionner un fichier audio ou vidéo valide');
                recordInput.value = '';
                return;
            }
        }
    });

});
});
