// SIDEBAR TOGGLE
function toggleNav() {
    const sidebar = document.getElementById("sidebar");
    const currentLeft = window.getComputedStyle(sidebar).left;
    sidebar.style.left = currentLeft === "0px" ? "-250px" : "0px";
}

const BACKEND_URL = "https://backend-m6sm.onrender.com";

document.addEventListener("DOMContentLoaded", function () {
    console.log("Starting with backend integration...");

    const menuIcon = document.querySelector(".menu-icon");
    const closeBtn = document.querySelector(".close-btn");
    const sidebar = document.getElementById("sidebar");

    if (menuIcon) menuIcon.addEventListener("click", toggleNav);
    if (closeBtn) closeBtn.addEventListener("click", toggleNav);

    document.addEventListener("click", function (event) {
        if (sidebar && menuIcon && 
            !sidebar.contains(event.target) && 
            !menuIcon.contains(event.target) &&
            sidebar.style.left === "0px") {
            sidebar.style.left = "-250px";
        }
    });

    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    
    if (!token) {
        console.error("Token non trouvé. Rediriger ou afficher une erreur.");
        return;
    }

    initializeWithBackend(token);
});

async function initializeWithBackend(token) {
    try {
        const userInfo = await fetchUserInfo(token);
        populateUserForm(userInfo.profile);
        displayCourseStats(userInfo.courses || []);
        displayCourseTable(userInfo.courses || []);
        displaySkills(userInfo.courses || []);
        setupProfileFeatures(token, userInfo);
    } catch (error) {
        console.error("Erreur de connexion au backend :", error);
        alert("Erreur de chargement des données. Veuillez réessayer plus tard.");
    }
}

async function fetchUserInfo(token) {
    const response = await fetch(`${BACKEND_URL}/users/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        throw new Error(`Échec de la récupération : ${response.status}`);
    }

    return await response.json();
}

function populateUserForm(userInfo) {
    document.getElementById("nom").value = userInfo.nom || "";
    document.getElementById("prenom").value = userInfo.prenom || "";
    document.getElementById("email").value = userInfo.email || "";
    document.getElementById("telephone").value = userInfo.telephone || "";
    document.getElementById("departement").value = userInfo.departement || "";
    document.getElementById("fonction").value = userInfo.fonction || "";
}

function displayCourseStats(courses) {
    const totalCourses = courses.length;
    const completedCourses = courses.filter(course => course.completed || course.progress === 100).length;
    const avgProgress = totalCourses > 0 
        ? Math.round(courses.reduce((sum, course) => sum + (course.progress || 0), 0) / totalCourses)
        : 0;

    document.getElementById("totalCourses").textContent = totalCourses;
    document.getElementById("completedCourses").textContent = completedCourses;
    document.getElementById("averageProgress").textContent = avgProgress + "%";
}

function displayCourseTable(courses) {
    const tbody = document.getElementById("courseTableBody");
    tbody.innerHTML = "";

    courses.forEach(course => {
        const title = course.nom_du_cours || "Cours sans nom";
        const progressStr = course.progres || "0%";
        const progress = parseFloat(progressStr.replace('%', '')) || 0;
        const startDate = course.date_debut || "N/A";
        const endDate = course.date_fin || "En cours...";
        const completed = progress === 100;
        const status = completed ? "✅ Terminé" : "📚 En cours";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${title}</td>
            <td>
                <div style="width: 100%; background: #f0f0f0; border-radius: 10px; overflow: hidden;">
                    <div style="width: ${progress}%; background: #4CAF50; height: 20px; border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">
                        ${progress}%
                    </div>
                </div>
            </td>
            <td>${startDate}</td>
            <td>${endDate}</td>
            <td>${status}</td>
        `;
        tbody.appendChild(row);
    });
}

function displaySkills(courses) {
    const skillsList = document.getElementById("skillsList");
    skillsList.innerHTML = "";

    const allSkills = courses.flatMap(course => course.skills || []).filter(skill => skill);
    const uniqueSkills = [...new Set(allSkills)];


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


    uniqueSkills.forEach(skill => {
        const li = document.createElement("li");
        li.innerHTML = `<span style="background: #e1f5fe; padding: 5px 10px; border-radius: 15px; display: inline-block; margin: 2px;">🎯 ${skill}</span>`;
        skillsList.appendChild(li);
    });
}


            if (isCompleted) completedCount++;
            totalProgress += progress;
        });

        totalCourses.textContent = courses.length;
        completedCourses.textContent = completedCount;
        averageProgress.textContent = courses.length > 0 ? Math.round(totalProgress / courses.length) + "%" : "0%";

    }

    if (changePicBtn) {
        changePicBtn.addEventListener("click", () => uploadInput.click());
    }


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


    if (uploadInput) {
        uploadInput.addEventListener("change", async function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async function (e) {
                    profilePic.src = e.target.result;
                    if (token) {
                        await uploadProfilePictureToBackend(token, file);
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

async function uploadProfilePictureToBackend(token, file) {
    try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`${BACKEND_URL}/users/upload-profile-picture`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            body: formData
        });


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

