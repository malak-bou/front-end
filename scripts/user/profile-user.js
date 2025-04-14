document.addEventListener("DOMContentLoaded", function () {
    // Sidebar toggle function
    function toggleNav() {
        let sidebar = document.getElementById("sidebar");
        sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px";
    }

    document.querySelector(".menu-icon").addEventListener("click", toggleNav);
    document.querySelector(".close-btn").addEventListener("click", toggleNav);

    document.addEventListener("DOMContentLoaded", () => {
        function loadProfileData() {
            document.getElementById("nom").textContent = localStorage.getItem("nom") || "Nom inconnu";
            document.getElementById("prenom").textContent = localStorage.getItem("prenom") || "Prénom inconnu";
            document.getElementById("email").textContent = localStorage.getItem("email") || "Email inconnu";
            document.getElementById("telephone").textContent = localStorage.getItem("telephone") || "Numéro inconnu";
        }
    
        loadProfileData(); 
    
        // Listen for changes in localStorage (when settings are updated)
        window.addEventListener("storage", loadProfileData);
    });
    

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


    loadProfileData();  
});




document.addEventListener("DOMContentLoaded", function () {
    const courseTableBody = document.getElementById("courseTableBody");
    const skillsList = document.getElementById("skillsList");
    const totalCourses = document.getElementById("totalCourses");
    const completedCourses = document.getElementById("completedCourses");
    const averageProgress = document.getElementById("averageProgress");

    // Récupérer les cours stockés
    let userCourses = JSON.parse(localStorage.getItem("userCourses")) || [];

    function loadCourses() {
        courseTableBody.innerHTML = "";
        let completedCount = 0;
        let totalProgress = 0;

        userCourses.forEach(course => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${course.title}</td>
                <td>
                    <div class="progress-bar">
                        <span style="width: ${course.progress}%;"></span>
                    </div>
                    ${course.progress}%
                </td>
                <td>${course.startDate}</td>
                <td>${course.endDate}</td>
                <td>${course.completed ? "✅ Terminé" : "⌛ En cours"}</td>
            `;

            courseTableBody.appendChild(row);

            if (course.completed) completedCount++;
            totalProgress += course.progress;
        });

        totalCourses.textContent = userCourses.length;
        completedCourses.textContent = completedCount;
        averageProgress.textContent = userCourses.length > 0 ? Math.round(totalProgress / userCourses.length) + "%" : "0%";
    }

    function loadSkills() {
        skillsList.innerHTML = "";
        const allSkills = new Set();

        userCourses.forEach(course => {
            if (course.completed) {
                course.skills.forEach(skill => allSkills.add(skill));
            }
        });

        allSkills.forEach(skill => {
            const li = document.createElement("li");
            li.textContent = skill;
            skillsList.appendChild(li);
        });
    }

    loadCourses();
    loadSkills();
});
