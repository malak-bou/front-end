document.addEventListener("DOMContentLoaded", function () {
    // Gestion de l'affichage du mot de passe
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    const emailInput = document.getElementById("email");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        });
    }

    // Validation du formulaire
    const form = document.querySelector("form");
    form.addEventListener("submit", async function (event) {
        event.preventDefault(); // Empêche l'envoi par défaut

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            // URL de l'API backend pour l'authentification
            const apiUrl = "https://backend-m6sm.onrender.com/api/auth/login";
            
            // Afficher un indicateur de chargement si nécessaire
            // document.querySelector(".btn-submit").textContent = "Chargement...";
            
            // Envoyer les données au backend
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Authentification réussie
                console.log("Connexion réussie!", data);
                
                // Sauvegarder le token dans localStorage si disponible
                if (data.token) {
                    localStorage.setItem("authToken", data.token);
                }
                
                // Redirection basée sur le rôle de l'utilisateur si disponible
                if (data.role === "admin") {
                    window.location.href = "../pages/RH-dashboard.html";
                } else if (data.role === "teacher") {
                    window.location.href = "../pages/dashboardprof.html";
                } else {
                    window.location.href = "../pages/user/user-dashboard.html";
                }
            } else {
                // Erreur d'authentification
                alert(data.message || "Email ou mot de passe incorrect.");
            }
        } catch (error) {
            console.error("Erreur lors de la connexion:", error);
            alert("Une erreur est survenue lors de la connexion. Veuillez réessayer plus tard.");
        }
    });

    // Redirection si on clique sur un bouton spécifique
    const redirectButton = document.querySelector(".btn-submit1");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/Sign-in.html";
        });
    }
});
