import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('urbanwear_cart')) || [] } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem('urbanwear_cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, size, color, quantity = 1) => {
    setCart(prev => {
      const key = `${product._id}-${size}-${color}`
      const existing = prev.find(i => `${i._id}-${i.selectedSize}-${i.selectedColor}` === key)
      if (existing) {
        return prev.map(i =>
          `${i._id}-${i.selectedSize}-${i.selectedColor}` === key
            ? { ...i, qty: i.qty + quantity }
            : i
        )
      }
      return [...prev, { ...product, selectedSize: size, selectedColor: color, qty: quantity }]
    })
  }

  const removeFromCart = (id, size, color) => {
    setCart(prev => prev.filter(i => !(i._id === id && i.selectedSize === size && i.selectedColor === color)))
  }

  const updateQty = (id, size, color, qty) => {
    if (qty < 1) return removeFromCart(id, size, color)
    setCart(prev => prev.map(i =>
      i._id === id && i.selectedSize === size && i.selectedColor === color ? { ...i, qty } : i
    ))
  }

  const clearCart = () => setCart([])

  const cartTotal = cart.reduce((acc, i) => {
    const discounted = i.price * (1 - (i.discount || 0) / 100)
    return acc + discounted * i.qty
  }, 0)

  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside CartProvider')
  return ctx
}
