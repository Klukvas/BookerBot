import moment from "moment-timezone";

export const addDaysToCurrentDay = (days: number=1, hour: number=12, minute: number = 30) => {
  const today = moment();
  const tomorrow = today.clone().add(days, 'day');
  const tomorrowWithTime = tomorrow.clone().set({ hour: hour, minute: minute }).format('DD.MM.YYYY HH:mm')
  return tomorrowWithTime.toString()
}
