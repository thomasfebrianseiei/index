// customLocale.js

const { id: idLocale } = require('date-fns/locale');

// Function to create a custom Indonesian locale for durations up to 24 hours
function getCustomLocale() {
  const customLocale = {
    ...idLocale,
    formatDistance: (token, count, options) => {
      const formatDistanceLocale = {
        lessThanXMinutes: {
          one: 'kurang dari 1 menit',
          other: 'kurang dari {{count}} menit yg lalu'
        },
        xMinutes: {
          one: '1 menit',
          other: '{{count}} menit yg lalu'
        },
        aboutXHours: {
          one: 'sekitar 1 jam',
          other: '{{count}} jam yg lalu'
        },
        xHours: {
          one: '1 jam',
          other: '{{count}} jam yg lalu'
        },
        xDays: {
          one: '1 hari',
          other: '{{count}} hari yg lalu'
        }
      };

      const result = formatDistanceLocale[token];
      return typeof result === 'string' ? result : result.other.replace('{{count}}', count);
    }
  };

  return customLocale;
}

module.exports = {
  getCustomLocale,
};
