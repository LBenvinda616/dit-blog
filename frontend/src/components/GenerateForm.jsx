import { useState } from 'react';

function GenerateForm({ onGenerate, status }) {
    const [topic, setTopic] = useState('surveillance capitalism');
    const [pending, setPending] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        const value = topic.trim();
        if (!value) return;
        setPending(true);
        await onGenerate(value);
        setPending(false);
        setTopic('');
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
            {status && <div className="generate__status">{status}</div>}
        </form>
    );
}

export default GenerateForm;
