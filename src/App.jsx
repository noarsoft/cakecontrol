import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SampleControl from './components/SampleControl';
import ControlsDocs from './components/controls_doc/ControlsDocs';
import FormBuilder from './forms/FormBuilder';
import FormFillerPage from './forms/FormFillerPage';

import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/controls-docs" replace />} />
        <Route path="/sample" element={<SampleControl />} />
        <Route path="/controls-docs" element={<ControlsDocs />} />
        <Route path="/formbuilder" element={<FormBuilder />} />
        <Route path="/form/:schemaId" element={<FormFillerPage />} />
      </Routes>
    </Router>
  )
}

export default App
