import { useEffect, useState } from 'react'
import { getAllOrders } from '../../services/api'
import Loader from '../../components/Loader'

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered']
const STATUS_COLORS = { Pending: '#e8e800', Processing: '#7ec8e3', Shipped: '#7ecfa0', Delivered: '#b0e87e' }

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    getAllOrders()
      .then(res => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <div className="mb-4">
        <p className="section-label">Manage</p>
        <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Orders</h1>
      </div>

      {/* Filter tabs */}
      <div className="d-flex gap-2 flex-wrap mb-4">
        {['All', ...STATUS_OPTIONS].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`btn ${filter === s ? 'btn-uw-primary' : 'btn-uw-dark'}`}
            style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
          >
            {s}
            {s !== 'All' && (
              <span style={{ marginLeft: '0.4rem', opacity: 0.8 }}>
                ({orders.filter(o => o.status === s).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? <Loader /> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table uw-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Shipping To</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--uw-light-gray)' }}>No orders found.</td></tr>
              ) : filtered.map(o => (
                <tr key={o._id}>
                  <td style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', fontWeight: 600 }}>
                    #{o._id.slice(-8).toUpperCase()}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>
                    {o.userId?.name || '—'}<br />
                    <span style={{ color: 'var(--uw-light-gray)', fontSize: '0.75rem' }}>{o.userId?.email || ''}</span>
                  </td>
                  <td style={{ color: 'var(--uw-light-gray)', fontSize: '0.85rem' }}>{o.items?.length} item{o.items?.length !== 1 ? 's' : ''}</td>
                  <td style={{ fontFamily: 'var(--font-display)', color: 'var(--uw-accent)', fontSize: '1.1rem' }}>
                    ${o.totalPrice?.toFixed(2)}
                  </td>
                  <td>
                    <span style={{
                      fontSize: '0.75rem', fontFamily: 'var(--font-display)', letterSpacing: '0.1em',
                      color: STATUS_COLORS[o.status] || 'var(--uw-white)',
                      background: `${STATUS_COLORS[o.status]}22`,
                      padding: '0.3em 0.7em', display: 'inline-block'
                    }}>
                      {o.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--uw-light-gray)' }}>
                    {o.shippingAddress ? `${o.shippingAddress.city}, ${o.shippingAddress.country}` : '—'}
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
  )
}
