import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, Wind } from 'lucide-react'
import './Login.css'

function Login() {
  const [mode, setMode] = useState('login')
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState('')
  const isRegistering = mode === 'register'

  const handleSubmit = (event) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    if (isRegistering && formData.get('password') !== formData.get('confirmPassword')) {
      setMessage('Mật khẩu xác nhận không khớp.')
      return
    }

    setMessage(isRegistering
      ? 'API đăng ký chưa được kết nối. Thông tin của bạn chưa được gửi đi.'
      : 'API đăng nhập chưa được kết nối. Thông tin của bạn chưa được gửi đi.')
  }

  return (
    <main className="login-page">
      <div className="login-shell">
        <section className="login-welcome" aria-label="GoFan">
          <Link to="/" className="login-brand">
            <span className="login-brand-mark"><Wind size={25} /></span>
            <span>GoFan<span className="login-brand-period">.</span></span>
          </Link>

          <div className="login-welcome-copy">
            <p className="login-kicker">GOFAN MEMBERS</p>
            <h1>{isRegistering ? 'Bắt đầu hành trình cùng GoFan.' : 'Rất vui được gặp lại bạn.'}</h1>
            <p>{isRegistering
              ? 'Tạo tài khoản để lưu lại thông tin và tiếp tục mua sắm thuận tiện.'
              : 'Đăng nhập để tiếp tục khám phá những sản phẩm yêu thích.'}</p>
          </div>

          <div className="login-welcome-footer">
            <span className="login-welcome-line"></span>
            <span>Mua sắm tiện lợi, mỗi ngày.</span>
          </div>
        </section>

        <section className="login-form-panel" aria-labelledby="login-title">
          <Link to="/" className="login-back-link">
            <ArrowLeft size={16} /> Về trang chủ
          </Link>

          <div className="login-mode-switch" role="tablist" aria-label="Tài khoản GoFan">
            <button
              type="button"
              role="tab"
              aria-selected={!isRegistering}
              className={!isRegistering ? 'login-mode-active' : ''}
              onClick={() => {
                setMode('login')
                setMessage('')
              }}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={isRegistering}
              className={isRegistering ? 'login-mode-active' : ''}
              onClick={() => {
                setMode('register')
                setMessage('')
              }}
            >
              Tạo tài khoản
            </button>
          </div>

          <div className="login-form-heading">
            <p>{isRegistering ? 'THÀNH VIÊN MỚI' : 'CHÀO MỪNG TRỞ LẠI'}</p>
            <h2 id="login-title">{isRegistering ? 'Tạo tài khoản' : 'Đăng nhập'}</h2>
            <span>{isRegistering
              ? 'Điền thông tin để tạo tài khoản GoFan.'
              : 'Nhập thông tin tài khoản của bạn bên dưới.'}</span>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {isRegistering && (
              <>
                <label htmlFor="register-name">Họ và tên</label>
                <div className="login-input-wrap">
                  <input
                    id="register-name"
                    name="fullName"
                    type="text"
                    placeholder="Nguyễn Văn An"
                    autoComplete="name"
                    required
                    onChange={() => setMessage('')}
                  />
                </div>
              </>
            )}

            <label htmlFor="login-email">Email</label>
            <div className="login-input-wrap">
              <Mail size={18} aria-hidden="true" />
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="ban@email.com"
                autoComplete="email"
                required
                onChange={() => setMessage('')}
              />
            </div>

            <div className="login-password-label">
              <label htmlFor="login-password">Mật khẩu</label>
              {!isRegistering && (
                <button
                  className="login-forgot-button"
                  type="button"
                  onClick={() => setMessage('Chức năng đặt lại mật khẩu sẽ khả dụng khi API được kết nối.')}
                >
                  Quên mật khẩu?
                </button>
              )}
            </div>
            <div className="login-input-wrap">
              <LockKeyhole size={18} aria-hidden="true" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Nhập mật khẩu"
                autoComplete={isRegistering ? 'new-password' : 'current-password'}
                minLength={6}
                required
                onChange={() => setMessage('')}
              />
              <button
                className="login-password-toggle"
                type="button"
                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                onClick={() => setShowPassword((isVisible) => !isVisible)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isRegistering ? (
              <label className="login-terms">
                <input type="checkbox" name="acceptTerms" required />
                <span>Tôi đồng ý với điều khoản sử dụng và chính sách bảo mật.</span>
              </label>
            ) : (
              <label className="login-remember">
                <input type="checkbox" name="remember" />
                <span>Ghi nhớ đăng nhập</span>
              </label>
            )}

            {message && <p className="login-message" role="status">{message}</p>}

            <button className="login-submit" type="submit">
              {isRegistering ? 'Tạo tài khoản' : 'Đăng nhập'}
            </button>
          </form>

          <p className="login-security-note">
            <LockKeyhole size={14} /> Biểu mẫu chưa kết nối máy chủ; dữ liệu không được gửi đi
          </p>
        </section>
      </div>
    </main>
  )
}

export default Login