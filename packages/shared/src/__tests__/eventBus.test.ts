import { describe, it, expect, vi } from 'vitest';
import { InMemoryEventBus, createEvent } from '../events/eventBus.js';

describe('InMemoryEventBus', () => {
  it('publishes and delivers typed events', () => {
    const bus = new InMemoryEventBus();
    const handler = vi.fn();

    bus.subscribe('test.event', handler);
    const event = createEvent('test.event', { data: 42 });

    bus.publish(event);
    expect(handler).toHaveBeenCalledWith(event);
  });

  it('supports unsubscribe', () => {
    const bus = new InMemoryEventBus();
    const handler = vi.fn();

    const unsub = bus.subscribe('test.event', handler);
    unsub();

    bus.publish(createEvent('test.event', {}));
    expect(handler).not.toHaveBeenCalled();
  });

  it('subscribes to all events', () => {
    const bus = new InMemoryEventBus();
    const handler = vi.fn();

    bus.subscribeAll(handler);
    bus.publish(createEvent('a', {}));
    bus.publish(createEvent('b', {}));

    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('replays events', async () => {
    const bus = new InMemoryEventBus();
    const handler = vi.fn();

    bus.subscribeAll(handler);
    const events = [
      createEvent('a', { n: 1 }),
      createEvent('b', { n: 2 }),
    ];

    await bus.replay(events);
    expect(handler).toHaveBeenCalledTimes(2);
  });

  it('maintains event log', () => {
    const bus = new InMemoryEventBus();
    bus.publish(createEvent('a', {}));
    bus.publish(createEvent('b', {}));

    expect(bus.getEventLog()).toHaveLength(2);
  });

  it('clears event log', () => {
    const bus = new InMemoryEventBus();
    bus.publish(createEvent('a', {}));
    bus.clearLog();
    expect(bus.getEventLog()).toHaveLength(0);
  });

  it('handles handler errors gracefully', () => {
    const bus = new InMemoryEventBus();
    const throwing = vi.fn(() => { throw new Error('handler error'); });
    const normal = vi.fn();

    bus.subscribe('test', throwing);
    bus.subscribe('test', normal);
    bus.publish(createEvent('test', {}));

    expect(normal).toHaveBeenCalled();
  });

  it('respects max log size', () => {
    const bus = new InMemoryEventBus();
    bus.setMaxLogSize(2);
    bus.publish(createEvent('a', {}));
    bus.publish(createEvent('b', {}));
    bus.publish(createEvent('c', {}));

    expect(bus.getEventLog()).toHaveLength(2);
  });
});

describe('createEvent', () => {
  it('creates event with metadata', () => {
    const event = createEvent('test', { x: 1 }, {
      source: 'test-suite',
      correlationId: 'corr-123',
      tags: ['unit-test'],
    });

    expect(event.type).toBe('test');
    expect(event.payload).toEqual({ x: 1 });
    expect(event.metadata.source).toBe('test-suite');
    expect(event.metadata.correlationId).toBe('corr-123');
    expect(event.metadata.tags).toEqual(['unit-test']);
  });
});
