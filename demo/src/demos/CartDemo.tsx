import React from 'react';
import { useCrossTabState } from 'cross-tab';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

function CartDemo() {
  const [cart, setCart] = useCrossTabState<CartItem[]>('shopping-cart', [], {
    persist: true,
  });

  const addItem = (item: Omit<CartItem, 'quantity'>) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const total = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );

  const sampleItems: Omit<CartItem, 'quantity'>[] = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 25 },
    { id: 3, name: 'Keyboard', price: 75 },
    { id: 4, name: 'Monitor', price: 299 },
  ];

  return (
    <section className="section">
      <h2>🛒 Example 3: Shopping Cart</h2>
      <p>
        A shopping cart that syncs across tabs. Add items in one tab and see
        them appear in all other tabs instantly. Perfect for e-commerce
        applications!
      </p>

      <div className="demo-box">
        <h3>Your Cart</h3>
        {cart.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Your cart is empty. Add some items below!
          </p>
        ) : (
          <div style={{ marginTop: '20px' }}>
            {cart.map((item: CartItem) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '1.25rem',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '0.75rem',
                  background: 'var(--bg-secondary)',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <strong style={{ fontSize: '1.125rem' }}>{item.name}</strong>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    ${item.price.toFixed(2)} each
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    className="btn btn-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={{ padding: '0.5rem', minWidth: '2.5rem', fontSize: '1rem' }}
                  >
                    ➖
                  </button>
                  <span style={{ 
                    minWidth: '2.5rem', 
                    textAlign: 'center',
                    fontWeight: 600,
                    fontSize: '1.125rem'
                  }}>
                    {item.quantity}
                  </span>
                  <button
                    className="btn btn-secondary"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={{ padding: '0.5rem', minWidth: '2.5rem', fontSize: '1rem' }}
                  >
                    ➕
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => removeItem(item.id)}
                    style={{ padding: '0.5rem', minWidth: '2.5rem', fontSize: '1rem', marginLeft: '0.5rem' }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            <div
              style={{
                marginTop: '1.5rem',
                padding: '1.5rem',
                background: 'var(--gradient-accent)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'right',
                color: 'white',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Total</div>
              <strong style={{ fontSize: '1.75rem', fontWeight: 700 }}>${total.toFixed(2)}</strong>
            </div>
          </div>
        )}

        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '2px solid var(--border)' }}>
          <h4 style={{ marginBottom: '1rem', fontSize: '1.125rem' }}>Add Items:</h4>
          <div className="demo-controls">
            {sampleItems.map((item) => (
              <button
                key={item.id}
                className="btn"
                onClick={() => addItem(item)}
                style={{ flex: '1 1 auto' }}
              >
                ➕ {item.name} (${item.price})
              </button>
            ))}
          </div>
        </div>

        <div className="info-box" style={{ marginTop: '20px' }}>
          <strong>💡 Real-world use case:</strong> Users can shop in multiple
          tabs without cart inconsistencies. Add items in one tab, checkout in
          another - everything stays in sync!
        </div>
      </div>

      <div className="code-block">
        <pre><code>{`interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

const [cart, setCart] = useCrossTabState<CartItem[]>('cart', [], {
  persist: true  // Cart persists across reloads
});

// Add item
setCart(prev => [...prev, newItem]);

// Update quantity
setCart(prev => prev.map(item => 
  item.id === id ? { ...item, quantity: newQty } : item
));`}</code></pre>
      </div>
    </section>
  );
}

export default CartDemo;

