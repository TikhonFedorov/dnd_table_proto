import React, { useState } from 'react';
import axios from 'axios';

function TokenManager({ socket, setTokens, tokens, characters }) {
    const [tokenName, setTokenName] = useState('');
    const [characterId, setCharacterId] = useState('');

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const addToken = async () => {
        if (tokenName) {
            const newToken = { 
                id: Date.now(), 
                name: tokenName, 
                x: 0, 
                y: 0, 
                color: getRandomColor(),
                character: characterId || null
            };
            if (socket) socket.send(JSON.stringify({ type: 'token', ...newToken }));
            await axios.post('/api/tokens/', newToken); // Убрано лишнее /api/
            setTokens(prev => [...prev, newToken]);
            setTokenName('');
            setCharacterId('');
        }
    };
    
    const deleteToken = async (id) => {
        if (socket) socket.send(JSON.stringify({ type: 'token_delete', id }));
        await axios.delete(`/api/tokens/${id}/`); // Убрано лишнее /api/
        setTokens(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="token-manager">
            <div className="token-input">
                <input
                    value={tokenName}
                    onChange={e => setTokenName(e.target.value)}
                    placeholder="Token name"
                    maxLength={20}
                />
                <select value={characterId} onChange={e => setCharacterId(e.target.value)}>
                    <option value="">No character</option>
                    {characters.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>
                <button onClick={addToken}>Add Token</button>
            </div>
            <div className="token-list">
                {tokens && tokens.length > 0 ? (
                    tokens.map(token => (
                        <div key={token.id} className="token-item" style={{ backgroundColor: token.color }}>
                            <span>{token.name} {token.character ? `(${characters.find(c => c.id === token.character)?.name})` : ''}</span>
                            <button onClick={() => deleteToken(token.id)}>Delete</button>
                        </div>
                    ))
                ) : (
                    <p>No tokens yet</p>
                )}
            </div>
        </div>
    );
}

export default TokenManager;