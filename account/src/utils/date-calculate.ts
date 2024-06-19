export function getStartOfDay(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }
  
export function getStartOfWeek(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return getStartOfDay(new Date(date.setDate(diff)));
  }
  
  export function getStartOfMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
  
  export function getStartOfYear(date: Date) {
    return new Date(date.getFullYear(), 0, 1);
  }
  
  export function getRecent7Days(date: Date) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(date);
      day.setDate(day.getDate() - i);
      days.push(getStartOfDay(day));
    }
    return days;
  }