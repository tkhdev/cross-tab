import { useCrossTabState } from 'cross-tab';

interface ComplexData {
  date: Date;
  map: Map<string, number>;
  set: Set<string>;
}

function CustomSerializationDemo() {
  const [data, setData] = useCrossTabState<ComplexData>(
    'custom-serialization-demo',
    {
      date: new Date(),
      map: new Map([['key1', 1]]),
      set: new Set(['value1']),
    },
    {
      persist: true,
      serialize: (value: ComplexData) => {
        if (!value || typeof value !== 'object') {
          return JSON.stringify(null);
        }
        return JSON.stringify({
          date: value.date?.toISOString() || new Date().toISOString(),
          map: Array.from(value.map?.entries() || []),
          set: Array.from(value.set || []),
        });
      },
      deserialize: (str: string) => {
        const parsed = JSON.parse(str);
        if (!parsed || typeof parsed !== 'object') {
          return {
            date: new Date(),
            map: new Map([['key1', 1]]),
            set: new Set(['value1']),
          };
        }
        return {
          date: parsed.date ? new Date(parsed.date) : new Date(),
          map: parsed.map ? new Map(parsed.map) : new Map([['key1', 1]]),
          set: parsed.set ? new Set(parsed.set) : new Set(['value1']),
        };
      },
    }
  );

  const addToMap = () => {
    setData((prev: ComplexData) => {
      const newMap = new Map(prev.map);
      newMap.set(`key${newMap.size + 1}`, newMap.size + 1);
      return { ...prev, map: newMap };
    });
  };

  const addToSet = () => {
    setData((prev: ComplexData) => {
      const newSet = new Set(prev.set);
      newSet.add(`value${newSet.size + 1}`);
      return { ...prev, set: newSet };
    });
  };

  return (
    <section className="section">
      <h2>🔧 Example 7: Custom Serialization</h2>
      <p>
        For complex data types (Date, Map, Set, etc.) that can't be directly
        JSON serialized, you can provide custom <code>serialize</code> and{' '}
        <code>deserialize</code> functions.
      </p>

      <div className="demo-box">
        <h3>Complex Data Object</h3>

        <div style={{ marginTop: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <strong>Date:</strong>{' '}
            <code>{data.date.toLocaleString()}</code>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Map:</strong>
            <div style={{ marginTop: '5px' }}>
              {Array.from(data.map.entries()).map((entry: [string, number]) => {
                const [key, value] = entry;
                return (
                <span
                  key={key}
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    margin: '5px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '3px',
                  }}
                >
                  {key}: {value}
                </span>
                );
              })}
            </div>
            <button
              className="btn"
              onClick={addToMap}
              style={{ marginTop: '10px' }}
            >
              ➕ Add to Map
            </button>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <strong>Set:</strong>
            <div style={{ marginTop: '5px' }}>
              {Array.from(data.set).map((value: string, index: number) => (
                <span
                  key={value}
                  style={{
                    display: 'inline-block',
                    padding: '5px 10px',
                    margin: '5px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '3px',
                  }}
                >
                  {value}
                </span>
              ))}
            </div>
            <button
              className="btn"
              onClick={addToSet}
              style={{ marginTop: '10px' }}
            >
              ➕ Add to Set
            </button>
          </div>
        </div>

        <div className="info-box" style={{ marginTop: '20px' }}>
          <strong>💡 Why custom serialization?</strong> JavaScript's{' '}
          <code>JSON.stringify</code> can't handle Date, Map, Set, and other
          complex types. Custom serialization lets you store any data type!
        </div>
      </div>

      <div className="code-block">
        <pre><code>{`interface ComplexData {
  date: Date;
  map: Map<string, number>;
  set: Set<string>;
}

const [data, setData] = useCrossTabState<ComplexData>(
  'key',
  initialValue,
  {
    persist: true,
    serialize: (value) => {
      return JSON.stringify({
        date: value.date.toISOString(),
        map: Array.from(value.map.entries()),
        set: Array.from(value.set),
      });
    },
    deserialize: (str) => {
      const parsed = JSON.parse(str);
      return {
        date: new Date(parsed.date),
        map: new Map(parsed.map),
        set: new Set(parsed.set),
      };
    },
  }
);`}</code></pre>
      </div>
    </section>
  );
}

export default CustomSerializationDemo;

