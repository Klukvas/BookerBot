import express, { Request, Response, Router } from 'express'
import adminController from '../controllers/admin-controller'
import AdminController from '../controllers/admin-controller'

const adminRouter = express.Router()
adminRouter.get('/', AdminController.getCurrentReservations)
adminRouter.get('/createSeat', AdminController.getCreateNewSeatForm)
adminRouter.post('/createSeat', AdminController.createNewSeat)
adminRouter.post('/deleteSeat', AdminController.deleteSeat)

export default adminRouter

