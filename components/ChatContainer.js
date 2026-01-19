'use client';

import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '@/lib/api';
import MessageBubble from './MessageBubble';
import Loader from './Loader';
import EmptyState from './EmptyState';
import BrandSelector from './BrandSelector';
import { ArrowUp, AlertCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export default function ChatContainer({ selectedBrand, onBrandSelect }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        // Auto-scroll
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isLoading]);

    const handleSend = async (textProp) => {
        const textToSend = textProp || input;
        if (!textToSend.trim() || isLoading || !selectedBrand) return;

        const userMessage = { role: 'user', content: textToSend.trim() };
        setMessages(prev => [...prev, userMessage]);

        if (!textProp) setInput('');

        setIsLoading(true);
        setError(null);

        try {
            const response = await sendMessage({
                brand_id: selectedBrand.id,
                question: userMessage.content
            });

            const assistantMessage = {
                role: 'assistant',
                content: response.answer,
                confidence: response.confidence,
                intent: response.intent
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (err) {
            console.error(err);
            setError("Brand Brain couldn't answer this right now. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const onFormSubmit = (e) => {
        e.preventDefault();
        handleSend();
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleRegenerate = async () => {
        // Find the last user message
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        if (!lastUserMessage) return;

        // Remove the last assistant message if it exists (optional, but cleaner)
        // For simplicity, we'll just append a new thinking state which is handled by isLoading
        // But to avoid duplicate assistant bubbles if we just append, let's remove the last assistant message
        setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages[newMessages.length - 1].role === 'assistant') {
                newMessages.pop();
            }
            return newMessages;
        });

        await handleSend(lastUserMessage.content);
    };

    const hasInput = input.trim().length > 0;

    return (
        <div className="flex flex-col h-full w-full bg-background">
            {/* Scrollable Messages Area */}
            <ScrollArea className="flex-1 w-full min-h-0">
                <div className="px-4 py-6">
                    <div className="max-w-3xl mx-auto space-y-8 pb-4">
                        {messages.length === 0 ? (
                            <EmptyState onPromptClick={(text) => handleSend(text)} />
                        ) : (
                            messages.map((msg, idx) => (
                                <MessageBubble
                                    key={idx}
                                    role={msg.role}
                                    content={msg.content}
                                    confidence={msg.confidence}
                                    intent={msg.intent}
                                    onRegenerate={handleRegenerate}
                                />
                            ))
                        )}

                        {isLoading && (
                            <div className="py-4">
                                <MessageBubble role="assistant" isThinking={true} content={<Loader />} />
                            </div>
                        )}

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-950/20 border border-red-900/30 p-3 rounded-lg text-sm max-w-md mx-auto animate-in fade-in slide-in-from-bottom-2">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </div>
            </ScrollArea>

            {/* Fixed Input Area */}
            <div className="w-full px-4 pb-6 pt-2 z-10 bg-background">
                <div className="max-w-3xl mx-auto relative">

                    <form onSubmit={onFormSubmit} className="relative flex flex-col w-full p-4 rounded-3xl bg-background transition-all duration-200 border border-black/10 focus-within:border-black focus-within:ring-1 focus-within:ring-black dark:border-white/10 dark:focus-within:border-white dark:focus-within:ring-white dark:shadow-white/5">

                        {/* 1. Text Input Area */}
                        <div className="flex-1">
                            <input
                                ref={inputRef}
                                disabled={!selectedBrand || isLoading}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={`Ask about ${selectedBrand?.name}`}
                                className={cn(
                                    "w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none placeholder:text-gray-foreground/50 resize-none min-h-[40px] max-h-[200px] overflow-y-auto",
                                    !selectedBrand && "opacity-50 cursor-not-allowed"
                                )}
                                autoComplete="off"
                            />
                        </div>

                        {/* 2. Bottom Row: Brand Selector (Left) & Actions (Right) */}
                        <div className="flex items-center justify-between mt-3 pt-2">
                            {/* Left: Brand Selector */}
                            <div className="flex items-center">
                                <BrandSelector
                                    selectedBrand={selectedBrand}
                                    onSelect={onBrandSelect}
                                    className="border-0 shadow-none p-0 h-auto"
                                    triggerClassName="bg-secondary/40 hover:bg-secondary/60 border-0 h-8 text-xs rounded-lg px-2"
                                />
                            </div>

                            {/* Right: Send Button */}
                            <div className="flex items-center gap-2">
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!hasInput || isLoading || !selectedBrand}
                                    className={cn(
                                        "h-8 w-8 rounded-full transition-all duration-200",
                                        hasInput
                                            ? "bg-black text-white hover:bg-black/90 shadow-sm dark:bg-white dark:text-black dark:hover:bg-white/90"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <ArrowUp size={16} strokeWidth={2.5} />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </div>
                        </div>

                    </form>

                    <div className="w-full text-center mt-2">
                        <span className="text-[10px] text-muted-foreground/40 font-medium tracking-wide">Brand Brain can make mistakes. Check important info.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
