document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("token");
if (!token) {
  window.location.href = "../index.html";
  return;
}

// Ouvrir modal et préremplir avec données utilisateur
async function openEditUserModal(id) {
    try {
      const response = await fetch('https://backend-m6sm.onrender.com/public/users', {
        headers: { "Authorization": `Bearer ${token}` } // si besoin, sinon enlève cette ligne
      });
      if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");
      const users = await response.json();
  
      const user = users.find(u => u.id == id);
      if (!user) throw new Error("Utilisateur non trouvé");
  
      document.getElementById("editUserId").value = user.id;
      document.getElementById("editNom").value = user.nom;
      document.getElementById("editPrenom").value = user.prenom;
      document.getElementById("editDepartement").value = user.departement;
      document.getElementById("editRole").value = user.role;
  
      document.getElementById("editUserModal").style.display = "flex";
    } catch (error) {
      alert(error.message);
    }
  }
  

// Fermer modal
function closeEditUserModal() {
  document.getElementById("editUserModal").style.display = "none";
}

document.getElementById("closeModalBtn").addEventListener("click", closeEditUserModal);

// Soumettre formulaire modif
document.getElementById("editUserForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const id = document.getElementById("editUserId").value;
  const nom = document.getElementById("editNom").value.trim();
  const prenom = document.getElementById("editPrenom").value.trim();
  const departement = document.getElementById("editDepartement").value.trim();
  const role = document.getElementById("editRole").value.trim();

  try {
    const res = await fetch(`https://backend-m6sm.onrender.com/admin/users/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nom, prenom, departement, role })
    });
    if (!res.ok) throw new Error("Erreur lors de la mise à jour");

    alert("Modification réussie !");
    closeEditUserModal();
    loadExistingAccounts();  // Recharge la liste
  } catch (error) {
    alert(error.message);
  }
});

// Attacher événement aux boutons Modifier (à appeler après affichage des comptes)
function attachModifyButtons() {
  document.querySelectorAll(".modify").forEach(button => {
    button.addEventListener("click", function() {
      const id = this.getAttribute("data-user-id");
      openEditUserModal(id);
    });
  });
}


    // Charger les demandes en attente et les comptes existants
    loadPendingRequests();
    loadExistingAccounts();

    // Function to handle 'Créer' button click
    document.querySelectorAll(".create").forEach(button => {
        button.addEventListener("click", async function () {
            const userId = this.getAttribute("data-user-id");
            try {
                const response = await fetch(`https://backend-m6sm.onrender.com/admin/approve-user/${userId}`, {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        is_approved: true
                    })
                });

                if (response.ok) {
                    alert("Un nouveau compte a été créé !");
                    loadPendingRequests();
                    loadExistingAccounts();
                } else {
                    alert("Erreur lors de la création du compte");
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Erreur lors de la création du compte");
            }
        });
    });

    // Function to handle 'Modifier' button click
    document.querySelectorAll(".modify").forEach(button => {
        button.addEventListener("click", function () {
            const userId = this.getAttribute("data-user-id");
            openEditUserModal({ id: userId });
        });
    });

    // Function to handle 'Supprimer' button click
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", async function () {
            const userId = this.getAttribute("data-user-id");
            if (confirm("Voulez-vous vraiment supprimer cet élément ?")) {
                try {
                    const response = await fetch(`https://backend-m6sm.onrender.com/admin/users/${userId}`, {
                        method: "DELETE",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        this.closest("tr").remove();
                        alert("Élément supprimé !");
                        loadPendingRequests();
                        loadExistingAccounts();
                    } else {
                        alert("Erreur lors de la suppression");
                    }
                } catch (error) {
                    console.error("Erreur:", error);
                    alert("Erreur lors de la suppression");
                }
            }
        });
    });

    // =========================
    // 1. DEMANDES EN ATTENTE
    // =========================

    // GET toutes les demandes en attente
    // URL : https://backend-m6sm.onrender.com/admin/pending-users
    async function loadPendingRequests() {
        try {
            const response = await fetch("https://backend-m6sm.onrender.com/admin/pending-users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des demandes");
            }

            const users = await response.json();
            displayPendingRequests(users);
        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger les demandes en attente");
        }
    }

    // Affiche les demandes dans le tableau dédié
    function displayPendingRequests(users) {
        const tbody = document.getElementById("requests-body");
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = "<tr><td colspan='6'>Aucune demande en attente</td></tr>";
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.nom}</td>
                <td>${user.prenom}</td>
                <td>${user.departement}</td>
                <td>${user.role}</td>
                <td><button class="create" data-user-id="${user.id}">Créer</button></td>
                <td><button class="delete" data-user-id="${user.id}">Supprimer</button></td>
            </tr>
        `).join("");

        attachButtonEvents();
    }

    // =========================
    // 2. COMPTES EXISTANTS
    // =========================

    // GET tous les comptes existants
    // URL : https://backend-m6sm.onrender.com/public/users
    async function loadExistingAccounts() {
        try {
            const response = await fetch("https://backend-m6sm.onrender.com/public/users", {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error("Erreur lors du chargement des comptes");
            }

            const users = await response.json();
            displayExistingAccounts(users);
            attachModifyButtons();

        } catch (error) {
            console.error("Erreur:", error);
            showError("Impossible de charger les comptes existants");
        }
    }

    // Affiche les comptes existants dans le tableau dédié
    function displayExistingAccounts(users) {
        const tbody = document.getElementById("accounts-body");
        if (!tbody) return;

        // Filtrer pour n'afficher que les comptes approuvés
        const approvedUsers = users.filter(user => user.is_approved);

        if (approvedUsers.length === 0) {
            tbody.innerHTML = "<tr><td colspan='6'>Aucun compte existant</td></tr>";
            return;
        }

        tbody.innerHTML = approvedUsers.map(user => `
            <tr>
                <td>${user.nom}</td>
                <td>${user.prenom}</td>
                <td>${user.departement}</td>
                <td>${user.role}</td>
                <td><button class="modify" data-user-id="${user.id}">Modifier</button></td>
                <td><button class="delete" data-user-id="${user.id}">Supprimer</button></td>
            </tr>
        `).join("");

        attachButtonEvents();
    }

    // =========================
    // 3. EVENEMENTS BOUTONS
    // =========================

    function attachButtonEvents() {
        // Valider une demande (approuver)
        // POST https://backend-m6sm.onrender.com/admin/approve-user/{user_id}
        document.querySelectorAll(".create").forEach(button => {
            button.addEventListener("click", async function () {
                const userId = this.getAttribute("data-user-id");
                try {
                    const response = await fetch(`https://backend-m6sm.onrender.com/admin/approve-user/${userId}`, {
                        method: "POST",
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            is_approved: true
                        })
                    });

                    if (response.ok) {
                        alert("Un nouveau compte a été créé !");
                        this.closest("tr").remove();
                        loadExistingAccounts();
                    } else {
                        alert("Erreur lors de la création du compte");
                    }
                } catch (error) {
                    console.error("Erreur:", error);
                    alert("Erreur lors de la création du compte");
                }
            });
        });

        // Modifier un compte existant
        document.querySelectorAll(".modify").forEach(button => {
            button.addEventListener("click", function () {
                const userId = this.getAttribute("data-user-id");
                async function openEditUserModal(id) {
                    try {
                      const response = await fetch('https://backend-m6sm.onrender.com/public/users', {
                        headers: { "Authorization": `Bearer ${token}` } // si besoin, sinon enlève cette ligne
                      });
                      if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");
                      const users = await response.json();
                  
                      const user = users.find(u => u.id == id);
                      if (!user) throw new Error("Utilisateur non trouvé");
                  
                      document.getElementById("editUserId").value = user.id;
                      document.getElementById("editNom").value = user.nom;
                      document.getElementById("editPrenom").value = user.prenom;
                      document.getElementById("editDepartement").value = user.departement;
                      document.getElementById("editRole").value = user.role;
                  
                      document.getElementById("editUserModal").style.display = "flex";
                    } catch (error) {
                      alert(error.message);
                    }
                  }
                  
            });
        });

        // Supprimer une demande ou un compte
        // DELETE https://backend-m6sm.onrender.com/admin/users/{user_id}
        document.querySelectorAll(".delete").forEach(button => {
            button.addEventListener("click", async function () {
                const userId = this.getAttribute("data-user-id");
                if (confirm("Voulez-vous vraiment supprimer cette demande ou ce compte ?")) {
                    try {
                        const response = await fetch(`https://backend-m6sm.onrender.com/admin/users/${userId}`, {
                            method: "DELETE",
                            headers: {
                                "Authorization": `Bearer ${token}`
                            }
                        });

                        if (response.ok) {
                            this.closest("tr").remove();
                            alert("Suppression réussie !");
                        } else {
                            alert("Erreur lors de la suppression");
                        }
                    } catch (error) {
                        console.error("Erreur:", error);
                        alert("Erreur lors de la suppression");
                    }
                }
            });
        });
    }

    // =========================
    // 4. MESSAGES UTILITAIRES
    // =========================

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-error';
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);
        setTimeout(() => errorDiv.remove(), 3000);
    }

    function showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success';
        successDiv.textContent = message;
        document.body.appendChild(successDiv);
        setTimeout(() => successDiv.remove(), 3000);
    }
});

// Function to open/close the sidebar
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
    } else {
        sidebar.style.width = "250px";
    }
}

// Gestion de l'image de profil
document.addEventListener("DOMContentLoaded", function () {
    const profilePic = document.querySelector(".profileimg");
    if (profilePic) {
        profilePic.addEventListener("click", function () {
            const overlay = document.createElement("div");
            overlay.style.position = "fixed";
            overlay.style.top = "0";
            overlay.style.left = "0";
            overlay.style.width = "100vw";
            overlay.style.height = "100vh";
            overlay.style.background = "rgba(0, 0, 0, 0.7)";
            overlay.style.display = "flex";
            overlay.style.alignItems = "center";
            overlay.style.justifyContent = "center";
            overlay.style.zIndex = "1000";

            const enlargedImg = document.createElement("img");
            enlargedImg.src = profilePic.src;
            enlargedImg.style.width = "300px";
            enlargedImg.style.height = "300px";
            enlargedImg.style.borderRadius = "50%";
            enlargedImg.style.border = "5px solid white";
            enlargedImg.style.cursor = "pointer";

            overlay.appendChild(enlargedImg);
            document.body.appendChild(overlay);

            overlay.addEventListener("click", function () {
                document.body.removeChild(overlay);
            });
        });
    }
}); 
document.getElementById("search-bar").addEventListener("input", function() {
    filterTable();
    updateNotificationDot(); // Mettre à jour la notification après le filtrage
});

function filterTable() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase().trim();
    const requestsRows = document.querySelectorAll("#requests-body tr");
    const accountsRows = document.querySelectorAll(".accounts tbody tr");
    filterRows(requestsRows, searchValue);
    filterRows(accountsRows, searchValue);
}

function filterRows(rows, value) {
    rows.forEach(row => {
        const name = row.cells[0]?.textContent.toLowerCase();
        const prenom = row.cells[1]?.textContent.toLowerCase();


        if (name.includes(value) || prenom.includes(value)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}
