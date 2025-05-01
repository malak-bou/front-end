

document.addEventListener("DOMContentLoaded", function() {
    const events = {
        // IT
        "lundi-08:00 - 09:00": { title: "Développement Web Moderne", prof: "M. Lefevre", dept: "IT", time: "08:00 - 09:00" },
        "mardi-09:00 - 10:00": { title: "Introduction à la Cybersécurité", prof: "Mme. Dubois", dept: "IT", time: "09:00 - 10:00" },
        "mercredi-10:00 - 11:00": { title: "Cloud Computing et AWS", prof: "M. Morel", dept: "IT", time: "10:00 - 11:00" },
    
        // Network
        "jeudi-11:00 - 12:00": { title: "Administration Réseaux", prof: "M. Lambert", dept: "Network", time: "11:00 - 12:00" },
        "vendredi-13:00 - 14:00": { title: "Sécurité des Réseaux", prof: "Mme. Fontaine", dept: "Network", time: "13:00 - 14:00" },
        
        // Marketing
        "lundi-14:00 - 15:00": { title: "Stratégie Digitale et SEO", prof: "M. Girard", dept: "Marketing", time: "14:00 - 15:00" },
        "mardi-15:00 - 16:00": { title: "Marketing d’Influence", prof: "Mme. Pelletier", dept: "Marketing", time: "15:00 - 16:00" },
    
        // Legal & Compliance
        "mercredi-16:00 - 17:00": { title: "Droit du Numérique", prof: "M. Rousseau", dept: "Legal", time: "16:00 - 17:00" },
        "jeudi-08:00 - 09:00": { title: "RGPD et Protection des Données", prof: "Mme. Martin", dept: "Legal", time: "08:00 - 09:00" },
    
        // RH
        "vendredi-09:00 - 10:00": { title: "Gestion des Talents", prof: "M. Leroy", dept: "RH", time: "09:00 - 10:00" },
        "samedi-10:00 - 11:00": { title: "Psychologie du Travail", prof: "Mme. Caron", dept: "RH", time: "10:00 - 11:00" },
    
        // Underwriting
        "dimanche-11:00 - 12:00": { title: "Évaluation des Risques en Assurance", prof: "M. Mercier", dept: "Underwriting", time: "11:00 - 12:00" },
        "lundi-12:00 - 13:00": { title: "Principes de la Souscription", prof: "Mme. Blanchard", dept: "Underwriting", time: "12:00 - 13:00" }
    };
    

    document.querySelectorAll("td.event-cell").forEach(cell => {
    let day = cell.getAttribute("data-day").toLowerCase().trim(); // Assure que c'est bien en minuscules
    let time = cell.getAttribute("data-time").trim().replace(/\s+/g, ' '); // Évite les espaces en trop
    let key = `${day}-${time}`;

    console.log("Vérification de la clé générée :", key);
    console.log("Clés disponibles dans events :", Object.keys(events));

    if (events[key]) {
        cell.textContent = events[key].time;
        cell.style.backgroundColor = "#ADD8E6";
        cell.style.color = "black";
        cell.style.textAlign = "center";
        cell.style.fontWeight = "bold";
        cell.style.cursor = "pointer";
        cell.addEventListener("click", () => showPopup(events[key]));
    } else {
        // Afficher l'heure par défaut si aucun événement n'est trouvé
        cell.textContent = time;
        cell.style.color = "#999"; 
    }
});

    function showPopup(eventDetails, cell) {
        let popup = document.createElement("div");
        popup.style.position = "fixed";
        popup.style.top = "50%";
        popup.style.left = "50%";
        popup.style.transform = "translate(-50%, -50%)";
        popup.style.backgroundColor = "#E0F2F7";
        popup.style.color = "#000";
        popup.style.padding = "20px";
        popup.style.boxShadow = "0px 4px 10px rgba(0,0,0,0.2)";
        popup.style.borderRadius = "8px";
        popup.style.textAlign = "left";
        popup.innerHTML = `
             
            <strong style="font-size:18px;">${eventDetails.title}</strong><br>
            <p>Professeur : ${eventDetails.prof}</p>
            <p>Département : ${eventDetails.dept}</p>
             <p>Heure : ${eventDetails.time}</p>
            <button id="closePopup" style="background-color: #1976D2; color: white; padding: 5px 10px; border: none; cursor: pointer;">Fermer</button>
        `;

        document.body.appendChild(popup);

        document.getElementById("closePopup").addEventListener("click", function() {
            popup.remove();
        });
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const dayHeaders = document.querySelectorAll('.day-header');

    dayHeaders.forEach(header => {
        header.addEventListener('click', function () {
            // Supprimer la classe "active" de tous les en-têtes
            dayHeaders.forEach(h => h.classList.remove('active'));

            // Ajouter la classe "active" à l'en-tête cliqué
            this.classList.add('active');

            // Vous pouvez ajouter ici d'autres actions à effectuer lors du clic sur un jour
            console.log('Jour sélectionné :', this.dataset.day);
        });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');
    const dayHeaders = document.querySelectorAll('.day-header');
    const eventCells = document.querySelectorAll('.event-cell');

    let currentDate = new Date(); // Date actuelle
    let currentWeekStart = getWeekStart(currentDate); // Début de la semaine actuelle

    // Fonction pour obtenir le début de la semaine (samedi)
    function getWeekStart(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : (day === 6 ? 0 : 6 - day)); // Ajuster pour le samedi
        return new Date(date.setDate(diff));
    }

    // Fonction pour mettre à jour l'affichage de la semaine
    function updateWeekDisplay() {
        for (let i = 0; i < dayHeaders.length; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + i); // Ajouter i jours pour chaque jour de la semaine
            dayHeaders[i].textContent = formatDate(date);
            dayHeaders[i].dataset.day = date.toISOString().split('T')[0]; // Format ISO pour data-day
        }

        eventCells.forEach(cell => {
            const dayIndex = Array.from(dayHeaders).findIndex(header => header.dataset.day === cell.dataset.day);
            if (dayIndex === -1) {
                cell.textContent = ''; // Effacer les événements si le jour n'est pas dans la semaine affichée
            }
        });
    }

    // Fonction pour formater une date en "Jour jj/mm"
    function formatDate(date) {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${dayName} ${day}/${month}`;
    }

    // Gestion du clic sur le bouton "Semaine précédente"
    prevWeekButton.addEventListener('click', function () {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7); // Reculer d'une semaine
        updateWeekDisplay();
    });

    // Gestion du clic sur le bouton "Semaine suivante"
    nextWeekButton.addEventListener('click', function () {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Avancer d'une semaine
        updateWeekDisplay();
    });

    // Initialiser l'affichage de la semaine
    updateWeekDisplay();
});




document.addEventListener('DOMContentLoaded', function () {
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');
    const dayHeaders = document.querySelectorAll('.day-header');
    const eventCells = document.querySelectorAll('.event-cell');
    const weekDisplay = document.getElementById('week-display');

    let currentDate = new Date(); // Date actuelle
    let currentWeekStart = getWeekStart(currentDate); // Début de la semaine actuelle

    // Fonction pour obtenir le début de la semaine (samedi)
    function getWeekStart(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : (day === 6 ? 0 : 6 - day)); // Ajuster pour le samedi
        return new Date(date.setDate(diff));
    }

    // Fonction pour mettre à jour l'affichage de la semaine
    function updateWeekDisplay() {
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Ajouter 6 jours pour obtenir la fin de la semaine
        weekDisplay.textContent = formatDateRange(currentWeekStart, weekEnd);

        for (let i = 0; i < dayHeaders.length; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + i); // Ajouter i jours pour chaque jour de la semaine
            dayHeaders[i].textContent = formatDateDay(date);
            dayHeaders[i].dataset.day = date.toISOString().split('T')[0]; // Format ISO pour data-day
        }

        eventCells.forEach(cell => {
            const dayIndex = Array.from(dayHeaders).findIndex(header => header.dataset.day === cell.dataset.day);
            if (dayIndex === -1) {
                cell.textContent = ''; // Effacer les événements si le jour n'est pas dans la semaine affichée
            }
        });
    }

    // Fonction pour formater une plage de dates en "jj/mm - jj/mm/aaaa"
    function formatDateRange(start, end) {
        const startDay = start.getDate().toString().padStart(2, '0');
        const startMonth = (start.getMonth() + 1).toString().padStart(2, '0');
        const endDay = end.getDate().toString().padStart(2, '0');
        const endMonth = (end.getMonth() + 1).toString().padStart(2, '0');
        const year = start.getFullYear();
        return `${startDay}/${startMonth} - ${endDay}/${endMonth}/${year}`;
    }

    // Fonction pour formater une date en "Jour jj/mm"
    function formatDateDay(date) {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${dayName} ${day}/${month}`;
    }

    // Gestion du clic sur le bouton "Semaine précédente"
    prevWeekButton.addEventListener('click', function () {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7); // Reculer d'une semaine
        updateWeekDisplay();
    });

    // Gestion du clic sur le bouton "Semaine suivante"
    nextWeekButton.addEventListener('click', function () {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Avancer d'une semaine
        updateWeekDisplay();
    });

    // Gestion du clic sur un jour
    dayHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const clickedDate = new Date(this.dataset.day);
            currentWeekStart = getWeekStart(clickedDate); // Mettre à jour le début de la semaine
            updateWeekDisplay();
        });
    });

    // Initialiser l'affichage de la semaine
    updateWeekDisplay();
});
document.addEventListener('DOMContentLoaded', function () {
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');
    const dayHeaders = document.querySelectorAll('.day-header');
    const eventCells = document.querySelectorAll('.event-cell');
    const weekDisplay = document.getElementById('week-display');

    let currentDate = new Date(); // Date actuelle
    let currentWeekStart = getWeekStart(currentDate); // Début de la semaine actuelle

    // Fonction pour obtenir le début de la semaine (samedi)
    function getWeekStart(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : (day === 6 ? 0 : 6 - day)); // Ajuster pour le samedi
        return new Date(date.setDate(diff));
    }

    // Fonction pour mettre à jour l'affichage de la semaine
    function updateWeekDisplay() {
        const weekStart = new Date(currentWeekStart);
        const weekEnd = new Date(currentWeekStart);
        weekEnd.setDate(weekEnd.getDate() + 6); // Ajouter 6 jours pour obtenir la fin de la semaine
        weekDisplay.textContent = formatDateRange(weekStart, weekEnd);

        for (let i = 0; i < dayHeaders.length; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + i); // Ajouter i jours pour chaque jour de la semaine
            dayHeaders[i].textContent = formatDateDay(date);
            dayHeaders[i].dataset.day = date.toISOString().split('T')[0]; // Format ISO pour data-day
        }

        eventCells.forEach(cell => {
            const dayIndex = Array.from(dayHeaders).findIndex(header => header.dataset.day === cell.dataset.day);
            if (dayIndex === -1) {
                cell.textContent = ''; // Effacer les événements si le jour n'est pas dans la semaine affichée
            }
        });
    }

    // Fonction pour formater une plage de dates en "Mois jj - jj, aaaa"
    function formatDateRange(start, end) {
        const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
        const startDay = start.getDate();
        const startMonth = months[start.getMonth()];
        const endDay = end.getDate();
        const year = start.getFullYear();
        return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }

    // Fonction pour formater une date en "Jour jj/mm"
    function formatDateDay(date) {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${dayName} ${day}/${month}`;
    }

    // Gestion du clic sur le bouton "Semaine précédente"
    prevWeekButton.addEventListener('click', function () {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7); // Reculer d'une semaine
        updateWeekDisplay();
    });

    // Gestion du clic sur le bouton "Semaine suivante"
    nextWeekButton.addEventListener('click', function () {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7); // Avancer d'une semaine
        updateWeekDisplay();
    });

    // Gestion du clic sur un jour
    dayHeaders.forEach(header => {
        header.addEventListener('click', function () {
            const clickedDate = new Date(this.dataset.day);
            currentWeekStart = getWeekStart(clickedDate); // Mettre à jour le début de la semaine
            updateWeekDisplay();
        });
    });

    // Initialiser l'affichage de la semaine
    updateWeekDisplay();
});


function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
  }
