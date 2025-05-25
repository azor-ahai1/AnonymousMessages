"use client"

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

import { Button } from './ui/button';
import { ApiResponse } from '@/types/ApiResponse';
import { toast } from 'sonner';
import mongoose from 'mongoose';

type MessageCardProps = {
  message: string;
  messageId: mongoose.Types.ObjectId,
  time: Date,
  onMessageDelete: (messageId: mongoose.Types.ObjectId) => void;
};

export function MessageCard({ message, messageId, time, onMessageDelete }: MessageCardProps) {

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
      toast("Error deleting message", {
        description: axiosError.response?.data.message ?? 'Failed to delete message',
      });
    } 
  };

  return (
    <Card className="card-bordered">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{message}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant='destructive'>
                <X className="w-5 h-5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure to delete this message?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="text-sm">
          {dayjs(time).format('MMM D, YYYY h:mm A')}
        </div>
      </CardHeader>
      <CardContent></CardContent>
    </Card>
  );
}