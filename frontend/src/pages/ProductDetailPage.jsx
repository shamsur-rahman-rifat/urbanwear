import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { getProductById } from '../services/api'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImg, setSelectedImg] = useState(0)
  const [selectedSize, setSelectedSize] = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)
  const [qty, setQty] = useState(1)
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    getProductById(id)
      .then(res => {
        setProduct(res.data)
        // Pre-select first variant
        if (res.data.variants?.length > 0) {
          setSelectedSize(res.data.variants[0].size)
          setSelectedColor(res.data.variants[0].color)
        }
      })
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="py-5"><Loader /></div>
  if (!product) return (
    <Container className="py-5 text-center">
      <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--uw-white)' }}>Product Not Found</h2>
      <Link to="/products" className="btn btn-uw-primary mt-3">Back to Shop</Link>
    </Container>
  )

  const sizes = [...new Set(product.variants?.map(v => v.size) || [])]
  const colors = [...new Set(product.variants?.map(v => v.color) || [])]
  const discounted = product.price * (1 - (product.discount || 0) / 100)
  const images = product.images?.length > 0 ? product.images : [PLACEHOLDER]

  const getStock = () => {
    const v = product.variants?.find(v => v.size === selectedSize && v.color === selectedColor)
    return v?.stock ?? 0
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return }
    if (!selectedSize) { toast.error('Please select a size'); return }
    if (!selectedColor) { toast.error('Please select a color'); return }
    if (getStock() === 0) { toast.error('Out of stock'); return }
    addToCart(product, selectedSize, selectedColor, qty)
    toast.success('Added to cart!')
  }

  return (
    <div className="py-5">
      <Container>
        {/* Breadcrumb */}
        <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.85rem', marginBottom: '2rem' }}>
          <Link to="/" style={{ color: 'var(--uw-light-gray)', textDecoration: 'none' }}>Home</Link>
          {' / '}
          <Link to="/products" style={{ color: 'var(--uw-light-gray)', textDecoration: 'none' }}>Shop</Link>
          {' / '}
          <span style={{ color: 'var(--uw-white)' }}>{product.name}</span>
        </p>

        <Row className="g-5">
          {/* Images */}
          <Col lg={6}>
            <div style={{ position: 'sticky', top: 80 }}>
              <div style={{ aspectRatio: '3/4', overflow: 'hidden', marginBottom: '1rem', border: '1px solid var(--uw-mid-gray)' }}>
                <img
                  src={images[selectedImg]}
                  alt={product.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={e => { e.target.src = PLACEHOLDER }}
                />
              </div>
              {images.length > 1 && (
                <div className="d-flex gap-2">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setSelectedImg(i)}
                      style={{
                        width: 80, height: 80, overflow: 'hidden', cursor: 'pointer',
                        border: selectedImg === i ? '2px solid var(--uw-accent)' : '1px solid var(--uw-mid-gray)'
                      }}
                    >
                      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={e => { e.target.src = PLACEHOLDER }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {/* Info */}
          <Col lg={6}>
            <p className="section-label">{product.category}</p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', color: 'var(--uw-white)', letterSpacing: '0.05em', lineHeight: 1.1, marginTop: '0.5rem' }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="d-flex align-items-center gap-3 my-3">
              {product.discount > 0 ? (
                <>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--uw-accent)' }}>
                    ${discounted.toFixed(2)}
                  </span>
                  <span style={{ fontSize: '1.2rem', color: 'var(--uw-light-gray)', textDecoration: 'line-through' }}>
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="badge-uw-red">-{product.discount}% OFF</span>
                </>
              ) : (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', color: 'var(--uw-white)' }}>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>

            <hr className="uw-divider my-3" />

            {/* Description */}
            <p style={{ color: 'var(--uw-light-gray)', lineHeight: 1.8, fontSize: '0.95rem' }}>{product.description}</p>

            <hr className="uw-divider my-3" />

            {/* Color */}
            {colors.length > 0 && (
              <div className="mb-4">
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Color: <span style={{ color: 'var(--uw-accent)' }}>{selectedColor}</span>
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  {colors.map(c => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      title={c}
                      className={`color-dot ${selectedColor === c ? 'active' : ''}`}
                      style={{ background: c.toLowerCase(), width: 32, height: 32, border: 'none', cursor: 'pointer' }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {sizes.length > 0 && (
              <div className="mb-4">
                <p style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
                  Size: <span style={{ color: 'var(--uw-accent)' }}>{selectedSize}</span>
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  {sizes.map(s => (
                    <button key={s} className={`size-btn ${selectedSize === s ? 'active' : ''}`} onClick={() => setSelectedSize(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock */}
            <div className="mb-4">
              {getStock() > 0 ? (
                <span style={{ color: '#7ecfa0', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✓ In Stock ({getStock()} left)
                </span>
              ) : (
                <span style={{ color: 'var(--uw-red)', fontSize: '0.85rem', fontWeight: 600 }}>
                  ✗ Out of Stock
                </span>
              )}
            </div>

            {/* Quantity + Add to Cart */}
            <div className="d-flex gap-3 align-items-center mb-4">
              <div className="d-flex align-items-center" style={{ border: '1px solid var(--uw-mid-gray)', background: 'var(--uw-gray)' }}>
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  style={{ background: 'none', border: 'none', color: 'var(--uw-white)', width: 40, height: 48, fontSize: '1.2rem', cursor: 'pointer' }}
                >−</button>
                <span style={{ width: 40, textAlign: 'center', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>{qty}</span>
                <button
                  onClick={() => setQty(q => Math.min(getStock(), q + 1))}
                  style={{ background: 'none', border: 'none', color: 'var(--uw-white)', width: 40, height: 48, fontSize: '1.2rem', cursor: 'pointer' }}
                >+</button>
              </div>
              <button className="btn btn-uw-primary flex-fill" onClick={handleAddToCart} style={{ height: 48, fontSize: '1rem' }}>
                Add to Cart
              </button>
            </div>

            {/* Tags */}
            <div className="d-flex gap-2 flex-wrap">
              <span className="badge-uw">{product.category}</span>
              {product.variants?.length > 0 && <span className="badge-uw">{product.variants.length} Variants</span>}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
