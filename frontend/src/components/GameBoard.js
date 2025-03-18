import React from 'react';

function GameBoard({ tokens, socket, setTokens }) {
    const handleDrag = (e, id) => {
        const token = tokens.find(t => t.id === id);
        const newToken = { ...token, x: e.clientX, y: e.clientY };
        if (socket) socket.send(JSON.stringify({ type: 'token', ...newToken }));
        setTokens(prev => prev.map(t => t.id === id ? newToken : t));
    };

    const gridCells = [];
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 20; col++) {
            gridCells.push(<div key={`${row}-${col}`} className="grid-cell" />);
        }
    }

    return (
        <div className="map">
            {gridCells}
            {tokens.map(token => (
                <div
                    key={token.id}
                    className="token"
                    draggable
                    onDragEnd={(e) => handleDrag(e, token.id)}
                    style={{ left: token.x, top: token.y, backgroundColor: token.color }}
                >
                    {token.name}
                </div>
            ))}
        </div>
    );
}

export default GameBoard;