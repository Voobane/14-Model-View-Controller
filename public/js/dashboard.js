// Function to handle creating a new post
const createPostHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#post-content").value.trim();

  if (title && content) {
    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard"); // Reload the dashboard to show the new post
    } else {
      alert("Failed to create post.");
    }
  }
};

// Function to handle deleting a post
const deletePostHandler = async (event) => {
  const id = event.target.getAttribute("data-id");

  if (id) {
    const response = await fetch(`/api/posts/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      document.location.replace("/dashboard"); // Reload the dashboard to reflect deleted post
    } else {
      alert("Failed to delete post.");
    }
  }
};

// Event listeners
document
  .querySelector(".new-post-form")
  .addEventListener("submit", createPostHandler);

document.querySelectorAll(".delete-post-btn").forEach((button) => {
  button.addEventListener("click", deletePostHandler);
});
