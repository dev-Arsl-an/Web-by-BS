document.addEventListener("DOMContentLoaded", function() {
    var profileImage = document.getElementById("profile_image");
    var imgIntroduction = document.querySelector(".img-introduction");

    profileImage.addEventListener("mouseover", function() {
        imgIntroduction.style.display = "block";
    });

    profileImage.addEventListener("mouseout", function() {
        imgIntroduction.style.display = "none";
    });
});
