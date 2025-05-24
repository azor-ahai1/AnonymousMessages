"use client"

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Message } from "@/models/Message"
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { uniqueUsernameSchema } from "@/schemas/uniqueUsernameSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from 'usehooks-ts';
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Edit, X, Check } from "lucide-react";
import mongoose from "mongoose";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type SessionUser = {
    userName?: string;
  fullName?: string | null;
  email?: string | null;
};

const page = () => {
    const [messages, setMessages] = useState<Message []>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showUsernameForm, setShowUsernameForm] = useState(false);
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
    
    const {data : session, update} = useSession(); 
    const user = session?.user as SessionUser;

    const form = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema),
    })

    const usernameForm = useForm<z.infer<typeof uniqueUsernameSchema>>({
        resolver: zodResolver(uniqueUsernameSchema),
        defaultValues: {
            userName: user?.userName || ''
        }
    });

    const {register, watch, setValue} = form;
    const { register: registerUsername, handleSubmit: handleUsernameSubmit, formState: { errors: usernameErrors }, reset: resetUsernameForm } = usernameForm;

    const acceptMessages = watch('acceptMessages')

    const fetchAcceptMessage = useCallback(async() => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages');
            setValue('acceptMessages', response.data?.data?.isAcceptingMessage);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Error Fetching Message Setting', {
                description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
            });
        } finally {
            setIsLoading(false);
        }
    }, [])

    const fetchMessages = useCallback( async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get<ApiResponse>('/api/get-messages');
            setMessages(response.data?.data?.messages || []);
            if (refresh) {
                toast('All Messages Fetched', {
                    description: 'Showing latest messages',
                });
            }
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Error Fetching Messages', {
                description: axiosError.response?.data.message ?? 'Failed to fetch messages',
            });
        } finally {
            setIsLoading(false);
        }
        },
        [setIsLoading, setMessages, toast]
    );

    // Fetch initial state from the server
    useEffect(() => {
        if (!session || !session.user){ 
            return;
        }
        fetchAcceptMessage();
        fetchMessages();
    }, [session, setValue, fetchAcceptMessage, fetchMessages]);

    // Reset username form when user data changes
    useEffect(() => {
        if (user?.userName) {
            resetUsernameForm({ userName: user.userName });
        }
    }, [user?.userName, resetUsernameForm]);
    
    // Handle switch change
    const handleSwitchChange = async () => {
        try {
        const response = await axios.post<ApiResponse>('/api/accept-messages', {
            acceptMessages: !acceptMessages,
        });
        setValue('acceptMessages', !acceptMessages);
        toast('Accept Message Status Changed', {
            description: response.data.message,
        });
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast('Error updating Accept Message Status', {
            description: axiosError.response?.data.message ?? 'Failed to update message settings',
        });
        }
    };

    const handleDeleteMessage = (messageId: mongoose.Types.ObjectId) => {
        setMessages(messages.filter((message) => message._id.toString() !== messageId.toString()))
    }

    const onUsernameSubmit = async (data: z.infer<typeof uniqueUsernameSchema>) => {
        setIsUpdatingUsername(true);
        try {
            const response = await axios.post(`/api/update-username`, {
                email: user?.email,
                newUserName: data.userName, 
            });
            toast('Username Updated Successfully', {
                description: response.data.message,
            });
            setShowUsernameForm(false);
            await update();
            // You might want to refresh the session here or update the user data
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Error updating Username', {
                description: axiosError.response?.data.message ?? 'Failed to change username.',
            });
        } finally {
            setIsUpdatingUsername(false);
        }
    };

    const handleCancelUsernameUpdate = () => {
        setShowUsernameForm(false);
        resetUsernameForm({ userName: user?.userName || '' });
    };
        
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const profileUrl = `${baseUrl}/message/${user?.userName}`;
    
    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast('URL Copied!', {
        description: 'Profile URL has been copied to clipboard.',
        });
    };

    if (!session || !session.user) {
        return <div>Please Login</div>;
    }

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
            <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
                <div className="flex items-center">
                    <input type="text" value={profileUrl} disabled className="input input-bordered w-full p-2 mr-2" />
                    <Button onClick={copyToClipboard}>Copy</Button>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <h2 className="text-lg font-semibold">Current Username: {user?.userName}</h2>
                        {!showUsernameForm && (
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => setShowUsernameForm(true)}
                                className="ml-2"
                            >
                                <Edit className="h-4 w-4" />
                                Update Username
                            </Button>
                        )}
                    </div>
                </div>
                
                {showUsernameForm && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                        <h3 className="text-md font-semibold mb-3">Update Username</h3>
                        <form onSubmit={handleUsernameSubmit(onUsernameSubmit)} className="space-y-4">
                            <div>
                                <Input
                                    {...registerUsername('userName')}
                                    placeholder="Enter new username"
                                    className="w-full"
                                    disabled={isUpdatingUsername}
                                />
                                {usernameErrors.userName && (
                                    <p className="text-red-500 text-sm mt-1">{usernameErrors.userName.message}</p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    type="submit" 
                                    size="sm"
                                    disabled={isUpdatingUsername}
                                >
                                    {isUpdatingUsername ? (
                                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    ) : (
                                        <Check className="h-4 w-4 mr-2" />
                                    )}
                                    Update
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    size="sm"
                                    onClick={handleCancelUsernameUpdate}
                                    disabled={isUpdatingUsername}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                )}
            </div>

            <div className="mb-4">
                <Switch {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isLoading} />
                <span className="ml-2">
                    Accept Messages: {acceptMessages ? 'On' : 'Off'}
                </span>
            </div>

            <Button className="mt-4" variant="outline" onClick={(e) => { 
                    e.preventDefault();
                    fetchMessages(true);
            }}>
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <RefreshCcw className="h-4 w-4" />
                )}
            </Button>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard key={message._id.toString()} message={message} onMessageDelete={handleDeleteMessage} />
                    ))
                ) : (
                    <p>No messages to display.</p>
                )}
            </div>
        </div>
    );
}

export default page;