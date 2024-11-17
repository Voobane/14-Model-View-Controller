const editFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#post-content").value.trim();
  const status = document.querySelector("#post-status")?.value || "published";
  const postId = document
    .querySelector("#edit-post-form")
    .getAttribute("data-id");

  if (title && content) {
    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        body: JSON.stringify({
          title,
          content,
          status,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update post");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update post");
    }
  }
};

const deleteHandler = async (event) => {
  if (event.target.matches(".delete-post")) {
    const postId = event.target.getAttribute("data-id");

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete post");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to delete post");
    }
  }
};

document
  .querySelector("#edit-post-form")
  .addEventListener("submit", editFormHandler);
document.addEventListener("click", deleteHandler);
