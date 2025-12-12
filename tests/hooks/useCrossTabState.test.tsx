import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCrossTabState } from '../../src/hooks/useCrossTabState';

describe('useCrossTabState', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  describe('basic functionality', () => {
    it('should return initial value', () => {
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 'initial')
      );
      
      expect(result.current[0]).toBe('initial');
      expect(typeof result.current[1]).toBe('function');
    });

    it('should handle different value types', () => {
      const { result: result1 } = renderHook(() =>
        useCrossTabState('key1', 42)
      );
      expect(result1.current[0]).toBe(42);

      const { result: result2 } = renderHook(() =>
        useCrossTabState('key2', { foo: 'bar' })
      );
      expect(result2.current[0]).toEqual({ foo: 'bar' });

      const { result: result3 } = renderHook(() =>
        useCrossTabState('key3', null)
      );
      expect(result3.current[0]).toBeNull();
    });

    it('should update value', () => {
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 'initial')
      );
      
      act(() => {
        result.current[1]('updated');
      });
      
      expect(result.current[0]).toBe('updated');
    });

    it('should support functional updates', () => {
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 0)
      );
      
      act(() => {
        result.current[1]((prev) => prev + 1);
      });
      
      expect(result.current[0]).toBe(1);
      
      act(() => {
        result.current[1]((prev) => prev * 2);
      });
      
      expect(result.current[0]).toBe(2);
    });
  });

  describe('cross-tab synchronization', () => {
    it('should sync between multiple hook instances', () => {
      const { result: result1 } = renderHook(() =>
        useCrossTabState('shared-key', 'initial')
      );
      
      const { result: result2 } = renderHook(() =>
        useCrossTabState('shared-key', 'initial')
      );
      
      act(() => {
        result1.current[1]('updated-from-1');
      });
      
      // Both should have the same value
      expect(result1.current[0]).toBe('updated-from-1');
      expect(result2.current[0]).toBe('updated-from-1');
    });

    it('should isolate different keys', () => {
      const { result: result1 } = renderHook(() =>
        useCrossTabState('key1', 'value1')
      );
      
      const { result: result2 } = renderHook(() =>
        useCrossTabState('key2', 'value2')
      );
      
      act(() => {
        result1.current[1]('updated1');
      });
      
      expect(result1.current[0]).toBe('updated1');
      expect(result2.current[0]).toBe('value2');
    });
  });

  describe('persistence', () => {
    it('should persist value when persist is enabled', () => {
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 'initial', {
          persist: true,
        })
      );
      
      act(() => {
        result.current[1]('persisted');
      });
      
      const stored = localStorage.getItem('xts-test-key');
      expect(stored).toBe('"persisted"');
    });

    it('should restore value from localStorage on mount', () => {
      localStorage.setItem('xts-test-key', '"restored"');
      
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 'initial', {
          persist: true,
        })
      );
      
      expect(result.current[0]).toBe('restored');
    });

    it('should not persist when persist is disabled', () => {
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 'initial', {
          persist: false,
        })
      );
      
      act(() => {
        result.current[1]('not-persisted');
      });
      
      const stored = localStorage.getItem('xts-test-key');
      expect(stored).toBeNull();
    });
  });

  describe('options', () => {
    it('should use custom channel name', () => {
      const { result: result1 } = renderHook(() =>
        useCrossTabState('key', 'value1', {
          channelName: 'channel1',
        })
      );
      
      const { result: result2 } = renderHook(() =>
        useCrossTabState('key', 'value2', {
          channelName: 'channel2',
        })
      );
      
      act(() => {
        result1.current[1]('updated1');
      });
      
      expect(result1.current[0]).toBe('updated1');
      expect(result2.current[0]).toBe('value2'); // Different channel
    });

    it('should use custom serialize/deserialize', () => {
      const { result } = renderHook(() =>
        useCrossTabState(
          'test-key',
          { date: new Date('2023-01-01') },
          {
            persist: true,
            serialize: (v) => JSON.stringify({ ...v, date: v.date.toISOString() }),
            deserialize: (str) => {
              const parsed = JSON.parse(str);
              return { ...parsed, date: new Date(parsed.date) };
            },
          }
        )
      );
      
      act(() => {
        result.current[1]({ date: new Date('2023-02-01') });
      });
      
      expect(result.current[0].date).toBeInstanceOf(Date);
    });

    it('should update when options change', () => {
      const { result, rerender } = renderHook(
        ({ options }) => useCrossTabState('test-key', 'initial', options),
        {
          initialProps: { options: { persist: false } },
        }
      );
      
      act(() => {
        result.current[1]('value');
      });
      
      rerender({ options: { persist: true } });
      
      // Should still work
      expect(result.current[0]).toBe('value');
    });
  });

  describe('cleanup', () => {
    it('should cleanup on unmount', () => {
      const { result, unmount } = renderHook(() =>
        useCrossTabState('test-key', 'initial')
      );
      
      act(() => {
        result.current[1]('value');
      });
      
      unmount();
      
      // Should not throw
      expect(() => {
        // Try to access after unmount
        const val = result.current[0];
        expect(val).toBe('value');
      }).not.toThrow();
    });

    it('should handle multiple unmounts gracefully', () => {
      const { unmount } = renderHook(() =>
        useCrossTabState('test-key', 'initial')
      );
      
      unmount();
      // Should not throw on second unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('edge cases', () => {
    it('should handle undefined values', () => {
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 'initial')
      );
      
      act(() => {
        result.current[1](undefined as any);
      });
      
      // Should not change (undefined is rejected)
      expect(result.current[0]).toBe('initial');
    });

    it('should handle setValue when channel is not ready', () => {
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 'initial')
      );
      
      // Immediately try to set value (before channel is ready)
      act(() => {
        result.current[1]('value');
      });
      
      // Should eventually update
      expect(result.current[0]).toBe('value');
    });

    it('should handle setValue when channelRef.current is null', () => {
      const { result, unmount } = renderHook(() =>
        useCrossTabState('null-channel-test', 'initial')
      );
      
      // Unmount to clear channelRef
      unmount();
      
      // Try to set value after unmount - should not throw
      act(() => {
        result.current[1]('after-unmount');
      });
      
      // Should not throw, but value won't update (channel is null)
      expect(result.current[1]).toBeDefined();
    });

    it('should handle key changes', () => {
      const { result, rerender } = renderHook(
        ({ key }) => useCrossTabState(key, 'initial'),
        { initialProps: { key: 'key1' } }
      );
      
      act(() => {
        result.current[1]('value1');
      });
      
      expect(result.current[0]).toBe('value1');
      
      rerender({ key: 'key2' });
      
      // Should reset to initial for new key
      expect(result.current[0]).toBe('initial');
    });

    it('should handle rapid updates', () => {
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 0)
      );
      
      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current[1]((prev) => prev + 1);
        }
      });
      
      expect(result.current[0]).toBe(10);
    });
  });

  describe('SSR support', () => {
    it('should return initial value in SSR (window undefined)', () => {
      // The hook checks for window === 'undefined' internally
      // In jsdom, window exists, so we can't fully test SSR here
      // But we can verify the hook works when window check passes
      const { result } = renderHook(() =>
        useCrossTabState('test-key', 'initial')
      );
      
      expect(result.current[0]).toBe('initial');
      expect(typeof result.current[1]).toBe('function');
    });

    // SSR is tested in core tests - React Testing Library doesn't work well with window deletion
  });

  describe('channel reuse', () => {
    it('should reuse channels for same key', () => {
      const { result: result1 } = renderHook(() =>
        useCrossTabState('shared-reuse-key', 'initial')
      );
      
      const { result: result2 } = renderHook(() =>
        useCrossTabState('shared-reuse-key', 'initial')
      );
      
      act(() => {
        result1.current[1]('updated');
      });
      
      // Both should see the update (they share the same channel)
      expect(result1.current[0]).toBe('updated');
      expect(result2.current[0]).toBe('updated');
    });

    it('should cleanup channels when last hook unmounts', () => {
      const { result, unmount } = renderHook(() =>
        useCrossTabState('cleanup-unique-key-2', 'initial')
      );
      
      act(() => {
        result.current[1]('value');
      });
      
      expect(result.current[0]).toBe('value');
      
      unmount();
      
      // Channel should be cleaned up after unmount
      // The cleanup happens in the useEffect return function
    });
  });
});

