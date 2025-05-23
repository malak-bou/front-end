document.addEventListener("DOMContentLoaded", function () {
    const backendURL = 'https://backend-m6sm.onrender.com';
    
    // Gestion de l'affichage des mots de passe
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    const passwordInput2 = document.getElementById("confirmer-password");
    const togglePassword2 = document.querySelector(".toggle-password1");

    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        });
    }

    if (togglePassword2) {
        togglePassword2.addEventListener("click", function () {
            passwordInput2.type = passwordInput2.type === "password" ? "text" : "password";
        });
    }

    // Gestion du formulaire d'inscription
    const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    // Expression régulière mise à jour pour @gig.dz en minuscules
    const emailRegex = /^[a-z]+(?:\.[a-z]+)*@gig\.dz$/;
    

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Validation de l'email
        const email = emailInput.value.trim();
        if (!emailRegex.test(email)) {
            emailError.style.display = 'block';
            emailInput.focus();
            return;
        }
    
        emailError.style.display = 'none';
        
        // Validation du téléphone
        const phoneInput = document.getElementById('telephone');
        const phone = phoneInput.value.trim();
        const phoneRegex = /^(05|06|07)\d{8}$/;

        if (!phoneRegex.test(phone)) {
        alert("Le numéro de téléphone doit contenir 10 chiffres et commencer par 05, 06 ou 07.");
        phoneInput.focus();
        return;
        }
        // Validation des mots de passe
        if (passwordInput.value !== passwordInput2.value) {
            alert("Les mots de passe ne correspondent pas!");
            return;
        }
                const fonctionValue = document.getElementById('fonction').value;
                let role;

                if (fonctionValue === 'professeur') {
                    role = 'prof';
                } else if (fonctionValue === 'administrateur') {
                    role = 'admin';
                } else {
                    role = 'employer';
                }

            

        // Récupération des données du formulaire
                const userData = {
                nom: document.getElementById('nom').value.trim(),
                prenom: document.getElementById('prenom').value.trim(),
                departement: document.getElementById('departement').value,
                role: role,
                email: email,
                telephone: document.getElementById('telephone').value.trim(),
                password: passwordInput.value,
                confirm_password: passwordInput2.value
                 };

        try {
            console.log("Envoi des données d'inscription:", userData);

            const response = await fetch(`${backendURL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();
            console.log("Réponse du serveur:", data);

            if (response.ok) {
                alert("Inscription réussie ! Votre compte est en attente d'approbation par l'administrateur.");
                window.location.href = "../pages/log-in.html";
            } else {
                if (data.detail === "Email already registered") {
                    alert("Cette adresse email est déjà utilisée.");
                } else {
                    alert(data.detail || "Erreur lors de l'inscription.");
                }
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert("Erreur lors de l'inscription. Veuillez réessayer plus tard.");
        }
    });

    // Masquer le message d'erreur email lors de la saisie
    emailInput.addEventListener('input', () => {
        emailError.style.display = 'none';
    });

    // Redirection vers la page de connexion
    const redirectButton1 = document.querySelector(".btn-submit1");
    if (redirectButton1) {
        redirectButton1.addEventListener("click", function () {
            window.location.href = "../pages/log-in.html";
        });
    }
});
