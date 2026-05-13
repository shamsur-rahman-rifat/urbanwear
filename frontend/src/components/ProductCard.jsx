import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80'

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()

  const discountedPrice = product.price * (1 - (product.discount || 0) / 100)
  const firstVariant = product.variants?.[0]
  const image = product.images?.[0] || PLACEHOLDER

  const handleQuickAdd = (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast.error('Please login to add to cart')
      return
    }
    if (!firstVariant) {
      toast.error('No variants available')
      return
    }
    addToCart(product, firstVariant.size, firstVariant.color, 1)
    toast.success(`${product.name} added to cart!`)
  }

  const colors = [...new Set(product.variants?.map(v => v.color) || [])]

  return (
    <div className="uw-card h-100" style={{ overflow: 'hidden', cursor: 'pointer' }}>
      <Link to={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
        <div className="product-img-wrap">
          <img src={image} alt={product.name} loading="lazy"
            onError={e => { e.target.src = PLACEHOLDER }}
          />
          {product.discount > 0 && (
            <span className="badge-uw-red" style={{ position: 'absolute', top: 12, left: 12 }}>
              -{product.discount}%
            </span>
          )}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.8))', padding: '2rem 1rem 1rem' }}>
            <button className="btn btn-uw-primary w-100" onClick={handleQuickAdd}
              style={{ fontSize: '0.8rem', padding: '0.5rem' }}>
              Quick Add
            </button>
          </div>
        </div>
        <div className="p-3">
          <p className="section-label mb-1">{product.category}</p>
          <h6 style={{ fontFamily: 'var(--font-body)', fontWeight: 700, color: 'var(--uw-white)', marginBottom: '0.4rem', fontSize: '1rem' }}>
            {product.name}
          </h6>
          <div className="d-flex align-items-center gap-2 mb-2">
            {product.discount > 0 ? (
              <>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--uw-accent)' }}>
                  ${discountedPrice.toFixed(2)}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--uw-light-gray)', textDecoration: 'line-through' }}>
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--uw-white)' }}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>
          {/* Color swatches */}
          {colors.length > 0 && (
            <div className="d-flex gap-1 flex-wrap">
              {colors.slice(0, 5).map(c => (
                <span key={c} title={c} className="color-dot"
                  style={{ background: c.toLowerCase(), border: '1px solid var(--uw-mid-gray)' }} />
              ))}
              {colors.length > 5 && <span style={{ fontSize: '0.75rem', color: 'var(--uw-light-gray)' }}>+{colors.length - 5}</span>}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
