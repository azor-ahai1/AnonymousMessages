import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
// import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export async function POST(request: Request){
    await dbConnect();

    try{
        const {userId, code} = await request.json()
        const user = await UserModel.findById(userId)
        // console.log(user)
        
        if(!user){
            return NextResponse.json({success:false, message:"User not found", status:400}) 
        }
        
        const isCodeValid = user.verifyCode===code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
        
        if(isCodeValid && !isCodeExpired){
            const update = await UserModel.updateOne(
                { _id: user._id },
                { $set : { isVerified: true } },
            );

            if (update.modifiedCount === 0) {
                return { status:402, message: 'Account could not verify. Please Try Again.', success: false }
            }

            return NextResponse.json({success:true, message:"Account Verified Successfully", status:200}) 
        } else if(isCodeExpired){
            return NextResponse.json({success:false, message:"Verification Code Expired", status:400}) 
        } else{
            return NextResponse.json({success:false, message:"Incorrect Verification Code", status:400}) 
        }

    } catch(error){
        console.error("Error verifying user", error);
        return NextResponse.json({success:false, message:"Error verifying User", status:500}) 
    }
}