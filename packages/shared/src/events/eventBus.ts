import type { SimulationEvent, EventBus, EventHandler, EventMetadata } from './index.js';

type HandlerMap = Map<string, Set<EventHandler>>;

export class InMemoryEventBus implements EventBus {
  private handlers: HandlerMap = new Map();
  private allHandlers: Set<EventHandler> = new Set();
  private eventLog: SimulationEvent[] = [];
  private maxLogSize = 10000;

  publish<T>(event: SimulationEvent<T>): void {
    this.eventLog.push(event);
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        try {
          handler(event);
        } catch (e) {
          console.error(`Handler error for ${event.type}:`, e);
        }
      }
    }

    for (const handler of this.allHandlers) {
      try {
        handler(event);
      } catch (e) {
        console.error('Global handler error:', e);
      }
    }
  }

  subscribe<T>(type: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler as EventHandler);

    return () => {
      this.handlers.get(type)?.delete(handler as EventHandler);
    };
  }

  subscribeAll(handler: EventHandler): () => void {
    this.allHandlers.add(handler);
    return () => this.allHandlers.delete(handler);
  }

  async replay(events: SimulationEvent[]): Promise<void> {
    for (const event of events) {
      this.publish(event);
    }
  }

  getEventLog(): SimulationEvent[] {
    return [...this.eventLog];
  }

  clearLog(): void {
    this.eventLog = [];
  }

  setMaxLogSize(size: number): void {
    this.maxLogSize = size;
  }
}

export const eventBus = new InMemoryEventBus();

export function createEvent<T>(type: string, payload: T, metadata?: Partial<EventMetadata>): SimulationEvent<T> {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    timestamp: Date.now(),
    payload,
    metadata: {
      source: metadata?.source || 'unknown',
      ...(metadata?.correlationId ? { correlationId: metadata.correlationId } : {}),
      ...(metadata?.causationId ? { causationId: metadata.causationId } : {}),
      ...(metadata?.tags ? { tags: metadata.tags } : {}),
    },
  };
}