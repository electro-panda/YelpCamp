const toogle=document.querySelector("#eye");
toogle.onclick=togglePassword;

function togglePassword() {
    let passwordInput = document.getElementById("password");
    let eyeIcon = document.getElementById("eye-icon");
    console.log("pass.js loaded");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        eyeIcon.src = "https://cdn-icons-png.flaticon.com/512/2767/2767146.png"; // Closed eye icon
    } else {
        passwordInput.type = "password";
        eyeIcon.src = "https://cdn-icons-png.flaticon.com/512/159/159604.png"; // Open eye icon
    }
}