import moment from "moment";

export const getTommorowDate = () => {
    const today = moment();
    const tomorrow = today.clone().add(1, 'day');
    const tomorrowWithTime = tomorrow.clone().set({ hour: 12, minute: 30 }).format('DD.MM.YYYY HH:mm')
    return tomorrowWithTime.toString()
  }
