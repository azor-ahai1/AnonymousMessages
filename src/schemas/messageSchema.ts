import {z} from "zod"

export const messageSchema = z.object({
    content: z.string().min(1, {message: 'Content must be at least of 10 charaters'})
}) 