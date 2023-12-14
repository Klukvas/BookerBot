import axios from "axios";
import env from "../core/env";
import { Response } from "express";
import { appLogger } from "../core/logger";

type SendResponseArgs = {
  message: string;
  chatId: number;
  expressResp: Response;
  reply_markup?: any;
};

export async function sendResponse({
  message,
  chatId,
  expressResp,
  reply_markup,
}: SendResponseArgs) {
  const url = `https://api.telegram.org/bot${env.botToken}/sendMessage`;

  const params = {
    chat_id: chatId,
    text: message,
    reply_markup: reply_markup
  };

  try {
    await axios.post(url, params);
  } catch (err) {
    appLogger.error(`Could not send request to bot with error: ${err}`);
  }

  expressResp.status(200).contentType("text").send("OK");
}
