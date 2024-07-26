export function getStartDate() {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const startOf48HoursAgo = new Date(startOfToday);
    startOf48HoursAgo.setHours(startOfToday.getHours() - 48);
    return startOf48HoursAgo;
  }