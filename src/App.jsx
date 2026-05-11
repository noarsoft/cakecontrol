import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ControlsDocs from './components/controls_doc/ControlsDocs';
import FormBuilder from './forms/FormBuilder';
import FormFillerPage from './forms/FormFillerPage';
import BusinessSelector from './forms/BusinessSelector';
import ThemeSwitcher from './ThemeSwitcher';

import './App.css';

function App() {
  return (
    <Router>
      <div className="app-global-container">
        <div className="global-theme-switcher">
          <ThemeSwitcher />
        </div>
        <Routes>
        <Route path="/" element={<BusinessSelector />} />
        <Route path="/controls-docs" element={<ControlsDocs />} />
        <Route path="/formbuilder" element={<FormBuilder />} />
        <Route path="/form/:schemaId" element={<FormFillerPage />} />
      </Routes>
      </div>
    </Router>
  )
}

export default App
