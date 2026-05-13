import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=200&q=80'

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout')
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', color: 'var(--uw-white)', letterSpacing: '0.05em' }}>YOUR CART IS EMPTY</h1>
        <p style={{ color: 'var(--uw-light-gray)', marginTop: '1rem', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-uw-primary" style={{ fontSize: '1rem' }}>Start Shopping</Link>
      </Container>
    )
  }

  return (
    <div className="py-5">
      <Container>
        <div className="d-flex justify-content-between align-items-end mb-4">
          <div>
            <p className="section-label">Review</p>
            <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Your Cart</h1>
          </div>
          <button
            onClick={() => { clearCart(); toast.success('Cart cleared') }}
            style={{ background: 'none', border: 'none', color: 'var(--uw-red)', fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
          >
            Clear Cart
          </button>
        </div>

        <Row className="g-4">
          <Col lg={8}>
            {cart.map((item, i) => {
              const discounted = item.price * (1 - (item.discount || 0) / 100)
              return (
                <div key={`${item._id}-${item.selectedSize}-${item.selectedColor}-${i}`}
                  className="uw-card p-3 mb-3"
                  style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}
                >
                  <img
                    src={item.images?.[0] || PLACEHOLDER}
                    alt={item.name}
                    onError={e => { e.target.src = PLACEHOLDER }}
                    style={{ width: 90, height: 110, objectFit: 'cover', flexShrink: 0 }}
                  />
                  <div className="flex-fill">
                    <Link to={`/products/${item._id}`} style={{ textDecoration: 'none' }}>
                      <h6 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--uw-white)', marginBottom: '0.25rem' }}>
                        {item.name}
                      </h6>
                    </Link>
                    <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                      Size: <b>{item.selectedSize}</b> &nbsp;|&nbsp; Color: <b>{item.selectedColor}</b>
                    </p>
                    <div className="d-flex align-items-center gap-3 flex-wrap">
                      {/* Qty controls */}
                      <div className="d-flex align-items-center" style={{ border: '1px solid var(--uw-mid-gray)', background: 'var(--uw-black)' }}>
                        <button
                          onClick={() => updateQty(item._id, item.selectedSize, item.selectedColor, item.qty - 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--uw-white)', width: 32, height: 36, cursor: 'pointer', fontSize: '1rem' }}
                        >−</button>
                        <span style={{ width: 32, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1rem' }}>{item.qty}</span>
                        <button
                          onClick={() => updateQty(item._id, item.selectedSize, item.selectedColor, item.qty + 1)}
                          style={{ background: 'none', border: 'none', color: 'var(--uw-white)', width: 32, height: 36, cursor: 'pointer', fontSize: '1rem' }}
                        >+</button>
                      </div>
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--uw-accent)' }}>
                        ${(discounted * item.qty).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => { removeFromCart(item._id, item.selectedSize, item.selectedColor); toast.success('Removed') }}
                    style={{ background: 'none', border: 'none', color: 'var(--uw-red)', fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem' }}
                  >✕</button>
                </div>
              )
            })}
          </Col>

          {/* Order summary */}
          <Col lg={4}>
            <div className="uw-card p-4" style={{ position: 'sticky', top: 80 }}>
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--uw-light-gray)' }}>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span style={{ color: 'var(--uw-light-gray)' }}>Shipping</span>
                <span style={{ color: '#7ecfa0' }}>{cartTotal >= 75 ? 'FREE' : '$9.99'}</span>
              </div>
              {cartTotal < 75 && (
                <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
                  Add ${(75 - cartTotal).toFixed(2)} more for free shipping
                </p>
              )}
              <hr className="uw-divider my-3" />
              <div className="d-flex justify-content-between mb-3">
                <span style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em', fontSize: '1.1rem' }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--uw-accent)' }}>
                  ${(cartTotal + (cartTotal >= 75 ? 0 : 9.99)).toFixed(2)}
                </span>
              </div>
              <button className="btn btn-uw-primary w-100" onClick={handleCheckout} style={{ fontSize: '1rem', padding: '0.8rem' }}>
                Proceed to Checkout
              </button>
              <Link to="/products" className="btn btn-uw-outline w-100 mt-2" style={{ fontSize: '0.9rem' }}>
                Continue Shopping
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
