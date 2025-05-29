import dbConnect from "@/lib/dbConnect";
// import { ApiResponse } from "@/types/ApiResponse";
import UserModel from "@/models/User";
import { NextResponse } from "next/server";
import MessageModel from "@/models/Message";


// export async function GET(request : Request){
export async function GET(
    request: Request,
    { params }: { params: Promise<{ userName: string }> }
){
    await dbConnect();
    const {userName} = await params;
    console.log(userName);
    const user = await UserModel.findOne({userName : userName});
    
    if(!user){
        return NextResponse.json({status:404, success:false, message:"User not found."})
    }
    
    try {
        const messages = await MessageModel.aggregate([
            { $match: { user: user._id } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                from: "replies", 
                localField: "reply",
                foreignField: "_id",
                as: "reply",
                },
            },
            {
                $unwind: {
                path: "$reply",
                preserveNullAndEmptyArrays: true, 
                },
            }
        ]);
        
        if(messages.length === 0) {
            return NextResponse.json({status:404, success:false, message:"Replies not found."})
        }

        return NextResponse.json({status:200, success:true, message:"User Replies Retrived Successfully.", data: messages })
    
    } catch (error){
        console.error("Error Retriving Replies", error);
        return NextResponse.json({success:false, message:"Error Retriving Replies", status:500})
    }
}