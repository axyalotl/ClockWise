// components/JoinCreatePage.js
import React, { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import './JoinCreate.css';

const JoinCreatePage = () => {
    const [teamCode, setTeamCode] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Handle joining a team
    const handleJoinTeam = async (e) => {
        e.preventDefault();
        try {
            // Replace with actual API call
            setSuccessMessage(`Joined team with code: ${teamCode}`);
            setErrorMessage('');
        } catch (error) {
            setErrorMessage('Failed to join team');
            setSuccessMessage('');
        }
    };

    // Handle creating a company
    const handleCreateCompany = async (e) => {
        e.preventDefault();
        try {
            // Replace with actual API call
            setSuccessMessage(`Company "${companyName}" created successfully`);
            setErrorMessage('');
            setShowCreateModal(false);
        } catch (error) {
            setErrorMessage('Failed to create company');
            setSuccessMessage('');
        }
    };

    return (
        <div className="join-create-page">
            <h1>Join or Create a Team</h1>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {errorMessage && <p className="error-message">{errorMessage}</p>}

            {/* Join Team */}
            <Form onSubmit={handleJoinTeam}>
                <Form.Group>
                    <Form.Label>Enter Team Code</Form.Label>
                    <Form.Control
                        type="text"
                        value={teamCode}
                        onChange={(e) => setTeamCode(e.target.value)}
                        placeholder="Enter team code"
                        required
                    />
                </Form.Group>
                <Button type="submit">Join Team</Button>
            </Form>

            {/* Create Company */}
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
                + Create Company
            </Button>

            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a New Company</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleCreateCompany}>
                        <Form.Group>
                            <Form.Label>Company Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                placeholder="Enter company name"
                                required
                            />
                        </Form.Group>
                        <Button type="submit" variant="success">
                            Create Company
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default JoinCreatePage;
