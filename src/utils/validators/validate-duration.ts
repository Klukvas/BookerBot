import env from "../../core/env";

export function validateDuration(timeString: string) {
  const [hoursStr, minutesStr] = timeString.split(':');
  const hours = parseInt(hoursStr, 10);
  const minutes = parseInt(minutesStr, 10);
  // Check if it's a valid time format with valid integers for hours and minutes
  if (isNaN(hours) || isNaN(minutes)) {
    return false;
  }

  // Check if the step is half an hour
  if (minutes % 30 !== 0) {
    return false;
  }
  // handle 00:00 | 00:29<
  if(hours <= 0 && minutes < 30 ){
    return false
  }
  
  if(hours === (env.maxReservationHours - 1) && minutes > 30){
    console.log('env.maxReservationHours - 1', env.maxReservationHours - 1)
    return false
  }

  if(hours >= env.maxReservationHours){
    return false
  }

  // If all conditions pass, it's a valid time
  return true;
  }
  