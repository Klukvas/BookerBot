import express, { Request, Response, Router } from 'express'
import { newTelegramMessageController } from '../controllers/new-telegram-message-controller'

const telegramRouter = express.Router()
telegramRouter.post('/new-message', newTelegramMessageController)

export default telegramRouter

