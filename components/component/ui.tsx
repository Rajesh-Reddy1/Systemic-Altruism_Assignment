
"use client";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea"; // Assume these are imported correctly
import { training_text } from "./Text";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';


interface Message {
  sender: "user" | "bot";
  text: string;
  image?: string;
  id?: string; 
}

export function App() {
  const [userInput, setUserInput] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageFileName, setImageFileName] = useState("");
  const [isLoading, setIsLoading] = useState<string | boolean>(false); // Track which message is loading
  const MessageContent = ({ text }: { text: string }) => (
    <ReactMarkdown rehypePlugins={[rehypeRaw]}>
      {text}
    </ReactMarkdown>
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "Greetings! How can I assist you today? ",
      id: "initial",
    },
  ]);
  const [context, setContext] = useState(training_text); 

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(event.target.value);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      setImageFileName(event.target.files[0].name);
    }
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === "" && !selectedImage) return;

    let imageBase64 = "";
    if (selectedImage) {
      imageBase64 = await convertToBase64(selectedImage);
    }

    const newMessage: Message = {
      sender: "user",
      text: userInput,
      image: imageBase64,
      id: new Date().toISOString(), 
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setUserInput("");
    setSelectedImage(null);
    setImageFileName("");

    setIsLoading(newMessage.id || "");

    setTimeout(async () => {
      const response = await getChatGPTResponse(newMessage);
      setMessages([...newMessages, { sender: "bot", text: response, id: new Date().toISOString() }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleClearChat = () => {
    setMessages([
      {
        sender: "bot",
        text: "Greetings! How can I assist you today?",
        id: "initial",
      },
    ]);
    setIsLoading(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const getChatGPTResponse = async (message: Message): Promise<string> => {
    const apiKey =  process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
    if (!apiKey) {
      console.error(
        "OpenAI API key not found. Please set NEXT_PUBLIC_OPENAI_API_KEY in your environment variables."
      );
      return "Error: API key not found.";
    }
  
    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o",
            messages: [
              { role: "system", content: context }, // Inject dynamic context
              {
                role: "user",
                content: [
                  { type: "text", text: message.text },
                  message.image
                    ? { type: "image_url", image_url: { url: message.image } }
                    : null,
                ].filter(Boolean),
              },
            ],
            max_tokens: 4096,
            temperature: 0.7,
          }),
        }
      );
  
      const data = await response.json();
  
      if (data.error) {
        console.error("API Error:", data.error);
        return `Error: ${data.error.message || "An error occurred"}`;
      }
  
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].message.content.trim(); // Ensure response is formatted correctly
      } else {
        console.error("No choices found in the API response:", data);
        return "Error: No response from API.";
      }
    } catch (error) {
      console.error("Error fetching response from ChatGPT:", error);
      return "Error: Could not get a response.";
    }
  };
  
  return (
    <div className=" bg-[#daf0f7] flex flex-col items-center justify-center  min-h-screen w-full">
      <div className="bg-[#dddcdc] border-[#555454] rounded-lg shadow-lg w-full max-w-7xl">
        <div className="flex h-[60px] items-center border-b border-[#e0e0e0] px-6">
          <div className="flex-1 font-medium">Conversation with ChatGPT</div>
          <Button
            variant="ghost"
            onClick={handleClearChat}
            className="rounded-full border border-[#000000] bg-[#e2dcdc]"
          >
            Clear Chat
          </Button>
        </div>
        <div className="flex-1 overflow-auto bg-[#f5f5f5] px-6 py-4 h-[500px]">
          <div className="grid gap-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-4 ${
                  message.sender === "user" ? "justify-end" : ""
                }`}
              >
                {message.sender === "bot" && isLoading === message.id && (
                  <div className="pulse-animation">
                    <div className="pulse-dot" />
                    <div className="pulse-dot" />
                    <div className="pulse-dot" />
                  </div>
                )}
                {message.sender === "bot" && isLoading !== message.id && (
                  <Avatar className="w-10 h-8 border border-[#000000] rounded-sm">
                    <AvatarImage  alt="ChatGPT" />
                    <AvatarFallback>Bot</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`grid gap-1 rounded-lg p-4 max-w-[80%] ${
                    message.sender === "user"
                      ? "bg-[#d4d4d4] border border-[#e0e0e0]"
                      : "bg-white border border-[#e0e0e0]"
                  }`}
                >
                  <div className="font-medium rounded-sm">
                    {message.sender === "user" ? "You" : "ChatGPT"}
                  </div>
                  <div className="text-sm text-[#353434] rounded-sm">
                    <MessageContent text={message.text} />
                  </div>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Uploaded"
                      className="mt-2 max-w-full h-auto"
                    />
                  )}
                </div>
                {message.sender === "user" && (
                  <Avatar className="w-10 h-10 border rounded-sm border-[#000000] ">
                    <AvatarImage  alt="User" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="flex items-center justify-center"> 
    {isLoading ? (
        <div className="pulse-animation ">
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
            <div className="pulse-dot"></div>
        </div>
    ) : (
        <div></div>
    )}
</div>
        <div className="bg-[#f5f5f5] border-t border-[#e0e0e0] px-8 py-4">
          <div className="relative">
            <Textarea
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type your message..."
              className="w-full bg-white border text-1xl border-[#e0e0e0] rounded-lg p-4 pr-24 resize-none text-left"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2">
              <label htmlFor="file-upload" className="cursor-pointer p-1 pl-2 pr-2 border border-spacing-1">
                <AttachIcon className="w-5 h-6 text-[#757575]" />
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
              {selectedImage && (
                <span className="text-sm text-[#757575] ml-2">
                  {imageFileName}
                </span>
              )}
              <Button
                type="button"
                onClick={handleSendMessage}
                variant="ghost"
                size="icon"
                className="rounded-full border border-[#e0e0e0] w-10 h-8 flex items-center justify-center"
                disabled={typeof isLoading === 'boolean' ? isLoading : false}
              >

                  <SendIcon className="w-5 h-6 text-[#757575]" />
                
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SendIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function AttachIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
  );
}
