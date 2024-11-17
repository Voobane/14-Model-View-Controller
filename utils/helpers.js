module.exports = {
  format_date: (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  format_datetime: (date) => {
    return new Date(date).toISOString();
  },

  format_relative_time: (date) => {
    const now = new Date();
    const past = new Date(date);
    const diff = Math.floor((now - past) / 1000);

    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    return past.toLocaleDateString();
  },

  format_username: (username) => {
    return username ? username.charAt(0).toUpperCase() + username.slice(1) : "";
  },

  format_datetime: (date) => {
    return new Date(date).toISOString();
  },

  format_username: (username) => {
    return username ? username.charAt(0).toUpperCase() + username.slice(1) : "";
  },

  create_excerpt: (text, length = 150) => {
    if (!text) return "";
    if (text.length <= length) return text;
    return text.substr(0, length) + "...";
  },

  pluralize: (count, singular, plural) => {
    return count === 1 ? singular : plural;
  },

  is_owner: (resourceUserId, sessionUserId) => {
    return resourceUserId === sessionUserId;
  },

  equals: (a, b) => {
    return a === b;
  },
};
