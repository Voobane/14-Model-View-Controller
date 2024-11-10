document
  .getElementById("new-post-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = document.getElementById("post-title").value.trim();
    const content = document.getElementById("post-content").value.trim();

    if (title && content) {
      try {
        const response = await fetch("/api/posts", {
          method: "POST",
          body: JSON.stringify({ title, content }),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          document.location.replace("/dashboard");
        } else {
          const data = await response.json();
          alert(data.message || "Failed to create post");
        }
      } catch (err) {
        alert("Failed to create post");
      }
    }
  });
