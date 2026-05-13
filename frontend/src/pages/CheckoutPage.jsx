import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { createOrder } from '../services/api'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [address, setAddress] = useState({ street: '', city: '', state: '', zip: '', country: '' })

  const handleChange = e => setAddress(a => ({ ...a, [e.target.name]: e.target.value }))

  const handleOrder = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const items = cart.map(i => ({
        productId: i._id,
        quantity: i.qty,
        size: i.selectedSize,
        color: i.selectedColor,
      }))
      await createOrder({ items, shippingAddress: address, totalPrice: cartTotal })
      clearCart()
      toast.success('Order placed successfully! 🎉')
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const shipping = cartTotal >= 75 ? 0 : 9.99
  const total = cartTotal + shipping

  return (
    <div className="py-5">
      <Container>
        <div className="mb-4">
          <p className="section-label">Final Step</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Checkout</h1>
        </div>

        <Row className="g-4">
          <Col lg={7}>
            <div className="uw-card p-4">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Shipping Address</h4>
              {error && <div className="alert-uw-error p-3 mb-3">{error}</div>}

              <form onSubmit={handleOrder}>
                <div className="mb-3">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.5rem' }}>Street Address</label>
                  <input type="text" name="street" required className="form-control form-control-uw" placeholder="123 Main St" value={address.street} onChange={handleChange} />
                </div>
                <Row className="g-3">
                  <Col md={6}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.5rem' }}>City</label>
                    <input type="text" name="city" required className="form-control form-control-uw" placeholder="New York" value={address.city} onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.5rem' }}>State</label>
                    <input type="text" name="state" required className="form-control form-control-uw" placeholder="NY" value={address.state} onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.5rem' }}>ZIP Code</label>
                    <input type="text" name="zip" required className="form-control form-control-uw" placeholder="10001" value={address.zip} onChange={handleChange} />
                  </Col>
                  <Col md={6}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.5rem' }}>Country</label>
                    <input type="text" name="country" required className="form-control form-control-uw" placeholder="United States" value={address.country} onChange={handleChange} />
                  </Col>
                </Row>

                <button type="submit" className="btn btn-uw-primary w-100 mt-4" disabled={loading} style={{ fontSize: '1.1rem', padding: '0.9rem' }}>
                  {loading ? 'Placing Order...' : `Place Order — $${total.toFixed(2)}`}
                </button>
              </form>
            </div>
          </Col>

          <Col lg={5}>
            <div className="uw-card p-4">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Order Summary</h4>
              {cart.map((item, i) => {
                const price = item.price * (1 - (item.discount || 0) / 100)
                return (
                  <div key={i} className="d-flex justify-content-between mb-2">
                    <span style={{ color: 'var(--uw-light-gray)', fontSize: '0.9rem' }}>
                      {item.name} × {item.qty}<br />
                      <small>{item.selectedSize} / {item.selectedColor}</small>
                    </span>
                    <span style={{ color: 'var(--uw-white)', fontSize: '0.9rem' }}>${(price * item.qty).toFixed(2)}</span>
                  </div>
                )
              })}
              <hr className="uw-divider my-3" />
              <div className="d-flex justify-content-between mb-1">
                <span style={{ color: 'var(--uw-light-gray)' }}>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span style={{ color: 'var(--uw-light-gray)' }}>Shipping</span>
                <span style={{ color: '#7ecfa0' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em', fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--uw-accent)' }}>${total.toFixed(2)}</span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
