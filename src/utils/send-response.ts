import axios from "axios"
import env from "./core/env"
import { Response } from "express"

type SendResponseArgs = {
  message: string
  chatId: number
  expressResp: Response
}

export async function sendResponse({message, chatId, expressResp}: SendResponseArgs) {
  const url = `https://api.telegram.org/bot${env.botToken}/sendMessage?&chat_id=${chatId}&text=${encodeURIComponent(message)}`
  console.log('url: ', url)
  console.log('it is a real one')
  await axios.get(url)
  expressResp.status(200).contentType('text').send('OK')
}