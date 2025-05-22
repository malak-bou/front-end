const token = localStorage.getItem("token");
let eventsData = []; // variable globale pour stocker les événements backend

document.addEventListener("DOMContentLoaded", function() {
    fetch("https://backend-m6sm.onrender.com/calendar", {
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })
    .then(response => {
      if (!response.ok) throw new Error(`Erreur HTTP! Statut : ${response.status}`);
      return response.json();
    })
    .then(data => {
      // Filtrer les événements approuvés
      eventsData = data.filter(event => event.status === "Approuvé");

      updateWeekDisplay();
      renderEvents();
    })
    .catch(error => {
      console.error("Erreur lors du chargement des événements :", error);
    });
});

function toggleNav() {
  document.getElementById("sidebar").classList.toggle("active");
}

document.addEventListener('DOMContentLoaded', function () {
    const prevWeekButton = document.getElementById('prev-week');
    const nextWeekButton = document.getElementById('next-week');
    const dayHeaders = document.querySelectorAll('.day-header');
    const eventCells = document.querySelectorAll('.event-cell');

    let currentDate = new Date();
    let currentWeekStart = getWeekStart(currentDate);

    function getWeekStart(date) {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : (day === 6 ? 0 : 6 - day));
        const start = new Date(date);
        start.setDate(diff);
        start.setHours(0,0,0,0);
        return start;
    }

    function formatDate(date) {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${dayName} ${day}/${month}`;
    }

    function updateWeekDisplay() {
        for (let i = 0; i < dayHeaders.length; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(date.getDate() + i);
            dayHeaders[i].textContent = formatDate(date);
            dayHeaders[i].dataset.date = date.toISOString().split('T')[0];
        }

        eventCells.forEach(cell => {
            const colIndex = Array.from(cell.parentNode.children).indexOf(cell);
            if (colIndex > 0) {
                const date = new Date(currentWeekStart);
                date.setDate(date.getDate() + (colIndex - 1));
                cell.dataset.date = date.toISOString().split('T')[0];
            }
        });
    }

    function renderEvents() {
        // Nettoyer d'abord
        eventCells.forEach(cell => {
            cell.textContent = cell.dataset.time || '';
            cell.style.backgroundColor = "";
            cell.style.cursor = "default";
            cell.onclick = null;
        });

        eventsData.forEach(event => {
            const eventDate = new Date(event.date);
            const eventDateStr = eventDate.toISOString().split('T')[0]; // "2025-06-01"
            const startHour = event.time; // ex: "08:00"
            const endHourNum = (parseInt(startHour.split(":")[0]) + 1) % 24;
            const endHourStr = endHourNum.toString().padStart(2, '0') + ":00";
            const timeRange = `${startHour} - ${endHourStr}`;

            // Chercher la cellule correspondante
            eventCells.forEach(cell => {
                if (cell.dataset.date === eventDateStr && cell.dataset.time === timeRange) {
                    // Afficher l'event dans la cellule
                    if(event.link){
                      cell.innerHTML = `<a href="${event.link}" target="_blank" style="color: black; font-weight: bold; text-decoration: none;">${event.name}</a>`;
                    } else {
                      cell.textContent = event.name;
                      cell.style.fontWeight = "bold";
                    }
                    cell.style.backgroundColor = "#ADD8E6";
                    cell.style.textAlign = "center";
                    cell.style.cursor = "pointer";
                    cell.onclick = () => showPopup({
                      title: event.name,
                      prof: `${event.requested_by.prenom} ${event.requested_by.nom}`,
                      dept: event.departement,
                      time: timeRange,
                      link: event.link
                    });
                }
            });
        });
    }

    function showPopup(eventDetails) {
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
        popup.style.zIndex = 1000;
        popup.innerHTML = `
          <strong style="font-size:18px;">${eventDetails.title}</strong><br>
          <p>Professeur : ${eventDetails.prof}</p>
          <p>Département : ${eventDetails.dept}</p>
          <p>Heure : ${eventDetails.time}</p>
          ${eventDetails.link ? `<p><a href="${eventDetails.link}" target="_blank" style="color:#1976D2;">Rejoindre la conférence</a></p>` : ""}
          <button id="closePopup" style="background-color: #1976D2; color: white; padding: 5px 10px; border: none; cursor: pointer;">Fermer</button>
        `;
        document.body.appendChild(popup);
        document.getElementById("closePopup").addEventListener("click", () => popup.remove());
    }

    prevWeekButton.addEventListener('click', function () {
        currentWeekStart.setDate(currentWeekStart.getDate() - 7);
        updateWeekDisplay();
        renderEvents();
    });

    nextWeekButton.addEventListener('click', function () {
        currentWeekStart.setDate(currentWeekStart.getDate() + 7);
        updateWeekDisplay();
        renderEvents();
    });

    updateWeekDisplay();
    // Attention : renderEvents sera appelé dans fetch après récupération des données
});
