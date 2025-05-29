"use client"

import { MessageCard } from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { uniqueUsernameSchema } from "@/schemas/uniqueUsernameSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounceCallback } from 'usehooks-ts';
import { User } from "next-auth";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Edit, X, Check } from "lucide-react";
import mongoose, { Schema } from "mongoose";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";

type message = {
    _id: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date,
    reply?: Schema.Types.ObjectId | null;
};

type MessagesArray = message[];

const Page = () => {
    const [messages, setMessages] = useState<MessagesArray>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showUsernameForm, setShowUsernameForm] = useState(false);
    const [username, setUsername] = useState("");
    const [userNameInfo, setUserNameInfo] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false);
    const [baseUrl, setBaseUrl] = useState('');

    const debouncedUsername = useDebounceCallback(setUsername, 300); 

    const router = useRouter();
    
    const {data : session, update} = useSession(); 
    const user: User = session?.user as User

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

    const acceptMessages = watch('acceptMessages')

    useEffect(() => {
        if (user?.userName) {
            usernameForm.reset({ userName: user.userName });
        }
    }, [user?.userName, usernameForm]);

    const fetchAcceptMessage = useCallback(async() => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/accept-messages');
            setValue('acceptMessages', response.data?.data?.isAcceptingMessage);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast('Error Fetching Message Setting', {
                description: axiosError.response?.data.message ?? 'Failed to fetch message settings',
            });
        } finally {
            setIsLoading(false);
        }
    }, [setValue])

    const fetchMessages = useCallback( async (refresh: boolean = false) => {
        setIsLoading(true);
        try {
            const response = await axios.get('/api/get-messages');
            console.log(response);
            setMessages(response?.data?.data[0]?.messages?.flat() || []);

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
        [setIsLoading, setMessages]
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
            usernameForm.reset({ userName: user.userName });
        }
    }, [user?.userName, usernameForm]);

    // Handle switch change
    const handleSwitchChange = async () => {
        try {
        const response = await axios.post('/api/accept-messages', {
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

    useEffect(() => {
        const checkUsernameUnique = async () => {
        if (username) {
            setIsCheckingUsername(true);
            setUserNameInfo('');
            try {
                const response = await axios.get<ApiResponse>(
                    `/api/check-unique-username?userName=${username}`
                );
                setUserNameInfo(response.data.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                setUserNameInfo(
                    axiosError.response?.data.message ?? 'Error checking username'
                );
            } finally {
                setIsCheckingUsername(false);
            }
        }
        };
        checkUsernameUnique();
    }, [username]);

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

            update({userName : data.userName});
            router.refresh();
            // console.log(session)
            
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
        usernameForm.reset({ userName: user?.userName || '' });
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setBaseUrl(`${window.location.protocol}//${window.location.host}`);
        }
    }, []);
        
    const profileUrl = baseUrl ? `${baseUrl}/message/${user?.userName}` : '';

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        toast('URL Copied!', {
        description: 'Profile URL has been copied to clipboard.',
        });
    };

    if (!session || !session.user) {
        return (
            <div className="flex flex-col items-center justify-center h-screen text-center px-6 bg-gray-900 text-white">
                <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full">
                    <h2 className="text-2xl font-bold mb-4">You are not logged in</h2>
                    <p className="text-gray-300 mb-6">
                        Please log in to access this feature and explore Secret Ping.
                    </p>
                    <Link href="/sign-in">
                        <Button className="bg-white text-black hover:bg-gray-200 transition-colors duration-200">
                            Log In
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }


    return (
        <div className="p-12 bg-gray-800 shadow-md w-full text-gray-50">
        {/* Heading */}
            <div className="flex flex-row">
                <h1 className="text-3xl md:text-4xl font-bold mb-8 w-11/12">Your Dashboard</h1>
                <Link href={`/replies/${user?.userName}`}>
                    <Button className="items-baseline cursor-grab"> See Replies </Button>
                </Link>
            </div>

            {/* Shareable Link Section */}
            <div className="mb-10 border-b border-gray-700 pb-6">
                <h2 className="text-lg font-semibold text-gray-200 mb-3">Your Unique Profile Link</h2>
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2">
                    <input type="text" value={profileUrl} disabled className="w-full px-4 py-2 border border-gray-600 rounded-md bg-gray-900 text-sm text-gray-300 cursor-text" />
                    <Button onClick={copyToClipboard} className="shrink-0 w-full md:w-auto transition duration-200 hover:bg-gray-700" >
                        Copy Link
                    </Button>
                </div>
            </div>

            {/* Username Section */}
            <div className="mb-10 border-b border-gray-700 pb-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-300">
                        Current Username: <span className="text-gray-100">{user?.userName}</span>
                    </h2>
                    {!showUsernameForm && (
                        <Button variant="ghost" className="text-gray-400 hover:text-white hover:bg-gray-600 transition" size="sm" onClick={() => setShowUsernameForm(true)} >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Username
                        </Button>
                    )}
                </div>

                {showUsernameForm && (
                <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-700 shadow-sm text-gray-300">
                    <h3 className="text-md font-semibold mb-3">Update Your Username</h3>
                    <Form {...usernameForm}>
                        <form onSubmit={usernameForm.handleSubmit(onUsernameSubmit)} className="space-y-4">
                            <FormField
                                control={usernameForm.control}
                                name="userName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter new username" {...field}onChange={(e) => {
                                                    field.onChange(e);
                                                    debouncedUsername(e.target.value);
                                                }} 
                                                disabled={isUpdatingUsername}
                                            />
                                        </FormControl>

                                        {isCheckingUsername && (
                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                Checking username...
                                            </div>
                                        )}

                                        <p className={`text-sm mt-1 ${ userNameInfo === 'Unique Username' ? 'text-green-600' : 'text-red-500' }`} >
                                            {userNameInfo}
                                        </p>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex gap-2">
                                <Button type="submit" size="sm" disabled={isUpdatingUsername}>
                                    {isUpdatingUsername ? (
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                        ) : (
                                            <Check className="h-4 w-4 mr-2" />
                                        )
                                    }
                                    Save
                                </Button>
                                <Button type="button" size="sm" onClick={handleCancelUsernameUpdate} disabled={isUpdatingUsername} >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
                )}
            </div>

            {/* Accept Messages Switch */}
            <div className="mb-8 flex items-center">
                <Switch {...register('acceptMessages')} checked={acceptMessages} onCheckedChange={handleSwitchChange} disabled={isLoading} />
                <span className="ml-3 text-sm text-gray-400">
                    Accept Messages:
                    <span className={`ml-1 font-medium ${ acceptMessages ? 'text-green-400' : 'text-red-400' }`} >
                        {acceptMessages ? 'On' : 'Off'}
                    </span>
                </span>
            </div>

            {/* Refresh Messages Button */}
            <div className="mb-8">
                <Button variant="outline" onClick={(e) => {
                        e.preventDefault();
                        fetchMessages(true);
                    }}
                    className="transition bg-gray-700"
                >
                {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <>
                            <RefreshCcw className="h-4 w-4 mr-2" />
                            Refresh Messages
                        </>
                    )
                }
                </Button>
            </div>

            {/* Messages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <MessageCard
                        key={index}
                        messageId={message?._id}
                        time={message?.createdAt}
                        message={message?.content}
                        isReplied={message?.reply ? true : false}
                        onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p className="text-gray-400 text-sm italic">No messages to display.</p>
                )}
            </div>
        </div>
    );
}

export default Page;