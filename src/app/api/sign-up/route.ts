import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from "bcryptjs";
// import { ApiResponse } from "@/types/ApiResponse";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { NextResponse } from "next/server";

function generateOTP(): number {
  return Math.floor(100000 + Math.random() * 900000);
}

export async function POST(request : Request){
    await dbConnect();

    try{
        const {email, password, fullName} = await request.json();

        const existingUserVerified = await UserModel.findOne({
            email: email,
            isVerified: true
        })
        if(existingUserVerified){
            return NextResponse.json({ status: 400, message: "User with E-mail already exists", success:false })
        }

        const otp = generateOTP().toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiry = new Date(Date.now() + 600000);
        const existingUser = await UserModel.findOne({ email: email });

        if(existingUser){
            existingUser.password = hashedPassword;
            existingUser.verifyCode = otp;
            existingUser.fullName = fullName;
            existingUser.verifyCodeExpiry = expiry;
            await existingUser.save();
        }else{
            const user = new UserModel({
                email: email,
                password: hashedPassword,
                fullName: fullName,
                userName: email,
                verifyCode: otp,
                verifyCodeExpiry: expiry
            });
            await user.save();
        }

        const user = await UserModel.findOne({email}).select(
            "-passowrd -verifyCode -verifyCodeExpiry"
        )

        const emailResponse = await sendVerificationEmail({
            email,
            fullname: fullName,
            verifyCode: otp
        })

        if(!emailResponse.success){
            return NextResponse.json({ status: 500, message: "Failed to send verification email", success:false})
        }

        return NextResponse.json({ status: 201, message: "User registered successfully. Please verify your account.", success:true, data:user});
    }
    catch(error){
        console.log("Error Registering User", error);
        return NextResponse.json({ status: 500, message: "Error Registering User", success:false });
    }
} 