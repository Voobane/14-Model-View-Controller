document.addEventListener("DOMContentLoaded", () => {
  let timeoutID;
  const warningTimeout = 150000; // Show warning after 150 seconds (30 seconds before logout)
  const logoutTimeout = 180000; // Logout after 180 seconds

  // Function to reset the timer
  const resetTimer = () => {
    clearTimeout(timeoutID);
    // Set new timeout
    timeoutID = setTimeout(showWarning, warningTimeout);
  };

  // Function to show warning modal
  const showWarning = () => {
    // Create and show the warning modal
    const modal = document.createElement("div");
    modal.className = "timeout-modal";
    modal.innerHTML = `
        <div class="timeout-modal-content">
          <h2>Session Timeout Warning</h2>
          <p>Your session will expire in 30 seconds due to inactivity.</p>
          <p>Click anywhere or move your mouse to stay logged in.</p>
          <div class="timeout-progress"></div>
        </div>
      `;
    document.body.appendChild(modal);

    // Add countdown animation
    const progress = modal.querySelector(".timeout-progress");
    progress.style.animation = "countdown 30s linear forwards";

    // Set timeout for actual logout
    setTimeout(() => {
      window.location.href = "/api/users/logout";
    }, 30000); // 30 seconds after warning

    // Reset timer if user shows activity during warning period
    const resetAndRemoveWarning = () => {
      modal.remove();
      resetTimer();
      document.removeEventListener("mousemove", resetAndRemoveWarning);
      document.removeEventListener("click", resetAndRemoveWarning);
      document.removeEventListener("keypress", resetAndRemoveWarning);
    };

    document.addEventListener("mousemove", resetAndRemoveWarning);
    document.addEventListener("click", resetAndRemoveWarning);
    document.addEventListener("keypress", resetAndRemoveWarning);
  };

  // Add event listeners for user activity
  document.addEventListener("mousemove", resetTimer);
  document.addEventListener("click", resetTimer);
  document.addEventListener("keypress", resetTimer);

  // Start initial timer
  resetTimer();
});
