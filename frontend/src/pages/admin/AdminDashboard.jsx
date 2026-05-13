import { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { getProducts, getAllOrders, getCollections } from '../../services/api'
import Loader from '../../components/Loader'
import { Link } from 'react-router-dom'

const STATUS_COLORS = { Pending: '#e8e800', Processing: '#7ec8e3', Shipped: '#7ecfa0', Delivered: '#b0e87e' }

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getProducts(), getAllOrders(), getCollections()])
      .then(([p, o, c]) => {
        setProducts(p.data)
        setOrders(o.data)
        setCollections(c.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loader />

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0)
  const totalStock = products.reduce((acc, p) => acc + (p.variants?.reduce((a, v) => a + v.stock, 0) || 0), 0)

  const stats = [
    { label: 'Products', value: products.length, icon: '👕', link: '/admin/products' },
    { label: 'Orders', value: orders.length, icon: '📦', link: '/admin/orders' },
    { label: 'Revenue', value: `$${totalRevenue.toFixed(0)}`, icon: '💰', link: '/admin/orders' },
    { label: 'Total Stock', value: totalStock, icon: '📊', link: '/admin/products' },
  ]

  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1
    return acc
  }, {})

  return (
    <div>
      <div className="mb-4">
        <p className="section-label">Overview</p>
        <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>Dashboard</h1>
      </div>

      {/* Stats */}
      <Row className="g-3 mb-4">
        {stats.map(s => (
          <Col key={s.label} xs={6} lg={3}>
            <Link to={s.link} style={{ textDecoration: 'none' }}>
              <div className="stat-card">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="stat-label">{s.label}</p>
                    <p className="stat-value mt-1">{s.value}</p>
                  </div>
                  <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                </div>
              </div>
            </Link>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        {/* Recent Orders */}
        <Col lg={7}>
          <div className="uw-card p-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em', margin: 0 }}>Recent Orders</h5>
              <Link to="/admin/orders" style={{ color: 'var(--uw-accent)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>View All →</Link>
            </div>
            {orders.length === 0 ? (
              <p style={{ color: 'var(--uw-light-gray)', textAlign: 'center', padding: '2rem 0' }}>No orders yet.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table className="table uw-table mb-0">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 6).map(o => (
                      <tr key={o._id}>
                        <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem' }}>#{o._id.slice(-8).toUpperCase()}</td>
                        <td style={{ color: 'var(--uw-accent)', fontFamily: 'var(--font-display)' }}>${o.totalPrice?.toFixed(2)}</td>
                        <td>
                          <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em', color: STATUS_COLORS[o.status] || '#fff' }}>
                            {o.status}
                          </span>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--uw-light-gray)' }}>
                          {new Date(o.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Col>

        {/* Order status breakdown */}
        <Col lg={5}>
          <div className="uw-card p-3 mb-3">
            <h5 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em', marginBottom: '1rem' }}>Order Status</h5>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: STATUS_COLORS[status] || '#fff', letterSpacing: '0.08em' }}>{status}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--uw-light-gray)' }}>{count}</span>
                </div>
                <div style={{ height: 6, background: 'var(--uw-mid-gray)', borderRadius: 3 }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    background: STATUS_COLORS[status] || 'var(--uw-accent)',
                    width: `${(count / orders.length) * 100}%`
                  }} />
                </div>
              </div>
            ))}
            {Object.keys(statusCounts).length === 0 && (
              <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.9rem' }}>No orders yet.</p>
            )}
          </div>

          <div className="uw-card p-3">
            <h5 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em', marginBottom: '1rem' }}>Quick Actions</h5>
            <div className="d-flex flex-column gap-2">
              <Link to="/admin/products/new" className="btn btn-uw-primary" style={{ fontSize: '0.85rem' }}>+ Add New Product</Link>
              <Link to="/admin/collections/new" className="btn btn-uw-dark" style={{ fontSize: '0.85rem' }}>+ Create Collection</Link>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  )
}
