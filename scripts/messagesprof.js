
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


let activeContact = null;
let activeContactId = null;

function getCurrentUserId() {
    return "11"; // Pour test
}

const typeButtons = document.querySelectorAll("input[name='type']");
const chatMessagesContainer = document.getElementById("chat-message");
const rhMessagesContainer = document.getElementById("rh-messages");
const profMessagesContainer = document.getElementById("prof-messages");

typeButtons.forEach(button => {
    button.addEventListener("change", function () {
        let value = this.value;
        if (value === "Chat") value = "User";
        renderUserList(value);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const messagesContainer = document.querySelector(".chat-box");
    const chatHeader = document.querySelector(".chat-header .username");
    const chatAvatar = document.querySelector(".chat-header .avatar img");
    const recentMessages = document.querySelectorAll(".message.supconvo");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.getElementById("sendButton");
    const fileInput = document.getElementById("file");

    // Suppression de la déclaration locale activeContact pour utiliser la globale
    // let activeContact = "Nesrine Fettal";  // <-- supprimé ici, on utilise variable globale

    let chatData = JSON.parse(localStorage.getItem("chatMessages")) || {};

    function loadMessages() {
        messagesContainer.innerHTML = "";
        if (chatData[activeContact]) {
            chatData[activeContact].forEach(msg => {
                const messageDiv = document.createElement("div");
                messageDiv.classList.add("message", msg.sender === "me" ? "sent" : "received");

                let content = `<div class="message-content">
                                <span class="timestamp">${msg.time}</span>`;

                if (msg.text) {
                    content += `<p class="msg-chat">${msg.text}</p>`;
                }

                if (msg.file) {
                    if (msg.fileType.startsWith("image/")) {
                        content += `<img src="${msg.file}" class="chat-image" alt="Image envoyée" />`;
                    } else {
                        content += `<a href="${msg.file}" download class="chat-file">Télécharger le fichier</a>`;
                    }
                }

                content += `</div>`;
                messageDiv.innerHTML = content;
                messagesContainer.appendChild(messageDiv);
            });
        }
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function sendMessage() {
        const messageText = messageInput.value.trim();
        if (messageText === "") return;

        const messageData = {
            text: messageText,
            sender: "me",
            time: new Date().toLocaleTimeString()
        };

        if (!chatData[activeContact]) {
            chatData[activeContact] = [];
        }
        chatData[activeContact].push(messageData);
        localStorage.setItem("chatMessages", JSON.stringify(chatData));

        messageInput.value = "";
        loadMessages();
    }

    function sendFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function (e) {
            const fileData = {
                file: e.target.result,
                fileType: file.type,
                sender: "me",
                time: new Date().toLocaleTimeString()
            };

            if (!chatData[activeContact]) {
                chatData[activeContact] = [];
            }
            chatData[activeContact].push(fileData);
            localStorage.setItem("chatMessages", JSON.stringify(chatData));

            loadMessages();
        };
        reader.readAsDataURL(file);
    }

    recentMessages.forEach(msg => {
        msg.addEventListener("click", function () {
            activeContact = this.dataset.name;    // MODIF : Met à jour la variable globale activeContact
            chatHeader.innerText = activeContact;
            chatAvatar.src = this.dataset.avatar;
            loadMessages();
        });
    });

    sendButton.addEventListener("click", sendMessageToBackend);
    
    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessageToBackend();
        }
    });

    fileInput.addEventListener("change", sendFile);

    // Appel initial pour charger les messages du premier contact (si défini)
    if (activeContact) {
        loadMessages();
    }
});

const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");
const hide = document.getElementById("hide-msg");

searchIcon.addEventListener("click", function () {
    if (searchInput.style.display === "none" || searchInput.style.display === "") {
        searchInput.style.display = "block";
        hide.style.display = "none";
        searchInput.focus();
    } else {
        searchInput.style.display = "none";
        hide.style.display = "block";
        searchInput.value = "";
    }
});

const messages = document.querySelectorAll(".message.supconvo");

searchInput.addEventListener("keyup", function() {
    let filter = searchInput.value.toLowerCase();

    messages.forEach(message => {
        let name = message.getAttribute("data-name").toLowerCase();
        message.style.display = name.includes(filter) ? "flex" : "none";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const messages = document.querySelectorAll(".message"); 
    const chatContainer = document.querySelector(".chat-container"); 
    const container1 = document.querySelector(".container1"); 
    const backButton = document.querySelector(".chat-header .material-symbols-outlined"); 

    backButton.style.display = "none"; 

    messages.forEach(message => {
        message.addEventListener("click", function () {
            if (window.innerWidth < 768) {
                container1.classList.add("hidden"); 
                chatContainer.classList.add("active"); 
                backButton.style.display = "block";
            }
        });
    });

    window.goback = function () {
        container1.classList.remove("hidden");
        chatContainer.classList.remove("active");
        backButton.style.display = "none"; 
    };
});

document.addEventListener("DOMContentLoaded", function () {
    const icon = document.querySelector("i.fa-users");
    const dot = icon ? icon.querySelector(".notification-dot") : null;

    const hasPending = localStorage.getItem("hasPendingAccountRequests") === "true";

    if (dot) {
        dot.style.display = hasPending ? "block" : "none";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    function getRequestsFromStorage() {
        const stored = localStorage.getItem('formationRequests');
        return stored ? JSON.parse(stored) : {};
    }

    function checkFormationRequests() {
        const notificationDot = document.getElementById('formationNotificationDot');
        const requests = getRequestsFromStorage();
        const hasRequests = Object.values(requests).some(count => count > 0);

        if (notificationDot) {
            notificationDot.style.display = hasRequests ? 'block' : 'none';
        }
    }

    checkFormationRequests();
    setInterval(checkFormationRequests, 1000);
});

localStorage.setItem('formationRequests', JSON.stringify({
    "Informatique": 2,
    "Marketing": 0
}));

const usersEndpoint = "https://backend-m6sm.onrender.com/public/users";
let allUsers = [];

function renderUserList(roleFilter) {
    const messagesContainer = document.getElementById("chat-message");
    messagesContainer.innerHTML = "";
    const filtered = allUsers.filter(user => {
        if (roleFilter === "Prof") return user.role === "prof";
        if (roleFilter === "User" || roleFilter === "Chat") return user.role === "employer";
        if (roleFilter === "RH") return user.role === "admin";
        return true;
    });

    filtered.forEach(user => {
        const div = document.createElement("div");
        div.className = "message supconvo";
        div.setAttribute("data-name", `${user.prenom} ${user.nom}`);
        div.setAttribute("data-id", user.id);
        div.innerHTML = `
            <span class="avatar">
                <img src="../assets/images/profil-pic.png" alt="profil-pic">
            </span>
            <div class="message-content">
                <strong>${user.prenom} ${user.nom}</strong>
                <span class="timestamp">--:--</span>
                <p class="supp-msg">${user.email}</p>
            </div>
        `;
        div.addEventListener("click", function () {
            activeContactId = user.id;                  // Stocke l’ID du contact cliqué
            activeContact = `${user.prenom} ${user.nom}`; // Stocke le nom complet (optionnel)
            showUserProfile(user);
            updateChatHeader(user);
            console.log("Contact cliqué :", activeContact);
            console.log("ID contact actif :", activeContactId);
            loadReceivedMessages();                     // Charge et affiche la conversation
        });
        
        
        
        messagesContainer.appendChild(div);
    });

    if (filtered.length > 0) {
        activeContact = `${filtered[0].prenom} ${filtered[0].nom}`;
        activeContactId = filtered[0].id;  // initialisation du premier contact
        showUserProfile(filtered[0]);
        updateChatHeader(filtered[0]);
        loadReceivedMessages();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    fetch(usersEndpoint)
        .then(res => res.json())
        .then(users => {
            allUsers = users;
            renderUserList("User");
        });
});

function getUsersByRole(role) {
    if (role === "Prof") return allUsers.filter(user => user.role === "prof");
    if (role === "User" || role === "Chat") return allUsers.filter(user => user.role === "employer");
    if (role === "RH") return allUsers.filter(user => user.role === "admin");
    return allUsers;
}

function showUserProfile(user) {
    const card = document.querySelector('.card-client');
    if (!card) return;
    card.querySelector('.profile-image').src = "../assets/images/profil-pic.png";
    card.querySelector('.name-client').innerHTML = `
        ${user.prenom} ${user.nom}
        <span>${user.departement}</span>
        <span>${user.email}</span>
    `;
}

function updateChatHeader(user) {
    const chatHeader = document.querySelector('.chat-header .username');
    const chatAvatar = document.querySelector('.chat-header .avatar img');
    if (chatHeader) chatHeader.textContent = `${user.prenom} ${user.nom}`;
    if (chatAvatar) chatAvatar.src = "../assets/images/profil-pic.png";
}

function sendMessageToBackend() {
    const token = localStorage.getItem("token");
    const messageInput = document.getElementById("messageInput");
    const fileInput = document.getElementById("file");
    const content = messageInput.value.trim();
    const file = fileInput.files[0] || null;

    const chatHeader = document.querySelector('.chat-header .username');
    const receiverName = chatHeader.textContent.trim();
    const receiver = allUsers.find(u => `${u.prenom} ${u.nom}` === receiverName);

    if (!content) {
        alert("Le message ne peut pas être vide !");
        return;
    }
    if (!receiver) {
        alert("Aucun destinataire sélectionné !");
        return;
    }

    const formData = new FormData();
    formData.append('content', content);
    formData.append('receiver_id', receiver.id);
    if (file) {
        formData.append('file', file);
    }

    fetch('https://backend-m6sm.onrender.com/messages/', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Message envoyé :", data);
        alert("Message envoyé !");
        messageInput.value = "";
        fileInput.value = "";
        loadReceivedMessages();  // MODIF : recharge la conversation après envoi
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi du message :", error);
        alert("Erreur lors de l'envoi du message !");
    });
}

function loadReceivedMessages() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Pas de token trouvé");
        return;
    }
    if (!activeContactId) {
        console.error("Aucun contact sélectionné");
        return;
    }
    const userId = getCurrentUserId();
    if (!userId) {
        console.error("Utilisateur connecté non identifié");
        return;
    }

    // Promesses pour fetch received + sent
    const fetchReceived = fetch(`https://backend-m6sm.onrender.com/messages/?message_type=received&skip=0&limit=100`, {
        headers: { 'Authorization': 'Bearer ' + token, 'accept': 'application/json' }
    }).then(res => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
    });

    const fetchSent = fetch(`https://backend-m6sm.onrender.com/messages/?message_type=sent&skip=0&limit=100`, {
        headers: { 'Authorization': 'Bearer ' + token, 'accept': 'application/json' }
    }).then(res => {
        if (!res.ok) throw new Error("Erreur HTTP " + res.status);
        return res.json();
    });

    Promise.all([fetchReceived, fetchSent])
    .then(([receivedMessages, sentMessages]) => {
        // Filtrer uniquement messages liés au contact actif
        const filteredReceived = receivedMessages.filter(msg =>
            String(msg.sender_id) === String(activeContactId) &&
            String(msg.receiver_id) === String(userId)
        );

        const filteredSent = sentMessages.filter(msg =>
            String(msg.receiver_id) === String(activeContactId) &&
            String(msg.sender_id) === String(userId)
        );

        // Fusionner et trier par date
        const allMessages = [...filteredReceived, ...filteredSent];
        allMessages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        const chatBox = document.querySelector('.chat-box');
        chatBox.innerHTML = "";

        if (allMessages.length === 0) {
            chatBox.innerHTML = "<p>Aucun message avec ce contact.</p>";
            return;
        }

        // Construire HTML des messages
        allMessages.forEach(msg => {
            const formattedDate = new Date(msg.created_at).toLocaleString('fr-FR', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit'
            });
        
            // Déterminer si message reçu ou envoyé
            const isSent = String(msg.sender_id) === String(userId);
            const messageClass = isSent ? "sent" : "received";
        
            const messageHTML = `
                <div class="message ${messageClass}">
                    <p>${msg.content}</p>
                    <p><small>${formattedDate}</small></p>
                </div>
            `;
            chatBox.innerHTML += messageHTML;
        });
        
    })
    .catch(error => {
        console.error("Erreur lors du chargement des messages :", error);
    });
}
