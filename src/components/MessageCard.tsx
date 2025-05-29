"use client";

import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import mongoose from 'mongoose';
import { Textarea } from './ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import * as z from 'zod';
import { replySchema } from '@/schemas/replySchema';

type MessageCardProps = {
  message: string;
  messageId: mongoose.Types.ObjectId;
  time: Date;
  isReplied: boolean;
  onMessageDelete: (messageId: mongoose.Types.ObjectId) => void;
};

export function MessageCard({
  message,
  messageId,
  time,
  onMessageDelete,
  isReplied,
}: MessageCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const [isMesssageReplied, setIsMessageReplied] = useState(isReplied);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: {
      reply: '',
    },
  });

  const replyContent = form.watch('reply');

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `/api/delete-message/${messageId}`
      );
      toast('Message Deleted Successfully', {
        description: response.data.message,
      });
      onMessageDelete(messageId);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error deleting message', {
        description:
          axiosError.response?.data.message ?? 'Failed to delete message',
      });
    }
  };

  const submitReply = async (data: z.infer<typeof replySchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `/api/reply-message/${messageId}`,
        {
          messageReply: data.reply,
        }
      );
      
      toast('Reply Sent Successfully', {
        description: response.data.message,
      });
      
      form.reset();
      setIsMessageReplied(true);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error sending reply', {
        description:
          axiosError.response?.data.message ?? 'Failed to send reply',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Card className="border border-gray-700 bg-gray-900 text-gray-100 hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-base font-medium leading-snug">
                {message}
              </CardTitle>
              <p className="mt-2 text-xs text-gray-400">
                {dayjs(time).format('MMM D, YYYY h:mm A')}
              </p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Delete message"
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-5 h-5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this message?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone and will permanently remove the
                    message.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteConfirm}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardHeader>
        <CardContent>
          {!isMesssageReplied ? (
            <div className="mt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(submitReply)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="reply"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Reply to this message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Write your reply here..."
                            className="resize-none bg-gray-800 border-gray-600 text-gray-100 placeholder-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    {isLoading ? (
                      <Button disabled>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </Button>
                    ) : (
                      <Button type="submit" disabled={!replyContent}>
                        Send Reply
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-gray-800 rounded-md border border-gray-600">
              <p className="text-sm text-gray-300">✓ Already replied to this message</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}