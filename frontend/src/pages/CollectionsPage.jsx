import { useEffect, useState } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import { getCollections } from '../services/api'
import { Link } from 'react-router-dom'
import Loader from '../components/Loader'

export default function CollectionsPage() {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCollections()
      .then(res => setCollections(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="py-5">
      <Container>
        <div className="mb-5 text-center">
          <p className="section-label">Curated Drops</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>Collections</h1>
          <p style={{ color: 'var(--uw-light-gray)', maxWidth: 500, margin: '1rem auto 0', fontSize: '1rem' }}>
            Seasonal and themed collections, crafted to define your look.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : collections.length === 0 ? (
          <div className="text-center py-5">
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--uw-light-gray)', letterSpacing: '0.1em' }}>
              NO COLLECTIONS YET
            </p>
            <p style={{ color: 'var(--uw-light-gray)' }}>Check back soon for curated drops.</p>
          </div>
        ) : (
          <Row className="g-4">
            {collections.map((col, i) => (
              <Col key={col._id} md={6} lg={4}>
                <div className="uw-card h-100" style={{ padding: '2rem', minHeight: 220 }}>
                  <span className="section-label">{col.season}</span>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--uw-white)', letterSpacing: '0.05em', lineHeight: 1 }}>
                    {col.name}
                  </h3>
                  <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                    {col.products?.length || 0} pieces in this collection
                  </p>
                  <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Added {new Date(col.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <Link to="/products" className="btn btn-uw-outline mt-auto d-inline-block" style={{ marginTop: '1.5rem', fontSize: '0.8rem', padding: '0.4rem 1.2rem' }}>
                    Shop Products →
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  )
}
