import React, { useState } from 'react';

function DiceRoller({ socket }) {
    const [diceType, setDiceType] = useState('d20');

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

    return (
        <div className="dice-roller">
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
        </div>
    );
}

export default DiceRoller;