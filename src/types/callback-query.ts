import { Chat } from "./chat"
import { MessageFrom } from "./message-from"

export type CallbackQury = {
  from: MessageFrom
  chat: Chat
  data: string
}