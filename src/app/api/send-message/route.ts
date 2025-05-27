import dbConnect from "@/lib/dbConnect";
// import { ApiResponse } from "@/types/ApiResponse";
// import { getServerSession } from "next-auth";
// import { authOptions } from "../auth/[...nextauth]/options";
// import mongoose from "mongoose";
import UserModel from "@/models/User";
import MessageModel from "@/models/Message";
import { NextResponse } from "next/server";


export async function POST(request : Request){
    await dbConnect();
    
    const {userName, content} = await request.json(); 

    try{
        const user = await UserModel.findOne({userName});
        
        if(!user){
            return NextResponse.json({status:404, success:false, message:"User not found."})
        }
        
        if(!user.isAcceptingMessage){
            return NextResponse.json({status:403, success:false, message:"User is not accepting the message."})
        }

        const message =  new MessageModel({
            content,
            user: user._id,
            createdAt: new Date()
        });
        await message.save();

        user.messages.push(message);

        await user.save();

        return NextResponse.json({status:200, success:true, message:"Message sent Successfully." })
    }
    catch (error){
        console.error("Error Sending Message", error);
        return NextResponse.json({success:false, message:"Error Sending Messages", status:500})
    }
}