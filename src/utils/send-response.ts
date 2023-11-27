import axios from "axios"
import env from "./core/env"
import { Response } from "express"

type SendResponseArgs = {
  env: typeof env
  message: string
  chatId: number
  expressResp: Response
}

export async function sendResponse({env, message, chatId, expressResp}: SendResponseArgs) {
  const url = `https://api.telegram.org/bot${env.botToken}/sendMessage?&chat_id=${chatId}&text=${message}`
  console.log('url: ', url)
  await axios.get(url)
  expressResp.status(200).contentType('text').send('OK')
}