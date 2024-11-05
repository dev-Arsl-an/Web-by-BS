var profile_image = document.getElementById("profile_image");
var img_introduction = document.getElementsById("img-introduction");

profile_image.addEventListener("mouseover", () => {
    img_introduction.style.display = "block";
});

profile_image.addEventListener("mouseout", () => {
    img_introduction.style.display = "none";
});
