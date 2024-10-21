document.addEventListener('DOMContentLoaded', () => {
  const createPostBtn = document.getElementById('create-new-post');

  createPostBtn.addEventListener('click', () => {
    window.location.href = '/dashboard/new'; // Redirect to create a new post page
  });

  document.querySelectorAll('.delete-post').forEach(button => {
    button.addEventListener('click', async (event) => {
      const postId = event.target.getAttribute('data-id');
      const response = await fetch(`/api/posts/${postId}`, { method: 'DELETE' });
      if (response.ok) {
        document.location.reload(); // Reload dashboard on success
      } else {
        alert('Failed to delete post.');
      }
    });
  });
});
