import moment, { Moment } from "moment";

export function addDurationToDate(date: Moment, duration: string): Moment {
  const [hours, minutes] = duration.split(":").map(Number);
  const reservedTo = date.add(hours, 'hours').add(minutes, 'minutes');
  return reservedTo
}
