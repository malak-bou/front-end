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

    

    // Redirection si on clique sur un bouton spécifique
    const redirectButton = document.querySelector(".btn-submit");
    if (redirectButton) {
        redirectButton.addEventListener("click", function () {
            window.location.href = "../pages/user/user-dashboard.html";
        });
    }

    const redirectButton1 = document.querySelector(".btn-submit1");
    if (redirectButton1) {
        redirectButton1.addEventListener("click", function () {
            window.location.href = "../pages/log-in.html";
        });
    }


    const departementSelect = document.getElementById("departement");
    const departementChoisi = departementSelect.value;
    console.log("Département choisi :", departementChoisi);
    
    departementSelect.addEventListener("change", function() {
        console.log("Nouvelle sélection :", this.value);
      });

      
      const form = document.getElementById('signupForm');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const emailRegex = /^[a-z]+(?:\.[a-z]+)*@GIG\.com$/;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = emailInput.value.trim();
        
        if (!emailRegex.test(email)) {
            emailError.style.display = 'block';
            emailInput.focus();
            return;
        }

        emailError.style.display = 'none';
        // Le formulaire peut être envoyé ici si tout est valide
        alert('Inscription réussie !');
        form.reset(); // Réinitialise le formulaire
    });

    emailInput.addEventListener('input', () => {
        emailError.style.display = 'none';
    });