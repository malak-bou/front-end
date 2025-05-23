// side barre

    // Fonction pour gérer l'affichage de la barre de navigation
function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active"); // Ajouter ou supprimer la classe active
}

// 🔄 Charger les infos utilisateur depuis l'API
async function loadUserInfo() {
    const token = localStorage.getItem("token");
    if (!token) return;
  
    try {
      const res = await fetch("https://backend-m6sm.onrender.com/personal-info", {
        method: "GET",
        headers: {
          "Authorization": "Bearer " + token,
          "Accept": "application/json"
        }
      });
  
      const data = await res.json();
      if (res.ok) {
        if (document.getElementById("nom")) {
          document.getElementById("nom").value = data.nom || "";
        }
        if (document.getElementById("prenom")) {
          document.getElementById("prenom").value = data.prenom || "";
        }
        if (document.getElementById("telephone")) {
          document.getElementById("telephone").value = data.telephone || "";
        }
      } else {
        console.warn("Erreur API :", data.message);
      }
    } catch (err) {
      console.error("Erreur GET /personal-info :", err);
    }
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    loadUserInfo(); // 🔁 Charger automatiquement les infos
  
    // 🌗 Mode sombre
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (localStorage.getItem("darkMode") === "enabled") {
      document.body.classList.add("dark-mode");
      if (darkModeToggle) darkModeToggle.checked = true;
    }
    if (darkModeToggle) {
      darkModeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode");
        localStorage.setItem("darkMode", darkModeToggle.checked ? "enabled" : "disabled");
      });
    }
  
    // 🌐 Langue
    const languageSelect = document.getElementById("languageSelect");
    if (languageSelect) {
      languageSelect.value = localStorage.getItem("language") || "fr";
      languageSelect.addEventListener("change", () => {
        localStorage.setItem("language", languageSelect.value);
        alert("Langue changée en " + languageSelect.value);
      });
    }
  
    // 🔽 Sections déroulantes
    document.querySelectorAll(".option").forEach(option => {
      option.addEventListener("click", () => {
        const sectionId = option.getAttribute("data-target");
        const section = document.getElementById(sectionId);
        const arrow = option.querySelector(".arrow");
  
        if (section.classList.contains("hidden")) {
          section.classList.remove("hidden");
          section.style.display = "block";
          arrow.style.transform = "rotate(180deg)";
        } else {
          section.classList.add("hidden");
          section.style.display = "none";
          arrow.style.transform = "rotate(0deg)";
        }
      });
    });
  
    // 👁️ Afficher/masquer mot de passe
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", () => {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
      });
    }
  
    // 🔴 Notification comptes
    const icon = document.querySelector("i.fa-users");
    const dot = icon ? icon.querySelector(".notification-dot") : null;
    if (dot) {
      const hasPending = localStorage.getItem("hasPendingAccountRequests") === "true";
      dot.style.display = hasPending ? "block" : "none";
    }
  
    // 🔔 Notification formations
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
  
  async function saveUserInfo() {
    const telephone = document.getElementById("telephone").value.trim();
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("🔒 Veuillez vous reconnecter.");
      return;
    }
  
    if (!telephone) {
      alert("⚠️ Le numéro de téléphone est requis !");
      return;
    }
  
    // ✅ Validation du format du numéro de téléphone
    const phoneRegex = /^(05|06|07)\d{8}$/;
    if (!phoneRegex.test(telephone)) {
      alert("❌ Le numéro de téléphone doit contenir 10 chiffres et commencer par 05, 06 ou 07.");
      document.getElementById("telephone").focus();
      return;
    }
  
    try {
      const res = await fetch("https://backend-m6sm.onrender.com/personal-info", {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          telephone: telephone
        })
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("📞 Mise à jour du téléphone effectuée !");
      } else {
        alert("❌ Erreur : " + (data.message || "Échec de mise à jour"));
      }
    } catch (err) {
      console.error("Erreur PUT /personal-info :", err);
      alert("❌ Une erreur est survenue.");
    }
  }
  
  // ✅ Changement de mot de passe
  async function changePassword() {
    const current = document.getElementById("current_password").value;
    const nouveau = document.getElementById("new_password").value;
    const confirmation = document.getElementById("confirm_password").value;
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("🔒 Veuillez vous reconnecter.");
      return;
    }
  
    if (!current || !nouveau || !confirmation) {
      alert("⚠️ Tous les champs sont obligatoires !");
      return;
    }
  
    if (nouveau !== confirmation) {
      alert("❌ Les mots de passe ne correspondent pas.");
      return;
    }
  
    try {
      const res = await fetch("https://backend-m6sm.onrender.com/password", {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          current_password: current,
          new_password: nouveau,
          confirm_password: confirmation
        })
      });
  
      const data = await res.json();
      if (res.ok) {
        alert(" Mise à jour du mot de passe effectuée !");
        document.getElementById("current_password").value = "";
        document.getElementById("new_password").value = "";
        document.getElementById("confirm_password").value = "";
      } else {
        alert("❌ Erreur : " + (data.message || "Échec de mise à jour"));
      }
    } catch (err) {
      console.error("Erreur PUT /password :", err);
      alert("❌ Une erreur est survenue.");
    }
  }
  
