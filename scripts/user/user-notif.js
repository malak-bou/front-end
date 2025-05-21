// side barre

    // Fonction pour gérer l'affichage de la barre de navigation
function toggleNav() {
        document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
}


// Function to display a notification's content
function showNotification(element) {
    document.querySelector(".main-content").innerHTML = `<p>${element.innerText}</p>`;
    element.classList.remove("unread"); // Mark as read
    element.dataset.read = "true"; // Store read status in data attribute
}

// Function to filter only mentions
function filterMentions() {
    let notifications = document.querySelectorAll(".notification");
    notifications.forEach((notif) => {
        notif.style.display = notif.dataset.type === "mention" ? "block" : "none";
    });
}

// Function to filter only unread notifications
function filterUnread() {
    let notifications = document.querySelectorAll(".notification");
    notifications.forEach((notif) => {
        notif.style.display = notif.classList.contains("unread") ? "block" : "none";
    });
}

// Function to reset filter and show all notifications
function showAllNotifications() {
    document.querySelectorAll(".notification").forEach((notif) => {
        notif.style.display = "block";
    });
}

// Function to generate a timestamp in HH:MM format
function getTimestamp() {
    let now = new Date();
    return `${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;
}

// Sort notifications by timestamp (latest first)
function sortNotifications() {
    let notificationList = document.querySelector(".notifications");
    let notifications = Array.from(notificationList.children);
    
    notifications.sort((a, b) => {
        let timeA = a.querySelector(".timestamp").innerText;
        let timeB = b.querySelector(".timestamp").innerText;
        return timeB.localeCompare(timeA);
    });

    // Re-append sorted notifications
    notifications.forEach((notif) => notificationList.appendChild(notif));
}

// Initialize timestamps for unread notifications
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".notification.unread").forEach((notif) => {
        notif.querySelector(".timestamp").innerText = getTimestamp();
    });
    sortNotifications(); // Sort after adding timestamps
});


function showNotification(element) {
    let contentArea = document.querySelector(".main-content");
    let backButton = document.getElementById("backButton");
    let sidebar = document.querySelector(".sidebar1");

    // Modifier le contenu de la notification
    contentArea.innerHTML = `
        <span id="backButton" class="material-symbols-outlined" onclick="HideNotif()">arrow_back</span>
        <div class="notif">${element.dataset.content}</div>`;

    // Cacher la sidebar et afficher le contenu principal
    sidebar.classList.add("hidden");
    contentArea.classList.add("visible");
}

function HideNotif() {
    let contentArea = document.querySelector(".main-content");
    let sidebar = document.querySelector(".sidebar1");

    // Réinitialiser le texte
    contentArea.innerHTML = `<p>Sélectionnez une notification pour voir les détails.</p>`;

    // Réafficher la sidebar et cacher le contenu
    sidebar.classList.remove("hidden");
    contentArea.classList.remove("visible");
}

// Function to fetch notifications from the backend
async function fetchNotifications() {
    try {
        // Check if user is authenticated
        const token = localStorage.getItem('token');
        if (!token) {
            showListErrorMessage('Veuillez vous connecter pour voir vos notifications');
            return;
        }

        const response = await fetch('https://backend-m6sm.onrender.com/notifications/?unread_only=false&sort_by=created_at&sort_order=desc', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            showListErrorMessage('Session expirée. Veuillez vous reconnecter.');
            return;
        }

        if (response.status === 403) {
            showListErrorMessage('Accès non autorisé aux notifications.');
            return;
        }

        if (!response.ok) {
            throw new Error(`Erreur serveur: ${response.status}`);
        }

        const data = await response.json();
        const notificationsList = document.querySelector('.notifications');
        notificationsList.innerHTML = ''; // Clear existing notifications

        if (data.notifications.length === 0) {
            notificationsList.innerHTML = `
                <li class="no-notifications">
                    <i class="fas fa-bell-slash"></i>
                    <p>Aucune notification</p>
                </li>
            `;
            return;
        }

        // Update notification count in the UI
        updateNotificationCount(data.unread_count);

        data.notifications.forEach(notif => {
            const li = document.createElement('li');
            li.className = `notification ${notif.is_read ? '' : 'unread'}`;
            li.dataset.type = notif.type || 'general';
            li.dataset.content = notif.message;
            li.onclick = () => showNotification(li);
            
            const timestamp = document.createElement('span');
            timestamp.className = 'timestamp';
            timestamp.textContent = new Date(notif.created_at).toLocaleTimeString();
            
            li.innerHTML = `
                <div class="notification-content">
                    <div class="notification-text">
                        <div class="notification-title">${notif.title}</div>
                    </div>
                </div>
            `;
            li.appendChild(timestamp);
            notificationsList.appendChild(li);
        });

    } catch (error) {
        console.error('Error fetching notifications:', error);
        if (error.message.includes('Failed to fetch')) {
            showListErrorMessage('Impossible de se connecter au serveur. Vérifiez votre connexion internet.');
        } else {
            showListErrorMessage('Une erreur est survenue lors du chargement des notifications.');
        }
    }
}

// Function to update notification count in the UI
function updateNotificationCount(count) {
    const notificationDot = document.querySelector('.notification-dot');
    if (notificationDot) {
        if (count > 0) {
            notificationDot.style.display = 'block';
            notificationDot.textContent = count > 99 ? '99+' : count;
        } else {
            notificationDot.style.display = 'none';
        }
    }
}

// Function to show error message in the main content area
function showErrorMessage(message) {
    const mainContent = document.querySelector('.main-content');
    mainContent.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="fetchNotifications()">Réessayer</button>
        </div>
    `;
}

// Function to show error message in the notifications list
function showListErrorMessage(message) {
    const notificationsList = document.querySelector('.notifications');
    notificationsList.innerHTML = `
        <li class="error-notification">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <button onclick="fetchNotifications()">Réessayer</button>
        </li>
    `;
}

// Update the DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", () => {
    fetchNotifications(); // Fetch notifications when page loads
    // Set up periodic refresh every 30 seconds
    setInterval(fetchNotifications, 30000);
});


