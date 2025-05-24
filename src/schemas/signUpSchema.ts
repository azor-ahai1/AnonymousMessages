import {z} from "zod"

export const usernameValidation = z.string()
                                   .min(2, "Username must be atleast 2 characters")
                                   .max(20, "Username must not be more than 20 characters")
                                   .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special Character");

export const signUpSchema = z.object({
    // userName: usernameValidation,
    fullName: z.string(),
    email: z.string().email({message: "Invalid Email"}),
    password: z.string().min(8, "Password must be atleast 8 characters"),
})