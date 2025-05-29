import mongoose, {Schema, Document} from "mongoose"

export interface Reply extends Document{
    _id: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    user: Schema.Types.ObjectId;
    message: Schema.Types.ObjectId;
}

const ReplySchema : Schema<Reply> = new Schema({
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
    },
    message: {
        type: Schema.Types.ObjectId,
        ref: 'Message',
        required: true
    }
})

const ReplyModel = mongoose.models.Reply as mongoose.Model<Reply> || mongoose.model<Reply>("Reply", ReplySchema)

export default ReplyModel;