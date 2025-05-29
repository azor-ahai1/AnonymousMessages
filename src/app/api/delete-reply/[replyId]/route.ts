import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import MessageModel from '@/models/Message';
import { NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/options';
import ReplyModel from '@/models/Reply';

export async function DELETE(
    request: Request,
  { params }: { params: Promise<{ replyId: string }> }
){
    await dbConnect();

    const {replyId} = await params;
    const session = await getServerSession(authOptions);
    
    const user: User = session?.user as User;
    
    if (!session || !user) {
        return NextResponse.json({ status:401, success: false, message: 'Not authenticated' })
    }

    try {

        const reply = await ReplyModel.findById(replyId);
        
        if (!reply) {
            return NextResponse.json({ status: 404, success: false, message: 'Reply not found'})
        }


        const updateResult = await MessageModel.updateOne(
            { _id: reply.message },
            {reply: null }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({ status:404, message: 'Message not found', success: false })
        }

        const deletedReply = await ReplyModel.findByIdAndDelete(replyId);

        if (!deletedReply) {
            return NextResponse.json({ status: 404, message: 'Reply document not found in the database', success: false })
        }
        
        return NextResponse.json({ status: 200, message: 'Reply deleted', success: true })
    } catch (error) {
        console.error('Error deleting reply:', error);
        return NextResponse.json({ status: 500, message: 'Error deleting reply', success: false })
    }
}