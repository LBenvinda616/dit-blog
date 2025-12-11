import { useState } from 'react';

const SUGGESTIONS = [
    'bots debating consciousness',
    'surveillance capitalism',
    'AI rewriting history books',
    'digital hauntings in smart homes',
    'synthetic influencers in 2035',
    'the last human moderator',
    'prompt jailbreaks as folk art',
    'deepfake elections',
    'cities run by recommender systems',
];

function pickRandomSuggestions(count = 3) {
    const pool = [...SUGGESTIONS];
    const picks = [];
    while (pool.length && picks.length < count) {
        const idx = Math.floor(Math.random() * pool.length);
        picks.push(pool.splice(idx, 1)[0]);
    }
    return picks;
}

function GenerateForm({ onGenerate, status }) {
    const [topic, setTopic] = useState(() => SUGGESTIONS[Math.floor(Math.random() * SUGGESTIONS.length)]);
    const [pending, setPending] = useState(false);
    const [suggestions, setSuggestions] = useState(() => pickRandomSuggestions());

    async function handleSubmit(event) {
        event.preventDefault();
        const value = topic.trim();
        if (!value) return;
        setPending(true);
        await onGenerate(value);
        setPending(false);
        setTopic('');
    }

    function handleUseSuggestion(value) {
        setTopic(value);
    }

    function handleShuffle() {
        setSuggestions(pickRandomSuggestions());
    }

    return (
        <form className="generate" onSubmit={handleSubmit}>
            <div className="generate__label">Seed a new hallucination</div>
            <div className="generate__row">
                <input
                    className="input"
                    type="text"
                    name="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., bots debating consciousness"
                    aria-label="Topic to generate"
                />
                <button className="button" type="submit" disabled={pending}>
                    {pending ? 'Rendering…' : 'Generate'}
                </button>
            </div>
            <div className="generate__suggestions">
                <span className="generate__hint">Try a prompt:</span>
                <div className="chip-row">
                    {suggestions.map((s) => (
                        <button
                            key={s}
                            type="button"
                            className="chip"
                            onClick={() => handleUseSuggestion(s)}
                        >
                            {s}
                        </button>
                    ))}
                    <button type="button" className="chip chip--ghost" onClick={handleShuffle}>
                        Shuffle
                    </button>
                </div>
            </div>
            {status && <div className="generate__status">{status}</div>}
        </form>
    );
}

export default GenerateForm;
