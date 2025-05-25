import dbConnect from "@/lib/dbConnect";
import { ApiResponse } from "@/types/ApiResponse";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";


export async function GET(request : Request){
    await dbConnect();

    const session = await getServerSession(authOptions);
    const sessionUser = session?.user

    if(!session || !session.user){
        return NextResponse.json({status:400, success:false, message:"Not Authenticated"})
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
                    'messages.createdAt': 1
                }
            },
            {
                $lookup: {
                    from: 'messages', 
                    localField: 'messages',
                    foreignField: '_id',
                    as: 'messageDetails' 
                }
            },
            {
                $group: {
                    _id: '$_id',
                    messages: { $push: '$messageDetails' } 
                }
            }
        ])
        
        if(!user || user.length === 0) {
            return NextResponse.json({status:404, success:false, message:"User not found."})
        }
        
        return NextResponse.json({status:200, success:true, message:"User Messages Retrived Successfully.", data: user })
        // return {status:200, success:true, message:"User Messages Retrived Successfully.", messages: user[0].messages }
    
    } catch (error){
        console.error("Error Retriving Messages", error);
        return NextResponse.json({success:false, message:"Error Retriving Messages", status:500})
    }

} 