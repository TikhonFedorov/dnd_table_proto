import React, { useState } from 'react';

function Chat({ messages, socket, tokens }) {
    const [input, setInput] = useState('');
    const [recipient, setRecipient] = useState('all');

    const sendMessage = () => {
        if (socket && input) {
            socket.send(JSON.stringify({
                type: 'chat',
                content: recipient === 'all' ? input : `Whisper to ${recipient}: ${input}`,
                recipient: recipient
            }));
            setInput('');
        }
    };

    return (
        <div className="chat">
            <div className="messages">
                {messages.map((msg, idx) => (
                    <p key={idx} className={msg.type === 'dice' ? 'dice' : msg.isWhisper ? 'whisper' : ''}>
                        {msg.text}
                    </p>
                ))}
            </div>
            <div className="chat-controls">
                <input value={input} onChange={e => setInput(e.target.value)} />
                <select value={recipient} onChange={e => setRecipient(e.target.value)}>
                    <option value="all">All</option>
                    {tokens.map(token => (
                        <option key={token.id} value={token.name}>{token.name}</option>
                    ))}
                </select>
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Chat;