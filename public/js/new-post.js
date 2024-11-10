const newPostFormHandler = async (event) => {
  event.preventDefault();

  // Get form values
  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#post-content").value.trim();

  // Validate input
  if (!title || !content) {
    alert("Please fill in both title and content");
    return;
  }

  try {
    // Send POST request to create new post
    const response = await fetch("/api/posts", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      // If successful, redirect to dashboard
      document.location.replace("/dashboard");
    } else {
      const data = await response.json();
      alert(data.message || "Failed to create post");
    }
  } catch (err) {
    console.error("Error:", err);
    alert("Failed to create post");
  }
};

// Add event listener to form
document
  .querySelector("#new-post-form")
  .addEventListener("submit", newPostFormHandler);
