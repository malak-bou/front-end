document.addEventListener("DOMContentLoaded", function () {
    // Sidebar toggle function
    function toggleNav() {
        let sidebar = document.getElementById("sidebar");
        sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
    }

    document.querySelector(".menu-icon").addEventListener("click", toggleNav);
    document.querySelector(".close-btn").addEventListener("click", toggleNav);



    // Profile picture handling
    const profilePic = document.getElementById("profilePic");
    const uploadInput = document.getElementById("uploadProfilePic");
    const changePicBtn = document.getElementById("changePicBtn");
    const deletePicBtn = document.getElementById("deletePicBtn");
    const defaultImage = "./profil-pic.png"; // Default image path

    // Function to open overlay with enlarged image
    profilePic.addEventListener("click", function () {
        // Remove existing overlay if it exists
        const existingOverlay = document.getElementById("imgOverlay");
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create overlay
        const overlay = document.createElement("div");
        overlay.id = "imgOverlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100vw";
        overlay.style.height = "100vh";
        overlay.style.background = "rgba(0, 0, 0, 0.7)";
        overlay.style.display = "flex";
        overlay.style.flexDirection = "column";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.zIndex = "1000";

        // Create enlarged image
        const enlargedImg = document.createElement("img");
        enlargedImg.src = profilePic.src;
        enlargedImg.style.width = "300px";
        enlargedImg.style.height = "300px";
        enlargedImg.style.borderRadius = "50%";
        enlargedImg.style.border = "5px solid white";
        enlargedImg.style.cursor = "pointer";

        // Create button container
        const btnContainer = document.createElement("div");
        btnContainer.style.display = "flex";
        btnContainer.style.gap = "10px";
        btnContainer.style.marginTop = "10px";

        // Create new buttons
        const newChangePicBtn = document.createElement("button");
        newChangePicBtn.textContent = "Modifier";
        newChangePicBtn.style.backgroundColor = "#7c3aed";
        newChangePicBtn.style.color = "white";
        newChangePicBtn.style.padding = "10px 15px";
        newChangePicBtn.style.border = "none";
        newChangePicBtn.style.borderRadius = "5px";
        newChangePicBtn.style.cursor = "pointer";
        newChangePicBtn.addEventListener("click", function () {
            uploadInput.click();
        });

        const newDeletePicBtn = document.createElement("button");
        newDeletePicBtn.textContent = "Supprimer";
        newDeletePicBtn.style.backgroundColor = "red";
        newDeletePicBtn.style.color = "white";
        newDeletePicBtn.style.padding = "10px 15px";
        newDeletePicBtn.style.border = "none";
        newDeletePicBtn.style.borderRadius = "5px";
        newDeletePicBtn.style.cursor = "pointer";
        newDeletePicBtn.addEventListener("click", function () {
            const confirmDelete = confirm("Êtes-vous sûr de vouloir supprimer votre photo de profil ?");
            if (confirmDelete) {
                profilePic.src = defaultImage; // Reset profile image
                enlargedImg.src = defaultImage; // Update enlarged image
                localStorage.removeItem("profileImage"); // Remove from local storage
                overlay.remove(); // Close overlay after deleting
            }
        });
        

        // Append buttons to the button container
        btnContainer.appendChild(newChangePicBtn);
        btnContainer.appendChild(newDeletePicBtn);

        // Append everything to overlay
        overlay.appendChild(enlargedImg);
        overlay.appendChild(btnContainer);
        document.body.appendChild(overlay);

        // Close overlay when clicking outside
        overlay.addEventListener("click", function (event) {
            if (event.target === overlay) {
                overlay.remove();
            }
        });
    });

    // Upload profile picture
    uploadInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result; // Update profile picture
                localStorage.setItem("profileImage", e.target.result); // Save to local storage

                // Also update enlarged image if overlay is open
                const enlargedImg = document.querySelector("#imgOverlay img");
                if (enlargedImg) {
                    enlargedImg.src = e.target.result;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    // Load saved profile picture from local storage
    const savedImage = localStorage.getItem("profileImage");
    if (savedImage) {
        profilePic.src = savedImage;
    }

    // Save and restore user details
    const saveBtn = document.querySelector(".save-btn");
    const cancelBtn = document.querySelector(".cancel-btn");
    const inputs = document.querySelectorAll(".input-box input");

    function loadProfileData() {
        inputs.forEach(input => {
            const savedValue = localStorage.getItem(input.id);
            if (savedValue) {
                input.value = savedValue;
            }
        });
    }

    saveBtn.addEventListener("click", function () {
        inputs.forEach(input => {
            localStorage.setItem(input.id, input.value);
        });
        alert("Informations enregistrées avec succès !");
    });

    cancelBtn.addEventListener("click", function () {
        loadProfileData();
        alert("Modifications annulées !");
    });

    loadProfileData();

    // Toggle password visibility
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        });
    }
});




document.addEventListener("DOMContentLoaded", function () {
    const courseTableBody = document.getElementById("courseTableBody");
    const skillsList = document.getElementById("skillsList");
    const totalCourses = document.getElementById("totalCourses");
    const completedCourses = document.getElementById("completedCourses");
    const averageProgress = document.getElementById("averageProgress");

    async function fetchUserCourses() {
        try {
            const response = await fetch('https://backend-m6sm.onrender.com/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch user courses');
            }

            const data = await response.json();
            return data.courses || [];
        } catch (error) {
            console.error('Error fetching user courses:', error);
            return [];
        }
    }

    async function loadCourses() {
        courseTableBody.innerHTML = "";
        let completedCount = 0;
        let totalProgress = 0;

        const courses = await fetchUserCourses();

        courses.forEach(course => {
            const row = document.createElement("tr");
            const progress = parseFloat(course.progres) || 0;
            const isCompleted = course.statut === "Terminé";

            row.innerHTML = `
                <td>${course.nom_du_cours}</td>
                <td>
                    <div class="progress-bar">
                        <span style="width: ${progress}%;"></span>
                    </div>
                    ${progress}%
                </td>
                <td>${course.date_debut}</td>
                <td>${course.date_fin}</td>
                <td>${isCompleted ? "✅ Terminé" : "⌛ En cours"}</td>
            `;

            courseTableBody.appendChild(row);

            if (isCompleted) completedCount++;
            totalProgress += progress;
        });

        totalCourses.textContent = courses.length;
        completedCourses.textContent = completedCount;
        averageProgress.textContent = courses.length > 0 ? Math.round(totalProgress / courses.length) + "%" : "0%";
    }

    function loadSkills() {
        skillsList.innerHTML = "";
        const allSkills = new Set();

        // You can add skills based on completed courses here
        // For example, if you have a mapping of courses to skills
        const courseSkills = {
            "Python Programming": ["Python", "Programming", "Data Analysis"],
            "Web Development": ["HTML", "CSS", "JavaScript"],
            // Add more course-skill mappings as needed
        };

        // Get completed courses from the table
        const rows = courseTableBody.getElementsByTagName("tr");
        for (let row of rows) {
            const courseName = row.cells[0].textContent;
            const isCompleted = row.cells[4].textContent.includes("Terminé");
            
            if (isCompleted && courseSkills[courseName]) {
                courseSkills[courseName].forEach(skill => allSkills.add(skill));
            }
        }

        allSkills.forEach(skill => {
            const li = document.createElement("li");
            li.textContent = skill;
            skillsList.appendChild(li);
        });
    }

    // Load courses and skills when the page loads
    loadCourses().then(() => {
        loadSkills();
    });

    // Refresh courses every 5 minutes
    setInterval(() => {
        loadCourses().then(() => {
            loadSkills();
        });
    }, 5 * 60 * 1000);
});












// Function to open/close the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    // Check the current width of the sidebar and adjust it
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; // Close the sidebar
    } else {
        sidebar.style.width = "250px"; // Open the sidebar
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const icon = document.querySelector("i.fa-users");
    const dot = icon ? icon.querySelector(".notification-dot") : null;

    const hasPending = localStorage.getItem("hasPendingAccountRequests") === "true";

    if (dot) {
        dot.style.display = hasPending ? "block" : "none";
    }
});


document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour récupérer les demandes depuis localStorage
    function getRequestsFromStorage() {
        const stored = localStorage.getItem('formationRequests');
        return stored ? JSON.parse(stored) : {};
    }

    // Fonction pour vérifier s'il y a des demandes de formation
    function checkFormationRequests() {
        const notificationDot = document.getElementById('formationNotificationDot');
        const requests = getRequestsFromStorage();
        
        // Vérifie si au moins un département a des demandes
        const hasRequests = Object.values(requests).some(count => count > 0);
        
        // Affiche ou cache la notification en fonction des demandes
        if (notificationDot) {
            notificationDot.style.display = hasRequests ? 'block' : 'none';
        }
    }

    // Vérifie les demandes au chargement de la page
    checkFormationRequests();

    // Vérifie périodiquement les nouvelles demandes
    setInterval(checkFormationRequests, 1000);
}); 