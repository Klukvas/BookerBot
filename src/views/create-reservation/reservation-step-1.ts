import moment from "moment";
import { IReserved, ReservedSeats } from "../../models";
import { buildResponse } from "../../utils/response";

export async function reservationStep1(messageText: string, reservationInProgress: IReserved) {
  let reservedFrom = moment(messageText, ['DD.MM.YYYY HH:mm', 'DD/MM/YYYY HH:mm'], true).tz('UTC')
  console.log('customerDateTime: ', reservedFrom)
  if(reservedFrom.isValid()){
    await ReservedSeats.updateOne({ _id: reservationInProgress._id }, { $set: { reservedFrom: reservedFrom, step: 2} });
    return buildResponse({responseMessage: 'Awesome. Our next step - how many hours do U want ?'})
  }else{
    return buildResponse({status: 400, responseMessage: 'It is wrong date-time format.\nWe expect one of the next formats: \n-DD.MM.YYYY HH:mm(23.11.2023 12:50)\n-DD/MM/YYYY HH:mm(23/11/2023 12:50)'})
  }
  return buildResponse({status: 400, responseMessage: 'I`m sorry, but it is incorrect data. Pls, try again'})
    
}