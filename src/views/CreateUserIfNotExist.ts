import { User, IUser } from "../models/user";
import { Message } from "../types/new-message";
import { CallbackQury } from "../types/new-message-types/callback-query";


export async function CreateUserIfNotExist(message: Message | CallbackQury):Promise<IUser> {

    const existingUser = await User.findOne({userId: message.from.id})
    if(existingUser){
       return existingUser
    }
    const user = await User.create({
        chatId: message.chat.id,
        userId: message.from.id,
        username: message.from.username,
        first_name: message.from.first_name
    })
    return user
}