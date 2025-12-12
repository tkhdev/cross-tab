import { beforeEach, afterEach, vi } from 'vitest';

// Mock BroadcastChannel
class MockBroadcastChannel {
  name: string;
  onmessage: ((event: MessageEvent) => void) | null = null;
  private listeners: Set<(event: MessageEvent) => void> = new Set();

  constructor(name: string) {
    this.name = name;
  }

  postMessage(message: any) {
    const event = new MessageEvent('message', { data: message });
    this.listeners.forEach(listener => listener(event));
    if (this.onmessage) {
      this.onmessage(event);
    }
  }

  close() {
    this.listeners.clear();
    this.onmessage = null;
  }

  addEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (type === 'message') {
      this.listeners.add(listener);
    }
  }

  removeEventListener(type: string, listener: (event: MessageEvent) => void) {
    if (type === 'message') {
      this.listeners.delete(listener);
    }
  }
}

// Setup
beforeEach(() => {
  // Clear localStorage and sessionStorage
  localStorage.clear();
  sessionStorage.clear();
  
  // Mock BroadcastChannel
  (global as any).BroadcastChannel = MockBroadcastChannel;
  
  // Reset tabId by clearing sessionStorage
  sessionStorage.removeItem('xts-tid');
});

afterEach(() => {
  // Clear all storage
  localStorage.clear();
  sessionStorage.clear();
  
  // Clean up any remaining channels/transports
  vi.clearAllMocks();
});

