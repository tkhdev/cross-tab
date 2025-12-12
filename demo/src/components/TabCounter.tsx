import React, { useEffect, useRef, useMemo } from 'react';
import { useCrossTabState } from 'cross-tab';

function TabCounter() {
  const initialSet = useMemo(() => new Set<string>(), []);
  const [openTabs, setOpenTabs] = useCrossTabState<Set<string>>('tab-counter-set', initialSet, {
    serialize: (set) => JSON.stringify(Array.from(set)),
    deserialize: (str) => {
      try {
        const arr = JSON.parse(str);
        return new Set(Array.isArray(arr) ? arr : []);
      } catch {
        return new Set();
      }
    },
  });

  const tabIdRef = useRef<string>(`tab-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`);

  useEffect(() => {
    const tabId = tabIdRef.current;

    setOpenTabs((prev) => {
      const newSet = new Set(prev);
      newSet.add(tabId);
      return newSet;
    });

    const heartbeat = setInterval(() => {
      setOpenTabs((prev) => {
        const newSet = new Set(prev);
        newSet.add(tabId);
        return newSet;
      });
    }, 1000);

    return () => {
      clearInterval(heartbeat);
      setOpenTabs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tabId);
        return newSet;
      });
    };
  }, [setOpenTabs]);

  useEffect(() => {
    const tabId = tabIdRef.current;

    const handleBeforeUnload = () => {
      setOpenTabs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tabId);
        return newSet;
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [setOpenTabs]);

  const tabCount = openTabs.size || 1;

  return (
    <div className="tab-indicator">
      <div>
        <span className="count">{tabCount}</span>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
          tab{tabCount !== 1 ? 's' : ''} open
        </div>
      </div>
      <div style={{ fontSize: '0.7rem', marginTop: '0.5rem', color: 'var(--text-tertiary)', lineHeight: '1.4' }}>
        Open in another tab to see sync!
      </div>
    </div>
  );
}

export default TabCounter;

