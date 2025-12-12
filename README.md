# cross-tab

> Minimal, framework-agnostic cross-tab state synchronization using BroadcastChannel API with localStorage fallback

[![npm version](https://img.shields.io/npm/v/cross-tab.svg)](https://www.npmjs.com/package/cross-tab)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Bundle Size](https://img.shields.io/badge/bundle-8.3KB-green.svg)](https://bundlephobia.com/package/cross-tab)

## 📦 Installation

Install the package using your preferred package manager:

```bash
npm install cross-tab
```

```bash
yarn add cross-tab
```

```bash
pnpm add cross-tab
```

## 🔗 Links

- **📦 npm**: [https://www.npmjs.com/package/cross-tab](https://www.npmjs.com/package/cross-tab)
- **🔗 GitHub**: [https://github.com/tkhdev/cross-tab](https://github.com/tkhdev/cross-tab)
- **🚀 Live Demo**: [https://cross-tab.vercel.app](https://cross-tab.vercel.app)

## 📖 Introduction

`cross-tab` is a minimal, framework-agnostic library that keeps your application state synchronized across multiple browser tabs and windows in real-time. No polling, no server, no complex setup—just clean, efficient cross-tab communication.

### Why cross-tab?

- **🚀 Real-time sync** - State updates instantly across all tabs
- **📦 Zero dependencies** - No external dependencies (works with or without React)
- **🌐 Framework agnostic** - Works with React, Vue, Svelte, vanilla JavaScript, and more
- **🔄 SSR-safe** - Works seamlessly with Next.js, Remix, and other SSR frameworks
- **🎯 Automatic fallback** - Uses BroadcastChannel with localStorage fallback
- **💪 TypeScript** - Full TypeScript support with excellent type inference
- **💾 Optional persistence** - Save state to localStorage for recovery
- **🔧 Custom serialization** - Support for complex data types (Date, Map, Set, etc.)
- **⚡ Tiny bundle** - Only ~8.3KB (ESM) / ~8.4KB (CJS), ~1.9KB gzipped
- **🛡️ Bulletproof** - Handles edge cases, errors, and browser quirks gracefully

### Use Cases

- **Authentication** - Logout in one tab → all tabs logout automatically
- **Theme preferences** - Change theme once → all tabs update instantly
- **Shopping carts** - Add items in one tab → cart syncs across all tabs
- **Feature flags** - Admin updates flags → all tabs reflect changes immediately
- **User preferences** - Settings sync across all open tabs
- **Real-time collaboration** - Share state between multiple browser windows
- **Form data** - Auto-save and sync form state across tabs
- **Notifications** - Dismiss notifications in one tab, update all tabs

---

## 🚀 Quick Start

### React (with Hook)

```tsx
import { useCrossTabState } from 'cross-tab';

function App() {
  const [theme, setTheme] = useCrossTabState('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

**That's it!** Change the theme in one tab, and it updates instantly in all other tabs.

### Vanilla JavaScript / Framework Agnostic

```javascript
import { createCrossTabChannel } from 'cross-tab';

const channel = createCrossTabChannel('theme', 'light');

// Subscribe to changes
channel.subscribe((value) => {
  console.log('Theme changed:', value);
  document.body.className = value;
});

// Update value (syncs across all tabs)
channel.setValue('dark');
```

---

## 📚 Examples

### React Hook Examples

#### Basic Usage

```tsx
import { useCrossTabState } from 'cross-tab';

function Counter() {
  const [count, setCount] = useCrossTabState('counter', 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount((prev) => prev - 1)}>Decrement</button>
    </div>
  );
}
```

#### With Persistence

```tsx
import { useCrossTabState } from 'cross-tab';

function ThemeToggle() {
  const [theme, setTheme] = useCrossTabState('theme', 'light', {
    persist: true, // Theme persists across page reloads
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

#### Authentication Synchronization

```tsx
import { useCrossTabState } from 'cross-tab';

function AuthProvider({ children }) {
  const [auth, setAuth] = useCrossTabState('auth', null, {
    persist: true,
  });

  const handleLogin = (user) => {
    setAuth(user);
  };

  const handleLogout = () => {
    setAuth(null); // Logout in one tab → all tabs logout
  };

  return (
    <AuthContext.Provider value={{ auth, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### Shopping Cart Synchronization

```tsx
import { useCrossTabState } from 'cross-tab';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

function ShoppingCart() {
  const [cart, setCart] = useCrossTabState<CartItem[]>('cart', [], {
    persist: true,
  });

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  return (
    <div>
      <h2>Shopping Cart ({cart.length} items)</h2>
      {cart.map((item) => (
        <div key={item.id}>
          {item.name} - ${item.price} x {item.quantity}
          <button onClick={() => removeFromCart(item.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}
```

#### Custom Serialization for Complex Types

```tsx
import { useCrossTabState } from 'cross-tab';

interface ComplexState {
  date: Date;
  map: Map<string, number>;
  set: Set<string>;
}

function ComplexStateDemo() {
  const [state, setState] = useCrossTabState<ComplexState>(
    'complex-state',
    {
      date: new Date(),
      map: new Map([['key1', 1]]),
      set: new Set(['value1']),
    },
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
  );

  return (
    <div>
      <p>Date: {state.date.toLocaleString()}</p>
      <p>Map size: {state.map.size}</p>
      <p>Set size: {state.set.size}</p>
    </div>
  );
}
```

### Framework Agnostic Examples

#### Vanilla JavaScript

```javascript
import { createCrossTabChannel } from 'cross-tab';

// Create a channel
const themeChannel = createCrossTabChannel('theme', 'light', {
  persist: true,
});

// Subscribe to changes
themeChannel.subscribe((theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  console.log('Theme updated:', theme);
});

// Update theme (syncs across all tabs)
document.getElementById('dark-mode-btn').addEventListener('click', () => {
  themeChannel.setValue('dark');
});
```

#### Vue 3 Composition API

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { createCrossTabChannel } from 'cross-tab';

const count = ref(0);
let channel;

onMounted(() => {
  channel = createCrossTabChannel('counter', 0);
  
  channel.subscribe((value) => {
    count.value = value;
  });
  
  count.value = channel.getValue();
});

onUnmounted(() => {
  channel?.destroy();
});

const increment = () => {
  channel.setValue(count.value + 1);
};
</script>
```

#### Svelte

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';
  import { createCrossTabChannel } from 'cross-tab';
  
  let count = 0;
  let channel;
  
  onMount(() => {
    channel = createCrossTabChannel('counter', 0);
    
    channel.subscribe((value) => {
      count = value;
    });
    
    count = channel.getValue();
  });
  
  onDestroy(() => {
    channel?.destroy();
  });
  
  function increment() {
    channel.setValue(count + 1);
  }
</script>

<div>
  <p>Count: {count}</p>
  <button on:click={increment}>Increment</button>
</div>
```

---

## 🔧 API Reference

### `useCrossTabState<T>(key, initialValue, options?)`

React hook that synchronizes state across browser tabs/windows.

#### Parameters

- **`key: string`** - Unique key for this state. Must be consistent across all tabs that should share this state.
- **`initialValue: T`** - Initial state value. Used if state doesn't exist yet or if persistence is disabled.
- **`options?: Options<T>`** - Optional configuration object (see [Options](#options) below).

#### Returns

Returns a tuple `[value, setValue]` similar to React's `useState`:

- **`value: T`** - Current state value
- **`setValue: (value: T | ((prev: T) => T)) => void`** - Function to update state. Supports both direct values and functional updates.

#### Type Parameters

- **`T`** - The type of the state value. Inferred from `initialValue` if not explicitly provided.

#### Examples

```tsx
// Basic usage
const [count, setCount] = useCrossTabState('counter', 0);

// With TypeScript
const [user, setUser] = useCrossTabState<User | null>('user', null);

// With options
const [theme, setTheme] = useCrossTabState('theme', 'light', {
  persist: true,
});

// Functional updates
setCount((prev) => prev + 1);
```

---

### `createCrossTabChannel<T>(key, initialValue, options?)`

Framework-agnostic API for using cross-tab state outside React. Useful for vanilla JavaScript, Vue, Svelte, or other frameworks.

#### Parameters

- **`key: string`** - Unique key for this state
- **`initialValue: T`** - Initial state value
- **`options?: Options<T>`** - Optional configuration (same as `useCrossTabState`)

#### Returns

Returns a channel object with the following methods:

- **`getValue(): T`** - Get the current value
- **`setValue(value: T): void`** - Set a new value (syncs across all tabs)
- **`subscribe(callback: Subscriber<T>): Unsubscribe`** - Subscribe to value changes
- **`destroy(): void`** - Destroy the channel and clean up resources

#### Example

```typescript
import { createCrossTabChannel } from 'cross-tab';

// Create a channel
const channel = createCrossTabChannel('cart', []);

// Subscribe to updates
const unsubscribe = channel.subscribe((value) => {
  console.log('Cart updated:', value);
});

// Update value (syncs across all tabs)
channel.setValue([{ id: 1, name: 'Item' }]);

// Get current value
const current = channel.getValue();

// Clean up when done
channel.destroy();
unsubscribe();
```

---

### Options

Configuration options for `useCrossTabState` and `createCrossTabChannel`:

```typescript
type Options<T> = {
  channelName?: string;        // Default: 'xts'
  persist?: boolean;           // Default: false
  serialize?: (v: T) => string;
  deserialize?: (v: string) => T;
};
```

#### `channelName?: string`

Custom channel name for isolating different state groups. Channels with different names don't interfere with each other.

**Default:** `'xts'`

**Example:**
```tsx
const [cart, setCart] = useCrossTabState('cart', [], {
  channelName: 'ecommerce', // Isolated channel
});
```

#### `persist?: boolean`

Whether to persist state to localStorage. When enabled, state survives page reloads and is restored on mount.

**Default:** `false`

**Example:**
```tsx
const [theme, setTheme] = useCrossTabState('theme', 'light', {
  persist: true, // Theme persists across reloads
});
```

**Note:** Persistence requires serializable values. Use custom `serialize`/`deserialize` for complex types.

#### `serialize?: (value: T) => string`

Custom serialization function for persisting values. Use this for complex data types that can't be serialized with `JSON.stringify`.

**Default:** `JSON.stringify`

**Example:**
```tsx
const [state, setState] = useCrossTabState('state', { date: new Date() }, {
  persist: true,
  serialize: (value) => JSON.stringify({
    ...value,
    date: value.date.toISOString(),
  }),
});
```

#### `deserialize?: (value: string) => T`

Custom deserialization function for restoring values. Must be the inverse of `serialize`.

**Default:** `JSON.parse`

**Example:**
```tsx
const [state, setState] = useCrossTabState('state', { date: new Date() }, {
  persist: true,
  serialize: (value) => JSON.stringify({
    ...value,
    date: value.date.toISOString(),
  }),
  deserialize: (str) => {
    const parsed = JSON.parse(str);
    return {
      ...parsed,
      date: new Date(parsed.date),
    };
  },
});
```

---

## 🌐 Browser Support

### Modern Browsers (BroadcastChannel API)

- ✅ **Chrome/Edge** 54+
- ✅ **Firefox** 38+
- ✅ **Safari** 15.4+
- ✅ **Opera** 41+

### Older Browsers (localStorage Fallback)

For browsers without BroadcastChannel support, the package automatically falls back to localStorage-based synchronization using the `storage` event.

**Note:** localStorage fallback has some limitations:
- Storage events only fire for **other tabs**, not the tab that made the change
- Slightly higher latency than BroadcastChannel
- Works in all modern browsers including IE 9+

---

## 🔍 How It Works

### Architecture

1. **Primary Transport**: Uses `BroadcastChannel` API for fast, efficient communication between tabs
2. **Fallback Transport**: Falls back to `localStorage` + `storage` events for older browsers
3. **Self-Broadcast Filtering**: Automatically ignores messages from the same tab using unique tab IDs
4. **Persistence**: Optional localStorage persistence for state recovery across page reloads
5. **Channel Management**: Singleton pattern ensures channels are reused efficiently

### Message Flow

```
Tab 1: setValue(newValue)
  ↓
Channel: Create message with tabId, timestamp, value
  ↓
Transport: BroadcastChannel.postMessage() or localStorage.setItem()
  ↓
Other Tabs: Receive message via BroadcastChannel.onmessage or storage event
  ↓
Channel: Filter self-broadcasts, update state
  ↓
Subscribers: Notify all subscribers with new value
  ↓
React: Hook updates, component re-renders
```

### Transport Selection

The package automatically selects the best available transport:

1. **BroadcastChannel** (preferred) - Fast, efficient, designed for cross-tab communication
2. **localStorage** (fallback) - Works in older browsers, uses storage events
3. **No-op** (SSR) - Returns initial value on server, no-op functions

---

## ⚡ Performance

### Optimizations

- **Channel Reuse**: Multiple hook instances with the same key share the same channel
- **Message Filtering**: Self-broadcasts are filtered before processing
- **Lazy Initialization**: Channels are created only when needed
- **Efficient Cleanup**: Proper resource cleanup prevents memory leaks

### Benchmarks

- **BroadcastChannel**: ~1-2ms latency for cross-tab updates
- **localStorage**: ~5-10ms latency (depends on browser)
- **Memory**: ~2-5KB per channel instance
- **Bundle Size**: ~8.3KB (ESM) / ~8.4KB (CJS) minified, ~1.9KB gzipped

---

## 🛠️ Advanced Usage

### SSR (Server-Side Rendering)

The hook is SSR-safe and works seamlessly with Next.js, Remix, and other SSR frameworks.

```tsx
// Works in both client and server
function MyComponent() {
  // On server: returns initialValue, setValue is no-op
  // On client: full cross-tab synchronization
  const [state, setState] = useCrossTabState('key', 'initial');
  
  return <div>{state}</div>;
}
```

### Custom Channel Names

Isolate different state groups using custom channel names:

```tsx
// User settings on one channel
const [settings, setSettings] = useCrossTabState('settings', {}, {
  channelName: 'user-settings',
});

// Shopping cart on another channel
const [cart, setCart] = useCrossTabState('cart', [], {
  channelName: 'ecommerce',
});
```

### Error Handling

The package handles errors gracefully:

- **localStorage quota exceeded**: Silently fails, doesn't break your app
- **Invalid JSON**: Clears corrupted data, uses initial value
- **Transport errors**: Falls back gracefully when possible

---

## ❓ FAQ

### Q: Does it work with Next.js / Remix / other SSR frameworks?

**A:** Yes! The hook is SSR-safe. On the server, it returns the initial value and setValue is a no-op. On the client, full cross-tab synchronization works.

### Q: What happens if localStorage is full?

**A:** The package silently handles quota exceeded errors. Persistence will fail, but your app continues to work with in-memory state.

### Q: Can I use it outside React?

**A:** Yes! Use `createCrossTabChannel` for non-React contexts:

```typescript
import { createCrossTabChannel } from 'cross-tab';

const channel = createCrossTabChannel('key', initialValue);
```

### Q: Does it work in private/incognito mode?

**A:** Yes, but localStorage may be restricted. The package handles this gracefully.

### Q: Can I sync complex objects like Date, Map, Set?

**A:** Yes! Use custom `serialize` and `deserialize` functions. See the [Custom Serialization](#custom-serialization-for-complex-types) example above.

### Q: Does it work across different origins?

**A:** No. Cross-tab synchronization only works for tabs from the same origin (same protocol, domain, and port).

### Q: What's the difference between `persist: true` and regular state?

**A:** With `persist: true`, state is saved to localStorage and survives page reloads. Without it, state is only in memory and resets on reload.

### Q: Is it production-ready?

**A:** Yes! The library is minimal, well-tested, and handles edge cases gracefully. It's designed to be bulletproof and production-ready.

---

## 📄 License

MIT © [tkhdev](https://github.com/tkhdev)

---

## 🙏 Acknowledgments

- Built with modern web APIs ([BroadcastChannel](https://developer.mozilla.org/en-US/docs/Web/API/BroadcastChannel))
- Inspired by the need for simple, efficient cross-tab state synchronization
- Framework-agnostic design for maximum flexibility

---

**Made with ❤️ - Minimal, framework-agnostic, bulletproof**
