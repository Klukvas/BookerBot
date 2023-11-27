import { responseMessages, step4Responses } from "./response-messages";
import moment, {Moment} from 'moment-timezone'


type ValidateDatetimeSuccessResult = {
  isValid: true
  value: Moment
}

type ValidateDatetimeErrorResult = {
  isValid: false
  error: string
}

type ValidateDatetimeResult = ValidateDatetimeErrorResult | ValidateDatetimeSuccessResult

export function validateDatetime(messageText: string): ValidateDatetimeResult {
  let reservedFrom = moment(messageText, ['DD.MM.YYYY HH:mm', 'DD/MM/YYYY HH:mm'], true).tz('UTC');

  // Check if the format is valid
  if (reservedFrom.isValid()) {
    // Check if minutes have valid value. Valid: 00 or 30 (e.g., 16:00 \ 16:30)
    const minutes = reservedFrom.minutes();
    
    if (minutes === 0 || minutes === 30) {
      // Check if the date is more than 7 days in the future
      const maxAllowedDate = moment().add(7, 'days').tz('UTC');
      if (reservedFrom.isAfter(maxAllowedDate)) {
        return {
          isValid: false,
          error: step4Responses.dateTooFarInFuture
        }
      } else {
        // Date is within the allowed range
        return {
          isValid: true,
          value: reservedFrom
        }
      }
    } else {
      return {
        isValid: false,
        error: step4Responses.invalidMinutes
      };
    }
  } else {
    return {
      isValid: false,
      error: step4Responses.invalidDateTimeFormat
    };
  }
}
