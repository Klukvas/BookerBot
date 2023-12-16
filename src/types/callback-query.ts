import { Chat } from "./chat"
import { MessageFrom } from "./message-from"
import { Message } from "./new-message"

export type CallbackQury = {
  from: MessageFrom
  chat: Chat
  data: string
  message: Message
}

/**
 * {
   "update_id":231231132213,
   "callback_query":{
      "id":"123123123",
      "from":{
         "id":123123123,
         "is_bot":false,
         "first_name":"adsdasadsdas",
         "username":"qweqweewqweq",
         "language_code":"ru"
      },
      "message":{
         "message_id":231312,
         "from":{
            "id":123123,
            "is_bot":true,
            "first_name":"booker",
            "username":"MissClickBooker_bot"
         },
         "chat":{
            "id":12321123,
            "first_name":"qweeqw",
            "username":"qweeqw",
            "type":"private"
         },
         "date":1702668253,
         "text":"askdfndaksjf",
         "entities":[
            {
               "offset":98,
               "length":11,
               "type":"bot_command"
            },
            {
               "offset":171,
               "length":11,
               "type":"bot_command"
            },
            {
               "offset":244,
               "length":15,
               "type":"bot_command"
            },
            {
               "offset":327,
               "length":5,
               "type":"bot_command"
            }
         ],
         "reply_markup":{
            "inline_keyboard":[
               [
                  {
                     "text":"📅 Выберать дату",
                     "callback_data":"/chooseDate"
                  }
               ],
               [
                  {
                     "text":"💺 Выбрать место",
                     "callback_data":"/chooseSeat"
                  }
               ],
               [
                  {
                     "text":"⏰ Выбрать продолжительность",
                     "callback_data":"/chooseDuration"
                  }
               ]
            ]
         }
      },
      "chat_instance":"-123213",
      "data":"/chooseDate"
   }
}
 */