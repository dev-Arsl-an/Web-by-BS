window.onload = function () {
    // Hide all error messages initially
    Array.from(document.getElementsByClassName("errorMessage")).forEach(error => error.style.display = 'none');

    // Add hover effect to buttons
    document.querySelectorAll(".btn-primary").forEach(button => {
        button.addEventListener("mouseover", (e) => e.target.style.background = 'black');
        button.addEventListener("mouseout", (e) => e.target.style.background = '');
    });

    // Form validation
    const form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", (event) => {
            let valid = true;

            // Validate email
            const email = document.getElementById("gmail");
            const emailError = document.getElementById("gmailError");
            if (!email.value.includes("@")) {
                emailError.style.display = 'block';
                valid = false;
            } else {
                emailError.style.display = 'none';
            }

            // Validate password
            const password = document.getElementById("password");
            const passwordError = document.getElementById("passwordError");
            if (password.value.length < 8) {
                passwordError.style.display = 'block';
                valid = false;
            } else {
                passwordError.style.display = 'none';
            }

            // Submit form if valid
            if (!valid) {
                event.preventDefault(); // Stop submission if the form is invalid
                form.submit();
            }
        });
    } else {
        console.error("Form not found");
    }
};
