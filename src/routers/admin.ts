import express, { Request, Response, Router } from 'express'
import AdminController from '../controllers/admin-controller'
import { sessionChecker } from '../middlewares/session-checker'

const adminRouter = express.Router()

adminRouter.get('/', sessionChecker, AdminController.getCurrentReservations)
adminRouter.get('/createSeat', sessionChecker, AdminController.getCreateNewSeatForm)
adminRouter.get('/login', AdminController.getLoginForm)
adminRouter.get('/users',sessionChecker, AdminController.getUserTable)
adminRouter.get('/conditions',sessionChecker, (req: Request, res: Response) => {
  AdminController.getConditions(req, res);
});

adminRouter.post('/createSeat', AdminController.createNewSeat)
adminRouter.post('/login', AdminController.login)
adminRouter.post('/deleteSeat', AdminController.deleteSeat)
adminRouter.post('/create-condition', AdminController.createCondition)
adminRouter.post('/delete-condition', AdminController.deleteCondition)

export default adminRouter

