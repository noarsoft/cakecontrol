import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './forms/Login';
import Register from './forms/Register';
import SampleControl from './components/SampleControl';
import ControlsDocs from './components/controls_doc/ControlsDocs';
import AppLayout from './components/AppLayout';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/sample" element={<SampleControl />} />
        <Route path="/controls-docs" element={<ControlsDocs />} />
      </Routes>
    </Router>
  )
}

export default App
