module.exports = {
  // Format date
  format_date: (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  // Format date for datetime attribute
  format_datetime: (date) => {
    if (!date) return "";
    return new Date(date).toISOString();
  },

  // Create excerpt from longer text
  create_excerpt: (text, length = 150) => {
    if (!text) return "";
    text = text.replace(/(<([^>]+)>)/gi, ""); // Remove HTML tags
    if (text.length <= length) return text;
    return text.substr(0, length).trim() + "...";
  },

  // Format relative time (e.g., "2 hours ago")
  format_relative_time: (date) => {
    if (!date) return "";

    const now = new Date();
    const then = new Date(date);
    const diff = Math.floor((now - then) / 1000); // difference in seconds

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 31536000) return `${Math.floor(diff / 2592000)} months ago`;
    return `${Math.floor(diff / 31536000)} years ago`;
  },

  // Format username (capitalize first letter)
  format_username: (username) => {
    if (!username) return "";
    return username.charAt(0).toUpperCase() + username.slice(1);
  },

  // Pluralize words
  pluralize: (count, singular, plural) => {
    return count === 1 ? singular : plural;
  },

  // Check if values are equal
  equals: (a, b) => {
    return a === b;
  },

  // Check if user is owner
  is_owner: (contentUserId, sessionUserId) => {
    return contentUserId === sessionUserId;
  },

  // Get current year
  get_year: () => {
    return new Date().getFullYear();
  },

  // Format number (e.g., for view counts)
  format_number: (number) => {
    if (!number) return "0";
    return new Intl.NumberFormat("en-US").format(number);
  },
};
