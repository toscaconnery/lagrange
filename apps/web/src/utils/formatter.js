export function formatRelativeDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  const diffMs = now - date;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;

  if (diffMs < minute) {
    return 'just now';
  }

  if (diffMs < hour) {
    const minutes = Math.floor(diffMs / minute);
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  }

  if (diffMs < day) {
    const hours = Math.floor(diffMs / hour);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  }

  if (diffMs < week) {
    const days = Math.floor(diffMs / day);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  if (diffMs < 4 * week) {
    const weeks = Math.floor(diffMs / week);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}