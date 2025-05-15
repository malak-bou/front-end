// Global toggleNav function for HTML onclick
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    // Check the current width of the sidebar and adjust it
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0"; // Close the sidebar
    } else {
        sidebar.style.width = "250px"; // Open the sidebar
    }
}

// Backend URL - use the deployed version consistently
const BACKEND_URL = "https://backend-m6sm.onrender.com";

document.addEventListener("DOMContentLoaded", function () {
    console.log("Starting with backend integration...");



    // ======= TOKEN CHECK =======
    const token = localStorage.getItem("token") || localStorage.getItem("access_token");
    
    if (!token) {
        console.log("No token found - loading offline mode");
        loadFromLocalStorage();
        setupProfileFeatures();
        return;
    }

    console.log("Token found, checking backend...");

    // ======= BACKEND INTEGRATION =======
    initializeWithBackend(token);
});

async function initializeWithBackend(token) {
    try {
        // ======= 1. GET USER INFO =======
        console.log("Fetching user info...");
        const userInfo = await fetchUserInfo(token);
        console.log("User info received:", userInfo);
        populateUserForm(userInfo.profile);


        // ======= 2. GET USER COURSES =======
        console.log("Fetching user courses...");
        displayCourseStats(userInfo.courses || []);
       displayCourseTable(userInfo.courses || []);
        displaySkills(userInfo.courses || []);


        // ======= 3. SETUP PROFILE FEATURES =======
        setupProfileFeatures(token, userInfo);

        console.log("Backend integration complete!");

    } catch (error) {
        console.error("Backend integration failed:", error);
        
        if (error.message.includes("401")) {
            console.log("Token expired - loading offline mode");
            loadFromLocalStorage();
        } else {
            console.log("Backend error - loading offline mode");
            loadFromLocalStorage();
        }
        setupProfileFeatures();
    }
}

async function fetchUserInfo(token) {
    console.log("Making API call to /users/me");
    
    const response = await fetch(`${BACKEND_URL}/users/me`, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    console.log("User info response status:", response.status);

    if (!response.ok) {
        throw new Error(`User info fetch failed: ${response.status}`);
    }

    return await response.json();
}

async function fetchUserCourses(token) {
    try {
        const response = await fetch(`${BACKEND_URL}/users/progress`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const courses = await response.json();
            displayCourseStats(courses);
            displayCourseTable(courses);
            displaySkills(courses);
        } else {
            console.log("No course data available, using localStorage");
            loadCoursesFromLocalStorage();
        }
    } catch (error) {
        console.error("Erreur lors du chargement des cours:", error);
        loadCoursesFromLocalStorage();
    }
}

function populateUserForm(userInfo) {
    console.log("Populating form with user info");
    
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
        
        // Strip % if necessary
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
    
    if (uniqueSkills.length === 0) {
        skillsList.innerHTML = "<li>Aucune compétence enregistrée</li>";
        return;
    }
    
    uniqueSkills.forEach(skill => {
        const li = document.createElement("li");
        li.innerHTML = `<span style="background: #e1f5fe; padding: 5px 10px; border-radius: 15px; display: inline-block; margin: 2px;">🎯 ${skill}</span>`;
        skillsList.appendChild(li);
    });
}

function loadFromLocalStorage() {
    console.log("Loading user data from localStorage");
    
    // Load user data from localStorage
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    
    document.getElementById("nom").value = userData.nom || "";
    document.getElementById("prenom").value = userData.prenom || "";
    document.getElementById("email").value = userData.email || "";
    document.getElementById("telephone").value = userData.telephone || "";
    document.getElementById("departement").value = userData.departement || "";
    document.getElementById("fonction").value = userData.fonction || "";
    
    loadCoursesFromLocalStorage();
}

function loadCoursesFromLocalStorage() {
    const userCourses = JSON.parse(localStorage.getItem("userCourses") || "[]");
    
    // If no courses in localStorage, show default values
    if (userCourses.length === 0) {
        document.getElementById("totalCourses").textContent = "0";
        document.getElementById("completedCourses").textContent = "0";
        document.getElementById("averageProgress").textContent = "0%";
        document.getElementById("courseTableBody").innerHTML = "<tr><td colspan='5'>Aucun cours trouvé</td></tr>";
        document.getElementById("skillsList").innerHTML = "<li>Aucune compétence enregistrée</li>";
        return;
    }
    
    displayCourseStats(userCourses);
    displayCourseTable(userCourses);
    displaySkills(userCourses);
}

function setupProfileFeatures(token = null, userInfo = null) {
    const profilePic = document.getElementById("profilePic");
    const uploadInput = document.getElementById("uploadProfilePic");
    const changePicBtn = document.getElementById("changePicBtn");
    const deletePicBtn = document.getElementById("deletePicBtn");
    const defaultImage = "../assets/images/profil-pic.png";

    // Load saved profile picture
    const savedPic = localStorage.getItem("profilePicture");
    if (savedPic) {
        profilePic.src = savedPic;
    }

    // Profile picture click to enlarge
    if (profilePic) {
        profilePic.addEventListener("click", function () {
            const existingOverlay = document.getElementById("imgOverlay");
            if (existingOverlay) existingOverlay.remove();

            const overlay = document.createElement("div");
            overlay.id = "imgOverlay";
            Object.assign(overlay.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                background: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: "1000"
            });

            const enlargedImg = document.createElement("img");
            enlargedImg.src = profilePic.src;
            Object.assign(enlargedImg.style, {
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                border: "5px solid white",
                cursor: "pointer"
            });

            const btnContainer = document.createElement("div");
            Object.assign(btnContainer.style, {
                display: "flex",
                gap: "10px",
                marginTop: "10px"
            });

            const newChangePicBtn = document.createElement("button");
            newChangePicBtn.textContent = "Modifier";
            Object.assign(newChangePicBtn.style, {
                backgroundColor: "#7c3aed",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            });
            newChangePicBtn.addEventListener("click", () => {
                overlay.remove();
                uploadInput.click();
            });

            const newDeletePicBtn = document.createElement("button");
            newDeletePicBtn.textContent = "Supprimer";
            Object.assign(newDeletePicBtn.style, {
                backgroundColor: "red",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
            });
            newDeletePicBtn.addEventListener("click", async () => {
                overlay.remove();
                if (token) {
                    await deleteProfilePictureFromBackend(token);
                } else {
                    profilePic.src = defaultImage;
                    localStorage.removeItem("profilePicture");
                }
            });

            const closeBtn = document.createElement("button");
            closeBtn.textContent = "✖";
            Object.assign(closeBtn.style, {
                backgroundColor: "gray",
                color: "white",
                padding: "10px 15px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                position: "absolute",
                top: "20px",
                right: "20px"
            });
            closeBtn.addEventListener("click", () => overlay.remove());

            btnContainer.appendChild(newChangePicBtn);
            btnContainer.appendChild(newDeletePicBtn);
            overlay.appendChild(enlargedImg);
            overlay.appendChild(btnContainer);
            overlay.appendChild(closeBtn);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", (e) => {
                if (e.target === overlay) overlay.remove();
            });
        });
    }

    // Change picture button
    if (changePicBtn) {
        changePicBtn.addEventListener("click", () => uploadInput.click());
    }

    // Delete picture button
    if (deletePicBtn) {
        deletePicBtn.addEventListener("click", async () => {
            if (token) {
                await deleteProfilePictureFromBackend(token);
            } else {
                profilePic.src = defaultImage;
                localStorage.removeItem("profilePicture");
            }
        });
    }

    // File upload handler
    if (uploadInput) {
        uploadInput.addEventListener("change", async function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = async function (e) {
                    profilePic.src = e.target.result;
                    
                    if (token) {
                        await uploadProfilePictureToBackend(token, file);
                    } else {
                        localStorage.setItem("profilePicture", e.target.result);
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

        if (response.ok) {
            console.log("Profile picture uploaded successfully");
        } else {
            console.error("Failed to upload profile picture");
        }
    } catch (error) {
        console.error("Error uploading profile picture:", error);
    }
}

async function deleteProfilePictureFromBackend(token) {
    try {
        const response = await fetch(`${BACKEND_URL}/users/delete-profile-picture`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            document.getElementById("profilePic").src = "../assets/images/profil-pic.png";
            console.log("Profile picture deleted successfully");
        } else {
            console.error("Failed to delete profile picture");
        }
    } catch (error) {
        console.error("Error deleting profile picture:", error);
    }
}

// Token refresh checker
function startTokenChecker() {
    setInterval(() => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiry = new Date(payload.exp * 1000);
                const now = new Date();
                const minutesLeft = (expiry - now) / 1000 / 60;
                
                if (minutesLeft < 5 && minutesLeft > 0) {
                    console.log(`Token expires in ${Math.round(minutesLeft)} minutes`);
                } else if (minutesLeft <= 0) {
                    console.log("Token expired");
                }
            } catch (error) {
                console.error("Error checking token:", error);
            }
        }
    }, 5 * 60 * 1000); // Check every 5 minutes
}

// Start token checker
startTokenChecker();
   
