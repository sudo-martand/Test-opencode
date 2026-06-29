import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryEventBus } from '@cybersim/shared';
import {
  pid, uid, gid, fd, signal,
  OsKernelImpl, createDefaultKernelConfig,
  HostImpl, createDefaultHostConfig,
  ProcessState, SyscallNumber, ProcessImpl,
  Pid,
} from '../index.js';

describe('branded type constructors', () => {
  it('pid creates valid process IDs', () => {
    expect(pid(1)).toBe(1);
  });

  it('uid creates valid user IDs', () => {
    expect(uid(0)).toBe(0);
    expect(uid(1000)).toBe(1000);
  });

  it('gid creates valid group IDs', () => {
    expect(gid(0)).toBe(0);
  });

  it('fd creates valid file descriptors', () => {
    expect(fd(3)).toBe(3);
  });

  it('signal creates valid signal numbers', () => {
    expect(signal(9)).toBe(9);
  });
});

describe('ProcessImpl', () => {
  it('creates process with defaults', () => {
    const proc = new ProcessImpl();
    expect(proc.state).toBe(ProcessState.RUNNING);
    expect(proc.uid).toBe(uid(0));
    expect(proc.gid).toBe(gid(0));
    expect(proc.cwd).toBe('/');
    expect(proc.priority).toBe(20);
    expect(proc.nice).toBe(0);
  });

  it('uses provided options', () => {
    const proc = new ProcessImpl({
      name: 'test-process',
      args: ['arg1', 'arg2'],
    });
    expect(proc.name).toBe('test-process');
  });

  it('manages file descriptors', () => {
    const proc = new ProcessImpl();
    const newFd = proc.allocFd('/test.txt', 0, 42);
    expect(Number(newFd)).toBeGreaterThanOrEqual(3);
    expect(proc.freeFd(Number(newFd))).toBe(true);
  });

  it('terminate clears state', () => {
    const proc = new ProcessImpl();
    proc.terminate();
    expect(proc.state).toBe(ProcessState.DEAD);
  });

  it('signal SIGKILL transitions to DEAD', () => {
    const proc = new ProcessImpl();
    proc.signal(signal(9));
    expect(proc.state).toBe(ProcessState.DEAD);
  });

  it('signal SIGSTOP transitions to STOPPED', () => {
    const proc = new ProcessImpl();
    proc.signal(signal(19));
    expect(proc.state).toBe(ProcessState.STOPPED);
  });

  it('resume transitions back to RUNNING', () => {
    const proc = new ProcessImpl();
    proc.signal(signal(19));
    proc.resume();
    expect(proc.state).toBe(ProcessState.RUNNING);
  });
});

describe('OsKernelImpl', () => {
  let kernel: OsKernelImpl;

  beforeEach(() => {
    kernel = new OsKernelImpl(createDefaultKernelConfig());
  });

  it('creates with default config', () => {
    expect(kernel.config.hostname).toBe('localhost');
    expect(kernel.config.version).toBe('6.8.0-cybersim');
    expect(kernel.config.cpuCores).toBe(4);
    expect(kernel.config.memoryTotal).toBe(8 * 1024 * 1024 * 1024);
  });

  it('spawn creates a new process', async () => {
    await kernel.start();
    const proc = await kernel.spawn('/bin/echo', ['hello']);
    expect(proc).toBeDefined();
    expect(proc.name).toBe('echo');
    expect(kernel.processes.has(proc.pid as Pid)).toBe(true);
  });

  it('kill sends signal and cleans up', async () => {
    await kernel.start();
    const proc = await kernel.spawn('/bin/test', []);
    const result = kernel.kill(proc.pid as Pid, signal(9));
    expect(result).toBe(true);
    expect(kernel.processes.has(proc.pid as Pid)).toBe(false);
  });

  it('getProcess returns by pid', async () => {
    await kernel.start();
    const proc = await kernel.spawn('/bin/true', []);
    const found = kernel.getProcess(proc.pid as Pid);
    expect(found?.name).toBe('true');
  });

  it('start creates init and kthreadd', async () => {
    await kernel.start();
    expect(kernel.stats.processes).toBeGreaterThanOrEqual(3);
  });

  it('stats provides runtime metrics', async () => {
    await kernel.start();
    expect(kernel.stats.processes).toBeGreaterThan(0);
    expect(kernel.stats.running).toBeGreaterThan(0);
    expect(Array.isArray(kernel.stats.loadAverage)).toBe(true);
    expect(kernel.stats.loadAverage.length).toBe(3);
  });

  it('reset clears all processes', async () => {
    await kernel.start();
    await kernel.spawn('/bin/echo', ['hello']);
    kernel.reset();
    expect(kernel.processes.size).toBe(0);
  });

  it('setHostname updates hostname', () => {
    kernel.setHostname('newhost');
    expect(kernel.config.hostname).toBe('newhost');
  });

  it('stop clears processes', async () => {
    await kernel.start();
    kernel.stop();
    expect(kernel.processes.size).toBe(0);
  });
});

describe('syscall dispatch', () => {
  let kernel: OsKernelImpl;

  beforeEach(async () => {
    kernel = new OsKernelImpl(createDefaultKernelConfig());
    await kernel.start();
  });

  async function runSyscall(call: { number: SyscallNumber; args: bigint[]; pid: Pid }) {
    return kernel.syscall({
      number: call.number,
      args: call.args,
      pid: call.pid,
      uid: uid(0),
      timestamp: Date.now(),
    });
  }

  it('GETPID returns correct pid', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.GETPID,
      args: [],
      pid: proc.pid as Pid,
    });
    expect(result.retval).toBe(BigInt(Number(proc.pid)));
  });

  it('GETPPID returns parent pid', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.GETPPID,
      args: [],
      pid: proc.pid as Pid,
    });
    expect(result.retval).toBeGreaterThanOrEqual(0n);
  });

  it('GETUID returns 0', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.GETUID,
      args: [],
      pid: proc.pid as Pid,
    });
    expect(result.retval).toBe(1000n);
  });

  it('OPEN allocates file descriptor', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.OPEN,
      args: [0n, 0n],
      pid: proc.pid as Pid,
    });
    expect(result.retval).toBeGreaterThanOrEqual(0n);
  });

  it('CLOSE frees file descriptor', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const openResult = await runSyscall({
      number: SyscallNumber.OPEN,
      args: [0n, 0n],
      pid: proc.pid as Pid,
    });
    const closeResult = await runSyscall({
      number: SyscallNumber.CLOSE,
      args: [openResult.retval],
      pid: proc.pid as Pid,
    });
    expect(closeResult.retval).toBe(0n);
  });

  it('WRITE to stdout succeeds', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.WRITE,
      args: [1n, 0n, 5n],
      pid: proc.pid as Pid,
    });
    expect(result.retval).toBe(5n);
  });

  it('WRITE to invalid fd returns error', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.WRITE,
      args: [99n, 0n, 5n],
      pid: proc.pid as Pid,
    });
    expect(typeof result.errno).toBe('number');
    expect(result.errno).toBeGreaterThan(0);
  });

  it('BRK allocates memory', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.BRK,
      args: [0n],
      pid: proc.pid as Pid,
    });
    expect(result.retval).toBeGreaterThan(0n);
  });

  it('EXIT terminates process', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    await runSyscall({
      number: SyscallNumber.EXIT,
      args: [0n],
      pid: proc.pid as Pid,
    });
    expect(proc.state).toBe(ProcessState.DEAD);
  });

  it('NANOSLEEP returns success', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.NANOSLEEP,
      args: [1000000n, 0n],
      pid: proc.pid as Pid,
    });
    expect(result.retval).toBe(0n);
  });

  it('GETCWD returns root initially', async () => {
    const proc = await kernel.spawn('/bin/test', []);
    const result = await runSyscall({
      number: SyscallNumber.GETCWD,
      args: [0n, 0n],
      pid: proc.pid as Pid,
    });
    expect(result.retval).toBe(0n);
  });
});

describe('HostImpl', () => {
  it('creates host with network and kernel', () => {
    const config = createDefaultHostConfig('testhost');
    const host = new HostImpl(config);
    expect(host.config.hostname).toBe('testhost');
    expect(host.kernel).toBeDefined();
    expect(host.network).toBeDefined();
  });

  it('start and stop lifecycle', async () => {
    const host = new HostImpl(createDefaultHostConfig('testhost'));
    await host.start();
    expect(host.kernel.stats.processes).toBeGreaterThan(0);
    await host.stop();
  });

  it('reset clears state', async () => {
    const host = new HostImpl(createDefaultHostConfig('testhost'));
    await host.start();
    await host.reset();
    expect(host.kernel.stats.processes).toBe(0);
  });

  it('attach connects event bus', async () => {
    const bus = new InMemoryEventBus();
    const host = new HostImpl(createDefaultHostConfig('testhost'));
    host.attach(bus);
    const events: string[] = [];
    bus.subscribeAll((e) => { events.push(e.type); });
    await host.start();
    expect(events.some((t) => t.startsWith('host'))).toBe(true);
  });
});
