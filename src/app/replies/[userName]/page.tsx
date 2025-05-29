"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { Loader2, Trash2, MessageCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import mongoose from 'mongoose';
import Link from 'next/link';

interface Reply {
  _id: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  user: string;
}

interface Message {
  _id: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  user: string;
  reply?: Reply;
}

export default function RepliesPage() {
  const params = useParams<{ userName: string }>();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingReplyId, setDeletingReplyId] = useState<string | null>(null);
  const userName = params.userName;

  const canDeleteReplies = session?.user?.userName === userName;

  const fetchReplies = async () => {
    if (!userName) return;
    
    setIsLoading(true);
    try {
    //   console.log(userName)
      const response = await axios.get(`/api/get-replies/${userName}`);
    //   console.log(response)
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      if (axiosError.response?.status !== 404) {
        toast('Error fetching replies', {
          description: axiosError.response?.data.message ?? 'Failed to fetch replies',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [userName]);

  const handleDeleteReply = async (replyId: mongoose.Types.ObjectId) => {
    setDeletingReplyId(replyId.toString());
    try {
      // Using your existing delete message API
      const response = await axios.delete<ApiResponse>(
        `/api/delete-reply/${replyId.toString()}`
      );
      
      toast('Reply deleted successfully', {
        description: response.data.message,
      });
      
      // Remove the entire message from the list since it's deleted
      setMessages(prevMessages =>
        prevMessages.filter(msg => msg.reply?._id.toString() !== replyId.toString())
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error deleting reply', {
        description:
          axiosError.response?.data.message ?? 'Failed to delete reply',
      });
    } finally {
      setDeletingReplyId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 p-6 w-full h-screen bg-gray-800">
        <div className="flex justify-center items-center min-h-full">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-400">Loading replies...</span>
        </div>
      </div>
    );
  }

  // Filter messages that have replies
  const messagesWithReplies = messages.filter(message => message.reply);

  return (
    <div className="p-12 bg-gray-800 shadow-md w-full text-gray-50">
        {/* Heading */}
        <div className="mb-10 border-b border-gray-700 pb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Replies by <Link href="/dashboard" className="text-lime-100 hover:underline">@{userName}</Link>
            </h1>
            <p className="text-gray-400 text-sm">
            All replies sent by @{userName} to anonymous messages.
            </p>
        </div>

        {/* Empty State */}
        {messagesWithReplies.length === 0 ? (
            <div className="bg-gray-700 text-center py-16 rounded-lg shadow-inner">
                <MessageCircle className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-200 mb-1">No Replies Yet</h2>
                <p className="text-gray-400 text-sm">
                    @{userName} has not replied to any messages yet.
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {messagesWithReplies.map((message) => (
                    <div key={message._id.toString()} className="bg-gray-900 border border-gray-700 rounded-lg p-6 shadow-sm relative">
                        {/* Reply Content */}
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-green-400 mb-1">{message.reply?.content}</h3>
                            <p className="text-xs text-gray-500">
                            Replied on {dayjs(message.reply?.createdAt).format('MMM D, YYYY h:mm A')}
                            </p>
                        </div>

                        {/* Original Message */}
                        <div className="bg-gray-800 border-l-4 border-primary p-4 rounded-md">
                            <h4 className="text-sm font-semibold text-gray-300 mb-2">Original Message</h4>
                            <p className="text-sm text-gray-400 mb-1">{message.content}</p>
                            <p className="text-xs text-gray-500">
                            Received on {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
                            </p>
                        </div>

                        {/* Delete Action */}
                        {canDeleteReplies && (
                            <div className="absolute top-4 right-4">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-400"
                                        disabled={deletingReplyId === message.reply?._id.toString()}
                                    >
                                        {deletingReplyId === message.reply?._id.toString() ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                        <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent className="bg-gray-900 border border-gray-700 text-gray-200">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Reply</AlertDialogTitle>
                                        <AlertDialogDescription className="text-gray-400">
                                        Are you sure you want to delete this reply? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-gray-700 text-gray-200 hover:bg-gray-600">Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                        onClick={() => handleDeleteReply(new mongoose.Types.ObjectId(message.reply?._id))}
                                        className="bg-red-600 text-white hover:bg-red-700"
                                        >
                                        Delete Reply
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
  );
}