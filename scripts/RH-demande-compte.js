


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




// agrandissement de limage 





  // Run filter every time the input changes
  document.getElementById("search-bar").addEventListener("input", filterTable);

  function filterTable() {
    const searchValue = document.getElementById("search-bar").value.toLowerCase().trim();

    // Rows from "Les demandes"
    const requestsRows = document.querySelectorAll("#requests-body tr");

    // Rows from "La liste des comptes"
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
    }
    modal.style.display = "none";
  });

  cancelBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside
  window.addEventListener("click", function (e) {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  });
});

// modify


  let editRow = null;

  function showEditConfirmPopup() {
    document.getElementById("confirmEditPopup").style.display = "flex";
  }

  function closeEditConfirmPopup() {
    if (editRow) {
      // Annuler les modifications visuelles (remettre le texte original)
      for (let i = 0; i < 4; i++) {
        const cell = editRow.cells[i];
        const input = cell.querySelector("input");
        if (input) {
          cell.textContent = input.defaultValue; // valeur initiale
        }
      }
      // Remettre le bouton à "Modifier"
      editRow.querySelector(".modify").textContent = "Modifier";
      editRow = null;
    }
  
    // Fermer le popup
    document.getElementById("confirmEditPopup").style.display = "none";
  }
  

  document.addEventListener("DOMContentLoaded", function () {
    // Gestion du bouton "Modifier"
    document.querySelectorAll(".modify").forEach(btn => {
      btn.addEventListener("click", function (e) {
        const row = e.target.closest("tr");

        if (e.target.textContent === "Modifier") {
          for (let i = 0; i < 4; i++) {
            const cell = row.cells[i];
            const input = document.createElement("input");
            input.defaultValue = cell.textContent;
            input.value = cell.textContent;
            cell.innerHTML = "";
            cell.appendChild(input);
          }
          e.target.textContent = "Enregistrer";
        } else {
          // Stocker la ligne temporaire + montrer le pop-up
          editRow = row;
          showEditConfirmPopup();
        }
      });
    });

    // Bouton "Oui" dans le pop-up
    document.getElementById("confirmEditBtn").addEventListener("click", function () {
      if (!editRow) return;

      for (let i = 0; i < 4; i++) {
        const cell = editRow.cells[i];
        const input = cell.querySelector("input");
        if (input) {
          cell.textContent = input.value;
        }
      }

      editRow.querySelector(".modify").textContent = "Modifier";
      editRow = null;
      closeEditConfirmPopup();
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
    // appelle aussi d'autres fonctions ici si besoin
  };
  