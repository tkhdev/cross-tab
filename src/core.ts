export type Subscriber<T> = (value: T) => void;
export type Unsubscribe = () => void;
export type Options<T> = {
  channelName?: string;
  persist?: boolean;
  serialize?: (v: T) => string;
  deserialize?: (v: string) => T;
};

let tabId: string | null = null;
function getTabId(): string {
  if (typeof window === 'undefined') return 'server';
  if (tabId) return tabId;
  
  try {
    const stored = sessionStorage.getItem('xts-tid');
    if (stored) return tabId = stored;
  } catch {
    // Ignore sessionStorage errors
  }
  
  tabId = `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  try {
    sessionStorage.setItem('xts-tid', tabId);
  } catch {
    // Ignore sessionStorage errors
  }
  return tabId;
}

function createTransport(channelName: string) {
  if (typeof window === 'undefined') {
    return {
      publish: () => {},
      subscribe: () => () => {},
      destroy: () => {},
    };
  }

  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel(channelName);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const listeners = new Set<Subscriber<any>>();
      
      bc.onmessage = (e) => {
        const msg = e.data;
        if (msg && typeof msg === 'object' && msg.value !== undefined && msg.tabId !== getTabId()) {
          listeners.forEach(fn => {
            try { fn(msg); } catch {
              // Ignore subscriber errors
            }
          });
        }
      };

      return {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        publish: (msg: any) => {
          try {
            bc.postMessage(typeof msg === 'object' && msg !== null ? msg : { value: msg, tabId: getTabId(), timestamp: Date.now() });
          } catch {
            // Ignore postMessage errors
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        subscribe: (fn: Subscriber<any>): Unsubscribe => {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
        destroy: () => {
          bc.close();
          listeners.clear();
        },
      };
    } catch {
      // Fallback to localStorage if BroadcastChannel fails
    }
  }

  const key = `xts-${channelName}`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const listeners = new Set<Subscriber<any>>();
  let handler: ((e: StorageEvent) => void) | null = null;

  if (typeof window !== 'undefined') {
    handler = (e: StorageEvent) => {
      if (e.key !== key || !e.newValue) return;
      try {
        const msg = JSON.parse(e.newValue);
        if (msg && typeof msg === 'object' && msg.value !== undefined && msg.tabId !== getTabId()) {
          listeners.forEach(fn => {
            try { fn(msg); } catch {
              // Ignore subscriber errors
            }
          });
        }
      } catch {
        // Ignore JSON parse errors
      }
    };
    window.addEventListener('storage', handler);
  }

  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    publish: (msg: any) => {
      if (typeof window === 'undefined') return;
      try {
        const message = typeof msg === 'object' && msg !== null ? msg : { value: msg, tabId: getTabId(), timestamp: Date.now() };
        localStorage.setItem(key, JSON.stringify(message));
      } catch {
        // Ignore localStorage errors (quota exceeded, etc.)
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscribe: (fn: Subscriber<any>): Unsubscribe => {
      listeners.add(fn);
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem(key);
          if (stored) {
            const msg = JSON.parse(stored);
            if (msg && typeof msg === 'object' && msg.value !== undefined) fn(msg);
          }
        } catch {
          // Ignore JSON parse errors
        }
      }
      return () => listeners.delete(fn);
    },
    destroy: () => {
      if (handler && typeof window !== 'undefined') {
        window.removeEventListener('storage', handler);
      }
      listeners.clear();
    },
  };
}

const transports = new Map<string, ReturnType<typeof createTransport>>();
const transportRefs = new Map<string, number>();

function getTransport(channelName: string) {
  if (!transports.has(channelName)) {
    transports.set(channelName, createTransport(channelName));
    transportRefs.set(channelName, 0);
  }
  const refs = transportRefs.get(channelName)!;
  transportRefs.set(channelName, refs + 1);
  return transports.get(channelName)!;
}

function releaseTransport(channelName: string) {
  const refs = transportRefs.get(channelName) || 0;
  if (refs <= 1) {
    const t = transports.get(channelName);
    if (t) t.destroy();
    transports.delete(channelName);
    transportRefs.delete(channelName);
  } else {
    transportRefs.set(channelName, refs - 1);
  }
}

export class CrossTabChannel<T> {
  private value: T;
  private subscribers = new Set<Subscriber<T>>();
  private transport: ReturnType<typeof createTransport>;
  private storageKey: string;
  private serialize: (v: T) => string;
  private deserialize: (v: string) => T;

  constructor(
    private key: string,
    initialValue: T,
    private options: Options<T> = {}
  ) {
    this.value = initialValue;
    this.storageKey = `xts-${key}`;
    this.serialize = options.serialize || ((v: T) => JSON.stringify(v));
    this.deserialize = options.deserialize || ((v: string) => JSON.parse(v));
    
    this.transport = getTransport(options.channelName || 'xts');
    
    if (options.persist && typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored && stored !== 'undefined' && stored.trim()) {
          this.value = this.deserialize(stored);
        }
      } catch {
        // Ignore deserialization errors, use initial value
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const unsubscribe = this.transport.subscribe((msg: any) => {
      if (typeof msg !== 'object' || msg === null) return;
      if (msg.key !== this.key) return;
      if (msg.value === undefined) return;
      
      this.value = msg.value;
      if (this.options.persist && typeof window !== 'undefined') {
        try {
          const serialized = this.serialize(msg.value);
          if (serialized && serialized !== 'undefined') {
            localStorage.setItem(this.storageKey, serialized);
          }
        } catch {
          // Ignore localStorage errors
        }
      }
      this.subscribers.forEach(fn => {
        try { fn(msg.value); } catch {
          // Ignore subscriber errors
        }
      });
    });
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any)._unsubscribe = unsubscribe;
  }

  getValue(): T {
    return this.value;
  }

  setValue(value: T): void {
    if (value === undefined) return;
    this.value = value;
    
    if (this.options.persist && typeof window !== 'undefined') {
      try {
        const serialized = this.serialize(value);
        if (serialized && serialized !== 'undefined') {
          localStorage.setItem(this.storageKey, serialized);
        }
      } catch {
        // Ignore localStorage errors
      }
    }
    
    this.transport.publish({ value, key: this.key, tabId: getTabId(), timestamp: Date.now() });
    this.subscribers.forEach(fn => {
      try { fn(value); } catch {
        // Ignore subscriber errors
      }
    });
  }

  subscribe(fn: Subscriber<T>): Unsubscribe {
    this.subscribers.add(fn);
    try { fn(this.value); } catch {
      // Ignore subscriber errors
    }
    return () => this.subscribers.delete(fn);
  }

  destroy(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((this as any)._unsubscribe) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any)._unsubscribe();
    }
    releaseTransport(this.options.channelName || 'xts');
    this.subscribers.clear();
  }
}

export function createCrossTabChannel<T>(
  key: string,
  initialValue: T,
  options?: Options<T>
) {
  const channel = new CrossTabChannel(key, initialValue, options);
  return {
    getValue: () => channel.getValue(),
    setValue: (value: T) => channel.setValue(value),
    subscribe: (fn: Subscriber<T>) => channel.subscribe(fn),
    destroy: () => channel.destroy(),
  };
}

