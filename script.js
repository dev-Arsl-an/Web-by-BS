window.onload = function () {
    var errorMessage = document.getElementsByClassName("errorMessage");
    Array.from(errorMessage).forEach((error) => {
        error.style.display = 'none';
    });
    var button= document.getElementsByClassName("btn-primary");
    Array.from(button).forEach((button)=>{
        button.addEventListener("mouseover",(event2)=>{
        event2.target.style.background = 'black'
        });
        button.addEventListener("mouseout",(event2)=>{
            event2.target.style.background ='';
        })
    })
    var form = document.querySelector("form");
    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            var valid = true;
            
            var inputTags = form.querySelectorAll("input, select");

            inputTags.forEach((input) => {
                var error = document.getElementById(input.id + 'Error');

                if (input.tagName.toLowerCase() === 'select') {
                    if (input.value === 'Country' || input.value === 'City') {
                        error.style.display = 'block';
                        valid = false;
                    } else {
                        error.style.display = 'none';
                    }
                } else {
                    if (input.value === '') {
                        error.style.display = 'block';
                        valid = false;
                    } else {
                        error.style.display = 'none';
                    }
                }
            });

            if (valid === true) {
                alert("Form is Submitted Successfully");
                form.submit();
            }
        });
    } else {
        console.log("Form not found");
    }
};
