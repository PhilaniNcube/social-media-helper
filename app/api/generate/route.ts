import { Configuration, OpenAIApi } from "openai";
import { NextResponse } from "next/server";
import { OpenAIStream, OpenAIStreamPayload } from "@/utils/OpenAIStream";

export const config = {
  runtime: "edge",
};

 type Payload = {
     model: string,
    prompt:string,
    temperature: number,
    top_p: number,
    frequency_penalty: number,
    presence_penalty: number,
    max_tokens: number,
    stream: boolean,
    n: number,
}

const configuration = new Configuration({
    organization: "org-0mM7xkvvMumgrFOCVDQty548",
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req:Request){

  const openai = new OpenAIApi(configuration);

  const body = await req.json();

  const {objective, prompt} = body;

 const payload :OpenAIStreamPayload= {
    model: 'gpt-4-0613',
    messages:[{role:"user", content:`${prompt}\n\nFacebook Ad Objective: ${objective}\n\n`}],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 700,
    stream: true,
    n: 1,
  }
 const stream = await OpenAIStream(payload);
  return new NextResponse(stream);

}



    // prompt: `${prompt}\n\nFacebook Ad Objective: ${objective}\n\n`,
