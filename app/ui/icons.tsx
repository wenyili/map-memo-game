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

export {
    IconMenu,
}