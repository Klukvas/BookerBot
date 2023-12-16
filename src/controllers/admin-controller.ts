import { Request, Response } from "express";
import { ReservedSeats, Seat } from "../models";
import { ObjectId } from "mongodb";
import env from "../core/env";
import * as bcrypt from 'bcrypt';
import { dateToMoment } from "../utils/date-to-moment";
import { User } from "../models/user";
import { reservationFormatterAdmin } from "../utils/formatters/reservation-formatter-admin";
import { logger } from "../core/logger";

class AdminController{

  static async getCurrentReservations(req: Request, res: Response){
    const rawReservations = await ReservedSeats.find({})
    const reservations = []
    for(const item of rawReservations){
      const prettyReservation = await reservationFormatterAdmin(item)
      reservations.push(prettyReservation)
    }
    logger.info(`reservations: ${reservations}`)
    res.render('reservations-table', { reservations });
  }

  static async getCreateNewSeatForm(req: Request, res: Response){
    const allSeats = await Seat.find({})
    res.render('create-seat', {seatData: allSeats});
  }

  static async getLoginForm(req: Request, res: Response){
    res.render('login', {errorMessage: ''});
  }

  static async login(req: Request, res: Response){
    const { token } = req.body;
    if(token!==env.userHardToken){
      res.render('login', {errorMessage: 'Wrong token'});
    }else{
      const hashedToken = await bcrypt.hash(token, 10);
      req.session.token = hashedToken
      res.redirect('/admin')
    }
  }

  static async createNewSeat(req: Request, res: Response){
    const { seatNumber, type, cost } = req.body;
    if(type){
      await Seat.create({ seatNumber, type, cost });
    }else{
      await Seat.create({ seatNumber, cost });
    }
    const allSeats = await Seat.find({})
    res.render('create-seat', { seatData: allSeats });
  }
  
  static async deleteSeat(req: Request, res: Response) {
    try {
      const { deleteId } = req.body;
      // Check if deleteId is a valid ObjectId
      if (!ObjectId.isValid(deleteId)) {
        return res.status(400).json({ error: 'Invalid ObjectId format for deleteId' });
      }

      // Use deleteMany for deleting based on a condition (ID in this case)
      const result = await Seat.deleteMany({ _id: new ObjectId(deleteId) });

      if (result.deletedCount > 0) {
        // If at least one document was deleted, you might want to redirect or send a success message
        res.redirect('/admin/createSeat'); // Adjust the route based on your actual setup
      } else {
        // If no document was deleted, you might want to handle this case
        res.json({ message: 'No matching seat found for deletion.' });
      }
    } catch (error) {
      // Handle errors appropriately (e.g., log them, send an error response)
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


}

export default AdminController;