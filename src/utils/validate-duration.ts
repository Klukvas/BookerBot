export function validateDuration(timeString: string) {
    const [hoursStr, minutesStr] = timeString.split(':');
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
  
    // Check if it's a valid time format with valid integers for hours and minutes
    if (isNaN(hours) || isNaN(minutes)) {
      return false;
    }
  
    // Check if it's more than half an hour and less than 12 hours
    if (hours < 0 || hours > 11 || (hours === 11 && minutes > 30) || minutes < 0 || minutes >= 60) {
      return false;
    }
  
    // Check if the step is half an hour
    if (minutes % 30 !== 0) {
      return false;
    }
  
    // If all conditions pass, it's a valid time
    return true;
  }
  