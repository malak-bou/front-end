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

// Fonction pour fermer la sidebar quand on clique en dehors
document.addEventListener('click', function(event) {
    var sidebar = document.getElementById("sidebar");
    var menuIcon = document.querySelector(".menuicon");
    var closeBtn = document.querySelector(".close-btn");

    // Si la sidebar est ouverte et qu'on clique ni sur la sidebar, ni sur le menu icon, ni sur le bouton close
    if (sidebar.style.width === "250px" && 
        !sidebar.contains(event.target) && 
        event.target !== menuIcon &&
        event.target !== closeBtn) {
        sidebar.style.width = "0";
    }
});

// Empêcher la propagation du clic depuis la sidebar
document.getElementById("sidebar").addEventListener('click', function(event) {
    event.stopPropagation();
});

// agrandissement de limage 

// Run filter every time the input changes
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

// valider le compet

document.addEventListener("DOMContentLoaded", function () {
    const requestsBody = document.getElementById("requests-body");
    const accountsBody = document.getElementById("accounts-body");
    const modal = document.getElementById("confirmationModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    let selectedRow = null;

    // Gestionnaire pour le bouton "Valider"
    requestsBody.addEventListener("click", function (e) {
        if (e.target.classList.contains("create")) {
            selectedRow = e.target.closest("tr");
            modal.style.display = "block";
        }
    });

    // Confirmation de la validation
    confirmBtn.addEventListener("click", function () {
        if (selectedRow) {
            const nom = selectedRow.cells[0].textContent;
            const prenom = selectedRow.cells[1].textContent;
            const department = selectedRow.cells[2].textContent;
            const fonction = selectedRow.cells[3].textContent;

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${nom}</td>
                <td>${prenom}</td>
                <td>${department}</td>
                <td>${fonction}</td>
                <td><button class="modify">Modifier</button></td>
                <td><button class="delete">Supprimer</button></td>
            `;
            accountsBody.appendChild(newRow);
            selectedRow.remove();
            setupDeleteConfirmation(); // Réinitialiser les gestionnaires d'événements
            updateNotificationDot(); // Mettre à jour la notification
        }
        modal.style.display = "none";
    });

    // Annulation de la validation
    cancelBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });

    // Fermeture du modal en cliquant à l'extérieur
    window.addEventListener("click", function (e) {
        if (e.target == modal) {
            modal.style.display = "none";
        }
    });
});

// modify

let editRow = null;

// Variables pour stocker les valeurs initiales
let savedValues = null;

function showEditConfirmPopup() {
    document.getElementById("confirmEditPopup").style.display = "flex";
}

function closeEditConfirmPopup() {
    document.getElementById("confirmEditPopup").style.display = "none";
    if (editRow) {
        // Restaurer les valeurs initiales
        if (savedValues) {
            editRow.cells[0].textContent = savedValues.nom;
            editRow.cells[1].textContent = savedValues.prenom;
            editRow.cells[2].textContent = savedValues.department;
            editRow.cells[3].textContent = savedValues.fonction;
            editRow.querySelector(".modify").textContent = "Modifier";
            savedValues = null;
        }
        editRow = null;
    }
}

// Fonction pour initialiser les boutons modifier
function initializeModifyButtons() {
    document.querySelectorAll(".modify").forEach(btn => {
        // Supprimer l'ancien écouteur d'événements s'il existe
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
        
        newBtn.addEventListener("click", function (e) {
            const row = e.target.closest("tr");

            if (e.target.textContent === "Modifier") {
                // Sauvegarder les valeurs initiales
                savedValues = {
                    nom: row.cells[0].textContent,
                    prenom: row.cells[1].textContent,
                    department: row.cells[2].textContent,
                    fonction: row.cells[3].textContent
                };

                for (let i = 0; i < 4; i++) {
                    const cell = row.cells[i];
                    if (i === 3) { // Si c'est la colonne "Function"
                        const select = document.createElement("select");
                        select.style.width = "100%";
                        select.style.padding = "5px";
                        select.style.borderRadius = "4px";
                        select.style.border = "1px solid #ddd";
                        select.innerHTML = `
                            <option value="Professeur" ${cell.textContent.trim() === "Professeur" ? "selected" : ""}>Professeur</option>
                            <option value="Employé" ${cell.textContent.trim() === "Employé" ? "selected" : ""}>Employé</option>
                            <option value="Administrateur" ${cell.textContent.trim() === "Administrateur" ? "selected" : ""}>Administrateur</option>
                        `;
                        cell.innerHTML = "";
                        cell.appendChild(select);
                    } else if (i === 2) { // Si c'est la colonne "Department"
                        const select = document.createElement("select");
                        select.style.width = "100%";
                        select.style.padding = "5px";
                        select.style.borderRadius = "4px";
                        select.style.border = "1px solid #ddd";
                        select.innerHTML = `
                            <option value="Center Regional Delegation" ${cell.textContent.trim() === "Center Regional Delegation" ? "selected" : ""}>Center Regional Delegation</option>
                            <option value="Information Technology" ${cell.textContent.trim() === "Information Technology" ? "selected" : ""}>Information Technology</option>
                            <option value="Human Resources" ${cell.textContent.trim() === "Human Resources" ? "selected" : ""}>Human Resources</option>
                            <option value="Marketing" ${cell.textContent.trim() === "Marketing" ? "selected" : ""}>Marketing</option>
                            <option value="Network" ${cell.textContent.trim() === "Network" ? "selected" : ""}>Network</option>
                            <option value="Underwriting" ${cell.textContent.trim() === "Underwriting" ? "selected" : ""}>Underwriting</option>
                            <option value="Legal and Compliance" ${cell.textContent.trim() === "Legal and Compliance" ? "selected" : ""}>Legal and Compliance</option>
                            <option value="Business Development" ${cell.textContent.trim() === "Business Development" ? "selected" : ""}>Business Development</option>
                            <option value="Claims" ${cell.textContent.trim() === "Claims" ? "selected" : ""}>Claims</option>
                            <option value="Reinsurance" ${cell.textContent.trim() === "Reinsurance" ? "selected" : ""}>Reinsurance</option>
                            <option value="Prevention" ${cell.textContent.trim() === "Prevention" ? "selected" : ""}>Prevention</option>
                            <option value="Finance & Accounting" ${cell.textContent.trim() === "Finance & Accounting" ? "selected" : ""}>Finance & Accounting</option>
                            <option value="Quality & Internal Control" ${cell.textContent.trim() === "Quality & Internal Control" ? "selected" : ""}>Quality & Internal Control</option>
                            <option value="Executive Management" ${cell.textContent.trim() === "Executive Management" ? "selected" : ""}>Executive Management</option>
                        `;
                        cell.innerHTML = "";
                        cell.appendChild(select);
                    } else {
                        const input = document.createElement("input");
                        input.value = cell.textContent;
                        input.style.width = "100%";
                        input.style.padding = "5px";
                        input.style.borderRadius = "4px";
                        input.style.border = "1px solid #ddd";
                        cell.innerHTML = "";
                        cell.appendChild(input);
                    }
                }
                e.target.textContent = "Enregistrer";
            } else {
                editRow = row;
                showEditConfirmPopup();
            }
        });
    });
}

// Initialiser les boutons au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    initializeModifyButtons();
    
    // Gestionnaire pour la validation des comptes
    const requestsBody = document.getElementById("requests-body");
    const accountsBody = document.getElementById("accounts-body");
    const modal = document.getElementById("confirmationModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    // Bouton "Modifier" dans le pop-up
    document.getElementById("confirmEditBtn").addEventListener("click", function () {
        if (!editRow) return;

        for (let i = 0; i < 4; i++) {
            const cell = editRow.cells[i];
            if (i === 3 || i === 2) {
                const select = cell.querySelector("select");
                if (select) {
                    cell.textContent = select.value;
                }
            } else {
                const input = cell.querySelector("input");
                if (input) {
                    cell.textContent = input.value;
                }
            }
        }

        editRow.querySelector(".modify").textContent = "Modifier";
        savedValues = null;
        editRow = null;
        closeEditConfirmPopup();
    });

    let selectedRow = null;

    requestsBody.addEventListener("click", function (e) {
        if (e.target.classList.contains("create")) {
            selectedRow = e.target.closest("tr");
            modal.style.display = "block";
        }
    });

    confirmBtn.addEventListener("click", function () {
        if (selectedRow) {
            const nom = selectedRow.cells[0].textContent;
            const prenom = selectedRow.cells[1].textContent;
            const department = selectedRow.cells[2].textContent;
            const fonction = selectedRow.cells[3].textContent;

            const newRow = document.createElement("tr");
            newRow.innerHTML = `
                <td>${nom}</td>
                <td>${prenom}</td>
                <td>${department}</td>
                <td>${fonction}</td>
                <td><button class="modify">Modifier</button></td>
                <td><button class="delete">Supprimer</button></td>
            `;
            accountsBody.appendChild(newRow);
            selectedRow.remove();
            
            // Réinitialiser tous les écouteurs d'événements
            initializeModifyButtons();
            setupDeleteConfirmation();
            updateNotificationDot();
        }
        modal.style.display = "none";
    });

    cancelBtn.addEventListener("click", function () {
        modal.style.display = "none";
    });
});

let rowToDelete = null;

function setupDeleteConfirmation() {
    document.querySelectorAll(".delete").forEach(button => {
        button.addEventListener("click", function () {
            rowToDelete = this.closest("tr");
            document.getElementById("confirmDeletePopup").style.display = "flex";
        });
    });

    document.getElementById("confirmDeleteBtn").addEventListener("click", function () {
        if (rowToDelete) {
            rowToDelete.remove();
            updateNotificationDot(); // Mettre à jour la notification après suppression
            rowToDelete = null;
        }
        closeDeleteConfirmPopup();
    });
}

function closeDeleteConfirmPopup() {
    document.getElementById("confirmDeletePopup").style.display = "none";
    rowToDelete = null;
}

window.onload = function () {
    setupDeleteConfirmation();
    updateNotificationDot();
};

// Fonction pour vérifier et mettre à jour la notification
function updateNotificationDot() {
    const requestsBody = document.getElementById("requests-body");
    const notificationDot = document.querySelector(".notification-dot");
    
    // Vérifie s'il y a des lignes visibles dans le tableau des demandes
    const visibleRows = requestsBody ? Array.from(requestsBody.rows).filter(row => row.style.display !== "none").length : 0;
    const hasPendingRequests = visibleRows > 0;
    localStorage.setItem("hasPendingAccountRequests", hasPendingRequests ? "true" : "false");

    if (notificationDot) {
        notificationDot.style.display = hasPendingRequests ? "block" : "none";
    }

    if (visibleRows > 0) {
        notificationDot.style.display = "block";
    } else {
        notificationDot.style.display = "none";
    }
}

// Exécuter au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    updateNotificationDot();
});

// ... rest of the existing code ...
  