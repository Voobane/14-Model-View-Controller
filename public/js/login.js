const loginFormHandler = async (event) => {
  event.preventDefault();

  const username = document.querySelector("#username-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();

  if (username && password) {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to log in.");
      }
    } catch (err) {
      alert("Failed to log in. Please try again.");
    }
  }
};

document
  .querySelector("#login-form")
  .addEventListener("submit", loginFormHandler);
