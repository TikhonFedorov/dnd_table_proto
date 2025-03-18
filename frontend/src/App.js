import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GameBoard from './components/GameBoard';
import Chat from './components/Chat';
import DiceRoller from './components/DiceRoller';
import TokenManager from './components/TokenManager';
import CharacterSheet from './components/CharacterSheet';
import InitiativeTracker from './components/InitiativeTracker';
import './App.css';

// Устанавливаем базовый URL без дублирования /api/
axios.defaults.baseURL = 'http://localhost:8000';

function App() {
    const [tokens, setTokens] = useState([]);
    const [messages, setMessages] = useState([]);
    const [socket, setSocket] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [selectedCharacter, setSelectedCharacter] = useState(null);

    useEffect(() => {
        axios.get('/api/tokens/')
            .then(res => setTokens(res.data))
            .catch(err => console.error(err));
    axios.get('/api/characters/')
            .then(res => setCharacters(res.data))
            .catch(err => console.error(err));

        const ws = new WebSocket('ws://localhost:8000/ws/game/');
        setSocket(ws);

        ws.onopen = () => console.log('Connected to WebSocket');
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'token') {
                setTokens(prev => prev.map(t => t.id === data.id ? data : t).concat(data.id ? [] : [data]));
            } else if (data.type === 'token_delete') {
                setTokens(prev => prev.filter(t => t.id !== data.id));
            } else if (data.type === 'chat') {
                setMessages(prev => [...prev, { text: data.content, type: 'chat', isWhisper: data.recipient !== 'all' }]);
            } else if (data.type === 'dice') {
                setMessages(prev => [...prev, { text: `${data.diceType} roll: ${data.result}`, type: 'dice' }]);
            } else if (data.type === 'initiative') {
                // Обработка инициативы, если нужно
            }
        };
        ws.onerror = (err) => console.error('WebSocket error:', err);
        ws.onclose = () => console.log('WebSocket closed');

        return () => ws.close();
    }, []);

    return (
        <div className="app">
            <GameBoard tokens={tokens} socket={socket} setTokens={setTokens} />
            <div className="sidebar">
                <Chat messages={messages} socket={socket} tokens={tokens} />
                <DiceRoller socket={socket} />
                <TokenManager socket={socket} setTokens={setTokens} tokens={tokens} characters={characters} />
                <CharacterSheet 
                    socket={socket} 
                    characters={characters} 
                    setCharacters={setCharacters} 
                    selectedCharacter={selectedCharacter} 
                    setSelectedCharacter={setSelectedCharacter} 
                />
                <InitiativeTracker tokens={tokens} socket={socket} />
            </div>
        </div>
    );
}

export default App;