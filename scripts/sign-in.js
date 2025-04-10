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
            window.location.href = "https://moumouh6.github.io/Users-Dashboard/";
        });
    }

    const redirectButton1 = document.querySelector(".btn-submit1");
    if (redirectButton1) {
        redirectButton1.addEventListener("click", function () {
            window.location.href = "https://moumouh6.github.io/Log-in/";
        });
    }