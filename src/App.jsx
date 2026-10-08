import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LeaveManagement from './pages/LeaveManagement';
import EmployeeMaster from './pages/masters/EmployeeMaster';
import EmployeeProfile from './pages/EmployeeProfile';
import Attendance from './pages/Attendance';
import Deliverables from './pages/Deliverables';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected (app shell) routes */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leave" element={<LeaveManagement />} />
          <Route path="/projects" element={<Deliverables />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/profile" element={<EmployeeProfile />} />
          <Route path="/masters/employees" element={<EmployeeMaster />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
