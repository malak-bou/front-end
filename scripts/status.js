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

fetchAndDisplayConferences()

// Fonction pour supprimer les conférences sélectionnées
async function deleteSelectedConferences() {
    const checkboxes = document.querySelectorAll('.formation-checkbox:checked');
    if (checkboxes.length === 0) {
        alert('Veuillez sélectionner au moins une conférence à supprimer');
        return;
    }

    if (!confirm(`Êtes-vous sûr de vouloir supprimer ${checkboxes.length} conférence(s) ?`)) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const rows = Array.from(checkboxes).map(checkbox => checkbox.closest('tr'));
        
        for (const row of rows) {
            const nameCell = row.querySelector('.formation-name');
            const name = nameCell.textContent;
            
            // Ajouter une classe pour l'animation de disparition
            row.classList.add('fade-out');
            
            // Attendre la fin de l'animation avant de supprimer
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Supprimer la conférence de la base de données
            try {
                const response = await fetch(`https://backend-m6sm.onrender.com/conferences/${name}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erreur lors de la suppression de la conférence: ${response.status}`);
                }

                // Supprimer la ligne du DOM
                row.remove();
            } catch (error) {
                console.error('Error deleting conference:', error);
                alert(`Erreur lors de la suppression de la conférence "${name}"`);
                // Retirer la classe d'animation en cas d'erreur
                row.classList.remove('fade-out');
            }
        }

        // Rafraîchir la liste des conférences
        await fetchAndDisplayConferences();
        
    } catch (error) {
        console.error('Error in delete process:', error);
        alert('Erreur lors de la suppression des conférences');
    }
}

// Fonction pour récupérer les conférences depuis l'API
async function fetchAndDisplayConferences() {
    try {
        console.log('Fetching conferences...');
        const token = localStorage.getItem('token');
        console.log('Token:', token ? 'Present' : 'Missing');

        const response = await fetch('https://backend-m6sm.onrender.com/prof/my-conferences', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch conferences: ${response.status}`);
        }

        const conferences = await response.json();
        console.log('Conferences received:', conferences);

        const tableBody = document.getElementById('formation-table-body');
        if (!tableBody) {
            console.error('Table body element not found!');
            return;
        }
        
        tableBody.innerHTML = '';

        if (conferences.length === 0) {
            console.log('No conferences to display');
            tableBody.innerHTML = `
                <tr>
                    <td><input type="checkbox" class="formation-checkbox"></td>
                    <td class="formation-name">Aucune conférence trouvée</td>
                    <td class="formation-type"></td>
                    <td class="formation-date"></td>
                    <td class="formation-status"></td>
                </tr>`;
            return;
        }

        conferences.forEach((conference) => {
            console.log('Processing conference:', conference);
            const row = document.createElement('tr');
            
            // Créer la cellule de checkbox
            const checkboxCell = document.createElement('td');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'formation-checkbox';
            checkboxCell.appendChild(checkbox);
            
            // Créer les cellules pour les informations de la conférence
            const nameCell = document.createElement('td');
            nameCell.className = 'formation-name';
            nameCell.textContent = conference.name;
            
            const typeCell = document.createElement('td');
            typeCell.className = 'formation-type';
            typeCell.textContent = conference.type;
            
            const dateCell = document.createElement('td');
            dateCell.className = 'formation-date';
            const conferenceDate = new Date(conference.date);
            dateCell.textContent = `${conferenceDate.toLocaleDateString()} ${conference.time}`;
            
            // Créer la cellule de statut
            const statusCell = document.createElement('td');
            statusCell.className = 'formation-status';
            const statusSpan = document.createElement('span');
            statusSpan.className = `status ${conference.status.toLowerCase()}`;
            statusSpan.textContent = conference.status;
            statusCell.appendChild(statusSpan);
            
            // Ajouter toutes les cellules à la ligne
            row.appendChild(checkboxCell);
            row.appendChild(nameCell);
            row.appendChild(typeCell);
            row.appendChild(dateCell);
            row.appendChild(statusCell);
            
            // Ajouter la ligne au tableau
            tableBody.appendChild(row);
        });

        // Ajouter le bouton de suppression si ce n'est pas déjà fait
        if (!document.getElementById('delete-selected')) {
            const deleteButton = document.createElement('button');
            deleteButton.id = 'delete-selected';
            deleteButton.className = 'delete-button';
            deleteButton.textContent = 'Supprimer la sélection';
            deleteButton.onclick = deleteSelectedConferences;
            document.querySelector('.table-container').appendChild(deleteButton);
        }
    } catch (error) {
        console.error('Error fetching conferences:', error);
        const tableBody = document.getElementById('formation-table-body');
        if (tableBody) {
            tableBody.innerHTML = `
                <tr>
                    <td><input type="checkbox" class="formation-checkbox"></td>
                    <td class="formation-name">Erreur lors du chargement des conférences</td>
                    <td class="formation-type"></td>
                    <td class="formation-date"></td>
                    <td class="formation-status"></td>
                </tr>`;
        }
    }
}

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
    fetchAndDisplayConferences();
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







