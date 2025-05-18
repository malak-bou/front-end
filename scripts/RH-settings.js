function toggleNav() {
    document.getElementById("sidebar").classList.toggle("active");
  }
  
  document.addEventListener("DOMContentLoaded", () => {
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
  
    // 🔽 Dépliage des sections
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
  
    // 👁️ Afficher / masquer le mot de passe
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener("click", () => {
        passwordInput.type = passwordInput.type === "password" ? "text" : "password";
      });
    }
  
    // 🔴 Notification comptes en attente
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
  
  
  // ✅ Enregistrement des infos personnelles (appel API backend)
  async function saveUserInfo() {
    const telephone = document.getElementById("telephone").value;
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("🔒 Veuillez vous reconnecter.");
      return;
    }
  
    if (!telephone) {
      alert("⚠️ Numéro de téléphone requis.");
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
          nom: "",
          prenom: "",
          telephone: telephone
        })
      });
  
      const data = await res.json();
      if (res.ok) {
        alert("✅ Téléphone mis à jour !");
      } else {
        alert("❌ Erreur : " + (data.message || "Échec de mise à jour"));
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("❌ Une erreur est survenue.");
    }
  }
  
  // ✅ Changement de mot de passe (appel API backend)
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
        alert("✅ Mot de passe mis à jour !");
        document.getElementById("current_password").value = "";
        document.getElementById("new_password").value = "";
        document.getElementById("confirm_password").value = "";
      } else {
        alert("❌ Erreur : " + (data.message || "Échec de mise à jour"));
      }
    } catch (err) {
      console.error("Erreur:", err);
      alert("❌ Une erreur est survenue.");
    }
  }
  
