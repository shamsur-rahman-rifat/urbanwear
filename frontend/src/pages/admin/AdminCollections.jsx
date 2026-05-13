import { useEffect, useState } from 'react'
import { Modal, Row, Col } from 'react-bootstrap'
import { getCollections, createCollection, getProducts } from '../../services/api'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

export default function AdminCollections() {
  const [collections, setCollections] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', season: 'SS 2025', products: [] })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    Promise.all([getCollections(), getProducts()])
      .then(([c, p]) => { setCollections(c.data); setProducts(p.data) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const { data } = await createCollection(form)
      setCollections(prev => [data, ...prev])
      setShowModal(false)
      setForm({ name: '', season: 'SS 2025', products: [] })
      toast.success('Collection created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create collection')
    } finally {
      setSaving(false)
    }
  }

  const toggleProduct = (id) => {
    setForm(f => ({
      ...f,
      products: f.products.includes(id) ? f.products.filter(p => p !== id) : [...f.products, id]
    }))
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <p className="section-label">Manage</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Collections</h1>
        </div>
        <button className="btn btn-uw-primary" onClick={() => setShowModal(true)}>+ New Collection</button>
      </div>

      {loading ? <Loader /> : (
        <Row className="g-3">
          {collections.length === 0 ? (
            <p style={{ color: 'var(--uw-light-gray)', textAlign: 'center', padding: '3rem' }}>No collections yet. Create one!</p>
          ) : collections.map(col => (
            <Col key={col._id} md={4}>
              <div className="uw-card p-4" style={{ minHeight: 180 }}>
                <span className="section-label">{col.season}</span>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginTop: '0.5rem', color: 'var(--uw-white)' }}>{col.name}</h4>
                <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  {col.products?.length || 0} products
                </p>
                <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.75rem' }}>
                  {new Date(col.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Col>
          ))}
        </Row>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>Create Collection</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.4rem' }}>Collection Name *</label>
                <input required className="form-control form-control-uw" placeholder="e.g. Fall Essentials" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </Col>
              <Col md={4}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.4rem' }}>Season</label>
                <input className="form-control form-control-uw" placeholder="SS 2025" value={form.season} onChange={e => setForm(f => ({ ...f, season: e.target.value }))} />
              </Col>
              <Col md={12}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.6rem' }}>
                  Assign Products ({form.products.length} selected)
                </label>
                <div style={{ maxHeight: 240, overflowY: 'auto', border: '1px solid var(--uw-mid-gray)', padding: '0.5rem' }}>
                  {products.length === 0 ? (
                    <p style={{ color: 'var(--uw-light-gray)', textAlign: 'center', padding: '1rem', fontSize: '0.85rem' }}>No products available.</p>
                  ) : products.map(p => (
                    <div
                      key={p._id}
                      onClick={() => toggleProduct(p._id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem',
                        cursor: 'pointer', borderRadius: 0, marginBottom: '0.25rem',
                        background: form.products.includes(p._id) ? 'rgba(232,232,0,0.1)' : 'transparent',
                        border: form.products.includes(p._id) ? '1px solid var(--uw-accent)' : '1px solid transparent',
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, border: '2px solid',
                        borderColor: form.products.includes(p._id) ? 'var(--uw-accent)' : 'var(--uw-mid-gray)',
                        background: form.products.includes(p._id) ? 'var(--uw-accent)' : 'transparent',
                        flexShrink: 0
                      }} />
                      <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</span>
                      <span className="ms-auto" style={{ color: 'var(--uw-accent)', fontFamily: 'var(--font-display)' }}>${p.price}</span>
                    </div>
                  ))}
                </div>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-uw-dark" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-uw-primary" disabled={saving}>
              {saving ? 'Creating...' : 'Create Collection'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}
