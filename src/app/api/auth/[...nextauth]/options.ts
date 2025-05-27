import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
// import { User } from "@/models/User";
import UserModel from "@/models/User";

export const authOptions : NextAuthOptions = {
    providers : [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                identifier: {
                    label: "Email or Username",
                    type: "text",
                    placeholder: "you@example.com or username"
                },
                password : {
                    label: "Password",
                    type: "password",
                    placeholder: "********"
                },
            },
            async authorize(credentials){
                if (!credentials?.identifier || !credentials?.password) {
                    return null;
                }
                await dbConnect();
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
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.userName,
                        _id: user._id.toString(),
                        isVerified: user.isVerified,
                        isAcceptingMessages: user.isAcceptingMessage,
                        userName: user.userName,
                    };
                }
                catch (error: any){
                    throw new Error(error)
                }
            }
        })
    ],
    callbacks: {
        async jwt({token, user, trigger, session}) {
            if(user){
                token._id = user._id?.toString();
                token.email = user.email;
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.userName = user.userName;
            }
            if (trigger === "update" && session) {
                if (session.userName !== undefined) {
                    token.userName = session.userName;
                }
                if (session.isAcceptingMessages !== undefined) {
                    token.isAcceptingMessages = session.isAcceptingMessages;
                }
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
    secret : process.env.NEXT_AUTH_SECRET

}