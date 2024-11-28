import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import UserDashboard from "./components/UserDashboard";
import JoinCreatePage from "./components/JoinCreatePage";
import JoinCompany from "./components/JoinCompany";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user-dashboard" element={<UserDashboard />} />
            <Route path="/join-create" element={<JoinCreatePage />} />
            <Route path="/join-company" element={<JoinCompany />} />
        </Routes>
    );
}

export default App;
