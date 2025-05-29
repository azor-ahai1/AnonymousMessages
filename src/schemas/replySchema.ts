import {z} from "zod"

export const replySchema = z.object({
    reply: z.string().min(1, {message: 'Reply must be at least of 1 charaters'})
}) 