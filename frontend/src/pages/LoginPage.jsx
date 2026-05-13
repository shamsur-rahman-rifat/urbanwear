import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { loginUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await loginUser(form)
      login(data)
      toast.success(`Welcome back, ${data.name}!`)
      navigate(data.role === 'admin' ? '/admin' : '/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--uw-black)' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={5} lg={4}>
            <div className="text-center mb-4">
              <Link to="/" style={{ textDecoration: 'none' }}>
                <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', letterSpacing: '0.15em', color: 'var(--uw-white)' }}>
                  URBAN<span className="text-accent">WEAR</span>
                </h1>
              </Link>
            </div>
            <div className="uw-card p-4">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Welcome Back</h2>
              <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sign in to your account</p>

              {error && <div className="alert-uw-error p-3 mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.5rem' }}>
                    Email
                  </label>
                  <input
                    type="email" name="email" required
                    className="form-control form-control-uw"
                    placeholder="your@email.com"
                    value={form.email} onChange={handleChange}
                  />
                </div>
                <div className="mb-4">
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.5rem' }}>
                    Password
                  </label>
                  <input
                    type="password" name="password" required
                    className="form-control form-control-uw"
                    placeholder="••••••••"
                    value={form.password} onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-uw-primary w-100" disabled={loading} style={{ fontSize: '1rem', padding: '0.75rem' }}>
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>

              <hr className="uw-divider my-3" />
              <p style={{ textAlign: 'center', color: 'var(--uw-light-gray)', fontSize: '0.9rem' }}>
                Don't have an account?{' '}
                <Link to="/register" style={{ color: 'var(--uw-accent)', fontWeight: 700, textDecoration: 'none' }}>Register</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
