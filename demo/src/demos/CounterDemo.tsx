import { useCrossTabState } from 'cross-tab';

function CounterDemo() {
  const [count, setCount] = useCrossTabState('counter-demo', 0);

  return (
    <section className="section">
      <h2>🔢 Example 2: Counter Synchronization</h2>
      <p>
        A simple counter that stays in sync across all tabs. Click the buttons
        below and watch the counter update in real-time across all open tabs.
      </p>

      <div className="demo-box">
        <div style={{ 
          fontSize: '4rem', 
          textAlign: 'center', 
          margin: '2rem 0',
          fontWeight: 800,
          background: 'var(--gradient-accent)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1
        }}>
          {count}
        </div>
        <div className="demo-controls" style={{ justifyContent: 'center' }}>
          <button className="btn" onClick={() => setCount((prev: number) => prev - 1)}>
            ➖ Decrement
          </button>
          <button className="btn btn-secondary" onClick={() => setCount(0)}>
            🔄 Reset
          </button>
          <button className="btn" onClick={() => setCount((prev: number) => prev + 1)}>
            ➕ Increment
          </button>
        </div>
        <div className="info-box" style={{ marginTop: '1.5rem' }}>
          <strong>💡 Feature:</strong> Supports functional updates just like
          React's useState! Use <code>setCount(prev =&gt; prev + 1)</code> for
          updates based on previous value.
        </div>
      </div>

      <div className="code-block">
        <pre><code>{`const [count, setCount] = useCrossTabState('counter', 0);

// Direct update
setCount(10);

// Functional update
setCount(prev => prev + 1);`}</code></pre>
      </div>
    </section>
  );
}

export default CounterDemo;

