window.onload = function () {
    // Hide all error messages
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

            // Validate all input fields
            form.querySelectorAll("input").forEach(input => {
                const error = document.getElementById(input.id + 'Error');

                // Check if the input is empty
                if (input.value.trim() === '') {
                    error.style.display = 'block';
                    valid = false;
                } else {
                    error.style.display = 'none';
                }
            });

            if (!valid) {
                event.preventDefault(); // Stop submission if the form is invalid
            } else {
                alert("Form is Submitted Successfully");
            }
        });
    } else {
        console.error("Form not found");
    }
};
