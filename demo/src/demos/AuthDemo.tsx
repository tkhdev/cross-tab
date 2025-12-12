import React from 'react';
import { useCrossTabState } from 'cross-tab';

interface User {
  id: string;
  name: string;
  email: string;
}

function AuthDemo() {
  const [user, setUser] = useCrossTabState<User | null>('auth-demo', null);

  const handleLogin = () => {
    setUser({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
    });
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <section className="section">
      <h2>🔐 Example 4: Authentication Sync</h2>
      <p>
        Critical for security: when a user logs out in one tab, all other tabs
        should immediately reflect the logout. This prevents stale sessions and
        security issues.
      </p>

      <div className="demo-box">
        {user ? (
          <div>
            <div
              style={{
                padding: '20px',
                background: 'var(--bg-secondary)',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            >
              <h3>✅ Logged In</h3>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
            </div>
            <button className="btn" onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        ) : (
          <div>
            <div
              style={{
                padding: '20px',
                background: 'var(--bg-secondary)',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            >
              <h3>❌ Not Logged In</h3>
              <p>Click the button below to simulate a login.</p>
            </div>
            <button className="btn" onClick={handleLogin}>
              🔑 Login
            </button>
          </div>
        )}

        <div className="warning-box" style={{ marginTop: '20px' }}>
          <strong>⚠️ Security Note:</strong> In a real application, you should
          also invalidate the session on the server when logging out. This demo
          only shows client-side state synchronization.
        </div>

        <div className="info-box" style={{ marginTop: '20px' }}>
          <strong>💡 Try this:</strong> Login in one tab, then logout in
          another tab. Watch the first tab automatically log out! This is
          essential for security.
        </div>
      </div>

      <div className="code-block">
        <pre><code>{`interface User {
  id: string;
  name: string;
  email: string;
}

const [user, setUser] = useCrossTabState<User | null>('auth', null);

// Login
setUser({ id: '1', name: 'John', email: 'john@example.com' });

// Logout in one tab → all tabs logout automatically
setUser(null);`}</code></pre>
      </div>
    </section>
  );
}

export default AuthDemo;

