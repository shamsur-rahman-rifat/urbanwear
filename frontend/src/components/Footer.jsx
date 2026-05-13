import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

const SHOP_LINKS = ['Men', 'Women', 'Streetwear', 'Accessories']
const ACCOUNT_LINKS = [
  ['My Orders', '/dashboard'],
  ['Wishlist', '/wishlist'],
  ['Login', '/login'],
  ['Register', '/register'],
]
const SOCIAL = [
  { label: 'IG', href: '#' },
  { label: 'TW', href: '#' },
  { label: 'TK', href: '#' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!email) return
    setSubscribed(true)
    setEmail('')
  }

  return (
    <footer className="uw-footer">
      <Container>

        {/* ── Top band: brand + social ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.2rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid var(--uw-mid-gray)',
            marginBottom: '3rem',
          }}
        >
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
                letterSpacing: '0.08em',
                color: 'var(--uw-white)',
                margin: 0,
                lineHeight: 1,
              }}
            >
              URBAN<span className="text-accent">WEAR</span>
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.75rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                color: 'var(--uw-light-gray)',
                margin: '0.4rem 0 0',
              }}
            >
              Redefine Your Streets
            </p>
          </Link>

          {/* Social pills */}
          <div className="d-flex gap-2">
            {SOCIAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 44,
                  height: 44,
                  background: 'var(--uw-gray)',
                  border: '1px solid var(--uw-mid-gray)',
                  color: 'var(--uw-light-gray)',
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05em',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = 'var(--uw-accent)'
                  e.currentTarget.style.color = 'var(--uw-accent)'
                  e.currentTarget.style.boxShadow = '0 0 14px rgba(232,255,0,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--uw-mid-gray)'
                  e.currentTarget.style.color = 'var(--uw-light-gray)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </div>

        {/* ── Main columns ── */}
        <Row className="gy-5 mb-5">

          {/* Col 1 — About */}
          <Col md={4}>
            <span className="section-label">About</span>
            <p
              style={{
                color: 'var(--uw-light-gray)',
                fontSize: '0.92rem',
                lineHeight: 1.9,
                maxWidth: 320,
              }}
            >
              Bold fashion for the streets. Trend-driven collections built for those who refuse to blend in.
              No compromises — just style.
            </p>

            {/* Mini stat strip */}
            <div className="d-flex gap-4 mt-3">
              {[['200+', 'Styles'], ['50k+', 'Customers'], ['4.9★', 'Rated']].map(([val, lbl]) => (
                <div key={lbl}>
                  <p
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.4rem',
                      color: 'var(--uw-accent)',
                      margin: 0,
                      lineHeight: 1,
                    }}
                  >
                    {val}
                  </p>
                  <p
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--uw-light-gray)',
                      margin: '0.2rem 0 0',
                    }}
                  >
                    {lbl}
                  </p>
                </div>
              ))}
            </div>
          </Col>

          {/* Col 2 — Shop */}
          <Col xs={6} md={2}>
            <span className="section-label">Shop</span>
            {SHOP_LINKS.map(cat => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                className="uw-footer-link"
              >
                {cat}
              </Link>
            ))}
            <Link to="/products" className="uw-footer-link">All Products</Link>
            <Link to="/collections" className="uw-footer-link">Collections</Link>
          </Col>

          {/* Col 3 — Account */}
          <Col xs={6} md={2}>
            <span className="section-label">Account</span>
            {ACCOUNT_LINKS.map(([label, path]) => (
              <Link key={label} to={path} className="uw-footer-link">
                {label}
              </Link>
            ))}
          </Col>

          {/* Col 4 — Newsletter */}
          <Col md={4}>
            <span className="section-label">Drop Alerts</span>
            <p
              style={{
                color: 'var(--uw-light-gray)',
                fontSize: '0.92rem',
                lineHeight: 1.7,
                marginBottom: '1.4rem',
              }}
            >
              First access to new drops, exclusive deals, and members-only offers.
            </p>

            {subscribed ? (
              <div
                style={{
                  background: 'rgba(232,255,0,0.08)',
                  border: '1px solid rgba(232,255,0,0.25)',
                  padding: '1rem 1.2rem',
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.1rem',
                  letterSpacing: '0.08em',
                  color: 'var(--uw-accent)',
                }}
              >
                ✓ You're on the list.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex' }}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="form-control form-control-uw"
                  style={{
                    borderRight: 'none',
                    flex: 1,
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  className="btn btn-uw-primary"
                  style={{
                    whiteSpace: 'nowrap',
                    fontSize: '0.85rem',
                    padding: '0 1.4rem',
                    flexShrink: 0,
                  }}
                >
                  Join
                </button>
              </form>
            )}

            {/* Trust badges */}
            <div className="d-flex gap-3 mt-3 flex-wrap">
              {['Free Returns', 'Secure Pay', 'Fast Ship'].map(badge => (
                <span
                  key={badge}
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--uw-light-gray)',
                    borderLeft: '2px solid var(--uw-mid-gray)',
                    paddingLeft: '0.5rem',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </Col>
        </Row>

        {/* ── Bottom bar ── */}
        <div
          style={{
            borderTop: '1px solid var(--uw-mid-gray)',
            paddingTop: '1.8rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.8rem',
          }}
        >
          <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.8rem', margin: 0 }}>
            © {new Date().getFullYear()} UrbanWear. All rights reserved.
          </p>
          <div className="d-flex gap-3">
            {['Privacy Policy', 'Terms', 'Cookies'].map(item => (
              <a
                key={item}
                href="#"
                style={{
                  color: 'var(--uw-light-gray)',
                  fontSize: '0.8rem',
                  textDecoration: 'none',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--uw-accent)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--uw-light-gray)'}
              >
                {item}
              </a>
            ))}
          </div>
          <p style={{ color: 'var(--uw-mid-gray)', fontSize: '0.78rem', margin: 0 }}>
            Built with MERN Stack
          </p>
        </div>
      </Container>
    </footer>
  )
}
