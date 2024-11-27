import React, { useState } from 'react';
import './UserDashboard.css';
import './CalendarComponent.css';

const UserDashboard = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];

    const handlePrevMonth = () => {
        const prevMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        setCurrentDate(prevMonth);
    };

    const handleNextMonth = () => {
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
        setCurrentDate(nextMonth);
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
                <img
                    src="/cat.png"
                    alt="Cat Icon"
                    className="sidebar-cat"
                />
                <h2>ClockWise</h2>
                <ul>
                    <li className="active">Dashboard</li>
                    <li>My Shifts</li>
                    <li>Settings</li>
                </ul>
                <button className="add-button">+ Add Company/Team</button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="dashboard-header">
                    <div className="cards-container">
                        {/* Card for Team */}
                        <div className="card">
                            <h3>Team A</h3>
                            <p>View team details and schedules</p>
                            <button>View</button>
                        </div>

                        {/* Card for Company */}
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
                        <h2>
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h2>
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
        </div>
    );
};

export default UserDashboard;
