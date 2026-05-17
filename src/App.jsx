import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Dashboard from './forms/Dashboard';
import BusinessSelector from './forms/BusinessSelector';
import { PAGES } from './lib/routes';
import './App.css';

const ControlsDocs = lazy(() => import('./components/controls_doc/ControlsDocs'));
const FormBuilder = lazy(() => import('./forms/FormBuilder'));
const FormFillerPage = lazy(() => import('./forms/FormFillerPage'));

function PageLoader() {
  return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
}

function App() {
  return (
    <Router>
      <div className="app-global-container">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path={PAGES.HOME} element={<BusinessSelector />} />
            <Route path={PAGES.CONTROLS_DOCS} element={<ControlsDocs />} />
            <Route path={PAGES.DASHBOARD} element={<Dashboard />} />
            <Route path={PAGES.FORM_BUILDER} element={<FormBuilder />} />
            <Route path={PAGES.FORM_FILLER} element={<FormFillerPage />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
