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

            {/* Fixed Input Area (Not Absolute anymore, to prevent overlap) */}
            <div className="w-full px-4 pb-6 pt-2 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="max-w-3xl mx-auto relative flex flex-col items-start gap-2">

                    {/* Brand Selector */}
                    <div className="pl-1">
                        <BrandSelector selectedBrand={selectedBrand} onSelect={onBrandSelect} />
                    </div>

                    <div className="relative w-full group">
                        <form onSubmit={onFormSubmit} className="relative">
                            <input
                                ref={inputRef}
                                disabled={!selectedBrand || isLoading}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={selectedBrand ? `Ask ${selectedBrand.name}...` : "Select a brand above to start..."}
                                className={cn(
                                    "w-full pl-6 pr-14 py-4 rounded-[26px] transition-all",
                                    "bg-secondary/40 hover:bg-secondary/60 focus:bg-secondary/40",
                                    "border border-black/10 focus:border-black focus:ring-1 focus:ring-black dark:border-white/10 dark:focus:border-white dark:focus:ring-white",
                                    "text-foreground placeholder:text-gray-foreground/40",
                                    "focus:outline-none shadow-sm",
                                    !selectedBrand && "opacity-50 cursor-not-allowed"
                                )}
                            />

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                size="icon"
                                disabled={!hasInput || isLoading || !selectedBrand}
                                className={cn(
                                    "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full transition-all duration-200",
                                    hasInput
                                        ? "bg-black text-white hover:bg-black/90 shadow-md dark:bg-white dark:text-black dark:hover:bg-white/90"
                                        : "bg-gray-300 text-gray-700 hover:bg-gray-400 dark:bg-zinc-800 dark:text-zinc-500 dark:hover:bg-zinc-700"
                                )}
                            >
                                <ArrowUp size={20} strokeWidth={2.5} />
                                <span className="sr-only">Send</span>
                            </Button>
                        </form>
                    </div>

                    <div className="w-full text-center mt-2">
                        <span className="text-[10px] text-muted-foreground/40 font-medium tracking-wide">Brand Brain can make mistakes. Check important info.</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
