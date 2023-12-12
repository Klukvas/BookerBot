import express, { Request, Response, Router } from 'express'
import { newTelegramMessageController } from '../controllers/new-telegram-message-controller'

const telegramRouter = express.Router()
telegramRouter.post('/new-message', newTelegramMessageController)
telegramRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).send('Ok')
})

export default telegramRouter

