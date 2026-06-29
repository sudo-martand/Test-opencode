import { describe, it, expect } from 'vitest';
import { InMemoryEventBus } from '@cybersim/shared';
import { TimeAuthority, createDefaultTimeConfig } from '@cybersim/time';
import { SimulationKernelImpl, BaseSimulationModule, createDefaultKernelConfig } from '../index.js';

describe('SimulationKernelImpl', () => {
  it('creates with valid config', () => {
    const eventBus = new InMemoryEventBus();
    const time = new TimeAuthority(createDefaultTimeConfig(), 42);
    const kernel = new SimulationKernelImpl(createDefaultKernelConfig(42), time, eventBus);
    expect(kernel.config.seed).toBe(42);
  });

  it('mounts and unmounts modules', async () => {
    const eventBus = new InMemoryEventBus();
    const time = new TimeAuthority(createDefaultTimeConfig(), 42);
    const kernel = new SimulationKernelImpl(createDefaultKernelConfig(42), time, eventBus);

    class TestModule extends BaseSimulationModule {
      name = 'test';
      version = '1.0.0';
      reset() {}
      dispose() {}
    }

    const mod = new TestModule();
    await kernel.mount(mod);
    expect(kernel.getModule('test')).toBe(mod);

    await kernel.unmount('test');
    expect(kernel.getModule('test')).toBeUndefined();
  });

  it('starts and stops', async () => {
    const eventBus = new InMemoryEventBus();
    const time = new TimeAuthority(createDefaultTimeConfig(), 42);
    const kernel = new SimulationKernelImpl(createDefaultKernelConfig(42), time, eventBus);
    await kernel.start();
    await kernel.stop();
  });

  it('provides metrics', () => {
    const eventBus = new InMemoryEventBus();
    const time = new TimeAuthority(createDefaultTimeConfig(), 42);
    const kernel = new SimulationKernelImpl(createDefaultKernelConfig(42), time, eventBus);
    const metrics = kernel.metrics();
    expect(metrics.moduleCount).toBe(0);
    expect(typeof metrics.uptime).toBe('number');
  });

  it('resets cleanly', async () => {
    const eventBus = new InMemoryEventBus();
    const time = new TimeAuthority(createDefaultTimeConfig(), 42);
    const kernel = new SimulationKernelImpl(createDefaultKernelConfig(42), time, eventBus);
    await kernel.start();
    kernel.step();
    await kernel.reset();
    expect(kernel.metrics().moduleCount).toBe(0);
  });
});
