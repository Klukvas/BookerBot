import { Request, Response } from "express";
import { logger } from "../core/logger";
import { handleCallbackQuery } from "../views/handlers/handle-callback-query";
import { messageHandler } from "../views/handlers/message-handler";

export async function newTelegramMessageController(req: Request, res: Response) {
  
  logger.debug(`New message form bot received:\n${JSON.stringify(req.body)}`)

  const { message, edited_message, callback_query, ...rest }  = req.body;

  logger.debug(`edited_message: ${edited_message}`)
  logger.debug(`callback_query: ${callback_query}`)
  logger.debug(`message: ${message}`)

  if(edited_message) {
    res.status(200).send('ok')
    return
  }else if(callback_query){
    await handleCallbackQuery({callback: callback_query, res})
  }else if(message){
    await messageHandler({message, res})
  } else {
    logger.error(`New type of message appear: ${rest}`)
    res.status(200).send('ok')
  }
  
}
