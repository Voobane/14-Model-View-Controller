const deletePostHandler = async (event) => {
  if (event.target.matches(".delete-post")) {
    if (confirm("Are you sure you want to delete this post?")) {
      const postId = event.target.getAttribute("data-id");

      try {
        const response = await fetch(`/api/posts/${postId}`, {
          method: "DELETE",
        });

        if (response.ok) {
          document.location.replace("/dashboard");
        } else {
          const data = await response.json();
          alert(data.message || "Failed to delete post.");
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to delete post.");
      }
    }
  }
};

document
  .querySelector(".post-actions")
  ?.addEventListener("click", deletePostHandler);
