import React, { useState } from 'react';

export default function CreateCompany({ onCreate }) {
    const [companyName, setCompanyName] = useState('');

    const handleCreate = (e) => {
        e.preventDefault();
        onCreate(companyName);
        setCompanyName('');
    };

    return (
        <div>
            <h2>Create Company</h2>
            <form onSubmit={handleCreate}>
                <input
                    type="text"
                    placeholder="Company Name"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                />
                <button type="submit">Create</button>
            </form>
        </div>
    );
}
