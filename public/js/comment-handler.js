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
      console.error("Error:", err);
      alert("Failed to post comment.");
    }
  }
};

const editCommentHandler = async (event) => {
  if (event.target.matches(".edit-comment")) {
    const commentId = event.target.getAttribute("data-id");
    const commentDiv = document.getElementById(`comment-${commentId}`);
    const contentDiv = commentDiv.querySelector(".comment-content");
    const currentContent = contentDiv.textContent.trim();

    // Create edit form
    const editForm = document.createElement("form");
    editForm.className = "edit-comment-form";
    editForm.innerHTML = `
      <div class="form-group">
        <textarea class="form-input" required>${currentContent}</textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-sm btn-primary">Save</button>
        <button type="button" class="btn btn-sm btn-secondary cancel-edit">Cancel</button>
      </div>
    `;

    // Replace content with edit form
    contentDiv.style.display = "none";
    contentDiv.insertAdjacentElement("afterend", editForm);

    // Hide edit and delete buttons while editing
    const actionButtons = commentDiv.querySelector(".comment-actions");
    if (actionButtons) actionButtons.style.display = "none";

    // Handle cancel
    editForm.querySelector(".cancel-edit").addEventListener("click", () => {
      editForm.remove();
      contentDiv.style.display = "block";
      if (actionButtons) actionButtons.style.display = "flex";
    });

    // Handle save
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const newContent = editForm.querySelector("textarea").value.trim();

      if (newContent && newContent !== currentContent) {
        try {
          const response = await fetch(`/api/comments/${commentId}`, {
            method: "PUT",
            body: JSON.stringify({ content: newContent }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (response.ok) {
            // Update content and cleanup
            contentDiv.textContent = newContent;
            editForm.remove();
            contentDiv.style.display = "block";
            if (actionButtons) actionButtons.style.display = "flex";

            // Add edited indicator if not already present
            const commentMeta = commentDiv.querySelector(".comment-meta");
            if (!commentMeta.querySelector(".comment-edited")) {
              commentMeta.insertAdjacentHTML(
                "beforeend",
                '<span class="comment-edited">(edited)</span>'
              );
            }
          } else {
            const data = await response.json();
            alert(data.message || "Failed to update comment.");
          }
        } catch (err) {
          console.error("Error:", err);
          alert("Failed to update comment.");
        }
      } else {
        // If no changes, just cancel
        editForm.remove();
        contentDiv.style.display = "block";
        if (actionButtons) actionButtons.style.display = "flex";
      }
    });
  }
};

const deleteCommentHandler = async (event) => {
  if (event.target.matches(".delete-comment")) {
    if (confirm("Are you sure you want to delete this comment?")) {
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
        console.error("Error:", err);
        alert("Failed to delete comment.");
      }
    }
  }
};

// Add event listeners
document
  .querySelector("#comment-form")
  ?.addEventListener("submit", commentFormHandler);
document
  .querySelector(".comments-list")
  ?.addEventListener("click", editCommentHandler);
document
  .querySelector(".comments-list")
  ?.addEventListener("click", deleteCommentHandler);
