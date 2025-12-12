import { useState, useEffect, useRef, useCallback } from 'react';
import { CrossTabChannel } from '../core';
import type { Options } from '../core';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const channels = new Map<string, CrossTabChannel<any>>();
const refs = new Map<string, number>();

function getChannel<T>(key: string, initialValue: T, options?: Options<T>) {
  const channelKey = `${options?.channelName || 'xts'}-${key}`;
  if (!channels.has(channelKey)) {
    channels.set(channelKey, new CrossTabChannel(key, initialValue, options));
    refs.set(channelKey, 0);
  }
  const count = refs.get(channelKey)!;
  refs.set(channelKey, count + 1);
  return channels.get(channelKey)!;
}

function releaseChannel(key: string, channelName?: string) {
  const channelKey = `${channelName || 'xts'}-${key}`;
  const count = refs.get(channelKey) || 0;
  if (count <= 1) {
    const ch = channels.get(channelKey);
    if (ch) ch.destroy();
    channels.delete(channelKey);
    refs.delete(channelKey);
  } else {
    refs.set(channelKey, count - 1);
  }
}

export function useCrossTabState<T>(
  key: string,
  initialValue: T,
  options?: Options<T>
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);
  const channelRef = useRef<CrossTabChannel<T> | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    channelRef.current = getChannel(key, initialValue, optionsRef.current);
    setState(channelRef.current.getValue());
    
    const unsubscribe = channelRef.current.subscribe((value) => {
      setState(value);
    });

    return () => {
      unsubscribe();
      releaseChannel(key, optionsRef.current?.channelName);
      channelRef.current = null;
    };
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    if (!channelRef.current) return;
    if (typeof value === 'function') {
      const updater = value as (prev: T) => T;
      channelRef.current.setValue(updater(channelRef.current.getValue()));
    } else {
      channelRef.current.setValue(value);
    }
  }, []);

  return [state, setValue];
}
