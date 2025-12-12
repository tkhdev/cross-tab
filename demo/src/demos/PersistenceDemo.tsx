import { useCrossTabState } from 'cross-tab';

function PersistenceDemo() {
  const [persistedValue, setPersistedValue] = useCrossTabState(
    'persistence-demo',
    '',
    { persist: true }
  );
  const [nonPersistedValue, setNonPersistedValue] = useCrossTabState(
    'non-persisted-demo',
    '',
    { persist: false }
  );

  return (
    <section className="section">
      <h2>💾 Example 5: Persistence</h2>
      <p>
        With <code>persist: true</code>, state is saved to localStorage and
        restored when the page reloads. Without it, state resets on reload.
      </p>

      <div className="grid">
        <div className="card">
          <h3>✅ With Persistence</h3>
          <p style={{ marginBottom: '15px' }}>
            This value persists across page reloads:
          </p>
          <input
            className="input"
            type="text"
            value={persistedValue}
            onChange={(e) => setPersistedValue(e.target.value)}
            placeholder="Type something..."
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <div className="status active">persist: true</div>
          <div className="info-box" style={{ marginTop: '15px' }}>
            <strong>Try it:</strong> Type something, reload the page, and see it
            still there!
          </div>
        </div>

        <div className="card">
          <h3>❌ Without Persistence</h3>
          <p style={{ marginBottom: '15px' }}>
            This value resets on page reload:
          </p>
          <input
            className="input"
            type="text"
            value={nonPersistedValue}
            onChange={(e) => setNonPersistedValue(e.target.value)}
            placeholder="Type something..."
            style={{ width: '100%', marginBottom: '10px' }}
          />
          <div className="status inactive">persist: false</div>
          <div className="info-box" style={{ marginTop: '15px' }}>
            <strong>Try it:</strong> Type something, reload the page, and see it
            disappear!
          </div>
        </div>
      </div>

      <div className="code-block">
        <pre><code>{`// With persistence - survives page reloads
const [value, setValue] = useCrossTabState('key', '', {
  persist: true
});

// Without persistence - resets on reload
const [value, setValue] = useCrossTabState('key', '', {
  persist: false  // or omit the option
});`}</code></pre>
      </div>
    </section>
  );
}

export default PersistenceDemo;

