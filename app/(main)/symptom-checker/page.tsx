"use client";
import { useState, useEffect, useRef } from "react";
import { UserMessage, AiMessage, AiLoading } from "@/components/index";
import { GoogleGenerativeAI } from "@google/generative-ai";
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: process.env.NEXT_PUBLIC_GEMINI_SYSTEM_INSTRUCTIONS || "",
});
import { Card, CardDescription } from "@/components/ui/card";
const SUGGESTIONS = [
  "What are some healthy lifestyle tips?",
  "How can I improve my sleep?",
  "What are the benefits of regular exercise?",
  "How do I maintain a balanced diet?",
];

type ChatMessage = {
  message: string | null;
  from: "User" | "Ai" | "AiLoading";
};

const SymptomChecker = () => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSend = async () => {
    if (loading) {
      alert("Please wait until the model is ready");
    }
    if (text.trim() !== "") {
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { message: text, from: "User" },
      ]);
      setText("");
      await run(text);
    } else {
      alert("Please enter a message");
    }
  };
  const handleSuggestionClick = async (suggestion: string) => {
    setChatMessages((prevMessages) => [
      ...prevMessages,
      { message: suggestion, from: "User" },
    ]);
    await run(suggestion);
  };
  const handleEnter = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if(event.key === "Enter"){
      event.preventDefault()
      handleSend()
    }
  }
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);
  };
  async function run(prompt: string) {
    try {
      setLoading(true);
      setChatMessages((prevMessages) => [
        ...prevMessages,
        { message: null, from: "AiLoading" },
      ]);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setChatMessages((prevMessages) => {
        prevMessages.splice(prevMessages.length - 1, 1, {
          message: text,
          from: "Ai",
        });
        return [...prevMessages];
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <main
      id="symptom-checker"
      className="w-full h-[calc(100svh-56px)] overflow-hidden justify-between flex flex-col mx-auto"
    >
      <div ref={scrollRef} className="overflow-y-auto h-full">
        {chatMessages.length === 0 && !loading && (
          <h1 className="text-center pt-4 sm:pt-8 text-3xl text-primary font-semibold">
            Symptom Checker
          </h1>
        )}
        <div
          ref={chatMessagesRef}
          className="max-w-7xl space-y-2 flex flex-col p-4 sm:px-16 md:px-32 mx-auto"
        >
          {chatMessages.map((message, index) => {
            if (message.from === "User" && message.message) {
              return <UserMessage key={index} message={message.message} />;
            } else if (message.from === "Ai" && message.message) {
              return <AiMessage key={index} message={message.message} />;
            } else {
              return <AiLoading key={index} />;
            }
          })}
        </div>
      </div>
      <div
        tabIndex={0}
        className="w-full max-w-7xl mx-auto p-4 sm:px-16 md:px-32 flex flex-col"
      >
        {chatMessages.length === 0 && (
          <div className="suggestions mb-4 gap-4 flex-wrap flex items-center justify-center">
            {SUGGESTIONS.map((suggestion) => (
              <Card
                onClick={() => handleSuggestionClick(suggestion)}
                key={suggestion}
                className="p-4 w-full sm:w-[unset] cursor-pointer transition-colors duration-300 hover:bg-primary/10"
              >
                <CardDescription>{suggestion}</CardDescription>
              </Card>
            ))}
          </div>
        )}
        <div
          tabIndex={0}
          onClick={() => textareaRef.current?.focus()}
          className="w-full justify-center items-center flex border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none min-h-[52px] rounded-[26px] gap-4"
        >
          <textarea
            value={text}
            onKeyDown={handleEnter}
            placeholder="Type your symptoms here"
            ref={textareaRef}
            rows={1}
            onChange={handleChange}
            className="w-full max-h- flex flex-col32 bg-transparent resize-none outline-none"
          ></textarea>
          <button
            onClick={handleSend}
            disabled={!text || loading}
            className={`send-button self-end transition-colors duration-300 ${
              text && !loading
                ? "bg-primary hover:bg-primary/60"
                : "bg-primary/60"
            } rounded-full`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <path
                fill="white"
                fillRule="evenodd"
                d="M15.192 8.906a1.143 1.143 0 0 1 1.616 0l5.143 5.143a1.143 1.143 0 0 1-1.616 1.616l-3.192-3.192v9.813a1.143 1.143 0 0 1-2.286 0v-9.813l-3.192 3.192a1.143 1.143 0 1 1-1.616-1.616z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </main>
  );
};

export default SymptomChecker;
