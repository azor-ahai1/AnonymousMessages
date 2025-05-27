"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from "next/link" 
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signUpSchema } from "@/schemas/signUpSchema"
import { useState } from "react"
import axios, {AxiosError} from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {Loader2} from "lucide-react" 

const Page = () => {
    const [errorMessage, setErrorMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState('')
    const router = useRouter(); 

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: ''
        }
    }) 

    const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
        setIsLoading(true);
        try {
            const response = await axios.post('/api/sign-up', data)
            toast('Sign up successful', {
                description: response.data.message,
            });
            console.log(email);
            // console.log("response", response?.data?.data?._id);
            console.log(email);
            if(response?.data?.data?._id){
                router.replace(`/verify/${response?.data?.data?._id}`)
            }
            // router.replace(`/verify/${data.email}`)
            // router.replace(`/verify`)
        } catch (error) {
            // if (error instanceof AxiosError) {
                //     toast('Sign up failed', {
            const axiosError = error as AxiosError<ApiResponse>;
            setErrorMessage(axiosError.response?.data.message ?? "Error signing up User" )
            toast('Sign up Failed', {
                description: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    } 
    
    return(
        <div className="flex justify-center items-center min-h-screen bg-gray-800">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join Secret Ping
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField name="fullName" control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Jayant Dubey" {...field}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField name="email" control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="aap@gmail.com" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            setEmail(e.target.value);
                                        }}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField name="password" control={form.control} render={({field}) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} onChange={(e) => {
                                            field.onChange(e)
                                            setEmail(e.target.value);
                                        }}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                </Form>
                <div className="text-center mt-4">
                    <p>
                        Already a member?{' '}
                        <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Page;