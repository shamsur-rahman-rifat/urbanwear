import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, Row, Col } from 'react-bootstrap'
import { registerUser } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirm) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      const { data } = await registerUser({ name: form.name, email: form.email, password: form.password })
      login(data)
      toast.success('Account created! Welcome to UrbanWear.')
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'var(--uw-black)', paddingTop: '2rem', paddingBottom: '2rem' }}>
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
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>Join Us</h2>
              <p style={{ color: 'var(--uw-light-gray)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Create your UrbanWear account</p>

              {error && <div className="alert-uw-error p-3 mb-3">{error}</div>}

              <form onSubmit={handleSubmit}>
                {[
                  { label: 'Full Name', name: 'name', type: 'text', placeholder: 'John Doe' },
                  { label: 'Email', name: 'email', type: 'email', placeholder: 'your@email.com' },
                  { label: 'Password', name: 'password', type: 'password', placeholder: '••••••••' },
                  { label: 'Confirm Password', name: 'confirm', type: 'password', placeholder: '••••••••' },
                ].map(field => (
                  <div key={field.name} className="mb-3">
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--uw-light-gray)', display: 'block', marginBottom: '0.5rem' }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type} name={field.name} required
                      className="form-control form-control-uw"
                      placeholder={field.placeholder}
                      value={form[field.name]} onChange={handleChange}
                    />
                  </div>
                ))}
                <button type="submit" className="btn btn-uw-primary w-100 mt-2" disabled={loading} style={{ fontSize: '1rem', padding: '0.75rem' }}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
              </form>

              <hr className="uw-divider my-3" />
              <p style={{ textAlign: 'center', color: 'var(--uw-light-gray)', fontSize: '0.9rem' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--uw-accent)', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
