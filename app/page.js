'use client';

import { useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import { Brain } from 'lucide-react';

import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  const [selectedBrand, setSelectedBrand] = useState(null);

  return (
    <main className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="h-16 flex-none bg-background/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-foreground">
            <Brain size={20} className="text-foreground" />
            <h1 className="font-semibold tracking-tight">Brand Brain</h1>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-medium uppercase tracking-wider border border-border/50">
            Dev v2.1
          </span>
        </div>
        <ModeToggle />
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative flex flex-col items-center w-full">
        <ChatContainer selectedBrand={selectedBrand} onBrandSelect={setSelectedBrand} />
      </div>
    </main>
  );
}
