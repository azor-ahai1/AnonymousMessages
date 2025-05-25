import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { z } from "zod";
import { usernameValidation } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

const UserNameQuerySchema = z.object({
    userName: usernameValidation
})

export async function GET(request: Request){
    await dbConnect();
    try{
        const {searchParams} = new URL(request.url)
        const queryParam = {
            userName: searchParams.get('userName')
        }
        const result = UserNameQuerySchema.safeParse(queryParam);
        if(!result.success){
            const userNameErrors = result.error.format().userName?._errors || [];
            return NextResponse.json({ status: 400, message: userNameErrors?.length>0 ? userNameErrors.join(', ') : 'Invalid query parameters', success:false })
        }
        const {userName} = result.data;

        const existingUserName = await UserModel.findOne({userName, isVerified: true});

        if(existingUserName){
            return NextResponse.json({ status: 400, message: "User with this username already exists", success:false })
        }

        return NextResponse.json({ status: 200, message: "Unique Username", success:true })
    }
    catch(error){
        console.error("Error checking Username", error)
        return NextResponse.json({ status: 500, message: "Error Checking UserName", success:false })
    }
}


