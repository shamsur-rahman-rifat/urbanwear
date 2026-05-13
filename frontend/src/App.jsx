import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import AppNavbar from './components/Navbar'
import Footer from './components/Footer'
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute'

import HomePage from './pages/HomePage'
import ProductsPage from './pages/ProductsPage'
import ProductDetailPage from './pages/ProductDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import DashboardPage from './pages/DashboardPage'
import CollectionsPage from './pages/CollectionsPage'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCollections from './pages/admin/AdminCollections'

function Layout({ children }) {
  return (
    <>
      <AppNavbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#121212',
                color: '#f8f8f8',
                border: '1px solid #2a2a2a',
                borderRadius: 0,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9rem',
              },
              success: { iconTheme: { primary: '#e8ff00', secondary: '#050505' } },
              error: { iconTheme: { primary: '#ff3333', secondary: '#f8f8f8' } },
            }}
          />
          <Routes>
            {/* Public routes with layout */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/products/:id" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/collections" element={<Layout><CollectionsPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />

            {/* Auth routes (no footer nav clutter) */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected user routes */}
            <Route path="/checkout" element={
              <ProtectedRoute><Layout><CheckoutPage /></Layout></ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute><Layout><DashboardPage /></Layout></ProtectedRoute>
            } />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="collections" element={<AdminCollections />} />
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
