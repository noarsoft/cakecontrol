import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
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

function NotFound() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>404</h1>
      <p style={{ marginBottom: '1.5rem' }}>ไม่พบหน้าที่คุณต้องการ</p>
      <button
        onClick={() => navigate(PAGES.HOME)}
        style={{
          padding: '0.5rem 1.5rem',
          background: 'var(--accent-primary)',
          color: 'var(--text-on-accent)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          cursor: 'pointer',
          fontSize: '0.9rem',
        }}
      >
        กลับหน้าแรก
      </button>
    </div>
  );
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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
