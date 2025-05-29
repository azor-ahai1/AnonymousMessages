import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import ReplyModel from '@/models/Reply';
import MessageModel from '@/models/Message';
import { NextResponse } from 'next/server';
// import { ApiResponse } from '@/types/ApiResponse';
import { authOptions } from '../../auth/[...nextauth]/options';
import { Schema } from 'mongoose';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ messageId: string }> }
){
    await dbConnect();

    const {messageId} = await params;
    const {messageReply} = await request.json();
    const session = await getServerSession(authOptions);
    
    const user: User = session?.user as User;
    
    if (!session || !user) {
        return NextResponse.json({ status:401, success: false, message: 'Not authenticated' })
    }

    try {

        const message = await MessageModel.findOne({_id: messageId})

        if(!message){
            return NextResponse.json({ status:404, message: 'Message not found', success: false })
        }        

        const oldreply = await ReplyModel.findOne({message: messageId})

        if(!user._id){
            return NextResponse.json({ status:401, success: false, message: 'Not authenticated'})
        }
        const userId = new Schema.Types.ObjectId(user._id);

        if(oldreply){
            oldreply.user = userId;
            oldreply.content = messageReply;
            oldreply.createdAt = new Date();
            await oldreply.save();
        } else{
            const reply = new ReplyModel({
                message: messageId,
                content: messageReply,
                user: user._id,
                createdAt: new Date()
            })
            await reply.save();
        }

        const reply = await ReplyModel.findOne({message: messageId});

        if(!reply){
            return NextResponse.json({ status: 500, message: 'Error replying message', success: false })
        }
        
        const updatedMessage = await MessageModel.updateOne(
            { _id: messageId },
            { reply: reply._id }
        );
        
        if (updatedMessage.modifiedCount === 0) {
            return NextResponse.json({ status: 500, message: 'Error replying message', success: false })
        }
        
        return NextResponse.json({ status: 200, message: 'Reply Sent Successfully', success: true, data:reply })
    } catch (error) {
        console.error('Error replying message:', error);
        return NextResponse.json({ status: 500, message: 'Error replying message', success: false })
    }
}