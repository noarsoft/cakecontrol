import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ControlsDocs from './components/controls_doc/ControlsDocs';
import FormBuilder from './forms/FormBuilder';
import FormFillerPage from './forms/FormFillerPage';
import Dashboard from './forms/Dashboard';
import BusinessSelector from './forms/BusinessSelector';
import { PAGES } from './lib/routes';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-global-container">
        <Routes>
          <Route path={PAGES.HOME} element={<BusinessSelector />} />
          <Route path={PAGES.CONTROLS_DOCS} element={<ControlsDocs />} />
          <Route path={PAGES.DASHBOARD} element={<Dashboard />} />
          <Route path={PAGES.FORM_BUILDER} element={<FormBuilder />} />
          <Route path={PAGES.FORM_FILLER} element={<FormFillerPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
