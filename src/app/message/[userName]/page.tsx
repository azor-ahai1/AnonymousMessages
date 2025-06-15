"use client";

import React, { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { CardHeader, CardContent, Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { ApiResponse } from '@/types/ApiResponse';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { messageSchema } from '@/schemas/messageSchema';
import { toast } from 'sonner';

export default function SendMessage() {
  const params = useParams<{ userName: string }>();
  const userName = decodeURIComponent(params.userName);

  const [baseUrl, setBaseUrl] = useState('')

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const messageContent = form.watch('content');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post<ApiResponse>('/api/send-message', {
        ...data,
        userName,
      });

      toast(`Message Sent Successfully to ${userName}`,{
        description: response.data.message
      });

      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast('Error sending Message',{
        description: axiosError.response?.data.message ?? 'Failed to send message'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
      if (typeof window !== 'undefined') {
          setBaseUrl(`${window.location.protocol}//${window.location.host}`);
      }
  }, []);
      
  const replyUrl = baseUrl ? `${baseUrl}/replies/${userName}` : '';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(replyUrl);
    toast('URL Copied!', {
      description: 'Profile URL has been copied to clipboard.',
    });
  };

  return (
    <div className="p-12 lg:px-72 bg-gray-800 shadow-md w-full text-gray-50 mx-auto">
      {/* Heading */}
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Send Anonymous Message</h1>

      {/* Anonymous Message Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-200">To @{userName}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Write your anonymous message here..."
                    className="resize-none bg-gray-900 text-gray-100 border-gray-600"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-center">
            {isLoading ? (
              <Button disabled className="bg-gray-700 text-gray-300">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" disabled={!messageContent}>
                Send It
              </Button>
            )}
          </div>
        </form>
      </Form>

      {/* Reply Link Section */}
      <div className="my-10 border-b border-gray-700 pb-6">
        <h2 className="text-lg font-semibold text-gray-200 mb-3">@{userName}&#39;s Reply Link</h2>
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
          <input
            type="text"
            value={replyUrl}
            disabled
            className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-sm text-gray-300 cursor-text"
          />
          <Button
            onClick={copyToClipboard}
            className="shrink-0 w-full md:w-auto transition duration-200 hover:bg-gray-700"
          >
            Copy Link
          </Button>
        </div>
      </div>

      {/* CTA to Sign Up */}
      <div className="text-center mt-12">
        <p className="mb-4 text-gray-400">Want your own anonymous message board?</p>
        <Link href="/sign-up">
          <Button variant="default" className="hover:bg-gray-700 transition">
            Create Your Account
          </Button>
        </Link>
      </div>
    </div>

  );
}
