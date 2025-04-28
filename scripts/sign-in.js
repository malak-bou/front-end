document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    // Regex qui accepte majuscules/minuscules et @gig.com ou @GIG.com
    const emailRegex = /^[a-zA-Z]+(?:\.[a-zA-Z]+)*@gig\.com$/i;

    // Affichage/masquage du mot de passe
    const togglePassword = document.querySelector(".toggle-password");
    const passwordInput = document.getElementById("password");
    if (togglePassword) {
        togglePassword.addEventListener("click", function () {
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
        });
    }
    const passwordInput2 = document.getElementById("confirmer-password");
    const togglePassword2 = document.querySelector(".toggle-password1");
    if (togglePassword2) {
        togglePassword2.addEventListener("click", function () {
            passwordInput2.type = passwordInput2.type === "password" ? "text" : "password";
        });
    }

    // Redirection vers la page de connexion
    const redirectButton1 = document.querySelector(".btn-submit1");
    if (redirectButton1) {
        redirectButton1.addEventListener("click", function (e) {
            e.preventDefault();
            window.location.href = "../pages/log-in.html";
        });
    }

    // Affichage du département choisi (optionnel)
    const departementSelect = document.getElementById("departement");
    if (departementSelect) {
        departementSelect.addEventListener("change", function() {
            console.log("Département choisi :", this.value);
        });
    }

    // Validation et envoi du formulaire
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            emailError.style.display = 'none';

            // Récupérer les valeurs
            const nom = document.getElementById('nom').value.trim();
            const prenom = document.getElementById('prenom').value.trim();
            const departement = document.getElementById('departement').value;
            const fonction = document.getElementById('fonction').value;
            const email = emailInput.value.trim();
            const telephone = document.getElementById('telephone').value.trim();
            const password = passwordInput.value;
            const confirmPassword = passwordInput2.value;

            // Validation email
            if (!emailRegex.test(email)) {
                emailError.textContent = "Format d'email invalide. Utilisez un email @GIG.com";
                emailError.style.display = 'block';
                emailInput.focus();
                return;
            }

            // Validation mot de passe
            if (password.length < 6) {
                emailError.textContent = "Le mot de passe doit contenir au moins 6 caractères";
                emailError.style.display = 'block';
                return;
            }
            if (password !== confirmPassword) {
                emailError.textContent = "Les mots de passe ne correspondent pas";
                emailError.style.display = 'block';
                return;
            }

            // Préparer les données pour le backend
            const data = {
                nom: nom,
                prenom: prenom,
                email: email,
                password: password,
                confirm_password: confirmPassword,
                departement: departement,
                role: fonction,
                telephone: telephone
            };

            try {
                const response = await fetch('https://backend-m6sm.onrender.com/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.detail || 'Erreur lors de l\'inscription');
                }

                alert('Inscription réussie ! Votre compte est en attente de validation.');
                form.reset();
                setTimeout(() => {
                    window.location.href = "../pages/log-in.html";
                }, 1000);
            } catch (error) {
                emailError.textContent = error.message || "Une erreur est survenue lors de l'inscription";
                emailError.style.display = 'block';
            }
        });
    }

    // Masquer l'erreur à la saisie
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            emailError.style.display = 'none';
        });
    }
});
