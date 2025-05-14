 // --- Dynamic Course Logic using localStorage and robust selectors ---
 const course = JSON.parse(localStorage.getItem('selectedCourse'));



 function renderCourseDetails(course) {
     document.getElementById('course-domain').innerHTML = `<strong>Département :</strong> <span style="color: purple; font-weight: bold;">${course.departement}</span>`;
     document.getElementById('course-image').src = course.image_url;
     document.getElementById('course-image').alt = course.title;
     document.getElementById('course-image').style.display = '';
     document.getElementById('course-title').innerHTML = `<strong>Nom du cours :</strong> ${course.title}`;
     document.getElementById('course-teacher').innerHTML = `<strong>Professeur :</strong> ${course.teacher}`;
     document.getElementById('course-description').innerHTML = `${course.description}`;
 }
 
 if (course) {
     renderCourseDetails(course);
 }
 
 let courseId = course.id ;
 
 async function fetchCourseMaterials(courseId) {
     try {
         const response = await fetch(`https://backend-m6sm.onrender.com/courses/${courseId}/materials/`);
         if (!response.ok) {
             throw new Error("Échec de chargement du contenu.");
         }
 
         const materials = await response.json();
         const container = document.getElementById("course-resources");
         container.innerHTML = ""; // Clear previous content
 
         if (materials.length === 0) {
             container.innerHTML = "<p>Aucun contenu disponible pour ce cours.</p>";
             return;
         }
 
         materials.forEach((material) => {
             if (material.file_category === "video") {
                 container.innerHTML += `
                     <h4>${material.title}</h4>
                     <video controls width="100%" style="margin-bottom: 20px;">
                         <source src="${material.file_url}" type="video/mp4">
                         Votre navigateur ne supporte pas la lecture vidéo.
                     </video>
                 `;
             } else if (material.file_category === "pdf") {
                 container.innerHTML += `
                     <h4>${material.title}</h4>
                     <iframe src="${material.file_url}" width="100%" height="500px" style="border:1px solid #ccc;"></iframe>
                     <a href="${material.file_url}" target="_blank" class="btn-download">📄 Télécharger PDF</a>
                     <hr>
                 `;
             } else {
                 container.innerHTML += `<p>${material.title} (type inconnu)</p>`;
             }
         });
     } catch (error) {
         console.error("Erreur:", error);
         document.getElementById("course-resources").innerHTML = "<p>Erreur de chargement du contenu du cours.</p>";
     }
 }
 
     
 
 const startCourseBtn = document.getElementById('start-course-btn');
 const maincontent = document.getElementById('course-content');
 
 startCourseBtn.addEventListener('click', function() {
     maincontent.style.display = 'block';
     startCourseBtn.style.display = 'none';
     document.getElementById('course-description').style.display = 'none';
     document.getElementById('course-image').style.display = 'none';
     document.getElementById('course-teacher').style.display = 'none';
     this.style.display = 'none';
     fetchCourseMaterials(courseId);
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
     window.location.href = 'RH-dashboard.html';
     // Tu pourrais aussi ici envoyer une requête pour "marquer terminé" si tu as un backend
 });
 
 