"use client"

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
// import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
// import axios, { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import Link from "next/link";
// import { useParams } from "next/navigation";
// import { useRouter } from "next/router";
import { useRouter } from 'next/navigation';
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z  from "zod";

const Page = () => {
    // const [isLoading, setIsLoading] = useState(false)
    const router = useRouter(); 
    const form = useForm<z.infer<typeof signInSchema>>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: '',
            password: ''
        }
    }) 

    const onSubmit = async (data: z.infer<typeof signInSchema>) => {
        const response = await signIn('credentials', {
            redirect: false,
            identifier: data.identifier,
            password: data.password
        })

        if (response?.error) {
            if (response.error === 'CredentialsSignin') {
                toast('Login Failed', {
                description: 'Incorrect username or password',
                });
            } else {
                toast('Error', {
                description: response.error,
                });
            }
        }

        if (response?.url) {
        router.replace('/dashboard');
        }
    }  

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Welcome Back to Secret Ping
                    </h1>
                    <p className="mb-4">Sign in to continue your secret conversations</p>
                </div>

                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField name="identifier" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email/Username</FormLabel>
                            <Input {...field} />
                            <FormMessage />
                        </FormItem>
                    )} />

                    <FormField name="password" control={form.control} render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" {...field} />
                            <FormMessage />
                        </FormItem>
                    )} />

                    <Button className='w-full' type="submit">Sign In</Button>
                </form>
                </Form> 

                <div className="text-center mt-4">
                    <p>
                        Not a member yet?{' '}
                        <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page;