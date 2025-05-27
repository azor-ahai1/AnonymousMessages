import UserModel from '@/models/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import MessageModel from '@/models/Message';
import { NextRequest, NextResponse } from 'next/server';
// import { ApiResponse } from '@/types/ApiResponse';
import { authOptions } from '../../auth/[...nextauth]/options';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { messageId: string } }
){
    await dbConnect();

    const messageId = params.messageId;
    const session = await getServerSession(authOptions);
    
    const user: User = session?.user as User;
    
    if (!session || !user) {
        return NextResponse.json({ status:401, success: false, message: 'Not authenticated' })
    }

    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: messageId } }
        );

        if (updateResult.modifiedCount === 0) {
            return NextResponse.json({ status:404, message: 'Message not found or already deleted', success: false })
        }

        const deletedMessage = await MessageModel.findByIdAndDelete(messageId);

        if (!deletedMessage) {
            return NextResponse.json({ status: 404, message: 'Message document not found in the database', success: false })
        }
        
        return NextResponse.json({ status: 200, message: 'Message deleted', success: true })
    } catch (error) {
        console.error('Error deleting message:', error);
        return NextResponse.json({ status: 500, message: 'Error deleting message', success: false })
    }
}