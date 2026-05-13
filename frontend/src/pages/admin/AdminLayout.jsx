import { NavLink, Outlet } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'

const links = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/products', label: 'Products', icon: '👕' },
  { to: '/admin/orders', label: 'Orders', icon: '📦' },
  { to: '/admin/collections', label: 'Collections', icon: '🗂️' },
]

export default function AdminLayout() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Admin top bar */}
      <div style={{ background: 'var(--uw-accent)', padding: '0.4rem 0' }}>
        <Container>
          <p style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '0.85rem', letterSpacing: '0.15em', color: 'var(--uw-black)' }}>
            ⚡ ADMIN PANEL
          </p>
        </Container>
      </div>
      <Container fluid className="px-0">
        <Row className="gx-0">
          {/* Sidebar */}
          <Col md={2} className="admin-sidebar d-none d-md-block">
            <nav>
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </nav>
          </Col>

          {/* Mobile nav */}
          <Col xs={12} className="d-md-none" style={{ background: 'var(--uw-gray)', borderBottom: '1px solid var(--uw-mid-gray)', padding: '0.5rem 0', overflowX: 'auto' }}>
            <div className="d-flex gap-0">
              {links.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  style={({ isActive }) => ({
                    padding: '0.5rem 1rem',
                    color: isActive ? 'var(--uw-accent)' : 'var(--uw-light-gray)',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    borderBottom: isActive ? '2px solid var(--uw-accent)' : '2px solid transparent',
                  })}
                >
                  {link.icon} {link.label}
                </NavLink>
              ))}
            </div>
          </Col>

          {/* Content */}
          <Col md={10} className="p-4">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
