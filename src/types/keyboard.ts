export type KeyboardButton = {
  text: string;
  callback_data: string;
};

export type Keyboard = {
  inline_keyboard: KeyboardButton[][];
}