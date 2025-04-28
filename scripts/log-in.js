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
        event.preventDefault();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            alert("Veuillez remplir tous les champs.");
            return;
        }

        try {
            // Préparation des données pour l'API
            const formData = new URLSearchParams();
            formData.append('username', email); // Le backend attend 'username'
            formData.append('password', password);

            // Appel à l'API de connexion
            const response = await fetch('http://localhost:8000/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                // Stockage du token
                localStorage.setItem('access_token', data.access_token);

                // Récupération des informations de l'utilisateur
                const userResponse = await fetch('http://localhost:8000/users/me', {
                    headers: {
                        'Authorization': `Bearer ${data.access_token}`
                    }
                });

                if (!userResponse.ok) {
                    throw new Error('Erreur lors de la récupération des informations utilisateur');
                }

                const userData = await userResponse.json();

                // Redirection selon le rôle
                switch(userData.profile.fonction) {
                    case 'admin':
                        window.location.href = "../pages/RH-dashboard.html"; // Admin redirigé vers RH-dashboard
                        break;
                    case 'prof':
                        window.location.href = "../pages/dashboardprof.html";
                        break;
                    case 'employer':
                        window.location.href = "../pages/RH-dashboard.html";
                        break;
                    default:
                        window.location.href = "../pages/user/user-dashboard.html";
                }
            } else {
                // Gestion des erreurs de connexion
                if (data.detail === "Account not approved yet. Please wait for admin approval.") {
                    alert("Votre compte n'est pas encore approuvé. Veuillez attendre l'approbation de l'administrateur.");
                } else {
                    alert("Email ou mot de passe incorrect.");
                }
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur de connexion au serveur. Veuillez réessayer plus tard.");
        }
    });

    // Redirection vers la page d'inscription
    const redirectButton = document.querySelector(".btn-submit1");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/Sign-in.html";
        });
    }
});
