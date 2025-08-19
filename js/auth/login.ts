const loginForm = document.getElementById("login-form") as HTMLFormElement | null;
const authAPI = "https://6874d57add06792b9c95705b.mockapi.io/api/v1/login";

interface User {
  id: string;
  username: string;
  password: string;
  [key: string]: any;
}

if (loginForm) {
  loginForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);
    const data = Object.fromEntries(formData.entries()) as Record<string, string>;

    try {
      const response: User[] = await fetch(authAPI).then((res) => res.json());

      const user = response.find(
        (u) => u.username === data.username && u.password === data.password
      );

      if (user) {
        localStorage.setItem("OutreachHub-user", JSON.stringify(user));
        window.location.href = "../pages/home.html";
      } else {
        alert("Invalid username or password");
      }
    } catch (e) {
      console.error("Error in login form submission:", e);
    }
  });
}

const checkLocalStorage = (): void => {
  const userStr = localStorage.getItem("OutreachHub-user");
  if (!userStr) return;

  try {
    const user: User = JSON.parse(userStr);
    if (user) {
      window.location.href = "../pages/home.html";
    }
  } catch (e) {
    console.error("Failed to parse user from localStorage:", e);
  }
};

checkLocalStorage();


