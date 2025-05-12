// import { Message } from "@/model/Message";

export interface ApiResponse{
    status: number;
    success: boolean
    message: string;
    data?: object;
    // isAcceptingMessages?: boolean;
    // messages?: Array<Message>;
    // // messages?: Message[]
}