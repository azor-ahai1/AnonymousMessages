import { resend } from "@/lib/resend";
import VerificationEmail from "./emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    // token: string
    username: string,
    verifyCode: string
): Promise<ApiResponse>{
    try{
        await resend.emails.send({
            from: "no-reply@mydomain.com",
            to: email,
            subject: "Verify your email",
            react: VerificationEmail({username, otp:verifyCode})
        });
        return { success: true,  status: 200, message: "Email sent successfully" };
    }
    catch(error){
        console.error("Error ending Verification Email", error);
        return { success: false,  status: 500, message: "Failed to send Email" };
    }
}