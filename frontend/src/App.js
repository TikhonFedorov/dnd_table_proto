import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

axios.defaults.baseURL = 'http://localhost:8000/api';

function App() {
    const [tokens, setTokens] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [socket, setSocket] = useState(null);
    const [diceType, setDiceType] = useState('d20');
    const [tokenName, setTokenName] = useState(''); // Для ввода имени токена

    useEffect(() => {
        axios.get('/tokens/')
            .then(res => setTokens(res.data))
            .catch(err => console.error(err));

        const ws = new WebSocket('ws://localhost:8000/ws/game/');
        setSocket(ws);

        ws.onopen = () => console.log('Connected to WebSocket');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'token') {
                setTokens(prev => prev.map(t => t.id === data.id ? data : t).concat(data.id ? [] : [data]));
            } else if (data.type === 'chat') {
                setMessages(prev => [...prev, { text: data.content, type: 'chat' }]);
            } else if (data.type === 'dice') {
                setMessages(prev => [...prev, { text: `${data.diceType} roll: ${data.result}`, type: 'dice' }]);
            }
        };
        ws.onerror = (err) => console.error('WebSocket error:', err);
        ws.onclose = () => console.log('WebSocket closed');

        return () => ws.close();
    }, []);

    const handleDrag = (e, id) => {
        const token = tokens.find(t => t.id === id);
        const newToken = { ...token, x: e.clientX, y: e.clientY };
        if (socket) socket.send(JSON.stringify({ type: 'token', ...newToken }));
        setTokens(prev => prev.map(t => t.id === id ? newToken : t));
    };

    const sendMessage = () => {
        if (socket) socket.send(JSON.stringify({ type: 'chat', content: input }));
        setInput('');
    };

    const rollDice = () => {
        let max;
        switch (diceType) {
            case 'd2': max = 2; break;
            case 'd4': max = 4; break;
            case 'd6': max = 6; break;
            case 'd8': max = 8; break;
            case 'd10': max = 10; break;
            case 'd12': max = 12; break;
            case 'd20': max = 20; break;
            case 'd100': max = 100; break;
            default: max = 20;
        }
        const result = Math.floor(Math.random() * max) + 1;
        if (socket) socket.send(JSON.stringify({ type: 'dice', diceType, result }));
    };

    const addToken = () => {
        if (tokenName) {
            const newToken = { id: Date.now(), name: tokenName, x: 0, y: 0 }; // Уникальный ID через timestamp
            if (socket) socket.send(JSON.stringify({ type: 'token', ...newToken }));
            setTokens(prev => [...prev, newToken]);
            setTokenName('');
        }
    };

    // Генерация ячеек сетки
    const gridCells = [];
    for (let row = 0; row < 15; row++) {
        for (let col = 0; col < 20; col++) {
            gridCells.push(<div key={`${row}-${col}`} className="grid-cell" />);
        }
    }

    return (
        <div className="app">
            <div className="map">
                {gridCells}
                {tokens.map(token => (
                    <div
                        key={token.id}
                        className="token"
                        draggable
                        onDragEnd={(e) => handleDrag(e, token.id)}
                        style={{ left: token.x, top: token.y }}
                    >
                        {token.name}
                    </div>
                ))}
            </div>
            <div className="chat">
                <div className="messages">
                    {messages.map((msg, idx) => (
                        <p key={idx} className={msg.type === 'dice' ? 'dice' : ''}>
                            {msg.text}
                        </p>
                    ))}
                </div>
                <div className="chat-controls">
                    <input value={input} onChange={e => setInput(e.target.value)} />
                    <button onClick={sendMessage}>Send</button>
                    <select value={diceType} onChange={e => setDiceType(e.target.value)}>
                        <option value="d2">d2</option>
                        <option value="d4">d4</option>
                        <option value="d6">d6</option>
                        <option value="d8">d8</option>
                        <option value="d10">d10</option>
                        <option value="d12">d12</option>
                        <option value="d20">d20</option>
                        <option value="d100">d100</option>
                    </select>
                    <button onClick={rollDice}>Roll</button>
                    <input
                        value={tokenName}
                        onChange={e => setTokenName(e.target.value)}
                        placeholder="Token name"
                    />
                    <button onClick={addToken}>Add Token</button>
                </div>
            </div>
        </div>
    );
}

export default App;