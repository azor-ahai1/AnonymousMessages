import mongooose, {Schema, Document} from "mongoose"
import MessageSchema from "./Message";
import { Message } from "./Message";

export interface User extends Document{
    _id: mongooose.Types.ObjectId;
    fullName: string;
    userName: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema : Schema<User> = new Schema({
    userName: {
        type: String, 
        required: [true, "UserName is required"],
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: [true, "Email is required"], 
        unique: true,
        trim: true,
        match: [/.+\@.+\..+/, "Please use a valid Email Address"]
    },
    password: {
        type: String, 
        required: [true, "Password is required"], 
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"], 
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verifyCodeExpiry is required"], 
    },
    isVerified: {
        type: Boolean, 
        default: false
    },
    isAcceptingMessage: {
        type: Boolean, 
        default: true
    },
    messages: [
        MessageSchema
    ],
    // message: [
    //     {
    //         type: Schema.Types.ObjectId, 
    //         ref: 'Message'
    //     }
    // ],
});

const UserModel = mongooose.models.User as mongooose.Model<User> || mongooose.model<User>("User", UserSchema)

export default UserModel;