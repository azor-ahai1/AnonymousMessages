import UserModel from '@/models/User';
import { getServerSession } from 'next-auth/next';
import dbConnect from '@/lib/dbConnect';
import { User } from 'next-auth';
import { ApiResponse } from '@/types/ApiResponse';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(request: Request):Promise<ApiResponse>{
    await dbConnect();

    const {email, newUserName} = await request.json()
    const session = await getServerSession(authOptions);
    
    const user: User = session?.user as User;
    
    if (!session || !user) {
        return { status:401, success: false, message: 'Not authenticated' }
    }
    
    if (user?.email!==email){
        return { status:401, success: false, message: 'Not authenticated' }
    }

    try {
        const updateResult = await UserModel.updateOne(
            { email: email },
            { $set: { userName: newUserName } }
        );

        if (updateResult.modifiedCount === 0) {
            return { status:404, message: 'User not found with this email', success: false }
        }
        
        return { status: 200, message: 'Username Successfully Updated', success: true }
        
    } catch (error) {
        console.error('Error updating UserName:', error);
        return { status: 500, message: 'Error Updating UserName', success: false }
    }
}