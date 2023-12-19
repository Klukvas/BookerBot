import { Moment } from "moment-timezone";
import env from "../core/env";

type AddDurationToDateArgs = {
  duration: number | string, 
  date: Moment
}


export class DurationHelper{

  static addDurationToDate({duration, date}: AddDurationToDateArgs){
    let minutesToAdd;
    if (typeof duration === 'number') {
      minutesToAdd = duration
    } else if (typeof duration === 'string') {
      minutesToAdd = DurationHelper.stringToMinutes(duration)
    } else {
      throw new Error(`Expected number | string, received: ${duration}`)
    }
    const updatedDate = date.clone()
    updatedDate.add(minutesToAdd, 'minutes')
    return updatedDate
  }

  static isDurationValid(diration: string): boolean {
    const [hoursStr, minutesStr] = diration.split(':');
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
    
    if(hours >= env.maxReservationHours){
      return false
    }
  
    // If all conditions pass, it's a valid time
    return true;
  }

  static stringToMinutes(duration: string): number{
    // from "2:30" to 150
    const [hoursStr, minutesStr] = duration.split(':')
    const hours = parseInt(hoursStr, 10);
    const minutes = parseInt(minutesStr, 10);
    return hours * 60 + minutes
  }

  static minutesToString(duration: number): string{
    // from 150 to "2:30"
    const hours = Math.trunc(duration / 60)
    const mins = String(duration % 60)
    return `${hours}:${mins.padEnd(2, '0')}`
  }


}

