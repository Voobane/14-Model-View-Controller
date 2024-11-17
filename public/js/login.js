const loginFormHandler = async (event) => {
  event.preventDefault();

  // Get form elements
  const username = document.querySelector("#username-login").value.trim();
  const password = document.querySelector("#password-login").value.trim();

  // Form validation
  if (!username || !password) {
    alert("Please enter both username and password");
    return;
  }

  try {
    // Disable form while processing
    const submitButton = document.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = "Logging in...";

    const response = await fetch("/api/users/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (response.ok) {
      // Successful login - redirect to dashboard
      document.location.replace("/dashboard");
    } else {
      // Show error message
      alert(data.message || "Failed to log in. Please check your credentials.");
    }
  } catch (err) {
    console.error("Login error:", err);
    alert("An error occurred during login. Please try again.");
  } finally {
    // Re-enable form
    const submitButton = document.querySelector('button[type="submit"]');
    submitButton.disabled = false;
    submitButton.textContent = "Login";
  }
};

// Add event listeners
document
  .querySelector("#login-form")
  .addEventListener("submit", loginFormHandler);

// Optional: Add enter key support for form fields
document.querySelectorAll(".form-input").forEach((input) => {
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      document.querySelector('button[type="submit"]').click();
    }
  });
});
