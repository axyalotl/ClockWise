import React, { useState } from 'react';
import './UserDashboard.css';
import './CalendarComponent.css';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { Button, Form, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAuth } from "firebase/auth";

const UserDashboard = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [teamCode, setTeamCode] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    const [appointmentDetails, setAppointmentDetails] = useState({
        title: '',
        date: '',
        duration: '',
        description: '',
    });
    const [availabilityDetails, setAvailabilityDetails] = useState({
        date: '',
        shiftType: 'Full',
    });

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December',
    ];

    const navigate = useNavigate(); // Initialize navigate

    // Handle joining a team
    const handleJoinTeam = async (e) => {
        e.preventDefault();
        try {
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
            setSuccessMessage(`Company "${companyName}" created successfully`);

            setShowCreateModal(false);
            const auth = getAuth();
            const user = auth.currentUser;
            await axios.post('http://localhost:3003/api/company', {
                name: companyName,
                ownerId: user.uid

            });

        } catch (error) {
            setErrorMessage('Failed to create company');

        }
    };


    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(nextMonth);
    };

    const handleAppointmentSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3003/api/appointments', appointmentDetails);
            if (response.status === 200) {
                alert('Appointment scheduled successfully.');
                setShowAppointmentModal(false);
            }
        } catch (error) {
            console.error('Error scheduling appointment:', error);
        }
    };

    const handleAvailabilitySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3003/api/employeeShifts', availabilityDetails);
            if (response.status === 200) {
                alert('Availability set successfully.');
                setShowAvailabilityModal(false);
            }
        } catch (error) {
            console.error('Error setting availability:', error);
        }
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <div key={day} className="calendar-day">
                    {day}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="user-dashboard">
            {/* Sidebar */}
            <div className="sidebar">
                <img src="/cat.png" alt="Cat Icon" className="sidebar-cat" />
                <h2>ClockWise</h2>
                <ul>
                    <li className="active">Dashboard</li>
                    <li>My Shifts</li>
                    <li>Settings</li>
                </ul>
                <Button onClick={() => setShowAppointmentModal(true)}>Set Unavailable Time</Button>
                <Button onClick={() => setShowAvailabilityModal(true)}>Set Availability</Button>

                <Popup
                    trigger={<button className="add-button"> + Add Company/Team </button>}
                    modal
                    nested
                    contentStyle={{ width: '40%', height: '50%' }} // Adjust size as needed
                >
                    {close => (
                        <div className='modal'>
                            <div className='h-popup-main'>
                                <h3>Create a New Company</h3>
                            </div>
                            <div>
                                <Form onSubmit={handleJoinTeam} className="h-popup-text">
                                    <Form.Group>
                                        <Form.Label>Enter Team Code </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={teamCode}
                                            onChange={(e) => setTeamCode(e.target.value)}
                                            placeholder="Enter team code"
                                            required
                                        />
                                    </Form.Group>
                                    <Button className="add-button-popup" type="submit">Join Team</Button>
                                </Form>

                                <Form onSubmit={handleCreateCompany} className="h-popup-text">
                                    <Form.Group>
                                        <Form.Label>Company Name </Form.Label>
                                        <Form.Control
                                            type="text"
                                            value={companyName}
                                            onChange={(e) => setCompanyName(e.target.value)}
                                            placeholder="Enter company name"
                                            required
                                        />
                                    </Form.Group>
                                    <Button className="add-button-popup" type="submit" variant="success">
                                        Create Company
                                    </Button>
                                </Form>
                            </div>
                        </div>
                    )}
                </Popup>

            </div>


            {/* Main Content */}
            <div className="main-content">
                <div className="dashboard-header">
                    <div className="cards-container">
                        <div className="card">
                            <h3>Team A</h3>
                            <p>View team details and schedules</p>
                            <button>View</button>
                        </div>
                        <div className="card">
                            <h3>Company A</h3>
                            <p>Manage company settings</p>
                            <button>Manage</button>
                        </div>
                    </div>
                </div>

                {/* Calendar Section */}
                <div className="calendar-container">
                    <div className="calendar-header">
                        <button onClick={handlePrevMonth}>◀</button>
                        <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                        <button onClick={handleNextMonth}>▶</button>
                    </div>
                    <div className="calendar-grid">
                        {daysOfWeek.map((day) => (
                            <div key={day} className="calendar-day-header">
                                {day}
                            </div>
                        ))}
                        {renderCalendar()}
                    </div>
                </div>
            </div>

            {/* Appointment Modal */}
            <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Schedule an Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAppointmentSubmit}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setAppointmentDetails({ ...appointmentDetails, title: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                onChange={(e) => setAppointmentDetails({ ...appointmentDetails, date: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Duration (minutes)</Form.Label>
                            <Form.Control
                                type="number"
                                onChange={(e) => setAppointmentDetails({ ...appointmentDetails, duration: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                onChange={(e) => setAppointmentDetails({ ...appointmentDetails, description: e.target.value })}
                            />
                        </Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Availability Modal */}
            <Modal show={showAvailabilityModal} onHide={() => setShowAvailabilityModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Set Availability</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAvailabilitySubmit}>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                onChange={(e) => setAvailabilityDetails({ ...availabilityDetails, date: e.target.value })}
                                required
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Shift Type</Form.Label>
                            <Form.Control
                                as="select"
                                onChange={(e) => setAvailabilityDetails({ ...availabilityDetails, shiftType: e.target.value })}
                                required
                            >
                                <option value="Full">Full</option>
                                <option value="Morning">Morning</option>
                                <option value="Afternoon">Afternoon</option>
                            </Form.Control>
                        </Form.Group>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default UserDashboard;