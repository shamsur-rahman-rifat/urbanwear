import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { getProducts, getCollections } from '../services/api'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

const CATEGORIES = [
  { name: 'Men', emoji: '👔', img: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&q=80' },
  { name: 'Women', emoji: '👗', img: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&q=80' },
  { name: 'Streetwear', emoji: '🧢', img: 'https://images.unsplash.com/photo-1588117260148-b47818741c74?w=400&q=80' },
  { name: 'Accessories', emoji: '🕶️', img: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80' },
]

export default function HomePage() {
  const [products, setProducts] = useState([])
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, cRes] = await Promise.all([getProducts(), getCollections()])
        setProducts(pRes.data.slice(0, 8))
        setCollections(cRes.data.slice(0, 3))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="hero-section">
        {/* Decorative grid lines */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
            pointerEvents: 'none',
          }}
        />

        <Container style={{ position: 'relative', zIndex: 1 }}>
          <Row className="align-items-center gy-5">

            {/* ── Text column ── */}
            <Col lg={7}>
              <p className="section-label fade-up fade-up-1">
                New Season — SS 2025
              </p>

              <h1
                className="page-title fade-up fade-up-2"
                style={{ color: 'var(--uw-white)' }}
              >
                DEFINE<br />YOUR<br />
                <span style={{
                  color: 'var(--uw-accent)',
                  textShadow: '0 0 40px rgba(232,255,0,0.3)',
                }}>
                  STYLE.
                </span>
              </h1>

              <p
                className="fade-up fade-up-3"
                style={{
                  color: 'var(--uw-light-gray)',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  maxWidth: 480,
                  marginTop: '1.8rem',
                  marginBottom: '0',
                }}
              >
                Bold streetwear. Timeless silhouettes. Clothes that move
                with you — and make you stand out.
              </p>

              {/* ── CTA buttons ── */}
              <div
                className="fade-up fade-up-3"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  marginTop: '2.5rem',
                  position: 'relative',   /* keep stacking context clean */
                  zIndex: 2,
                }}
              >
                <Link
                  to="/products"
                  className="btn btn-uw-primary"
                  style={{ minWidth: 160 }}
                >
                  Shop Now
                </Link>
                <Link
                  to="/collections"
                  className="btn btn-uw-outline"
                  style={{ minWidth: 160 }}
                >
                  Collections
                </Link>
              </div>

              {/* ── Social proof micro strip ── */}
              <div
                className="fade-up fade-up-3"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.4rem',
                  marginTop: '2.8rem',
                  flexWrap: 'wrap',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {/* Avatar stack */}
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      style={{
                        width: 32, height: 32,
                        borderRadius: '50%',
                        background: `hsl(${i * 40}, 20%, 30%)`,
                        border: '2px solid var(--uw-black)',
                        marginLeft: i > 1 ? -10 : 0,
                      }}
                    />
                  ))}
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: 'var(--uw-light-gray)',
                      marginLeft: '0.4rem',
                    }}
                  >
                    50k+ customers
                  </span>
                </div>
                <div
                  style={{
                    width: 1,
                    height: 20,
                    background: 'var(--uw-mid-gray)',
                  }}
                />
                <span
                  style={{
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: 'var(--uw-light-gray)',
                  }}
                >
                  ★ 4.9 / 5.0 rating
                </span>
              </div>
            </Col>

            {/* ── Image column ── */}
            <Col lg={5} className="d-none d-lg-flex justify-content-end">
              <div style={{ position: 'relative' }}>
                {/* Main image */}
                <img
                  src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&q=80"
                  alt="Hero model"
                  style={{
                    width: 380,
                    height: 520,
                    objectFit: 'cover',
                    display: 'block',
                    border: '1px solid var(--uw-mid-gray)',
                  }}
                />

                {/* Accent corner line */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    top: -12, right: -12,
                    width: 100, height: 100,
                    border: '2px solid var(--uw-accent)',
                    borderBottom: 'none',
                    borderLeft: 'none',
                    pointerEvents: 'none',
                  }}
                />

                {/* Floating badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: -18,
                    left: -24,
                    background: 'var(--uw-accent)',
                    color: 'var(--uw-black)',
                    padding: '1rem 1.5rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.05rem',
                    letterSpacing: '0.08em',
                    lineHeight: 1.3,
                    boxShadow: '0 8px 24px rgba(232,255,0,0.25)',
                    zIndex: 2,
                  }}
                >
                  FREE SHIPPING
                  <br />
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontFamily: 'var(--font-body)',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}
                  >
                    on orders over $75
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-5" style={{ background: 'var(--uw-gray)' }}>
        <Container>
          <div className="text-center mb-4">
            <p className="section-label">Browse By</p>
            <h2 className="page-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Categories</h2>
          </div>
          <Row className="g-3">
            {CATEGORIES.map(cat => (
              <Col key={cat.name} xs={6} md={3}>
                <div
                  className="uw-card"
                  style={{ cursor: 'pointer', overflow: 'hidden' }}
                  onClick={() => navigate(`/products?category=${cat.name}`)}
                >
                  <div style={{ aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
                    <img src={cat.img} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }} />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                      display: 'flex', alignItems: 'flex-end', padding: '1rem'
                    }}>
                      <h5 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--uw-white)', letterSpacing: '0.1em', margin: 0 }}>
                        {cat.name}
                      </h5>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Trending Products */}
      <section className="py-5">
        <Container>
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <p className="section-label">Hot Right Now</p>
              <h2 className="page-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Trending</h2>
            </div>
            <Link to="/products" className="btn btn-uw-outline" style={{ fontSize: '0.8rem' }}>View All →</Link>
          </div>
          {loading ? (
            <Loader message="Loading products..." />
          ) : products.length === 0 ? (
            <div className="text-center py-5">
              <p style={{ color: 'var(--uw-light-gray)' }}>No products available yet.</p>
              <Link to="/admin/products/new" className="btn btn-uw-primary mt-3">Add Products (Admin)</Link>
            </div>
          ) : (
            <Row className="g-3">
              {products.map(p => (
                <Col key={p._id} xs={6} md={4} lg={3}>
                  <ProductCard product={p} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Promo Banner */}
      <section style={{ background: 'var(--uw-accent)', padding: '3rem 0' }}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--uw-black)', letterSpacing: '0.05em' }}>
                SEASONAL CLEARANCE — UP TO 50% OFF
              </h2>
              <p style={{ color: '#333', fontSize: '1rem', marginTop: '0.5rem' }}>
                Limited time. Limited stock. Don't sleep on it.
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Link to="/products" className="btn" style={{
                background: 'var(--uw-black)', color: 'var(--uw-white)',
                fontFamily: 'var(--font-display)', letterSpacing: '0.1em', fontSize: '1rem', padding: '0.8rem 2rem', borderRadius: 0
              }}>Shop Sale</Link>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Collections */}
      {collections.length > 0 && (
        <section className="py-5" style={{ background: 'var(--uw-gray)' }}>
          <Container>
            <div className="text-center mb-4">
              <p className="section-label">Curated For You</p>
              <h2 className="page-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>Collections</h2>
            </div>
            <Row className="g-3">
              {collections.map(col => (
                <Col key={col._id} md={4}>
                  <div className="uw-card p-4" style={{ minHeight: 180 }}>
                    <span className="section-label">{col.season}</span>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginTop: '0.5rem', color: 'var(--uw-white)' }}>{col.name}</h4>
                    <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                      {col.products?.length || 0} pieces
                    </p>
                    <Link to="/collections" className="btn btn-uw-outline mt-3" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}>
                      Explore →
                    </Link>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </div>
  )
}
