import axios from "axios"
import env from "./core/env"
import { Response } from "express"
import { error } from "console"
import { appLogger } from "./core/logger"

type SendResponseArgs = {
  message: string
  chatId: number
  expressResp: Response
}

export async function sendResponse({message, chatId, expressResp}: SendResponseArgs) {
  // const url = `https://api.telegram.org/bot${env.botToken}/sendMessage?&chat_id=${chatId}&text=${encodeURIComponent(message)}`
  const url = `https://api.telegram.org/bot${env.botToken}/sendMessage`
  try{
    // await axios.get(url)
    await axios.post(url, {
      chat_id: chatId,
      text: message,
    })
  }catch(err){
    appLogger.error(`Could not send request to bot with error: ${err}`)
  }
  
  expressResp.status(200).contentType('text').send('OK')
}