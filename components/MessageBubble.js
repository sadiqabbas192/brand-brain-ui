'use client';

import { useState } from 'react';
import { Bot, User, Copy, RefreshCcw, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export default function MessageBubble({ role, content, confidence, intent, isThinking, onRegenerate }) {
    const isUser = role === 'user';
    const [isCopied, setIsCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className={cn("flex gap-5 w-full py-6 group", isUser ? "flex-row-reverse" : "flex-row")}>

            {/* Avatar */}
            <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border",
                isUser ? "bg-secondary border-border" : "bg-primary text-primary-foreground border-primary"
            )}>
                {isUser ? <User size={16} className="text-foreground" /> : <Bot size={16} />}
            </div>

            {/* Content */}
            <div className={cn("flex flex-col gap-2 min-w-0 max-w-[85%]", isUser ? "items-end" : "items-start")}>

                {/* Name */}
                {!isUser && (
                    <span className="text-xs font-semibold text-foreground ml-0.5">Brand Brain</span>
                )}

                {/* Message Box */}
                <div className={cn(
                    "prose prose-sm max-w-none leading-7 break-words !select-text cursor-text", // select-text enforced with !important and cursor
                    isUser
                        ? "text-right text-black bg-gray-200 border-muted px-5 py-2 rounded-[20px] rounded-tr-sm"
                        : "prose-invert text-left text-foreground/90 pl-0.5"
                )}>
                    {isUser ? (
                        <div className="whitespace-pre-wrap m-0">{content}</div>
                    ) : isThinking ? (
                        <div className="flex items-center">{content}</div>
                    ) : (
                        <ReactMarkdown
                            components={{
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    )}
                </div>

                {/* Actions (Assistant Only) */}
                {!isUser && !isThinking && (
                    <div className="flex flex-col gap-2 ml-0.5">
                        {/* Confidence & Intent */}
                        {(confidence || intent) && (
                            <div className="flex items-center gap-2 opacity-90 transition-opacity">
                                {confidence && (
                                    <span className={cn(
                                        "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border shadow-sm",
                                        confidence.toLowerCase() === 'high' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            confidence.toLowerCase() === 'medium' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                                "bg-red-500/10 text-red-400 border-red-500/20"
                                    )}>
                                        {confidence}
                                    </span>
                                )}

                                {intent && (
                                    <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center gap-1.5 align-middle">
                                        <span className="text-border/40">|</span>
                                        {intent}
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <ActionButton
                                tooltip={isCopied ? "Copied!" : "Copy to clipboard"}
                                onClick={handleCopy}
                                icon={isCopied ? Check : Copy}
                            />
                            <ActionButton
                                tooltip="Regenerate response"
                                onClick={onRegenerate}
                                icon={RefreshCcw}
                            />
                            <div className="h-3 w-[1px] bg-border/50 mx-1" />
                            <ActionButton
                                tooltip="Good response"
                                onClick={() => console.log("Thumbs up!")}
                                icon={ThumbsUp}
                            />
                            <ActionButton
                                tooltip="Bad response"
                                onClick={() => console.log("Thumbs down!")}
                                icon={ThumbsDown}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function ActionButton({ icon: Icon, onClick, tooltip }) {
    return (
        <button
            onClick={onClick}
            title={tooltip}
            className="p-1.5 text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50 rounded-md transition-colors"
        >
            <Icon size={14} />
        </button>
    );
}
