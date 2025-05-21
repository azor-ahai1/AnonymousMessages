// import { console } from "inspector";
// import { NextResponse } from "next/server";
// import {OpenAIStream, StreamingTextResponse} from "ai";
// import OpenAI from "openai";


// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// })

// export const runtime = 'edge';

// export async function POST(request: Request) {
//     try{
//         // const {messages} = await request.json();

//         const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are from an anonymous social messaging platform, and should be suitable for a diverese audience."

//         const response = await openai.completions.create({
//             model: 'gpt-3.5-turbo',
//             max_tokens: 400,
//             stream: true,
//             // messages,
//             prompt
//         });

//         const stream = OpenAIStream(response);

//         return new StreamingTextResponse(stream);
//     } 
//     catch (error) {
//         if(error instanceof OpenAI.APIError){
//              const {name, status, headers, message} = error;
//              return NextResponse.json({
//                 name, status, headers, message
//              })
//         } else{
//              console.error("An unexpected error ocurred while suggesting messages ", error);
//              throw error;
//         }
//     } 
// }