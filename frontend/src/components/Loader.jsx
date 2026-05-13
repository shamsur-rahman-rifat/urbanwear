export default function Loader({ message = 'Loading...' }) {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 gap-3">
      <div className="spinner-uw" />
      <p style={{ color: 'var(--uw-light-gray)', fontFamily: 'var(--font-display)', letterSpacing: '0.2em', fontSize: '0.9rem' }}>
        {message}
      </p>
    </div>
  )
}
