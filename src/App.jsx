import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './forms/Login';
import Register from './forms/Register';
import Dashboard from './forms/Dashboard';
import SampleControl from './components/SampleControl';
import ControlsDocs from './components/controls_doc/ControlsDocs';
import FormBuilder from './forms/FormBuilder';
import FormFillerPage from './forms/FormFillerPage';
import AppLayout from './components/AppLayout';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sample" element={<SampleControl />} />
        <Route path="/controls-docs" element={<ControlsDocs />} />
        <Route path="/formbuilder" element={<FormBuilder />} />
        <Route path="/form/:schemaId" element={<FormFillerPage />} />
      </Routes>
    </Router>
  )
}

export default App
