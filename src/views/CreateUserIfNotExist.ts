import { User, IUser } from "../models/user";
import { Message } from "../types/new-message";


export async function CreateUserIfNotExist(message: Message):Promise<IUser> {

    const existingUser = await User.findOne({userId: message.from.id})
    console.log('existingUser', existingUser)
    if(existingUser){
       return existingUser
    }
    const user = await User.create({
        chatId: message.chat.id,
        userId: message.from.id,
        username: message.from.username,
        lastName: message.from.last_name,
        first_name: message.from.first_name
    })
    return user
}