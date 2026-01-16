import { MessageCircle, Search, Palette, Megaphone } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Brain } from 'lucide-react';

export default function EmptyState({ onPromptClick }) {
    const prompts = [
        {
            icon: <Palette className="w-5 h-5 text-indigo-400" />,
            title: "Brand Assets",
            desc: "Find colors, logos, or fonts.",
            query: "What are the primary brand colors?"
        },
        {
            icon: <Megaphone className="w-5 h-5 text-pink-400" />,
            title: "Marketing Copy",
            desc: "Write taglines or social posts.",
            query: "Write a catchy tagline for a summer campaign."
        },
        {
            icon: <Search className="w-5 h-5 text-emerald-400" />,
            title: "Strategy",
            desc: "Understand retrieval & guidelines.",
            query: "What is the brand voice overview?"
        },
        {
            icon: <MessageCircle className="w-5 h-5 text-sky-400" />,
            title: "General Q&A",
            desc: "Ask anything about the brand.",
            query: "Who is the target audience?"
        }
    ];

    return (
        <div className="flex flex-col items-center justify-center p-4 mt-6 animate-in fade-in zoom-in-95 duration-700">

            {/* Hero Section - Reduced Size */}
            <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mb-4 border border-secondary shadow-2xl shadow-primary/5">
                <Brain className="text-foreground w-8 h-8" />
            </div>

            <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">Brand Brain</h3>
            <p className="text-muted-foreground max-w-sm text-center text-xs mb-8">
                Your intelligent brand guardian. Select a starter below or type your own query.
            </p>

            {/* Grid of Prompts - Compact Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                {prompts.map((p, idx) => (
                    <Card
                        key={idx}
                        onClick={() => onPromptClick && onPromptClick(p.query)}
                        /* Updated to V3.3: Added Custom Dark Mode Styling per request */
                        className="p-3 bg-card/40 hover:bg-secondary/40 transition-all cursor-pointer group hover:-translate-y-0.5 hover:shadow-lg border border-black/10 dark:border-white/10 hover:border-black hover:ring-1 hover:ring-black dark:hover:border-white dark:hover:ring-white dark:hover:shadow-white/5"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-1.5 bg-secondary/50 rounded-md group-hover:bg-background transition-colors">
                                {p.icon}
                            </div>
                            <div>
                                <h4 className="font-medium text-foreground text-sm mb-0.5">{p.title}</h4>
                                <p className="text-[10px] text-muted-foreground leading-tight">{p.desc}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
