import { useCrossTabState } from 'cross-tab';

function ThemeDemo() {
  const [theme, setTheme] = useCrossTabState('demo-theme', 'light', {
    persist: true,
  });

  return (
    <section className="section">
      <h2>🎨 Example 1: Theme Synchronization</h2>
      <p>
        Change the theme below and open this page in another tab to see it update instantly!
      </p>

      <div className="demo-box">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          marginBottom: '1.5rem',
          padding: '1rem',
          background: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ 
            width: '3rem', 
            height: '3rem', 
            borderRadius: '50%',
            background: theme === 'light' 
              ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)'
              : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem',
            boxShadow: 'var(--shadow-md)'
          }}>
            {theme === 'light' ? '☀️' : '🌙'}
          </div>
          <div>
            <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>Current Theme</h3>
            <div className="status active" style={{ textTransform: 'capitalize' }}>
              {theme}
            </div>
          </div>
        </div>
        <div className="demo-controls">
          <button 
            className="btn" 
            onClick={() => setTheme('light')}
            style={{ flex: 1 }}
          >
            ☀️ Light
          </button>
          <button 
            className="btn" 
            onClick={() => setTheme('dark')}
            style={{ flex: 1 }}
          >
            🌙 Dark
          </button>
        </div>
        <div className="info-box" style={{ marginTop: '1.5rem' }}>
          <strong>💡 Try this:</strong> Open this page in another browser tab
          and change the theme. Watch it update in real-time across all tabs!
        </div>
      </div>

      <div className="code-block">
        <pre><code>{`const [theme, setTheme] = useCrossTabState('theme', 'light', {
  persist: true  // Theme persists across page reloads
});

<button onClick={() => setTheme('dark')}>
  Switch to Dark Mode
</button>`}</code></pre>
      </div>
    </section>
  );
}

export default ThemeDemo;
