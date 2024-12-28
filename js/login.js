
window.addEventListener('load', async () => {

    const token = localStorage.getItem('token')
    if (token) {
        try {
            const res = await axios.post("http://localhost:8080/user/v1/verify", {}, {
                headers: { 'token': token}
            });
            if (res.data.valid) {
              window.location.href='http://localhost:5000/me'
            }
        } catch (error) {
            alert("Please login")
        }
    }
})


let loginForm = document.querySelector(".my-form")

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    let email = document.getElementById("email").value
    let password = document.getElementById("password").value

    try {
        const res = await axios.post("http://localhost:5000/signin", { email, password })
        localStorage.setItem("token", res.data.token)  
        alert("Signin successful")
        window.location.href = 'http://localhost:5000/me'
    } catch (err) {
        console.log(err)
        alert("Unauthorized")
    }
})


