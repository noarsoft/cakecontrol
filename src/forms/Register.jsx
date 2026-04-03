import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ThemeSwitcher from '../ThemeSwitcher';
import API_CONFIG, { getApiUrl } from '../config/api.config';
import {
    FormControl,
    LinkControl,
} from '../components/controls';
import '../components/Login.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    displayName: '',
    reason: '',
    consent: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleSubmit = async (e, rowData = {}) => {
    if (e && e.preventDefault) e.preventDefault();
    setError('');
    setSuccess('');

    const data = rowData || formData;

    // Validation
    if (!data.firstName || !data.lastName || !data.displayName) {
      setError('กรุณากรอกข้อมูลส่วนตัวให้ครบถ้วน');
      return;
    }

    if (!data.reason) {
      setError('กรุณาระบุเหตุผลในการขอใช้งานระบบ');
      return;
    }

    if (!data.consent) {
      setError('กรุณายอมรับเงื่อนไขการใช้งาน');
      return;
    }

    if (data.password !== data.confirmPassword) {
      setError('รหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง');
      return;
    }

    if (data.password.length < 8) {
      setError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create user account
      const userResponse = await axios.post(
        getApiUrl('/userx'),
        {
          email: data.email,
          password: data.password
        },
        {
          headers: API_CONFIG.HEADERS,
          timeout: API_CONFIG.TIMEOUT
        }
      );

      const userData = userResponse.data?.data;

      // Step 2: Create register profile
      const registerResponse = await axios.post(
        getApiUrl(API_CONFIG.ENDPOINTS.AUTH.REGISTER),
        {
          userxRootId: userData.rootid,
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
          reason: data.reason,
          consent: data.consent,
          status: 'pending'
        },
        {
          headers: API_CONFIG.HEADERS,
          timeout: API_CONFIG.TIMEOUT
        }
      );

      setSuccess('สมัครสมาชิกสำเร็จ! สถานะ: รอการอนุมัติ กำลังเปลี่ยนเส้นทางไปหน้าเข้าสู่ระบบ...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      const errorMsg = err?.response?.data?.error || err?.message || 'ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้ กรุณาลองใหม่อีกครั้ง';
      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* Theme Switcher in top-right */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 10 }}>
        <ThemeSwitcher />
      </div>

      {/* Terms Modal */}
      {showTermsModal && (
        <div className="modal-backdrop" onClick={() => setShowTermsModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5>
                  <i className="bi bi-file-text-fill"></i> เงื่อนไขการใช้งาน
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTermsModal(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <h6>1. การยอมรับข้อกำหนด</h6>
                <p>การใช้งานระบบ CAMT Authentication ถือว่าท่านได้อ่านและยอมรับเงื่อนไขการใช้งานทั้งหมด</p>

                <h6>2. การใช้งานบัญชี</h6>
                <ul>
                  <li>ท่านต้องให้ข้อมูลที่ถูกต้องและเป็นความจริง</li>
                  <li>ท่านมีหน้าที่รักษาความปลอดภัยของรหัสผ่านของท่าน</li>
                  <li>ห้ามแชร์บัญชีหรือให้ผู้อื่นใช้งาน</li>
                  <li>ห้ามใช้งานในทางที่ผิดกฎหมายหรือละเมิดสิทธิผู้อื่น</li>
                </ul>

                <h6>3. ข้อมูลส่วนบุคคล</h6>
                <p>เราจะเก็บรักษาข้อมูลส่วนบุคคลของท่านตามนโยบายความเป็นส่วนตัว และจะไม่เปิดเผยให้บุคคลที่สามโดยไม่ได้รับอนุญาต</p>

                <h6>4. การอนุมัติบัญชี</h6>
                <ul>
                  <li>บัญชีใหม่จะอยู่ในสถานะ "รอการอนุมัติ" จนกว่าผู้ดูแลระบบจะตรวจสอบ</li>
                  <li>ผู้ดูแลระบบมีสิทธิ์อนุมัติหรือปฏิเสธการสมัครสมาชิก</li>
                  <li>หากถูกปฏิเสธ ท่านสามารถสมัครใหม่ได้หากแก้ไขข้อมูลให้ถูกต้อง</li>
                </ul>

                <h6>5. การยกเลิกบัญชี</h6>
                <p>ท่านสามารถขอยกเลิกบัญชีได้ตลอดเวลา โดยติดต่อผู้ดูแลระบบ</p>

                <h6>6. การเปลี่ยนแปลงเงื่อนไข</h6>
                <p>เราขอสงวนสิทธิ์ในการแก้ไขเงื่อนไขการใช้งานโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</p>

                <h6>7. การติดต่อ</h6>
                <p>หากมีข้อสงสัย กรุณาติดต่อ: <strong>admin@cmu.ac.th</strong></p>

                <hr />
                <p className="text-muted small mb-0">
                  <i className="bi bi-calendar-check"></i> อัปเดตล่าสุด: 29 ตุลาคม 2568
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowTermsModal(false)}
                >
                  ปิด
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="login-card">
        <div className="form-card-header">
          <i className="fas fa-user-plus"></i>
          <h2>สมัครสมาชิก</h2>
          <p>CAMT Authentication System</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <i className="fas fa-check-circle"></i>
            <span>{success}</span>
          </div>
        )}

        <div className="login-form-wrapper">
          <FormControl
            config={{
              colnumbers: 1,
              responsive: true,
              data: [formData],
              controls: [
                {
                  colno: 1,
                  rowno: 1,
                  type: 'textbox',
                  databind: 'email',
                  placeholder: 'example@cmu.ac.th',
                  label: 'อีเมล',
                  labelBold: true,
                  labelFontSize: '14px',
                },
                {
                  colno: 1,
                  rowno: 2,
                  type: 'textbox',
                  databind: 'firstName',
                  placeholder: 'ชื่อจริง',
                  label: 'ชื่อจริง',
                  labelBold: true,
                  labelFontSize: '14px',
                },
                {
                  colno: 1,
                  rowno: 3,
                  type: 'textbox',
                  databind: 'lastName',
                  placeholder: 'นามสกุล',
                  label: 'นามสกุล',
                  labelBold: true,
                  labelFontSize: '14px',
                },
                {
                  colno: 1,
                  rowno: 4,
                  type: 'textbox',
                  databind: 'displayName',
                  placeholder: 'ชื่อที่แสดง',
                  label: 'ชื่อที่แสดง',
                  labelBold: true,
                  labelFontSize: '14px',
                },
                {
                  colno: 1,
                  rowno: 5,
                  type: 'password',
                  databind: 'password',
                  placeholder: '••••••••',
                  label: 'รหัสผ่าน',
                  labelBold: true,
                  labelFontSize: '14px',
                },
                {
                  colno: 1,
                  rowno: 6,
                  type: 'password',
                  databind: 'confirmPassword',
                  placeholder: '••••••••',
                  label: 'ยืนยันรหัสผ่าน',
                  labelBold: true,
                  labelFontSize: '14px',
                },
                {
                  colno: 1,
                  rowno: 7,
                  type: 'textbox',
                  databind: 'reason',
                  placeholder: 'กรุณาระบุเหตุผลในการขอใช้งาน...',
                  label: 'เหตุผลในการขอใช้งาน',
                  labelBold: true,
                  labelFontSize: '14px',
                  rows: 4,
                },
                {
                  colno: 1,
                  rowno: 8,
                  type: 'checkbox',
                  databind: 'consent',
                  label: 'ยินยอมและยอมรับเงื่อนไขการใช้งาน',
                  labelBold: false,
                  labelFontSize: '14px',
                },
                {
                  colno: 1,
                  rowno: 9,
                  type: 'button',
                  value: loading ? (
                    <>
                      <span className="spinner"></span>
                      กำลัง...
                    </>
                  ) : (
                    'สมัครสมาชิก'
                  ),
                  className: 'btn-login',
                  disabled: loading || !formData.consent,
                  onClick: (e, rowData) => handleSubmit(e, rowData),
                },
              ],
              onChange: (event) => {
                const newData = (event && event.target && event.target.value) || {};
                setFormData(newData);
                setError('');
              },
            }}
          />
          
          {/* Terms Link */}
          <div style={{ marginTop: '12px', textAlign: 'center' }}>
            <button
              type="button"
              className="btn-link"
              onClick={() => setShowTermsModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: '#F48E2E',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontSize: '13px',
                padding: '0'
              }}
            >
              <i className="bi bi-file-text"></i> ดูเงื่อนไขการใช้งาน
            </button>
          </div>
        </div>

        <div className="form-card-footer">
          <p>มีบัญชีอยู่แล้ว? <LinkControl control={{ href: '/login', value: 'เข้าสู่ระบบ' }} /></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
