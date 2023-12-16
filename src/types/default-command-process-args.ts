import { Response } from "express"
import { IUser } from "../models/user"

export type DefaultCommandProcessArgs = {
  res: Response
  user: IUser
  chatId: number
}