document.querySelector("#logout").addEventListener("click", async () => {
  const response = await fetch("/api/users/logout", {
    method: "POST",
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert("Failed to log out.");
  }
});
