import React from 'react';
import CreateCompany from './CreateCompany';
import JoinCompany from './JoinCompany';

export default function UserDashboard() {
    const handleCreateCompany = (companyName) => {
        console.log('Create Company:', companyName);
        // Send API request to create company
    };

    const handleJoinCompany = (teamCode) => {
        console.log('Join Company:', teamCode);
        // Send API request to join company
    };

    return (
        <div>
            <h1>User Dashboard</h1>
            <CreateCompany onCreate={handleCreateCompany} />
            <JoinCompany onJoin={handleJoinCompany} />
        </div>
    );
}
