import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import './App.css';

const socket = io('/', { transports: ['websocket'] });
axios.defaults.baseURL = '/api';

function App() {
    const [tokens, setTokens] = useState([]);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        axios.get('/tokens/').then(res => setTokens(res.data));

        socket.on('connect', () => console.log('Connected to WebSocket'));
        socket.on('message', (data) => {
            if (data.type === 'token') {
                setTokens(prev => prev.map(t => t.id === data.id ? data : t));
            } else if (data.type === 'chat') {
                setMessages(prev => [...prev, data.content]);
            }
        });

        return () => socket.off('message');
    }, []);

    const handleDrag = (e, id) => {
        const token = tokens.find(t => t.id === id);
        const newToken = { ...token, x: e.clientX, y: e.clientY };
        socket.emit('message', { type: 'token', ...newToken });
        setTokens(prev => prev.map(t => t.id === id ? newToken : t));
    };

    const sendMessage = () => {
        socket.emit('message', { type: 'chat', content: input });
        setInput('');
    };

    return (
        <div className="app">
            <div className="map">
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
                    {messages.map((msg, idx) => <p key={idx}>{msg}</p>)}
                </div>
                <input value={input} onChange={e => setInput(e.target.value)} />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default App;