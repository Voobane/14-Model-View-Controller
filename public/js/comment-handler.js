const commentFormHandler = async (event) => {
  event.preventDefault();

  const postId = event.target.getAttribute("data-post-id");
  const content = document.querySelector("#comment-content").value.trim();

  if (content) {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        document.location.reload();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to post comment.");
      }
    } catch (err) {
      alert("Failed to post comment.");
    }
  }
};

const deleteCommentHandler = async (event) => {
  if (event.target.matches(".delete-comment")) {
    const commentId = event.target.getAttribute("data-id");

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        document.location.reload();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete comment.");
      }
    } catch (err) {
      alert("Failed to delete comment.");
    }
  }
};

document
  .querySelector("#comment-form")
  ?.addEventListener("submit", commentFormHandler);
document
  .querySelector(".comments")
  ?.addEventListener("click", deleteCommentHandler);
