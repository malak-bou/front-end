// document.addEventListener("DOMContentLoaded", function () {
//     const storedData = localStorage.getItem("selectedCourse");

//     if (!storedData) {
//         document.querySelector("main").innerHTML = "<p>Error: Course data not found.</p>";
//         console.error("No course data in localStorage.");
//         return;
//     }

//     const courseData = JSON.parse(storedData);
//     document.getElementById("course-title").textContent = courseData.title;
//     document.getElementById("course-description").textContent = courseData.description;
//     document.getElementById("course-teacher").textContent = courseData.teacher;
//     document.getElementById("course-department").textContent = courseData.department;

//     const mainContentDiv = document.getElementById("main-content");

//     if (courseData.type === "video") {
//         mainContentDiv.innerHTML = `
//             <video controls width="100%">
//                 <source src="${courseData.mainContent}" type="video/mp4">
//             </video>
//         `;
//     } else if (courseData.type === "pdf") {
//         mainContentDiv.innerHTML = `
//             <p><strong>Course Material:</strong></p>
//             <iframe src="${courseData.mainContent}" width="100%" height="500px"></iframe>
//             <a href="${courseData.mainContent}" target="_blank" class="btn-download">📄 Download PDF</a>
//         `;
//     }
// });

// document.addEventListener("DOMContentLoaded", function () {
//     const storedData = localStorage.getItem("selectedCourse");

//     if (!storedData) {
//         document.querySelector("main").innerHTML = "<p>❌ Erreur : Aucune donnée de cours trouvée.</p>";
//         console.error("Aucun cours sélectionné.");
//         return;
//     }

//     const courseData = JSON.parse(storedData);

//     // 🟢 Remplir les informations du cours
//     document.getElementById("course-title").textContent = courseData.title;
//     document.getElementById("course-description").textContent = courseData.description;
//     document.getElementById("course-teacher").textContent = courseData.teacher;
//     document.getElementById("course-department").textContent = courseData.department;

//     // 🟢 Sélection des éléments
//     const startCourseBtn = document.getElementById("start-course-btn");
//     const mainContent = document.getElementById("main-content");
//     const dynamicContent = document.getElementById("dynamic-content");

//     // Vérifier si les éléments existent
//     if (!startCourseBtn || !mainContent) {
//         console.error("🚨 Erreur: Élément non trouvé !");
//         return;
//     }

//     // 🟢 Fonction pour afficher le contenu du cours
//     startCourseBtn.addEventListener("click", function () {
//         console.log("✅ Bouton cliqué, affichage du cours...");
        
//         mainContent.classList.remove("hidden"); // Afficher le contenu
//         mainContent.style.display = "block"; // Assurer l'affichage
//         startCourseBtn.style.display = "none"; // Cacher le bouton

//         // 🟢 Charger le contenu du cours (vidéo ou PDF)
//         if (courseData.type === "video") {
//             dynamicContent.innerHTML = `
//                 <video controls width="100%">
//                     <source src="${courseData.mainContent}" type="video/mp4">
//                 </video>
//             `;
//         } else if (courseData.type === "pdf") {
//             dynamicContent.innerHTML = `
//                 <iframe src="${courseData.mainContent}" width="100%" height="500px"></iframe>
//                 <a href="${courseData.mainContent}" target="_blank" class="btn-download">📄 Télécharger PDF</a>
//             `;
//         }
//     });
// });