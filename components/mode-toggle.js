"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="rounded-full transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] hover:scale-110 hover:shadow-[0_4px_20px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_20px_rgba(255,255,255,0.2)] hover:bg-gradient-to-br hover:from-primary/5 hover:to-transparent active:scale-90 active:shadow-inner active:bg-secondary/80"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:-rotate-180 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-180 scale-0 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
