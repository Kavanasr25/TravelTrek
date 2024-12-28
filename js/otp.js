let loginForm = document.querySelector(".my-form")

loginForm.addEventListener("submit", (e) => { 
    e.preventDefault();

    let email = document.getElementById("email").value 
    let token = document.getElementById("otp").value  // First, check if the email already exists
     // First, check if the email already exists
    axios
        .post("http://localhost:8080/verifyEmail", { eamil,token}) 
        .then(res => {
            if (res.data.valid) {
                alert("Email verified")
                window.location.href="http://127.0.0.1:5500/TravelTrek/index.html"
            } else {
                alert("verification unsucessfull")
            }
        })
        .catch(err => {
            alert("Failed to check email")
        })
})











