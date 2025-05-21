import mongooose, {Schema, Document} from "mongoose"
import {User} from "./User"

export interface Message extends Document{
    content: string;
    createdAt: Date;
    user: Schema.Types.ObjectId;
}

const MessageSchema : Schema<Message> = new Schema({
    content: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

const MessageModel = mongooose.models.Message as mongooose.Model<Message> || mongooose.model<Message>("Message", MessageSchema)

export default MessageModel;