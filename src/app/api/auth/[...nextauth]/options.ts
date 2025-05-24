import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import UserModel from "@/models/User";

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email : {
                    label: "Email",
                    type: "email",
                    placeholder: "you@example.com"
                },
                userName : {
                    label: "UserName",
                    type: "userName",
                    placeholder: "username"
                },
                password : {
                    label: "Password",
                    type: "password",
                    placeholder: "********"
                },
            },
            async authorize(credentials : any) : Promise<any> {
                const db = await dbConnect();
                try{
                    const user = await UserModel.findOne({ 
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier },
                        ],  
                    });
                    if (!user) {
                        throw new Error("User not found");
                    }
                    if(!user.isVerified){
                        throw new Error("User not verified. Please verify your account.");
                    }
                    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
                    if (!isValidPassword) {
                        throw new Error("Invalid password");
                    }
                    return user;
                }
                catch (error: any){
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            if(user){
                token._id = user._id?.toString();
                token.email = user.email;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.userName = user.userName;
            }
            return token;
        },

        async session({session, token}){
            if(token){
                session.user._id = token._id;
                session.user.email = token.email;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.userName = token.userName;
            }
            return session;
        }
    },

    pages: {
        signIn: '/login',
    },
    session: {
        strategy: "jwt"
    },
    secret : process.env.NEXTAUTH_SECRET

}