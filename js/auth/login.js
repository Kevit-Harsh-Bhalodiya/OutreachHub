"use strict";
const loginForm = document.getElementById("login-form");
const authAPI = "https://6874d57add06792b9c95705b.mockapi.io/api/v1/login";
if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const formData = new FormData(loginForm);
        const data = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(authAPI).then((res) => res.json());
            const user = response.find((u) => u.username === data.username && u.password === data.password);
            if (user) {
                localStorage.setItem("OutreachHub-user", JSON.stringify(user));
                window.location.href = "../pages/home.html";
            }
            else {
                alert("Invalid username or password");
            }
        }
        catch (e) {
            console.error("Error in login form submission:", e);
        }
    });
}
const checkLocalStorage = () => {
    const userStr = localStorage.getItem("OutreachHub-user");
    if (!userStr)
        return;
    try {
        const user = JSON.parse(userStr);
        if (user) {
            window.location.href = "../pages/home.html";
        }
    }
    catch (e) {
        console.error("Failed to parse user from localStorage:", e);
    }
};
checkLocalStorage();
