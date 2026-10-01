import { useState } from 'react'
import { ArrowRight, Check, Headphones, PackageCheck, RotateCcw, ShieldCheck, Tag } from 'lucide-react'
import './BrandGuarantee.css'

function BrandGuarantee() {
  const [emailOrPhone, setEmailOrPhone] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!emailOrPhone) return
    setSubscribed(true)
    setTimeout(() => {
      setEmailOrPhone('')
      setSubscribed(false)
    }, 4000)
  }

  return (
    <section className="brand-guarantee-section">
      <div className="landing-container">
        {/* VIP Club Discount Box */}
        <div className="vip-club-card">
          <div className="vip-copy">
            <span className="vip-tag">
              <Tag size={15} />
              <span>ƯU ĐÃI ĐỘC QUYỀN THÀNH VIÊN</span>
            </span>
            <h3 className="vip-heading">Nhận Voucher 100.000đ Cho Đơn Hàng Đầu Tiên</h3>
            <p className="vip-desc">
              Gia nhập cộng đồng GoFan để nhận ngay mã giảm giá, cập nhật xu hướng công nghệ làm mát
              và đặc quyền tham gia chương trình bảo dưỡng định kỳ miễn phí.
            </p>

            <form onSubmit={handleSubmit} className="vip-form">
              <input
                type="text"
                placeholder="Nhập email hoặc số điện thoại của bạn..."
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                required
                className="vip-input"
              />
              <button type="submit" className="vip-submit-btn">
                {subscribed ? (
                  <>
                    <Check size={18} />
                    <span>Đã nhận voucher!</span>
                  </>
                ) : (
                  <>
                    <span>Đăng ký ngay</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
            {subscribed && (
              <p className="vip-success-note">
                🎉 Chúc mừng bạn! Mã giảm giá GOFAN100K đã được ghi nhận vào tài khoản.
              </p>
            )}
          </div>
        </div>

        {/* 4 Guarantees Grid */}
        <div className="guarantees-grid">
          <div className="guarantee-item">
            <div className="guarantee-icon"><ShieldCheck size={28} /></div>
            <div>
              <strong>100% Hàng Chính Hãng</strong>
              <span>Bảo hành điện tử chính hãng lên đến 36 tháng</span>
            </div>
          </div>

          <div className="guarantee-item">
            <div className="guarantee-icon"><PackageCheck size={28} /></div>
            <div>
              <strong>Lắp Đặt Tại Nhà</strong>
              <span>Đội ngũ kỹ thuật viên tận tâm tại HN & TP.HCM</span>
            </div>
          </div>

          <div className="guarantee-item">
            <div className="guarantee-icon"><RotateCcw size={28} /></div>
            <div>
              <strong>30 Ngày Đổi Mới</strong>
              <span>Đổi mới 1:1 nếu sản phẩm phát sinh lỗi kỹ thuật</span>
            </div>
          </div>

          <div className="guarantee-item">
            <div className="guarantee-icon"><Headphones size={28} /></div>
            <div>
              <strong>Hỗ Trợ 24/7</strong>
              <span>Tổng đài 1900 6868 luôn sẵn sàng lắng nghe</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandGuarantee
