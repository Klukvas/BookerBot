import { Request, Response } from "express";
import path from "path";
import { Seat } from "../models";

class AdminController{
  static getCurrentReservations(req: Request, res: Response){
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
    res.render('create-seat');
  }

  static async createNewSeat(req: Request, res: Response){
    const { name, type, cost } = req.body;
    await Seat.create({ name, type, cost });
    res.send(200)
  }


}

export default AdminController;