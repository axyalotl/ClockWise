import React, { useState } from 'react';

export default function JoinCompany({ onJoin }) {
    const [teamCode, setTeamCode] = useState('');

    const handleJoin = (e) => {
        e.preventDefault();
        onJoin(teamCode);
        setTeamCode('');
    };

    return (
        <div>
            <h2>Join Company</h2>
            <form onSubmit={handleJoin}>
                <input
                    type="text"
                    placeholder="Team Code"
                    value={teamCode}
                    onChange={(e) => setTeamCode(e.target.value)}
                    required
                />
                <button type="submit">Join</button>
            </form>
        </div>
    );
}
