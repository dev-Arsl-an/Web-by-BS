document.addEventListener("DOMContentLoaded", () => {
    const menuButton = document.querySelector('.logo button i'); // The fa-bars icon
    const closeButton = document.querySelector('.nav button i'); // The fa-xmark icon
    const navMenu = document.querySelector('.nav'); // The nav menu

    // Function to show the nav menu
    function openNav() {
        navMenu.style.display = 'block'; // Display the nav menu
        menuButton.style.display = 'none'; // Hide the fa-bars icon
        closeButton.style.display = 'block'; // Show the fa-xmark icon
    }

    // Function to hide the nav menu
    function closeNav() {
        navMenu.style.display = 'none'; // Hide the nav menu
        menuButton.style.display = 'block'; // Show the fa-bars icon
        closeButton.style.display = 'none'; // Hide the fa-xmark icon
    }

    // Initially hide the nav menu and the fa-xmark icon
    navMenu.style.display = 'none';
    closeButton.style.display = 'none';

    // Add event listeners to the buttons
    menuButton.addEventListener('click', openNav); // Open nav on clicking fa-bars
    closeButton.addEventListener('click', closeNav); // Close nav on clicking fa-xmark
});
