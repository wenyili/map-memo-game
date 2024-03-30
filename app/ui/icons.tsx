function IconMenu({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <svg 
            data-testid="geist-icon" 
            fill="none" 
            height="24" 
            shapeRendering="geometricPrecision" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24"
        >
            <path d="M3 12h18"/>
            <path d="M3 6h18"/>
            <path d="M3 18h18"/>
        </svg>
    )
}

function IconMic({ className, ...props }: React.ComponentProps<'svg'>) {
    return (
        <svg 
            fill="none"
            height="16" 
            shapeRendering="geometricPrecision" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            width="16"
        >
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
            <path d="M19 10v2a7 7 0 01-14 0v-2"/>
            <path d="M12 19v4"/>
            <path d="M8 23h8"/>
        </svg>
    )
}

function IconMicOff({ className, ...props }: React.ComponentProps<'svg'>) {    
    return (
        <svg
            fill="none" 
            height="16" 
            shapeRendering="geometricPrecision" 
            stroke="currentColor" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            viewBox="0 0 24 24" 
            width="16" 
        >
            <path d="M1 1l22 22"/>
            <path d="M9 9v3a3 3 0 005.12 2.12M15 9.34V4a3 3 0 00-5.94-.6"/>
            <path d="M17 16.95A7 7 0 015 12v-2m14 0v2a7 7 0 01-.11 1.23"/>
            <path d="M12 19v4"/>
            <path d="M8 23h8"/>
        </svg>
    )
}


export {
    IconMenu,
    IconMic,
    IconMicOff
}