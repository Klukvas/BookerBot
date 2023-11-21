interface Message {
    date: number;
    chat: {
      last_name: string;
      id: number;
      first_name: string;
      username: string;
    };
    message_id: number;
    from: {
      last_name: string;
      id: number;
      first_name: string;
      username: string;
    };
    text: string;
  }
  
  interface TelegramUpdate {
    update_id: number;
    message: Message;
  }

export {TelegramUpdate, Message}
