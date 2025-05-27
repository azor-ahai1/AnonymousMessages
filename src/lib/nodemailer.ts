import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    // service: 'gmail', 
    host: "smtp.gmail.com",
    port: 465, 
    secure: true, 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
    debug: true
});

// transporter.verify(function(error:any, success:any) {
transporter.verify(function(error:Error | null) {
    if (error) {
        console.log("Server connection failed:", error);
    } else {
        console.log("Server is ready to send messages");
    }
});

export {transporter}