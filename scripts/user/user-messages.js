// side barre

    // Fonction pour gérer l'affichage de la barre de navigation
    function toggleNav() {
        document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
    }


 // Fonction pour gérer l'affichage des messages de chat et RH
const typeButtons = document.querySelectorAll("input[name='type']");
const chatMessagesContainer = document.getElementById("chat-message"); // Correction ici
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

    let activeContact = "Nesrine Fettal";
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
            activeContact = this.dataset.name;
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

    loadMessages();
});

    
const searchIcon = document.getElementById("searchIcon");
const searchInput = document.getElementById("searchInput");
const hide = document.getElementById("hide-msg");

// Quand on clique sur la loupe, alterner l'affichage du champ de recherche
searchIcon.addEventListener("click", function () {
    if (searchInput.style.display === "none" || searchInput.style.display === "") {
        searchInput.style.display = "block";
        hide.style.display = "none"; // Masquer "Recent Messages"
        searchInput.focus(); // Mettre le focus dans l'input
    } else {
        searchInput.style.display = "none";
        hide.style.display = "block"; // Réafficher "Recent Messages"
        searchInput.value = ""; // Optionnel : Effacer le texte dans l'input
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

    // Cache le bouton retour au début
    backButton.style.display = "none"; 

    messages.forEach(message => {
        message.addEventListener("click", function () {
            if (window.innerWidth < 768) {
                container1.classList.add("hidden"); 
                chatContainer.classList.add("active"); 
                backButton.style.display = "block";  // Afficher le bouton retour
            }
        });
    });

    // Fonction goback maintenant globale
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
    // Fonction pour récupérer les demandes depuis localStorage
    function getRequestsFromStorage() {
        const stored = localStorage.getItem('formationRequests');
        return stored ? JSON.parse(stored) : {};
    }

    // Fonction pour vérifier s'il y a des demandes de formation
    function checkFormationRequests() {
        const notificationDot = document.getElementById('formationNotificationDot');
        const requests = getRequestsFromStorage();
        
        // Vérifie si au moins un département a des demandes
        const hasRequests = Object.values(requests).some(count => count > 0);
        
        // Affiche ou cache la notification en fonction des demandes
        if (notificationDot) {
            notificationDot.style.display = hasRequests ? 'block' : 'none';
        }
    }

    // Vérifie les demandes au chargement de la page
    checkFormationRequests();

    // Vérifie périodiquement les nouvelles demandes
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
                <img src="../../assets/images/profil-pic.png" alt="profil-pic">
            </span>
            <div class="message-content">
                <strong>${user.prenom} ${user.nom}</strong>
                <span class="timestamp">--:--</span>
                <p class="supp-msg">${user.email}</p>
            </div>
        `;
        div.addEventListener("click", function () {
            showUserProfile(user);
            updateChatHeader(user);
            loadConversationWith(user.id);
        });
        messagesContainer.appendChild(div);
    });

    if (allUsers.length > 0) {
        showUserProfile(allUsers[0]);
        updateChatHeader(allUsers[0]);
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
  // pour filtrageeee  kol role wplasstouu
function getUsersByRole(role) {
    if (role === "Prof") return allUsers.filter(user => user.role === "prof");
    if (role === "User" || role === "Chat") return allUsers.filter(user => user.role === "employer");
    if (role === "RH") return allUsers.filter(user => user.role === "admin");
    return allUsers;
}
  
function showUserProfile(user) {
    const card = document.querySelector('.card-client');
    if (!card) return;
    card.querySelector('.profile-image').src = "../../assets/images/profil-pic.png";
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
    if (chatAvatar) chatAvatar.src = "../../assets/images/profil-pic.png";
}
  
// nsyou ndirou fct tae post send message 

function sendMessageToBackend() {
    const token = localStorage.getItem("token");
    const messageInput = document.getElementById("messageInput");
    const fileInput = document.getElementById("file");
    const content = messageInput.value.trim();
    const file = fileInput.files[0] || null;

    // Trouver l'utilisateur sélectionné (destinataire)
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
            // NE PAS mettre 'Content-Type' ici avec FormData !
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Message envoyé :", data);
        alert("Message envoyé !");
        messageInput.value = "";
        fileInput.value = "";
        loadReceivedMessages();
    })
    .catch(error => {
        console.error("Erreur lors de l'envoi du message :", error);
        alert("Erreur lors de l'envoi du message !");
    });
}

// nsyou ndirou fct bach nchargiw les msg li beatnahom deja 
function loadReceivedMessages() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Pas de token trouvé");
        return;
    }

    const chatHeader = document.querySelector('.chat-header .username');
    if (!chatHeader) {
        console.error("Chat header introuvable");
        return;
    }

    const receiverName = chatHeader.textContent.trim();
    const receiver = allUsers.find(u => `${u.prenom} ${u.nom}` === receiverName);

    if (!receiver) {
        console.error("Aucun destinataire sélectionné");
        return;
    }

    fetch('https://backend-m6sm.onrender.com/messages/', {
        headers: {
            'Authorization': 'Bearer ' + token,
            'accept': 'application/json'
        }
    })
    .then(res => res.json())
    .then(allMessages => {
        // Filtrer les messages envoyés au destinataire actif
        const sentToContact = allMessages.filter(msg => msg.sender_id === getCurrentUserId() && String(msg.receiver_id) === String(receiver.id));
        // Filtrer les messages reçus du destinataire actif
        const receivedFromContact = allMessages.filter(msg => msg.receiver_id === getCurrentUserId() && String(msg.sender_id) === String(receiver.id));

        const conversation = [...sentToContact, ...receivedFromContact].sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        const chatBox = document.querySelector('.chat-box');
        chatBox.innerHTML = "";

        if (conversation.length > 0) {
            conversation.forEach(msg => {
                const isSent = msg.sender_id === getCurrentUserId();
                const messageDate = new Date(msg.created_at);
                const formattedDate = messageDate.toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const messageHTML = `
                    <div class="message ${isSent ? "sent" : "received"}">
                        <div class="message-content">
                            <p class="message-text">${msg.content}</p>
                            <p class="timestamp">${formattedDate}</p>
                        </div>
                    </div>
                `;
                chatBox.innerHTML += messageHTML;
            });
        } else {
            chatBox.innerHTML = "<p>Aucun message dans cette conversation.</p>";
        }
    })
    .catch(error => {
        console.error("Erreur lors du chargement des messages :", error);
    });
}
