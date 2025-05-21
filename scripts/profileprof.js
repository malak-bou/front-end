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

function setupProfileFeatures(token = null, userInfo = null) {
    const profilePic = document.getElementById("profilePic");
    const uploadInput = document.getElementById("uploadProfilePic");
    const changePicBtn = document.getElementById("changePicBtn");
    const deletePicBtn = document.getElementById("deletePicBtn");
    const defaultImage = "../assets/images/profil-pic.png";

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

    if (changePicBtn) {
        changePicBtn.addEventListener("click", () => uploadInput.click());
    }

    if (deletePicBtn) {
        deletePicBtn.addEventListener("click", async () => {
            if (token) {
                await deleteProfilePictureFromBackend(token);
            } else {
                profilePic.src = defaultImage;
            }
        });
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
