import type { EventBus, SimulationEvent } from '@cybersim/shared';
import type { TimeAuthority, TimeConfig } from '@cybersim/time';

export interface SimulationModule {
  readonly name: string;
  readonly version: string;
  init(kernel: SimulationKernel): Promise<void> | void;
  reset(): void;
  dispose(): void;
}

export interface KernelConfig {
  time: TimeConfig;
  modules: string[];
  maxHosts: number;
  maxConnections: number;
  seed: number;
}

export interface KernelMetrics {
  tickRate: number;
  moduleCount: number;
  eventCount: number;
  memoryUsage: number;
  uptime: number;
}

export interface SimulationKernel {
  readonly config: KernelConfig;
  readonly time: TimeAuthority;
  readonly eventBus: EventBus;

  mount(module: SimulationModule): Promise<void>;
  unmount(name: string): Promise<void>;
  getModule<T extends SimulationModule>(name: string): T | undefined;

  start(): Promise<void>;
  stop(): Promise<void>;
  pause(): void;
  resume(): void;
  step(): void;

  metrics(): KernelMetrics;
  reset(): Promise<void>;
  dispose(): void;
}

export abstract class BaseSimulationModule implements SimulationModule {
  abstract readonly name: string;
  abstract readonly version: string;
  protected kernel?: SimulationKernel;

  init(kernel: SimulationKernel): void | Promise<void> {
    this.kernel = kernel;
  }

  abstract reset(): void;
  abstract dispose(): void;
}

export class SimulationKernelImpl implements SimulationKernel {
  readonly config: KernelConfig;
  readonly time: TimeAuthority;
  readonly eventBus: EventBus;
  private modules: Map<string, SimulationModule> = new Map();
  private running: boolean = false;
  private _startTime: number = 0;

  constructor(config: KernelConfig, time: TimeAuthority, eventBus: EventBus) {
    this.config = config;
    this.time = time;
    this.eventBus = eventBus;
  }

  async mount(module: SimulationModule): Promise<void> {
    if (this.modules.has(module.name)) {
      throw new Error(`Module "${module.name}" already mounted`);
    }
    await module.init(this);
    this.modules.set(module.name, module);
    this.eventBus.publish({
      id: `kernel-mount-${module.name}`,
      type: 'kernel.module.mount',
      timestamp: Date.now(),
      payload: { name: module.name, version: module.version },
      metadata: { source: 'kernel' },
    });
  }

  async unmount(name: string): Promise<void> {
    const module = this.modules.get(name);
    if (!module) throw new Error(`Module "${name}" not found`);
    module.dispose();
    this.modules.delete(name);
    this.eventBus.publish({
      id: `kernel-unmount-${name}`,
      type: 'kernel.module.unmount',
      timestamp: Date.now(),
      payload: { name },
      metadata: { source: 'kernel' },
    });
  }

  getModule<T extends SimulationModule>(name: string): T | undefined {
    return this.modules.get(name) as T | undefined;
  }

  async start(): Promise<void> {
    this.running = true;
    this._startTime = Date.now();
    this.eventBus.publish({
      id: 'kernel-start',
      type: 'kernel.start',
      timestamp: Date.now(),
      payload: { config: this.config },
      metadata: { source: 'kernel' },
    });
  }

  async stop(): Promise<void> {
    this.running = false;
    this.eventBus.publish({
      id: 'kernel-stop',
      type: 'kernel.stop',
      timestamp: Date.now(),
      payload: {},
      metadata: { source: 'kernel' },
    });
  }

  pause(): void { this.time.getClock().pause(); }
  resume(): void { this.time.getClock().resume(); }

  step(): void {
    if (!this.running) return;
    this.time.tick();
  }

  metrics(): KernelMetrics {
    return {
      tickRate: this.time.getClock()['tick'] ?? 0,
      moduleCount: this.modules.size,
      eventCount: this.eventBus.getEventLog().length,
      memoryUsage: 0,
      uptime: Date.now() - this._startTime,
    };
  }

  async reset(): Promise<void> {
    for (const [name, module] of this.modules) {
      module.reset();
    }
    this.time.reset();
    this.eventBus.clearLog();
    this.running = false;
  }

  dispose(): void {
    for (const [name, module] of this.modules) {
      module.dispose();
    }
    this.modules.clear();
    this.eventBus.clearLog();
  }
}

export function createDefaultKernelConfig(seed?: number): KernelConfig {
  return {
    time: {
      tickRate: 16,
      maxSteps: 1_000_000,
      realtime: true,
      startTime: 0,
    },
    modules: [],
    maxHosts: 256,
    maxConnections: 65535,
    seed: seed ?? Date.now(),
  };
}
