// import ReactDOMServer from 'react-dom/server';
import { render } from '@react-email/render';
import { transporter } from "@/lib/nodemailer";
import VerificationEmail from "./emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

type SendVerificationEmailArgs = {
    email: string;
    fullname: string;
    verifyCode: string;
};

// export async function sendVerificationEmail(
//     email: string,
//     fullname: string,
//     verifyCode: string,
//     token: string,
// ): Promise<ApiResponse>{

export async function sendVerificationEmail({
    email,
    fullname,
    verifyCode,
} : SendVerificationEmailArgs): Promise<ApiResponse>{
    
    // const html = ReactDOMServer.renderToStaticMarkup(
    //     VerificationEmail({fullname, otp:verifyCode})
    // );
    const html = await render(
        VerificationEmail({fullname, otp:verifyCode})
    );

    try{
        await transporter.sendMail({
            from: "swapspace.help@gmail.com",
            to: email,
            subject: "Anonymouse Messages Verification",
            html: html
        });
        return { success: true,  status: 200, message: "Email sent successfully" };
    }
    catch(error){
        console.error("Error ending Verification Email", error);
        return { success: false,  status: 500, message: "Failed to send Email" };
    }
}