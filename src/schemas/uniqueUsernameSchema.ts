import {z} from "zod"

export const uniqueUsernameSchema = z.object({
    userName: z.string()
               .min(2, "Username must me atleast of 2 characters")
               .max(15,  "Username must me atmost of 15 characters")
               .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special Character")

})