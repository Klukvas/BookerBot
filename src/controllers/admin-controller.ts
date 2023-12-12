import { Request, Response } from "express";
import { Seat } from "../models";
import { ObjectId } from "mongodb";
import env from "../utils/core/env";
import * as bcrypt from 'bcrypt';

class AdminController{

  static async getCurrentReservations(req: Request, res: Response){
    const reservations = [
      {
        id: 12,
        reservedFor: 'asd',
        reservedUntil: 'sad',
        amount: 122
      },
      {
        id: 123,
        reservedFor: 'asd',
        reservedUntil: 'sad',
        amount: 12
      }
    ]
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
    const { name, type, cost } = req.body;
    if(type){
      await Seat.create({ name, type, cost });
    }else{
      await Seat.create({ name, cost });
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