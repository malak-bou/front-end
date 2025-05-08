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

        // Create FormData object
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('departement', departement);
        
        if (external_links) formData.append('external_links', external_links);
        if (quiz_link) formData.append('quiz_link', quiz_link);
        if (course_photo) formData.append('course_photo', course_photo);
        if (course_material) formData.append('course_material', course_material);
        if (course_record) formData.append('course_record', course_record);

        try {
            const response = await fetch('https://backend-m6sm.onrender.com/courses/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                alert('Cours créé avec succès!');
                window.location.href = 'mescours.html'; // Redirect to courses list
            } else {
                const error = await response.json();
                alert(`Erreur: ${error.detail || 'Une erreur est survenue'}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Une erreur est survenue lors de la création du cours');
        }
    });

    // Handle cancel button
    const cancelButton = document.querySelector('.cancel');
    cancelButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Voulez-vous vraiment annuler la création du cours ?')) {
            window.location.href = 'RH-mescours.html';
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
