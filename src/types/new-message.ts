import { Chat } from "./chat";
import { MessageFrom } from "./message-from";

interface Message {
  chat: Chat;
  message_id: number;
  from: MessageFrom;
  text: string;
}
  
interface TelegramUpdate {
  update_id: number;
  message: Message;
}

export {TelegramUpdate, Message}
