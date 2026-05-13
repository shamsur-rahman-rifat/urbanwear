import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Navbar, Nav, Container, Dropdown } from 'react-bootstrap'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const NAV_LINKS = [
  { label: 'Shop', to: '/products' },
  { label: 'Collections', to: '/collections' },
  { label: 'Men', to: '/products?category=Men' },
  { label: 'Women', to: '/products?category=Women' },
  { label: 'Streetwear', to: '/products?category=Streetwear' },
]

export default function AppNavbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar className="uw-navbar sticky-top" expand="lg">
      <Container>

        {/* ── Brand ── */}
        <Navbar.Brand as={Link} to="/" style={{ position: 'relative' }}>
          URBAN<span className="text-accent">WEAR</span>
        </Navbar.Brand>

        {/* ── Mobile toggle ── */}
        <Navbar.Toggle aria-controls="nav-main" className="navbar-toggler" />

        <Navbar.Collapse id="nav-main">

          {/* ── Centre links ── */}
          <Nav className="mx-auto align-items-lg-center gap-lg-1">
            {NAV_LINKS.map(({ label, to }) => (
              <Nav.Link
                key={label}
                as={NavLink}
                to={to}
                end={to === '/products'}
              >
                {label}
              </Nav.Link>
            ))}
          </Nav>

          {/* ── Right side: cart + user ── */}
          <Nav className="align-items-lg-center gap-2 mt-3 mt-lg-0">

            {/* Cart icon */}
            <Nav.Link
              as={Link}
              to="/cart"
              style={{ position: 'relative', padding: '0.4rem 0.6rem' }}
              aria-label="Cart"
            >
              <svg
                width="22" height="22" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ display: 'block', color: 'var(--uw-white)' }}
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Nav.Link>

            {/* ── Authenticated: user dropdown ── */}
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  as="button"
                  className="uw-user-btn"
                  id="user-menu-toggle"
                >
                  <span className="user-dot" />
                  {user.name.split(' ')[0]}
                </Dropdown.Toggle>

                <Dropdown.Menu className="uw-user-menu" renderOnMount>
                  {/* Header info */}
                  <div style={{
                    padding: '0.6rem 1.2rem 1rem',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                    marginBottom: '0.4rem',
                  }}>
                    <p style={{
                      fontFamily: 'var(--font-body)',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      color: 'var(--uw-white)',
                      margin: 0,
                      lineHeight: 1.3,
                    }}>
                      {user.name}
                    </p>
                    <p style={{
                      fontSize: '0.75rem',
                      color: 'var(--uw-light-gray)',
                      margin: 0,
                      marginTop: '0.2rem',
                    }}>
                      {user.email}
                    </p>
                  </div>

                  <Dropdown.Item as={Link} to="/dashboard" className="dropdown-item">
                    <span style={{ marginRight: '0.6rem', opacity: 0.6 }}>📦</span> My Orders
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/wishlist" className="dropdown-item">
                    <span style={{ marginRight: '0.6rem', opacity: 0.6 }}>♡</span> Wishlist
                  </Dropdown.Item>

                  {isAdmin && (
                    <>
                      <Dropdown.Divider className="dropdown-divider" />
                      <Dropdown.Item as={Link} to="/admin" className="dropdown-item admin-link">
                        <span style={{ marginRight: '0.6rem' }}>⚡</span> Admin Panel
                      </Dropdown.Item>
                    </>
                  )}

                  <Dropdown.Divider className="dropdown-divider" />
                  <Dropdown.Item
                    onClick={handleLogout}
                    className="dropdown-item logout-link"
                    style={{ cursor: 'pointer' }}
                  >
                    <span style={{ marginRight: '0.6rem', opacity: 0.7 }}>→</span> Sign Out
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              /* ── Guest: login button ── */
              <Link
                to="/login"
                className="btn btn-uw-primary"
                style={{ fontSize: '0.9rem', padding: '0.55rem 1.4rem' }}
              >
                Login
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
