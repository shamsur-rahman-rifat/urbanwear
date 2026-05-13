import { useEffect, useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'

const CATEGORIES = ['All', 'Men', 'Women', 'Streetwear', 'Accessories']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()

  // Filter state
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const [selectedSizes, setSelectedSizes] = useState([])
  const [maxPrice, setMaxPrice] = useState(500)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
  }, [searchParams])

  const filtered = useMemo(() => {
    let list = [...products]
    if (category !== 'All') list = list.filter(p => p.category === category)
    if (selectedSizes.length > 0) {
      list = list.filter(p => p.variants?.some(v => selectedSizes.includes(v.size)))
    }
    list = list.filter(p => {
      const final = p.price * (1 - (p.discount || 0) / 100)
      return final <= maxPrice
    })
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
    }
    if (sortBy === 'price-asc') list.sort((a, b) => a.price - b.price)
    else if (sortBy === 'price-desc') list.sort((a, b) => b.price - a.price)
    else if (sortBy === 'discount') list.sort((a, b) => (b.discount || 0) - (a.discount || 0))
    return list
  }, [products, category, selectedSizes, maxPrice, searchQuery, sortBy])

  const toggleSize = (size) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    )
  }

  const clearFilters = () => {
    setCategory('All')
    setSelectedSizes([])
    setMaxPrice(500)
    setSearchQuery('')
    setSortBy('newest')
    setSearchParams({})
  }

  return (
    <div className="py-5">
      <Container>
        {/* Header */}
        <div className="mb-4">
          <p className="section-label">UrbanWear</p>
          <h1 className="page-title" style={{ fontSize: 'clamp(2rem, 6vw, 4rem)' }}>
            {category === 'All' ? 'All Products' : category}
          </h1>
        </div>

        {/* Search + Sort bar */}
        <Row className="mb-4 g-2">
          <Col md={6}>
            <input
              type="text"
              className="form-control form-control-uw"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <select className="form-select form-select-uw" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </Col>
          <Col md={3} className="d-flex align-items-center">
            <span style={{ color: 'var(--uw-light-gray)', fontSize: '0.9rem' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Sidebar Filters */}
          <Col lg={3}>
            <div className="filter-sidebar">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.1em', margin: 0, color: 'var(--uw-white)' }}>FILTERS</h5>
                <button onClick={clearFilters} style={{ background: 'none', border: 'none', color: 'var(--uw-accent)', fontSize: '0.8rem', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                  Clear All
                </button>
              </div>

              {/* Category */}
              <div className="mb-4">
                <p className="filter-title">Category</p>
                {CATEGORIES.map(cat => (
                  <div key={cat} className="mb-1">
                    <button
                      onClick={() => { setCategory(cat); setSearchParams(cat !== 'All' ? { category: cat } : {}) }}
                      style={{
                        background: 'none', border: 'none', padding: '0.3rem 0',
                        color: category === cat ? 'var(--uw-accent)' : 'var(--uw-light-gray)',
                        fontFamily: 'var(--font-body)', fontWeight: category === cat ? 700 : 400,
                        fontSize: '0.9rem', cursor: 'pointer', display: 'block', width: '100%', textAlign: 'left',
                        borderLeft: category === cat ? '2px solid var(--uw-accent)' : '2px solid transparent',
                        paddingLeft: '0.8rem', transition: 'all 0.15s'
                      }}
                    >
                      {cat}
                    </button>
                  </div>
                ))}
              </div>

              {/* Size */}
              <div className="mb-4">
                <p className="filter-title">Size</p>
                <div className="d-flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button
                      key={s}
                      className={`size-btn ${selectedSizes.includes(s) ? 'active' : ''}`}
                      onClick={() => toggleSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <p className="filter-title">Max Price: <span className="text-accent">${maxPrice}</span></p>
                <input
                  type="range" min={0} max={500} step={10}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-100"
                  style={{ accentColor: 'var(--uw-accent)' }}
                />
                <div className="d-flex justify-content-between" style={{ color: 'var(--uw-light-gray)', fontSize: '0.8rem' }}>
                  <span>$0</span><span>$500</span>
                </div>
              </div>
            </div>
          </Col>

          {/* Grid */}
          <Col lg={9}>
            {loading ? (
              <Loader message="Loading products..." />
            ) : filtered.length === 0 ? (
              <div className="text-center py-5">
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', color: 'var(--uw-light-gray)', letterSpacing: '0.1em' }}>
                  NO PRODUCTS FOUND
                </p>
                <p style={{ color: 'var(--uw-light-gray)' }}>Try adjusting your filters.</p>
                <button className="btn btn-uw-outline mt-3" onClick={clearFilters}>Clear Filters</button>
              </div>
            ) : (
              <Row className="g-3">
                {filtered.map(p => (
                  <Col key={p._id} xs={6} md={4}>
                    <ProductCard product={p} />
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}
