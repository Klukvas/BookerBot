import { Response } from "express";
import { IReserved, ReservedSeats, Seat } from "../../models";
import { IUser, User } from "../../models/user";
import { responseMessages } from "../../utils/response-messages";
import { sendResponse } from "../../utils/send-response";
import { calculatePrice } from "../../utils/calculate-price";
import { getNextSteps } from "../../utils/get-next-steps";

type ApproveReservationArgs = {
  user: IUser
  res: Response
  chatId: number
};

export async function approveReservation({ user, res, chatId}: ApproveReservationArgs) {
  const currentReservation = await ReservedSeats.findOne({ user: user._id, reservationFinished: false });

  if(!currentReservation){
    await sendResponse({
      message: responseMessages.reservationNotFound,
      expressResp: res,
      chatId
    })
    // res.send(responseMessages.reservationNotFound)
  }else{

    if(!currentReservation.reservedFrom || !currentReservation.seatId || !currentReservation.duration){
      const { keyboardMarkup } = await getNextSteps(currentReservation)
      await sendResponse({
        message: `${responseMessages.reservationNotReadyForApprove}`,
        expressResp: res,
        chatId,
        reply_markup: keyboardMarkup
      })
    }


    // check if time is not taken
    const sameReservations = await ReservedSeats.find({
      user: {$ne: currentReservation.user},
      reservedFrom: {$gte: currentReservation.reservedFrom}, 
      reservedTo: {$lte: currentReservation.reservedTo}, 
      seatId: currentReservation.seatId,
      reservationFinished: true
    })
    if(sameReservations.length !== 0){
      await ReservedSeats.deleteOne({_id: currentReservation._id})
      await sendResponse({
        message: responseMessages.sameReservationFinished,
        expressResp: res,
        chatId
      })
      // res.send(responseMessages.sameReservationFinished)
    }else{
      // first -> set reservation as finished
      await ReservedSeats.updateOne(
        {_id: currentReservation._id}, 
        {$set: {
          reservationFinished: true,
          stepFinished: true
        }}
      )
      // then -> update its amount
      const reservation = await ReservedSeats.findOne({_id: currentReservation._id})
      const reservedSeat = await Seat.findOne({_id: reservation!.seatId})
      const totalPrice = calculatePrice({duration: reservation!.duration, price: reservedSeat!.cost})
      await ReservedSeats.updateOne(
        {_id: currentReservation._id}, 
        {$set: {
          totalAmountToPay: totalPrice
        }}
      )
      await sendResponse({
        message: responseMessages.reservationFinished,
        expressResp: res,
        chatId
      })
      // res.send(responseMessages.reservationFinished)
    }

  }

    
}