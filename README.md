# Brand Brain DEV UI (v1)

A minimal, calm, and trust-centric chat interface for Brand Brain, built with Next.js.
Designed for internal development testing.

## Features

- **Brand-First Selection**: Mandatory brand context before chatting.
- **Calm UX**: Subtle animations, no clutter, "thinking" indicators.
- **Trust Context**: Displays determination confidence and intent for every response.
- **Robust Error Handling**: Graceful fallback for API issues.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS (Custom "Calm" Palette)
- **Icons**: Lucide React
- **Integration**: FastAPI Adapter (`/brands`, `/ask`)

## Setup & Run

1. **Install Dependencies**

    ```bash
    npm install
    ```

2. **Environment Configuration**
    Create a `.env.local` file (optional, defaults to localhost:8000):

    ```env
    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
    ```

3. **Run Development Server**

    ```bash
    npm run dev -- -p 3001
    ```

    Access the app at [http://localhost:3001](http://localhost:3001).

## Implementation Details

- **Custom Chat Container**: Implements `assistant-ui` inspired patterns for maximum control over the "Calm" aesthetic and strict message rendering rules.
- **State Management**: Local React state for simplicity in v1.
- **API**: Hardcoded `x-api-key: digitalf5` for current dev environment.

## Known Limitations (v1)

- Chat history is local-only (refresh clears it).
- Markdown support is minimal (whitespace-pre-wrap).
- Dark mode is not yet implemented.
