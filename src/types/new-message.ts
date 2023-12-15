import { Chat } from "./new-message-types/chat";
import { MessageFrom } from "./new-message-types/message-from";

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
