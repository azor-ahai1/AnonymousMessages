import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";


export async function GET(request : Request):Promise<ApiResponse>{
    await dbConnect();

    const session = await getServerSession(authOptions);
    const sessionUser = session?.user

    if(!session || !session.user){
        return {status:400, success:false, message:"Not Authenticated"}
    }
    
    const userId = new mongoose.Types.ObjectId(sessionUser?._id);
    
    try {
        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: '$messages'
            },
            {
                $sort: {
                    'messages.createdAt': -1
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages'
                    }
                } 
            }
        ])
        
        if(!user || user.length === 0) {
            return {status:404, success:false, message:"User not found."}
        }
        
        return {status:200, success:true, message:"User Messages Retrived Successfully.", data: user }
        // return {status:200, success:true, message:"User Messages Retrived Successfully.", messages: user[0].messages }
    
    } catch (error){
        console.error("Error Retriving Messages", error);
        return {success:false, message:"Error Retriving Messages", status:500} 
    }


} 