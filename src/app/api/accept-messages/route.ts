import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/models/User";
// import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";


export async function POST(request: Request){
    await dbConnect();
    
    const session = await getServerSession(authOptions);

    // const user : User = session?.user    // it is having error
    // const user : User = session?.user as User   // it is the soluton
    
    const user = session?.user   // Simple way

    if(!session || !session.user){
        return NextResponse.json({status:401, success:false, message:'Not Authenticated'})
    }
    
    const userId = user?._id
    
    const {acceptMessages} = await request.json();
    
    try{
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            {isAcceptingMessage : acceptMessages},
            {new : true}
        )
        
        if(!updatedUser){
            return NextResponse.json({status:400, success:false, message:'Failed to update User message acceptance status.'})
        }
        
        return NextResponse.json({status:200, success:true, message:'User message acceptance status updated successfully.', data: updatedUser})

        
    }catch(error){
        console.log(error)
        return NextResponse.json({status:500, success:false, message:'Error updating User message acceptance status.'})
    }
} 


export async function GET(){
    await dbConnect();
    
    const session = await getServerSession(authOptions);
    
    // const user : User = session?.user    // it is having error
    // const user : User = session?.user as User   // it is the soluton
    
    const sessionUser = session?.user   // Simple way
    
    if(!session || !session.user){
        return NextResponse.json({status:401, success:false, message:'Not Authenticated'})
    }
    
    const userId = sessionUser?._id

    try{
        const user = await UserModel.findById(userId)

        if(!user){
            return NextResponse.json({status:404, success:false, message:'User not found.'})
        }
        
        // return {status:200, success:true, message:'User data founded', data: user, isAcceptingMessages: user.isAcceptingMessage}
        return NextResponse.json({status:200, success:true, message:'User data founded', data: user})
        
    }catch(error){
        console.log(error)
        return NextResponse.json({status:500, success:false, message:'Error getting User message acceptance status.'})
    }
} 