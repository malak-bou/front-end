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
        if (this.value === "RH") {
            chatMessagesContainer.style.display = "none";
            rhMessagesContainer.style.display = "block";
            profMessagesContainer.style.display = "none";
        } else {    if(this.value === "Chat") {
                    rhMessagesContainer.style.display = "none";
                    chatMessagesContainer.style.display = "block";
                    profMessagesContainer.style.display = "none";
                    } else {
                                  rhMessagesContainer.style.display = "none";
                                  chatMessagesContainer.style.display = "none";
                                  profMessagesContainer.style.display = "block";
                            };
                }
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

    sendButton.addEventListener("click", sendMessage);
    
    messageInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
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

// Function to check for unread messages
function checkUnreadMessages() {
    // Get all messages
    const messages = document.querySelectorAll('.message');
    const unreadMessages = Array.from(messages).filter(message => 
        !message.classList.contains('read')
    );

    // Get the messages icon in the sidebar
    const messageIcon = document.querySelector('.sidebar ul li a i.fa-envelope');
    
    // Update the notification dot based on unread messages
    if (unreadMessages.length > 0) {
        messageIcon.classList.add('has-unread');
    } else {
        messageIcon.classList.remove('has-unread');
    }
}

// Check for unread messages when the page loads
document.addEventListener('DOMContentLoaded', function() {
    checkUnreadMessages();

    // Mark a message as read when clicked
    document.querySelectorAll('.message').forEach(message => {
        message.addEventListener('click', function() {
            this.classList.add('read');
            checkUnreadMessages(); // Update the notification dot
        });
    });
});

// Function to simulate receiving a new message (for testing)
function simulateNewMessage() {
    const messageIcon = document.querySelector('.sidebar ul li a i.fa-envelope');
    messageIcon.classList.add('has-unread');
}

