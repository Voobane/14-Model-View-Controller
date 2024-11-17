document.addEventListener("DOMContentLoaded", () => {
  // Handle delete post
  document.querySelectorAll(".delete-post").forEach((button) => {
    button.addEventListener("click", async (event) => {
      if (confirm("Are you sure you want to delete this post?")) {
        const postId = event.target.getAttribute("data-id");

        try {
          const response = await fetch(`/api/posts/${postId}`, {
            method: "DELETE",
          });

          if (response.ok) {
            document.location.replace("/dashboard");
          } else {
            alert("Failed to delete post");
          }
        } catch (err) {
          console.error("Error:", err);
          alert("Failed to delete post");
        }
      }
    });
  });
});
