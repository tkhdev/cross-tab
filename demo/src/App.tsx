import React, { useEffect } from 'react';
import { useCrossTabState } from 'cross-tab';
import ThemeDemo from './demos/ThemeDemo';
import CounterDemo from './demos/CounterDemo';
import CartDemo from './demos/CartDemo';
import AuthDemo from './demos/AuthDemo';
import PersistenceDemo from './demos/PersistenceDemo';
import CustomSerializationDemo from './demos/CustomSerializationDemo';
import TabCounter from './components/TabCounter';
import './App.css';

function App() {
  const [theme, setTheme] = useCrossTabState('demo-theme', 'light', {
    persist: true,
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app">
      <TabCounter />
      <div className="container">
        <header className="hero">
          <div className="hero-content">
            <h1>cross-tab</h1>
            <p>
              Minimal, framework-agnostic cross-tab state synchronization. 
              Keep your app state in sync across all browser tabs in real-time.
            </p>
            
            <div className="hero-badges">
              <span className="badge">
                <span className="badge-icon">⚡</span>
                Zero Dependencies
              </span>
              <span className="badge">
                <span className="badge-icon">🚀</span>
                Real-time Sync
              </span>
              <span className="badge">
                <span className="badge-icon">📦</span>
                ~8.3KB Bundle
              </span>
              <span className="badge">
                <span className="badge-icon">🔧</span>
                TypeScript Ready
              </span>
            </div>

            <div className="hero-actions">
              <button
                className="btn"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? '🌙' : '☀️'} Switch to{' '}
                {theme === 'light' ? 'Dark' : 'Light'} Mode
              </button>
              <a
                href="https://www.npmjs.com/package/cross-tab"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                📦 View on npm
              </a>
            </div>
          </div>
        </header>

        <section className="section">
          <h2>✨ Key Features</h2>
          <div className="grid">
            <div className="card">
              <h3>🔄 Real-time Synchronization</h3>
              <p>
                State updates instantly across all tabs using BroadcastChannel API with automatic localStorage fallback.
              </p>
            </div>
            <div className="card">
              <h3>🌐 Framework Agnostic</h3>
              <p>
                Works seamlessly with React, Vue, Svelte, vanilla JavaScript, and any other framework.
              </p>
            </div>
            <div className="card">
              <h3>🛡️ SSR-Safe</h3>
              <p>
                Fully compatible with Next.js, Remix, and other server-side rendering frameworks.
              </p>
            </div>
            <div className="card">
              <h3>💾 Optional Persistence</h3>
              <p>
                Save state to localStorage for recovery across page reloads with a simple option flag.
              </p>
            </div>
            <div className="card">
              <h3>🔧 Custom Serialization</h3>
              <p>
                Support for complex data types (Date, Map, Set, etc.) with custom serialize/deserialize functions.
              </p>
            </div>
            <div className="card">
              <h3>⚡ Tiny & Fast</h3>
              <p>
                Only ~8.3KB (ESM) / ~8.4KB (CJS) minified, ~1.9KB gzipped, with zero dependencies and optimized performance.
              </p>
            </div>
          </div>

          <div className="info-box" style={{ marginTop: '2rem' }}>
            <strong>💡 Installation:</strong>
            <div className="code-block" style={{ marginTop: '1rem', marginBottom: 0 }}>
              <pre><code><span className="keyword">npm</span> install cross-tab</code></pre>
            </div>
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <a href="https://www.npmjs.com/package/cross-tab" target="_blank" rel="noopener noreferrer" className="badge">
                📦 npm package
              </a>
              <a href="https://github.com/tkhdev/cross-tab" target="_blank" rel="noopener noreferrer" className="badge">
                🔗 GitHub repository
              </a>
              <a href="https://cross-tab.vercel.app" target="_blank" rel="noopener noreferrer" className="badge">
                🚀 Live Demo
              </a>
            </div>
          </div>
        </section>

        <ThemeDemo />
        <CounterDemo />
        <CartDemo />
        <AuthDemo />
        <PersistenceDemo />
        <CustomSerializationDemo />

        <section className="section">
          <h2>🔧 API Reference</h2>

          <h3>useCrossTabState (React Hook)</h3>
          <div className="code-block">
            <pre><code>{`const [value, setValue] = useCrossTabState<T>(
  key: string,
  initialValue: T,
  options?: Options<T>
);`}</code></pre>
          </div>

          <h3>createCrossTabChannel (Framework Agnostic)</h3>
          <div className="code-block">
            <pre><code>{`import { createCrossTabChannel } from 'cross-tab';

const channel = createCrossTabChannel('key', initialValue, options);

channel.subscribe((value) => { ... });
channel.setValue(newValue);
channel.getValue();
channel.destroy();`}</code></pre>
          </div>

          <h3>Options</h3>
          <div className="code-block">
            <pre><code>{`type Options<T> = {
  channelName?: string;        // Default: 'xts'
  persist?: boolean;           // Default: false
  serialize?: (v: T) => string;
  deserialize?: (v: string) => T;
};`}</code></pre>
          </div>
        </section>

        <section className="section">
          <h2>🌐 Browser Support</h2>
          <div className="grid">
            <div className="card">
              <h3>Modern Browsers</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                <span className="status active">✅ Chrome 54+</span>
                <span className="status active">✅ Edge 54+</span>
                <span className="status active">✅ Firefox 38+</span>
                <span className="status active">✅ Safari 15.4+</span>
              </div>
              <p style={{ marginTop: '1rem' }}>
                Uses BroadcastChannel API for fast, efficient communication.
              </p>
            </div>
            <div className="card">
              <h3>Older Browsers</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1rem' }}>
                <span className="status inactive">🔄 Fallback</span>
              </div>
              <p style={{ marginTop: '1rem' }}>
                Automatically falls back to localStorage + storage events for maximum compatibility.
              </p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>📖 Use Cases</h2>
          <div className="grid">
            <div className="card">
              <h3>🔐 Auth Synchronization</h3>
              <p>
                Logout in one tab → all tabs logout automatically. Essential for security and user experience.
              </p>
            </div>
            <div className="card">
              <h3>🎨 Theme Sync</h3>
              <p>
                User changes theme once → all tabs update instantly. Perfect for user preferences.
              </p>
            </div>
            <div className="card">
              <h3>🛒 Shopping Cart</h3>
              <p>
                Add items in one tab → cart updates in all tabs. No more cart inconsistencies!
              </p>
            </div>
            <div className="card">
              <h3>🚩 Feature Flags</h3>
              <p>
                Admin updates flags → all tabs reflect changes immediately. Great for A/B testing.
              </p>
            </div>
          </div>
        </section>

        <footer className="footer">
          <p style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            Made with ❤️ - Minimal, framework-agnostic, bulletproof
          </p>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            Keep your app state synchronized across browser tabs effortlessly
          </p>
          <div className="footer-links">
            <a
              href="https://www.npmjs.com/package/cross-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              📦 npm
            </a>
            <a
              href="https://github.com/tkhdev/cross-tab"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              🔗 GitHub
            </a>
            <a
              href="https://cross-tab.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              🚀 Demo
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
