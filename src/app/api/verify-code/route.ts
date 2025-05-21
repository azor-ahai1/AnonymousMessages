import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { ApiResponse } from "@/types/ApiResponse";

export async function POST(request: Request):Promise<ApiResponse> {
    await dbConnect();

    try{
        const {email, code} = await request.json()
        const user = await UserModel.findOne({email});
        
        if(!user){
            return {success:false, message:"User not found", status:400} 
        }
        
        const isCodeValid = user.verifyCode===code;
        const isCodeExpired = new Date(user.verifyCodeExpiry) < new Date();
        
        if(isCodeValid && !isCodeExpired){
            return {success:true, message:"Account Verified Successfully", status:200} 
        } else if(isCodeExpired){
            return {success:false, message:"Verification Code Expired", status:400} 
        } else{
            return {success:false, message:"Incorrect Verification Code", status:400} 
        }

    } catch(error){
        console.error("Error verifying user", error);
        return {success:false, message:"Error verifying User", status:500} 
    }
}