'use client';

import React from 'react';
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

import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import mongoose from 'mongoose';

type MessageCardProps = {
  message: string;
  messageId: mongoose.Types.ObjectId;
  time: Date;
  onMessageDelete: (messageId: mongoose.Types.ObjectId) => void;
};

export function MessageCard({
  message,
  messageId,
  time,
  onMessageDelete,
}: MessageCardProps) {
  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
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

  return (
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
      <CardContent />
    </Card>
  );
}