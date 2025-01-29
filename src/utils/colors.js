const getRandomColor = () => {
    const colors = [
        { background: '#FFD1DC', text: '#000000' }, // Pink
        { background: '#98FB98', text: '#000000' }, // Pale Green
        { background: '#87CEEB', text: '#000000' }, // Sky Blue
        { background: '#DDA0DD', text: '#000000' }, // Plum
        { background: '#F0E68C', text: '#000000' }, // Khaki
        { background: '#E6E6FA', text: '#000000' }, // Lavender
        { background: '#FFA07A', text: '#000000' }, // Light Salmon
        { background: '#98FF98', text: '#000000' }, // Mint
        { background: '#87CEFA', text: '#000000' }, // Light Sky Blue
        { background: '#FFB6C1', text: '#000000' }  // Light Pink
    ];
    return colors[Math.floor(Math.random() * colors.length)];
};

export { getRandomColor }; 