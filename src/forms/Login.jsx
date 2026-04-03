import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThemeSwitcher from '../ThemeSwitcher';
import API_CONFIG, { getApiUrl } from '../config/api.config';
import {
    FormControl,
    LinkControl,
} from '../components/controls';
// import '../components/Login.css';

function Login() {
  const navigate = useNavigate();
  const emailRef = useRef('admin@cmu.ac.th');
  const passwordRef = useRef('admin123456');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRowSubmit = async (rowData = {}) => {
    setError('');
    setLoading(true);
    try {
      const res = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.AUTH.LOGIN),
        { email: rowData.email, password: rowData.password },
        { 
          headers: API_CONFIG.HEADERS, 
          timeout: API_CONFIG.TIMEOUT 
        }
      );

      const result = res?.data;
      const data = result?.data || {};
      localStorage.setItem('accessToken', data.accessToken || '');
      localStorage.setItem('userxRootId', data.userxRootId || '');
      localStorage.setItem('expiresAt', data.expiresAt || '');

      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.error || err?.message || String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Theme Switcher in top-right */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 10 }}>
        <ThemeSwitcher />
      </div>

      <div className="login-card">
        <div className="form-card-header">
          <i className="fas fa-lock"></i>
          <h2>เข้าสู่ระบบ</h2>
          <p>ใช้อีเมล และรหัสผ่าน CAMT ของคุณ</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className="login-form-wrapper">
          <FormControl
            config={{
              colnumbers: 1,
              responsive: true,
              data: [{ email: emailRef.current, password: passwordRef.current }],
              controls: [
                {
                  colno: 1,
                  rowno: 1,
                  type: 'textbox',
                  databind: 'email',
                  placeholder: 'your.email@cmu.ac.th',
                  label: 'อีเมล',
                  labelBold: true,
                  labelFontSize: '14px',
                  labelColor: 'var(--text-primary)'
                },
                {
                  colno: 1,
                  rowno: 2,
                  type: 'password',
                  databind: 'password',
                  placeholder: '••••••••',
                  label: 'รหัสผ่าน',
                  labelBold: true,
                  labelFontSize: '14px',
                  labelColor: 'var(--text-primary)'
                },
                {
                  colno: 1,
                  rowno: 3,
                  type: 'button',
                  value: loading ? (
                    <>
                      <span className="spinner"></span>
                      กำลัง...
                    </>
                  ) : (
                    'เข้าสู่ระบบ'
                  ),
                  className: 'btn-login',
                  disabled: loading,
                  onClick: (e, rowData) => handleRowSubmit(rowData),
                },
              ],
            }}
          />
        </div>

        <div className="form-card-footer">
          <p>ยังไม่มีบัญชี? <LinkControl control={{ href: '/register', value: 'ลงทะเบียน' }} /></p>
        </div>
      </div>
    </div>
  );
}
export default Login;
