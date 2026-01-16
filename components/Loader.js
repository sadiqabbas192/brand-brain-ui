export default function Loader() {
    return (
        <div className="flex items-center gap-1.5 h-6">
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-calm-pulse [animation-delay:0ms]" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-calm-pulse [animation-delay:300ms]" />
            <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-calm-pulse [animation-delay:600ms]" />
        </div>
    );
}
