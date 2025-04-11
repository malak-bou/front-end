document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");

    // Gestion de la Sidebar
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", function () {
            sidebar.classList.toggle("active");
        });
    }

    // Fermer la sidebar en cliquant en dehors
    document.addEventListener("click", function (event) {
        if (!sidebar.contains(event.target) && !toggleBtn.contains(event.target)) {
            sidebar.classList.remove("active");
        }
    });

   
   
});
document.addEventListener("DOMContentLoaded", function () {
    // Gestion de la Sidebar
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("toggleSidebar");
    const closeBtn = document.getElementById("closeSidebar");

    if (openBtn && closeBtn && sidebar) {
        openBtn.addEventListener("click", function () {
            sidebar.classList.add("active");
        });

        closeBtn.addEventListener("click", function () {
            sidebar.classList.remove("active");
        });

        document.addEventListener("click", function (event) {
            if (!sidebar.contains(event.target) && !openBtn.contains(event.target)) {
                sidebar.classList.remove("active");
            }
        });
    }
   
});
document.getElementById("toggleSidebar").addEventListener("click", function () {
    document.getElementById("sidebar").classList.toggle("hidden");
});

document.getElementById("closeSidebar").addEventListener("click", function () {
    document.getElementById("sidebar").classList.add("hidden");
});
document.addEventListener("DOMContentLoaded", function () {
    let links = document.querySelectorAll(".sidebar-menu li a");
    links.forEach(link => {
        if (link.href === window.location.href) {
            link.classList.add("active");
        }
    });
});
document.getElementById('toggleSidebar').addEventListener('click', function() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
});
function toggleSidebar() {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("open");
}
document.addEventListener("DOMContentLoaded", function () {
    // Sélection des éléments
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("toggleSidebar");
    const closeBtn = document.getElementById("closeSidebar");

    // **🔹 FERME LA SIDEBAR AU CHARGEMENT 🔹**
    sidebar.classList.remove("open"); // Assure que la sidebar est fermée par défaut

   
});

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

