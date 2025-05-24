// import { Message } from "@/model/Message";

export interface ApiResponse<T = any>{
    status: number;
    success: boolean
    message: string;
    data?: T;
    // isAcceptingMessages?: boolean;
    // messages?: Array<Message>;
    // // messages?: Message[]
}