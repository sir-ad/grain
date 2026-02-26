/**
 * Event Bus
 * Simple event emitter for AI Semantics
 */

import type { EventCallback, EventPayload } from './types';

type EventMap = Map<string, Set<EventCallback>>;

export class EventBus {
  private events: EventMap = new Map();
  private onceEvents: WeakMap<EventCallback, EventCallback> = new WeakMap();

  /**
   * Subscribe to an event
   */
  on(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);

    // Return unsubscribe function
    return () => this.off(event, callback);
  }

  /**
   * Subscribe to an event once
   */
  once(event: string, callback: EventCallback): () => void {
    const wrappedCallback = ((payload: EventPayload) => {
      callback(payload);
      this.off(event, wrappedCallback);
    }) as EventCallback;
    
    this.onceEvents.set(callback, wrappedCallback);
    return this.on(event, wrappedCallback);
  }

  /**
   * Unsubscribe from an event
   */
  off(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      // Check for wrapped callback
      const wrapped = this.onceEvents.get(callback);
      if (wrapped) {
        callbacks.delete(wrapped);
        this.onceEvents.delete(callback);
      } else {
        callbacks.delete(callback);
      }
    }
  }

  /**
   * Emit an event
   */
  emit(event: string, payload?: EventPayload): void {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(cb => {
        try {
          cb(payload || {});
        } catch (error) {
          console.error(`Error in event handler for "${event}":`, error);
        }
      });
    }
  }

  /**
   * Remove all listeners for an event
   */
  clear(event?: string): void {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
      this.onceEvents = new WeakMap();
    }
  }

  /**
   * Get listener count for an event
   */
  listenerCount(event: string): number {
    return this.events.get(event)?.size || 0;
  }

  /**
   * Get all event names
   */
  eventNames(): string[] {
    return Array.from(this.events.keys());
  }
}

/**
 * Create a new event bus
 */
export function createEventBus(): EventBus {
  return new EventBus();
}
