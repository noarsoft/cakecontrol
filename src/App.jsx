import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ControlsDocs from './components/controls_doc/ControlsDocs';
import FormBuilder from './forms/FormBuilder';
import FormFillerPage from './forms/FormFillerPage';
import Dashboard from './forms/Dashboard';
import BusinessSelector from './forms/BusinessSelector';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-global-container">
        <Routes>
        <Route path="/" element={<BusinessSelector />} />
        <Route path="/controls-docs" element={<ControlsDocs />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/formbuilder" element={<FormBuilder />} />
        <Route path="/form/:schemaId" element={<FormFillerPage />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App
