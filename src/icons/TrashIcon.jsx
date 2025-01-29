const TrashIcon = ({ size = 20, color = "currentColor" }) => (
    <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color}
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <path d="M3 6h18" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" />
        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </svg>
);

export default TrashIcon; 