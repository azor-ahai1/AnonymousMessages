import mongoose, {Schema, Document} from "mongoose"
// import {User} from "./User"

export interface Message extends Document{
    _id: mongoose.Types.ObjectId;
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

const MessageModel = mongoose.models.Message as mongoose.Model<Message> || mongoose.model<Message>("Message", MessageSchema)

export default MessageModel;