import { Request, Response } from "express";
import { ReservedSeats, Seat } from "../models";
import { ObjectId } from "mongodb";
import env from "../core/env";
import * as bcrypt from 'bcrypt';
import { dateToMoment } from "../utils/date-to-moment";
import { User } from "../models/user";
import { reservationFormatterAdmin } from "../utils/formatters/reservation-formatter-admin";
import { logger } from "../core/logger";
import { Promo } from "../models/promo";
import { Condition } from "../models/conditions";
import { DurationHelper } from "../utils/duration-helper";

type ConditionErrorMessages = {
  conditionName?: string
  durationFrom?: string
  duraionTo?: string
  timeFrom?: string
  timeTo?: string
}

type GetConditionsOptions = {
  errorMessages?: ConditionErrorMessages
}

class AdminController{

  static async getLoginForm(req: Request, res: Response){
    res.render('login', {errorMessage: ''});
  }

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
  
  static async getConditions(req: Request, res: Response, options: GetConditionsOptions = {}) {
    const {
      errorMessages = {}
    } = options;
    const promos = await Promo.find({})
    const confitions = await Condition.find({})
    res.render(
      'conditions',
      {
        promos: promos,
        conditions: confitions,
        errorMessages: errorMessages
      });
  }

  static async deleteCondition(req: Request, res: Response){
    try {
      const { deleteId } = req.body;
      if (!ObjectId.isValid(deleteId)) {
        // todo: ...
      }else{
        const result = await Condition.deleteMany({_id: new ObjectId(deleteId)})
        if(result.deletedCount > 0){
          res.redirect('/admin/conditions')
        }else {
          // If no document was deleted, you might want to handle this case
          res.json({ message: 'No matching seat found for deletion.' });
        }
      }
    } catch (error) {
      // Handle errors appropriately (e.g., log them, send an error response)
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  static async createCondition(req: Request, res: Response){
    const {
      conditionName,
      isWeekend,
      isWorkday,
      durationFrom,
      duraionTo,
      timeFrom,
      timeTo
    } = req.body
    const isWeekendValue = isWeekend == 'on' ? true: false
    const isWorkdayValue = isWorkday == 'on' ? true: false
    const errorMessages: ConditionErrorMessages = {};
    const updObj = {} as any;
    if(!conditionName || !conditionName.trim()){
      errorMessages.conditionName = 'Invalid'
    }
    if(durationFrom){
      const isDurationFromValid = DurationHelper.isDurationValid(durationFrom)
      if(!isDurationFromValid){
        errorMessages.durationFrom = 'Invalid format'
      }else{
        updObj.durationFrom = DurationHelper.stringToMinutes(durationFrom)
      }
      
    }

    if(duraionTo){
      const isDurationToValid = DurationHelper.isDurationValid(duraionTo)
      if(!isDurationToValid){
        errorMessages.duraionTo = 'Invalid format'
      }else{
        const durationToMinutes = DurationHelper.stringToMinutes(duraionTo)
        if(updObj.durationFrom && updObj.durationFrom > durationToMinutes){
          errorMessages.duraionTo = 'Could not be less then duration from'
        }else{
          updObj.durationTo = DurationHelper.stringToMinutes(duraionTo)
        }
      }
    }
    //todo: validation of time
    console.log(`updObj: ${JSON.stringify(updObj)}`)
    if(Object.keys(errorMessages).length == 0){
      await Condition.create({
        name: conditionName,
        isWeekend: isWeekendValue,
        isWorkday: isWorkdayValue,
        durationFrom: updObj.durationFrom,
        duraionTo: updObj.durationTo,
        timeFrom: timeFrom,
        timeTo: timeTo
      })
      res.redirect('/admin/conditions')
    }else{
      return await AdminController.getConditions(req, res, {errorMessages})
    }


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

  static async getUserTable(req: Request, res: Response){
    const users = await User.find({})
    res.render('users-table', {users: users});
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