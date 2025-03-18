import React, { useState } from 'react';

function InitiativeTracker({ tokens, socket }) {
    const [initiativeOrder, setInitiativeOrder] = useState([]);

    const rollInitiative = () => {
        const rolls = tokens.map(token => {
            const roll = Math.floor(Math.random() * 20) + 1;
            // Здесь нужен доступ к DEX-модификатору персонажа
            return { ...token, initiative: roll };
        });
        setInitiativeOrder(rolls.sort((a, b) => b.initiative - a.initiative));
        socket.send(JSON.stringify({ type: 'initiative', order: rolls }));
    };

    return (
        <div className="initiative-tracker">
            <button onClick={rollInitiative}>Roll Initiative</button>
            <ul>
                {initiativeOrder.map((token, idx) => (
                    <li key={idx} style={{ backgroundColor: token.color }}>
                        {token.name}: {token.initiative}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default InitiativeTracker;