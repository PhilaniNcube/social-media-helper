"use client";

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image'
import { FormEvent, useState } from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const objectives = [
  {
    name: "Awareness",
    value: "awareness",
    details: [
      {
        name: "Reach",
      },
      {
        name: "Brand awareness",
      },
      {
        name: "Store location awareness",
      },
      {
        name: "Video views",
      },
    ],
  },
  {
    name: "Traffic",
    value: "traffic",
    details: [
      {
        name: "Link clicks",
      },
      {
        name: "Landing page views",
      },
      {
        name: "Messenger and Whatsapp",
      },
      {
        name: "Calls",
      },
    ],
  },
  {
    name: "Engagement",
    value: "engagement",
    details: [
      {
        name: "Messenger, Instagram and Whatsapp",
      },
      {
        name: "Video views",
      },
      {
        name: "Post Engagement",
      },
      {
        name: "Conversions",
      },
    ],
  },
  {
    name: "Leads",
    value: "leads",
    details: [
      {
        name: "Instant forms",
      },
      {
        name: "Messenger and Instagram",
      },
      {
        name: "Conversions",
      },
      {
        name: "Calls",
      },
    ],
  },
  {
    name: "Sales",
    value: "sales",
    details: [
      {
        name: "Conversions",
      },
      {
        name: "Catalogue sales",
      },
      {
        name: "Messenger, Instagram and Whatsapp",
      },
      {
        name: "Calls",
      },
    ],
  },
  {
    name: "App promotion",
    value: "app promotion",
    details: [
      {
        name: "App installs",
      },
      {
        name: "App events",
      },
    ],
  },
];

const FormSchema = z.object({
  objective: z.string().nonempty(),
  prompt: z.string().nonempty(),
})

export default function Home() {

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

    const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [promptResponse, setPromptResponse] = useState("");


  const handleSubmit = async (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
        setPromptResponse('')
    setLoading(true)

    console.log(e.currentTarget);

    const {objective, prompt} = Object.fromEntries(new FormData(e.currentTarget));

    console.log({objective, prompt})

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        objective: objective,
        prompt: prompt,
      }),
    });

       if (!response.ok) {
         setLoading(false);
         throw new Error(response.statusText);
       }

  const data = response.body;
  if (!data) {
    return;
  }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      setLoading(false);

      setPromptResponse((prev) => prev + chunkValue);
    }

    setLoading(false);

}


  return (
    <main className="">
      . .{" "}
      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-medium">Social Media Helper</h1>
        <p className="text-md font-medium mt-6">
          Use AI to help you with ideas for your social media posts
        </p>
        <Separator className="my-4" />
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="objective">
              What is the objective of your post?
            </Label>
            <Select name="objective">
              <SelectTrigger id="objective" className="">
                <SelectValue
                  id="objective"
                  className="flex items-center space-x-2"
                  placeholder="Select Objective"
                />
              </SelectTrigger>
              <SelectContent id="objective">
                {objectives.map((objective, idx) => (
                  <SelectItem
                    key={idx}
                    id="objective"
                    value={objective.value}
                    className="flex items-center space-x-2"
                  >
                    {objective.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col mt-8">
            <Label htmlFor="prompt">Performance Goal</Label>
            <Textarea
              id="prompt"
              name="prompt"
              className="mt-1"
              placeholder="Type what type of facebook ad you are looking for"
            />
          </div>
          <div className="flex flex-col mt-8">
            <Button type="submit">
              {loading ? "Loading..." : "Generate Ads"}
            </Button>
          </div>
        </form>
      </div>
      <div className="w-full max-w-4xl mx-auto mt-8">
        <h2 className="text-2xl font-medium">Generated Ad</h2>
        <Separator className="my-4" />
        {promptResponse && <p>{promptResponse}</p>}
      </div>
    </main>
  );
}
