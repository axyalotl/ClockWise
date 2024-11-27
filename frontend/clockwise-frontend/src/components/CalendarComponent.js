import React, { useState } from 'react';
import './CalendarComponent.css'; // Import CSS file for styling

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getMonthName = (month) => {
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month];
    };

    const renderCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = getDaysInMonth(year, month);

        const days = [];
        for (let i = 0; i < firstDay; i++) {
            days.push(<td key={`empty-${i}`}></td>);
        }

        let dayCounter = 1;
        for (let i = firstDay; i < firstDay + daysInMonth; i++) {
            days.push(
                <td key={dayCounter}>
                    {dayCounter}
                </td>
            );
            dayCounter++;
        }

        const calendarRows = [];
        let row = [];
        for (let i = 0; i < days.length; i++) {
            row.push(days[i]);
            if ((i + 1) % 7 === 0) {
                calendarRows.push(<tr key={i}>{row}</tr>);
                row = [];
            }
        }

        return calendarRows;
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <h2>{getMonthName(currentDate.getMonth())} {currentDate.getFullYear()}</h2>
            </div>
            <table className="calendar-grid">
                <thead>
                <tr>
                    <th>Sun</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                </tr>
                </thead>
                <tbody>
                {renderCalendar()}
                </tbody>
            </table>
        </div>
    );
}

export default Calendar;