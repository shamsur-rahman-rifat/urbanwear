import { useEffect, useState } from 'react'
import { Row, Col, Modal } from 'react-bootstrap'
import { getProducts, createProduct } from '../../services/api'
import Loader from '../../components/Loader'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', category: 'Men', price: '', discount: 0, description: '',
  images: '', variants: [{ size: 'M', color: 'Black', stock: 10 }]
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleVariantChange = (i, field, val) => {
    setForm(f => {
      const variants = [...f.variants]
      variants[i] = { ...variants[i], [field]: val }
      return { ...f, variants }
    })
  }

  const addVariant = () => setForm(f => ({ ...f, variants: [...f.variants, { size: 'M', color: 'White', stock: 5 }] }))
  const removeVariant = (i) => setForm(f => ({ ...f, variants: f.variants.filter((_, idx) => idx !== i) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        discount: parseFloat(form.discount),
        images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
        variants: form.variants.map(v => ({ ...v, stock: parseInt(v.stock) }))
      }
      const { data } = await createProduct(payload)
      setProducts(prev => [data, ...prev])
      setShowModal(false)
      setForm(EMPTY_FORM)
      toast.success('Product created!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product')
    } finally {
      setSaving(false)
    }
  }

  const PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=80&q=80'

  return (
    <div>
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <p className="section-label">Manage</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>Products</h1>
        </div>
        <button className="btn btn-uw-primary" onClick={() => setShowModal(true)}>+ Add Product</button>
      </div>

      {loading ? <Loader /> : (
        <div style={{ overflowX: 'auto' }}>
          <table className="table uw-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Discount</th>
                <th>Variants</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-4" style={{ color: 'var(--uw-light-gray)' }}>No products. Add one!</td></tr>
              ) : products.map(p => {
                const totalStock = p.variants?.reduce((a, v) => a + v.stock, 0) || 0
                const finalPrice = p.price * (1 - (p.discount || 0) / 100)
                return (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.images?.[0] || PLACEHOLDER}
                        alt={p.name}
                        style={{ width: 50, height: 60, objectFit: 'cover' }}
                        onError={e => { e.target.src = PLACEHOLDER }}
                      />
                    </td>
                    <td style={{ fontWeight: 600, maxWidth: 200 }}>{p.name}</td>
                    <td><span className="badge-uw" style={{ fontSize: '0.7rem' }}>{p.category}</span></td>
                    <td style={{ fontFamily: 'var(--font-display)', color: 'var(--uw-accent)' }}>
                      ${finalPrice.toFixed(2)}
                      {p.discount > 0 && <span style={{ color: 'var(--uw-light-gray)', fontSize: '0.75rem', textDecoration: 'line-through', marginLeft: '0.4rem' }}>${p.price}</span>}
                    </td>
                    <td>{p.discount > 0 ? <span className="badge-uw-red">{p.discount}%</span> : '—'}</td>
                    <td style={{ color: 'var(--uw-light-gray)', fontSize: '0.85rem' }}>{p.variants?.length || 0} variants</td>
                    <td style={{ color: totalStock > 0 ? '#7ecfa0' : 'var(--uw-red)' }}>{totalStock}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}>Add New Product</Modal.Title>
        </Modal.Header>
        <form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="g-3">
              <Col md={8}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.4rem' }}>Product Name *</label>
                <input name="name" required className="form-control form-control-uw" placeholder="e.g. Oversized Cargo Hoodie" value={form.name} onChange={handleChange} />
              </Col>
              <Col md={4}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.4rem' }}>Category *</label>
                <select name="category" className="form-select form-select-uw" value={form.category} onChange={handleChange}>
                  {['Men', 'Women', 'Streetwear', 'Accessories'].map(c => <option key={c}>{c}</option>)}
                </select>
              </Col>
              <Col md={4}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.4rem' }}>Price ($) *</label>
                <input name="price" type="number" step="0.01" min="0" required className="form-control form-control-uw" placeholder="59.99" value={form.price} onChange={handleChange} />
              </Col>
              <Col md={4}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.4rem' }}>Discount (%)</label>
                <input name="discount" type="number" min="0" max="99" className="form-control form-control-uw" placeholder="0" value={form.discount} onChange={handleChange} />
              </Col>
              <Col md={12}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.4rem' }}>Description *</label>
                <textarea name="description" required rows={3} className="form-control form-control-uw" placeholder="Describe the product..." value={form.description} onChange={handleChange} />
              </Col>
              <Col md={12}>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.4rem' }}>Image URLs (comma-separated)</label>
                <input name="images" className="form-control form-control-uw" placeholder="https://..., https://..." value={form.images} onChange={handleChange} />
              </Col>

              {/* Variants */}
              <Col md={12}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)' }}>Variants</label>
                  <button type="button" className="btn btn-uw-dark" style={{ fontSize: '0.75rem', padding: '0.3rem 0.8rem' }} onClick={addVariant}>+ Add Variant</button>
                </div>
                {form.variants.map((v, i) => (
                  <div key={i} className="d-flex gap-2 mb-2 align-items-center">
                    <input
                      placeholder="Size (e.g. M)"
                      className="form-control form-control-uw"
                      value={v.size} onChange={e => handleVariantChange(i, 'size', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      placeholder="Color (e.g. Black)"
                      className="form-control form-control-uw"
                      value={v.color} onChange={e => handleVariantChange(i, 'color', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <input
                      placeholder="Stock"
                      type="number" min="0"
                      className="form-control form-control-uw"
                      value={v.stock} onChange={e => handleVariantChange(i, 'stock', e.target.value)}
                      style={{ flex: 1 }}
                    />
                    {form.variants.length > 1 && (
                      <button type="button" onClick={() => removeVariant(i)}
                        style={{ background: 'none', border: 'none', color: 'var(--uw-red)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    )}
                  </div>
                ))}
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <button type="button" className="btn btn-uw-dark" onClick={() => setShowModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-uw-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Create Product'}
            </button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  )
}
