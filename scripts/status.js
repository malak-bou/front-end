// Stockage des formations (dans un vrai projet, cela serait dans une base de données)
let formations = [];

// Fonction pour faire défiler jusqu'au formulaire
function scrollToForm() {
    const formContainer = document.querySelector('.form-container');
    formContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Fonction pour gérer l'affichage du champ de lien
function handleFormationType() {
    const formationType = document.getElementById('formation-type');
    const formationLink = document.getElementById('formation-link');
    
    if (formationType.value === 'En ligne') {
        formationLink.removeAttribute('disabled');
        formationLink.setAttribute('required', 'required');
        formationLink.style.opacity = '1';
    } else {
        formationLink.setAttribute('disabled', 'disabled');
        formationLink.removeAttribute('required');
        formationLink.value = ''; // Clear the link when disabled
        formationLink.style.opacity = '0.5';
    }
}

// Fonction pour ajouter une nouvelle formation
function addFormation(event) {
    event.preventDefault();
    
    const newFormation = {
        professor: document.getElementById('prof-name').value,
        name: document.getElementById('formation-name').value,
        date: document.getElementById('datePicker').value,
        time: document.getElementById('timePicker').value,
        description: document.getElementById('formation-description').value,
        type: document.getElementById('formation-type').value,
        link: document.getElementById('formation-link').value,
        status: 'En attente',  // Statut initial
        id: Date.now() // Ajouter un identifiant unique
    };
    
    formations.push(newFormation);
    updateTable();
    document.getElementById('formation-form').reset();
    document.getElementById('preview').style.display = 'none';
    handleFormationType(); // Reset link field state
}

// Fonction pour supprimer une formation
function removeFormation(id) {
    formations = formations.filter(formation => formation.id !== id);
    updateTable();
}

// Fonction pour mettre à jour le tableau
function updateTable() {
    const tableBody = document.getElementById('formation-table-body');
    tableBody.innerHTML = '';
    
    formations.forEach((formation) => {
        const row = document.createElement('tr');
        
        // Créer la cellule de checkbox
        const checkboxCell = document.createElement('td');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'formation-checkbox';
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Ajouter une classe pour l'animation de disparition
                row.classList.add('fade-out');
                // Attendre la fin de l'animation avant de supprimer
                setTimeout(() => {
                    removeFormation(formation.id);
                }, 500); // Correspond à la durée de l'animation CSS
            }
        });
        checkboxCell.appendChild(checkbox);
        row.appendChild(checkboxCell);
        
        // Créer les cellules pour les informations de la formation
        const nameCell = document.createElement('td');
        nameCell.textContent = formation.name;
        
        const typeCell = document.createElement('td');
        typeCell.textContent = formation.type;
        
        const dateCell = document.createElement('td');
        dateCell.textContent = `${formation.date} ${formation.time}`;
        
        // Créer la cellule de statut
        const statusCell = document.createElement('td');
        const statusSpan = document.createElement('span');
        statusSpan.className = `status ${formation.status.toLowerCase().replace(' ', '-')}`;
        statusSpan.textContent = formation.status;
        statusCell.appendChild(statusSpan);
        
        // Ajouter toutes les cellules à la ligne
        row.appendChild(nameCell);
        row.appendChild(typeCell);
        row.appendChild(dateCell);
        row.appendChild(statusCell);
        
        // Ajouter la ligne au tableau
        tableBody.appendChild(row);
    });
}

// Gestion de l'aperçu de l'image
const fileInput = document.getElementById('file-upload');
const preview = document.getElementById('preview');

fileInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    } else {
        preview.style.display = 'none';
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    // Gérer le bouton d'ajout de formation
    const addFormationButton = document.getElementById('add-formation');
    addFormationButton.addEventListener('click', scrollToForm);

    // Gérer la soumission du formulaire
    const form = document.getElementById('formation-form');
    form.addEventListener('submit', addFormation);

    // Gérer le changement de type de formation
    const formationType = document.getElementById('formation-type');
    formationType.addEventListener('change', handleFormationType);
    
    // Initialiser l'état du champ de lien
    handleFormationType();

    // Gérer le bouton Annuler
    document.querySelector('.cancel').addEventListener('click', function(e) {
        e.preventDefault();
        const form = document.getElementById('formation-form');
        form.reset();
        
        // Réinitialiser l'aperçu de l'image
        const preview = document.getElementById('preview');
        if (preview) {
            preview.src = '';
            preview.style.display = 'none';
        }
        
        // Réinitialiser l'état du champ de lien
        handleFormationType();
    });

    // Initialiser le tableau
    updateTable();
});

const dateInput = document.getElementById('datePicker');
const selectedDateLabel = document.getElementById('selectedDate');

dateInput.addEventListener('change', function() {
  selectedDateLabel.textContent = dateInput.value;
});
// add formation button//
const timeInput = document.getElementById('timePicker');
const selectedHourLabel = document.getElementById('selectedHour');

timeInput.addEventListener('change', function () {
  const timeValue = timeInput.value; // e.g. "14:30"
  const hourOnly = timeValue.split(':')[0]; // "14"
  selectedHourLabel.textContent = hourOnly + ":00";
});

// Nav barre

// Fonction pour gérer l'affichage de la barre de navigation
function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
}






