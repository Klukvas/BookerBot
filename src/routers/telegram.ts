import express, { Request, Response } from 'express'
import { newTelegramMessageController } from '../controllers/new-telegram-message-controller'

const telegramRouter = express.Router()
telegramRouter.post('/', newTelegramMessageController)

export default telegramRouter

