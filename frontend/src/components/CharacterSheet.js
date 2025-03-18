import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CharacterSheet({ socket, characters, setCharacters, selectedCharacter, setSelectedCharacter }) {
    const [name, setName] = useState('');
    const [stats, setStats] = useState({
        strength: 10, dexterity: 10, constitution: 10,
        intelligence: 10, wisdom: 10, charisma: 10
    });
    const [level, setLevel] = useState(1);
    const [hpMax, setHpMax] = useState(10);
    const [hpCurrent, setHpCurrent] = useState(10);
    const [ac, setAc] = useState(10);
    const [proficiency, setProficiency] = useState(2);
    const [characterClass, setCharacterClass] = useState('');
    const [race, setRace] = useState('');

    useEffect(() => {
        if (selectedCharacter) {
            setName(selectedCharacter.name);
            setStats({
                strength: selectedCharacter.strength,
                dexterity: selectedCharacter.dexterity,
                constitution: selectedCharacter.constitution,
                intelligence: selectedCharacter.intelligence,
                wisdom: selectedCharacter.wisdom,
                charisma: selectedCharacter.charisma
            });
            setLevel(selectedCharacter.level);
            setHpMax(selectedCharacter.hit_points_max);
            setHpCurrent(selectedCharacter.hit_points_current);
            setAc(selectedCharacter.armor_class);
            setProficiency(selectedCharacter.proficiency_bonus);
            setCharacterClass(selectedCharacter.character_class);
            setRace(selectedCharacter.race);
        }
    }, [selectedCharacter]);

    const addCharacter = async () => {
        const newCharacter = {
            name,
            rule_set: 1, // Убедись, что RuleSet с id=1 существует
            strength: stats.strength,
            dexterity: stats.dexterity,
            constitution: stats.constitution,
            intelligence: stats.intelligence,
            wisdom: stats.wisdom, // Исправлено с wism
            charisma: stats.charisma,
            level,
            hit_points_max: hpMax,
            hit_points_current: hpCurrent,
            armor_class: ac,
            proficiency_bonus: proficiency,
            character_class: characterClass,
            race
        };
        const response = await axios.post('/api/characters/', newCharacter); // Убрано лишнее /api/
        setCharacters(prev => [...prev, response.data]);
        resetForm();
    };
    
    const updateCharacter = async () => {
        if (selectedCharacter) {
            const updatedCharacter = {
                ...selectedCharacter,
                name,
                strength: stats.strength,
                dexterity: stats.dexterity,
                constitution: stats.constitution,
                intelligence: stats.intelligence,
                wisdom: stats.wisdom, // Исправлено с wism
                charisma: stats.charisma,
                level,
                hit_points_max: hpMax,
                hit_points_current: hpCurrent,
                armor_class: ac,
                proficiency_bonus: proficiency,
                character_class: characterClass,
                race
            };
            const response = await axios.put(`/api/characters/${selectedCharacter.id}/`, updatedCharacter);
            setCharacters(prev => prev.map(c => c.id === response.data.id ? response.data : c));
            setSelectedCharacter(null);
            resetForm();
        }
    };

    const resetForm = () => {
        setName('');
        setStats({ strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10 });
        setLevel(1);
        setHpMax(10);
        setHpCurrent(10);
        setAc(10);
        setProficiency(2);
        setCharacterClass('');
        setRace('');
    };

    const handleStatChange = (stat, value) => {
        setStats(prev => ({ ...prev, [stat]: parseInt(value) || 0 }));
    };

    return (
        <div className="character-sheet">
            <h3>Character Sheet</h3>
            <select
                value={selectedCharacter ? selectedCharacter.id : ''}
                onChange={e => setSelectedCharacter(characters.find(c => c.id === parseInt(e.target.value)) || null)}
            >
                <option value="">New Character</option>
                {characters.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
            </select>
            <div className="character-form">
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
                <div className="stats">
                    {Object.keys(stats).map(stat => (
                        <div key={stat}>
                            <label>{stat.charAt(0).toUpperCase() + stat.slice(1)}:</label>
                            <input
                                type="number"
                                value={stats[stat]}
                                onChange={e => handleStatChange(stat, e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <input type="number" value={level} onChange={e => setLevel(parseInt(e.target.value) || 1)} placeholder="Level" />
                <input type="number" value={hpMax} onChange={e => setHpMax(parseInt(e.target.value) || 10)} placeholder="Max HP" />
                <input type="number" value={hpCurrent} onChange={e => setHpCurrent(parseInt(e.target.value) || 10)} placeholder="Current HP" />
                <input type="number" value={ac} onChange={e => setAc(parseInt(e.target.value) || 10)} placeholder="AC" />
                <input type="number" value={proficiency} onChange={e => setProficiency(parseInt(e.target.value) || 2)} placeholder="Proficiency" />
                <input value={characterClass} onChange={e => setCharacterClass(e.target.value)} placeholder="Class" />
                <input value={race} onChange={e => setRace(e.target.value)} placeholder="Race" />
                <button onClick={selectedCharacter ? updateCharacter : addCharacter}>
                    {selectedCharacter ? 'Update' : 'Add'} Character
                </button>
            </div>
        </div>
    );
}

export default CharacterSheet;