

type GenerateTelegramMessageArgs = {
  messageText?: string
  userId?: number
  chatId?: number
}

export function generateTelegramMessage(args: GenerateTelegramMessageArgs = {}){
  const {
    messageText = '/create-reservation',
    userId = 1233210,
    chatId = 1233210
  } = args
    return {
      update_id: 10000,
      message: {
        date: 1441645532,
        chat: {
            last_name: "Test Lastname",
            id: chatId,
            first_name: "Test",
            username: "Test"
        },
        message_id: 1365,
        from: {
          last_name: "New",
          id: userId,
          first_name: "Customer",
          username: "UsernameNew"
        },
        text: messageText
      }
    }
}