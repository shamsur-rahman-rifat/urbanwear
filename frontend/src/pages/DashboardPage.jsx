import { useEffect, useState } from 'react'
import { Container, Row, Col, Tab, Nav } from 'react-bootstrap'
import { getMyOrders } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered']

export default function DashboardPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="py-5">
      <Container>
        <div className="mb-4">
          <p className="section-label">My Account</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Hey, {user?.name?.split(' ')[0]}
          </h1>
        </div>

        <Tab.Container defaultActiveKey="orders">
          <Row className="g-4">
            <Col md={3}>
              <div className="filter-sidebar p-0" style={{ overflow: 'hidden' }}>
                <Nav className="flex-column">
                  {[['orders', '📦 Orders'], ['profile', '👤 Profile']].map(([key, label]) => (
                    <Nav.Item key={key}>
                      <Nav.Link eventKey={key} style={{
                        color: 'var(--uw-light-gray)',
                        fontFamily: 'var(--font-body)',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '0.9rem 1.5rem',
                        borderLeft: '3px solid transparent',
                        transition: 'all 0.2s',
                      }}
                        className="dashboard-nav-link"
                      >
                        {label}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </div>
            </Col>

            <Col md={9}>
              <Tab.Content>
                {/* Orders Tab */}
                <Tab.Pane eventKey="orders">
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
                    Order History
                  </h4>
                  {loading ? (
                    <Loader />
                  ) : orders.length === 0 ? (
                    <div className="uw-card p-5 text-center">
                      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--uw-light-gray)', letterSpacing: '0.1em' }}>
                        NO ORDERS YET
                      </p>
                      <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.9rem' }}>Start shopping to see your orders here.</p>
                    </div>
                  ) : (
                    <div className="d-flex flex-column gap-3">
                      {orders.map(order => (
                        <div key={order._id} className="uw-card p-4">
                          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                            <div>
                              <p style={{ fontSize: '0.75rem', color: 'var(--uw-light-gray)', fontFamily: 'var(--font-body)', marginBottom: '0.2rem' }}>
                                Order ID
                              </p>
                              <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', color: 'var(--uw-white)' }}>
                                #{order._id.slice(-8).toUpperCase()}
                              </p>
                            </div>
                            <span className={`badge status-${order.status}`} style={{ borderRadius: 0, fontSize: '0.75rem', padding: '0.4em 0.8em', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>
                              {order.status}
                            </span>
                          </div>

                          {/* Progress bar */}
                          <div className="mb-3">
                            <div className="d-flex justify-content-between mb-1">
                              {STATUS_STEPS.map(step => (
                                <span key={step} style={{
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  letterSpacing: '0.1em',
                                  textTransform: 'uppercase',
                                  color: STATUS_STEPS.indexOf(step) <= STATUS_STEPS.indexOf(order.status)
                                    ? 'var(--uw-accent)' : 'var(--uw-mid-gray)'
                                }}>
                                  {step}
                                </span>
                              ))}
                            </div>
                            <div style={{ height: 4, background: 'var(--uw-mid-gray)', borderRadius: 2 }}>
                              <div style={{
                                height: '100%',
                                background: 'var(--uw-accent)',
                                borderRadius: 2,
                                width: `${((STATUS_STEPS.indexOf(order.status) + 1) / STATUS_STEPS.length) * 100}%`,
                                transition: 'width 0.4s ease'
                              }} />
                            </div>
                          </div>

                          <div className="d-flex justify-content-between flex-wrap gap-2">
                            <div>
                              <p style={{ fontSize: '0.8rem', color: 'var(--uw-light-gray)', marginBottom: '0.2rem' }}>
                                {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                              </p>
                              <p style={{ fontSize: '0.8rem', color: 'var(--uw-light-gray)' }}>
                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--uw-accent)' }}>
                              ${order.totalPrice?.toFixed(2)}
                            </span>
                          </div>

                          {/* Shipping address */}
                          {order.shippingAddress && (
                            <div className="mt-2 pt-2" style={{ borderTop: '1px solid var(--uw-mid-gray)' }}>
                              <p style={{ fontSize: '0.75rem', color: 'var(--uw-light-gray)' }}>
                                📍 {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}, {order.shippingAddress.country}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </Tab.Pane>

                {/* Profile Tab */}
                <Tab.Pane eventKey="profile">
                  <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem', letterSpacing: '0.1em' }}>
                    Profile Info
                  </h4>
                  <div className="uw-card p-4">
                    {[['Name', user?.name], ['Email', user?.email], ['Role', user?.role?.toUpperCase()]].map(([label, val]) => (
                      <div key={label} className="d-flex justify-content-between py-2" style={{ borderBottom: '1px solid var(--uw-mid-gray)' }}>
                        <span style={{ color: 'var(--uw-light-gray)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
                        <span style={{ color: 'var(--uw-white)', fontSize: '0.9rem' }}>{val}</span>
                      </div>
                    ))}
                    <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.8rem', marginTop: '1rem' }}>
                      Profile editing coming soon via PUT /api/users/profile
                    </p>
                  </div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>
  )
}
