const signupForm = document.getElementById("signup-form");
const authAPI = "https://6874d57add06792b9c95705b.mockapi.io/api/v1/login";

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  console.log("SignUp form submitted");
  const formData = new FormData(signupForm);
  const data = Object.fromEntries(formData.entries());
  console.log("Form data:", data);
  try {
    await fetch(authAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(data),
    })
      .then((res) => console.log("API Call successful: ", res))
      .catch((err) => console.log("Error in api call: ", err));
  } catch (e) {
    console.log("Error in signup form submission: ", e);
  }
});
