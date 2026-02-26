/**
 * State Machine
 * Manages state transitions for primitives
 */

import type { StateTransition, StateMachineConfig, StateChangeEvent } from './types';

export class StateMachine {
  private config: StateMachineConfig;
  private current: string;
  private history: string[] = [];
  private listeners: Map<string, Set<(event: StateChangeEvent) => void>> = new Map();

  constructor(config: StateMachineConfig) {
    this.config = config;
    this.current = config.initial;
  }

  /**
   * Transition to a new state
   */
  transition(event: string, payload?: Record<string, unknown>): StateChangeEvent {
    const fromState = this.current;
    const allowedTransitions = this.config.transitions[fromState];
    
    if (!allowedTransitions) {
      throw new Error(`No transitions defined from state: ${fromState}`);
    }

    const toState = allowedTransitions[event];
    
    if (!toState) {
      throw new Error(`Invalid transition: ${fromState} --${event}--> (no target)`);
    }

    this.history.push(fromState);
    this.current = toState;

    const stateChangeEvent: StateChangeEvent = {
      from: fromState,
      to: toState,
      event,
      payload,
      timestamp: Date.now()
    };

    this.emit('transition', stateChangeEvent);
    this.emit(toState, stateChangeEvent);

    return stateChangeEvent;
  }

  /**
   * Check if a transition is valid
   */
  canTransition(event: string): boolean {
    const allowedTransitions = this.config.transitions[this.current];
    return !!(allowedTransitions && allowedTransitions[event]);
  }

  /**
   * Get current state
   */
  getState(): string {
    return this.current;
  }

  /**
   * Get state history
   */
  getHistory(): string[] {
    return [...this.history];
  }

  /**
   * Reset to initial state
   */
  reset(): void {
    this.current = this.config.initial;
    this.history = [];
    this.emit('reset', { from: this.current, to: this.config.initial, event: 'reset', timestamp: Date.now() });
  }

  /**
   * Subscribe to state changes
   */
  on(event: string, callback: (event: StateChangeEvent) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * Emit an event
   */
  private emit(event: string, data: StateChangeEvent): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

/**
 * Pre-built state machines for common primitives
 */
export const STATE_MACHINES = {
  stream: {
    initial: 'idle',
    states: ['idle', 'generating', 'paused', 'resuming', 'complete', 'error'],
    transitions: {
      idle: { 'start': 'generating' },
      generating: { 'chunk': 'generating', 'pause': 'paused', 'complete': 'complete', 'error': 'error' },
      paused: { 'resume': 'resuming', 'cancel': 'idle' },
      resuming: { 'resume': 'generating', 'error': 'error' },
      complete: { 'start': 'generating' },
      error: { 'retry': 'generating', 'cancel': 'idle' }
    }
  },

  tool: {
    initial: 'pending',
    states: ['pending', 'running', 'complete', 'skipped', 'error', 'retry', 'cancelled'],
    transitions: {
      pending: { 'start': 'running', 'skip': 'skipped', 'cancel': 'cancelled' },
      running: { 'complete': 'complete', 'error': 'error', 'cancel': 'cancelled' },
      error: { 'retry': 'retry', 'cancel': 'cancelled' },
      retry: { 'retry': 'running', 'cancel': 'cancelled' },
      complete: { 'start': 'running' },
      skipped: {},
      cancelled: {}
    }
  },

  approve: {
    initial: 'pending',
    states: ['pending', 'showing', 'approved', 'denied', 'expired', 'executing', 'complete'],
    transitions: {
      pending: { 'show': 'showing', 'expire': 'expired' },
      showing: { 'approve': 'approved', 'deny': 'denied', 'expire': 'expired' },
      approved: { 'execute': 'executing' },
      executing: { 'complete': 'complete' },
      denied: {},
      expired: {},
      complete: {}
    }
  }
} as const;

/**
 * Create a state machine for a primitive
 */
export function createStateMachine(primitive: keyof typeof STATE_MACHINES): StateMachine {
  const config = STATE_MACHINES[primitive];
  if (!config) {
    throw new Error(`Unknown primitive: ${primitive}`);
  }
  return new StateMachine(config);
}
