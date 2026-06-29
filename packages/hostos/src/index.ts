import type { EventBus } from '@cybersim/shared';
import { uid as generateUid, createEvent } from '@cybersim/shared';
import type { NetworkStack, NetworkStackConfig } from '@cybersim/netstack';
import { NetworkStackImpl, createDefaultStackConfig } from '@cybersim/netstack';

export type Pid = number & { readonly __brand: 'pid' };
export type Uid = number & { readonly __brand: 'uid' };
export type Gid = number & { readonly __brand: 'gid' };
export type Fd = number & { readonly __brand: 'fd' };
export type Signal = number & { readonly __brand: 'signal' };

export function pid(value: number): Pid { return value as Pid; }
export function uid(value: number): Uid { return value as Uid; }
export function gid(value: number): Gid { return value as Gid; }
export function fd(value: number): Fd { return value as Fd; }
export function signal(value: number): Signal { return value as Signal; }

export enum ProcessState {
  RUNNING = 'RUNNING',
  SLEEPING = 'SLEEPING',
  STOPPED = 'STOPPED',
  ZOMBIE = 'ZOMBIE',
  DEAD = 'DEAD',
}

export enum SyscallNumber {
  READ = 0,
  WRITE = 1,
  OPEN = 2,
  CLOSE = 3,
  STAT = 4,
  FSTAT = 5,
  LSEEK = 8,
  MMAP = 9,
  MUNMAP = 11,
  BRK = 12,
  CLONE = 56,
  FORK = 57,
  EXECVE = 59,
  EXIT = 60,
  WAIT4 = 61,
  KILL = 62,
  IOCTL = 16,
  POLL = 7,
  SOCKET = 41,
  CONNECT = 42,
  ACCEPT = 43,
  SENDTO = 44,
  RECVFROM = 45,
  SENDMSG = 46,
  RECVMSG = 47,
  SHUTDOWN = 48,
  BIND = 49,
  LISTEN = 50,
  GETDENTS = 78,
  GETCWD = 79,
  CHDIR = 80,
  OPENAT = 257,
  MKDIRAT = 258,
  UNAME = 63,
  GETPID = 39,
  GETPPID = 110,
  GETUID = 102,
  SETUID = 105,
  SIGACTION = 13,
  SIGPROCMASK = 14,
  SIGRETURN = 15,
  NANOSLEEP = 35,
  GETTIMEOFDAY = 96,
  CLOCK_GETTIME = 228,
}

export interface SyscallContext {
  number: SyscallNumber;
  args: bigint[];
  pid: Pid;
  uid: Uid;
  timestamp: number;
}

export interface SyscallResult {
  retval: bigint;
  errno?: number;
}

export interface FileDescriptor {
  readonly fd: Fd;
  readonly path: string;
  readonly flags: number;
  readonly position: number;
  readonly inode: number;
}

export interface MemoryRegion {
  start: bigint;
  end: bigint;
  perms: string;
  offset: bigint;
  dev: string;
  inode: number;
  path: string;
}

export interface ProcessMemory {
  regions: MemoryRegion[];
  heap: { start: bigint; end: bigint };
  stack: { start: bigint; end: bigint };
}

export interface Thread {
  readonly tid: number;
  readonly pid: Pid;
  readonly state: ProcessState;
  readonly registers: Record<string, bigint>;
  readonly stackPointer: bigint;
  readonly instructionPointer: bigint;
}

export interface Process {
  readonly pid: Pid;
  readonly ppid: Pid;
  readonly tgid: Pid;
  readonly name: string;
  readonly state: ProcessState;
  readonly uid: Uid;
  readonly gid: Gid;
  readonly threads: Map<number, Thread>;
  readonly fileDescriptors: Map<number, FileDescriptor>;
  readonly memory: ProcessMemory;
  readonly env: Record<string, string>;
  readonly cwd: string;
  readonly root: string;
  readonly commandLine: string[];
  readonly startTime: number;
  readonly cpuTime: number;
  readonly priority: number;
  readonly nice: number;

  signal(sig: Signal): void;
  suspend(): void;
  resume(): void;
  terminate(): void;
}

export interface CgroupConfig {
  name: string;
  cpuMax?: number;
  cpuWeight?: number;
  memoryMax?: number;
  memorySwapMax?: number;
  ioMax?: Record<string, { rbps: number; riops: number; wbps: number; wiops: number }>;
  pidsMax?: number;
  freezer: boolean;
}

export interface NamespaceConfig {
  pid: boolean;
  net: boolean;
  mnt: boolean;
  uts: boolean;
  ipc: boolean;
  user: boolean;
  cgroup: boolean;
  time: boolean;
}

export interface Capability {
  readonly bit: number;
  readonly name: string;
  readonly description: string;
}

export enum CapabilityBit {
  CAP_CHOWN = 0,
  CAP_NET_RAW = 13,
  CAP_SYS_ADMIN = 21,
  CAP_SYS_PTRACE = 19,
  CAP_NET_ADMIN = 12,
  CAP_DAC_OVERRIDE = 1,
  CAP_SETUID = 6,
  CAP_SETGID = 5,
}

export const Capabilities: Record<string, Capability> = {
  CAP_CHOWN: { bit: 0, name: 'CAP_CHOWN', description: 'Change file owner' },
  CAP_DAC_OVERRIDE: { bit: 1, name: 'CAP_DAC_OVERRIDE', description: 'Bypass DAC checks' },
  CAP_NET_ADMIN: { bit: 12, name: 'CAP_NET_ADMIN', description: 'Network admin' },
  CAP_NET_RAW: { bit: 13, name: 'CAP_NET_RAW', description: 'Raw sockets' },
  CAP_SYS_ADMIN: { bit: 21, name: 'CAP_SYS_ADMIN', description: 'System admin' },
  CAP_SYS_PTRACE: { bit: 19, name: 'CAP_SYS_PTRACE', description: 'Process trace' },
  CAP_SETUID: { bit: 6, name: 'CAP_SETUID', description: 'Set UID' },
  CAP_SETGID: { bit: 5, name: 'CAP_SETGID', description: 'Set GID' },
};

export interface KernelConfig {
  hostname: string;
  version: string;
  cpuCores: number;
  memoryTotal: number;
  pageSize: number;
  aslr: boolean;
  kaslr: boolean;
  smap: boolean;
  smep: boolean;
  kpti: boolean;
  seccomp: boolean;
  namespaceSupport: boolean;
  cgroupV2: boolean;
}

export interface KernelStats {
  processes: number;
  threads: number;
  running: number;
  sleeping: number;
  zombie: number;
  cpuUsage: number;
  memoryUsed: number;
  memoryFree: number;
  contextSwitches: number;
  syscallsPerSecond: number;
  uptime: number;
  loadAverage: [number, number, number];
}

export interface OsKernel {
  readonly config: KernelConfig;
  readonly processes: Map<Pid, Process>;
  readonly stats: KernelStats;

  spawn(path: string, args: string[], env?: Record<string, string>): Promise<Process>;
  kill(pid: Pid, sig: Signal): boolean;
  getProcess(pid: Pid): Process | undefined;

  syscall(ctx: SyscallContext): Promise<SyscallResult>;

  setHostname(name: string): void;
  reboot(): Promise<void>;
  shutdown(): Promise<void>;

  start(): void;
  stop(): void;
  reset(): void;
}

export interface HostConfig {
  kernel: KernelConfig;
  network: NetworkStackConfig;
  rootfs: string;
  hostname: string;
}

export interface Host {
  readonly config: HostConfig;
  readonly kernel: OsKernel;
  readonly network: NetworkStack;
  start(): Promise<void>;
  stop(): Promise<void>;
  reset(): Promise<void>;
}

export function createDefaultKernelConfig(): KernelConfig {
  return {
    hostname: 'localhost',
    version: '6.8.0-cybersim',
    cpuCores: 4,
    memoryTotal: 8 * 1024 * 1024 * 1024,
    pageSize: 4096,
    aslr: true,
    kaslr: true,
    smap: true,
    smep: true,
    kpti: true,
    seccomp: true,
    namespaceSupport: true,
    cgroupV2: true,
  };
}

const MEM_PAGE_SIZE = 4096n;

export function createDefaultHostConfig(hostname: string): HostConfig {
  return {
    hostname,
    kernel: createDefaultKernelConfig(),
    network: createDefaultStackConfig(hostname),
    rootfs: '/',
  };
}

export interface ProcessCreateOptions {
  pid?: Pid;
  ppid?: Pid;
  name?: string;
  args?: string[];
  env?: Record<string, string>;
  cwd?: string;
  uid?: Uid;
  gid?: Gid;
}

export class ProcessImpl implements Process {
  readonly pid: Pid;
  readonly ppid: Pid;
  readonly tgid: Pid;
  readonly threads: Map<number, Thread> = new Map();
  readonly fileDescriptors: Map<number, FileDescriptor> = new Map();
  readonly memory: ProcessMemory;
  readonly env: Record<string, string>;
  readonly commandLine: string[];
  readonly startTime: number;
  private _name: string;
  private _state: ProcessState;
  private _uid: Uid;
  private _gid: Gid;
  private _cwd: string;
  private _root: string;
  private _priority: number;
  private _nice: number;
  private _cpuTime: number = 0;
  private _signalHandlers: Map<number, bigint> = new Map();
  private _threadCounter: number = 0;

  constructor(options: ProcessCreateOptions = {}) {
    this.pid = options.pid ?? pid(Math.floor(Math.random() * 99999) + 1000);
    this.ppid = options.ppid ?? pid(0);
    this.tgid = this.pid;
    this._name = options.name ?? 'unknown';
    this._state = ProcessState.RUNNING;
    this._uid = options.uid ?? uid(0);
    this._gid = options.gid ?? gid(0);
    this._cwd = options.cwd ?? '/';
    this._root = '/';
    this._priority = 20;
    this._nice = 0;
    this.commandLine = options.args ?? [this._name];
    this.env = options.env ?? { PATH: '/usr/bin:/bin', HOME: '/root', TERM: 'linux' };
    this.startTime = Date.now();
    this.memory = {
      regions: [
        { start: 0x400000n, end: 0x401000n, perms: 'r-x', offset: 0n, dev: '00:00', inode: 1, path: `/${this._name}` },
        { start: 0x600000n, end: 0x601000n, perms: 'rw-', offset: 0n, dev: '00:00', inode: 1, path: `/${this._name}` },
      ],
      heap: { start: 0x1000000n, end: 0x1000000n },
      stack: { start: 0x7ffffffff000n, end: 0x800000000000n },
    };
    this.addThread();
  }

  get name(): string { return this._name; }
  get state(): ProcessState { return this._state; }
  get uid(): Uid { return this._uid; }
  get gid(): Gid { return this._gid; }
  get cwd(): string { return this._cwd; }
  get root(): string { return this._root; }
  get priority(): number { return this._priority; }
  get nice(): number { return this._nice; }
  get cpuTime(): number { return this._cpuTime; }

  addCpuTime(dt: number): void {
    this._cpuTime += dt;
  }

  setState(state: ProcessState): void {
    this._state = state;
  }

  private addThread(): Thread {
    const tid = ++this._threadCounter;
    const thread: Thread = {
      tid,
      pid: this.pid,
      state: this._state,
      registers: { rax: 0n, rbx: 0n, rcx: 0n, rdx: 0n, rsi: 0n, rdi: 0n, rsp: 0n, rbp: 0n, rip: 0n },
      stackPointer: 0x7ffffffff000n,
      instructionPointer: 0x400000n,
    };
    this.threads.set(tid, thread);
    return thread;
  }

  allocFd(path: string, flags: number, inode: number): Fd {
    let fdn = 3;
    while (this.fileDescriptors.has(fdn)) fdn++;
    const f = fd(fdn);
    this.fileDescriptors.set(fdn, { fd: f, path, flags, position: 0, inode });
    return f;
  }

  freeFd(fdNum: number): boolean {
    return this.fileDescriptors.delete(fdNum);
  }

  signal(sig: Signal): void {
    const handler = this._signalHandlers.get(sig);
    if (handler === 0n) return;
    if (sig === signal(9)) {
      this._state = ProcessState.DEAD;
    } else if (sig === signal(15)) {
      this._state = ProcessState.DEAD;
    } else if (sig === signal(19)) {
      this._state = ProcessState.STOPPED;
    } else if (sig === signal(18)) {
      if (this._state === ProcessState.STOPPED) this._state = ProcessState.RUNNING;
    }
  }

  suspend(): void {
    this._state = ProcessState.STOPPED;
  }

  resume(): void {
    if (this._state === ProcessState.STOPPED) this._state = ProcessState.RUNNING;
  }

  terminate(): void {
    this._state = ProcessState.DEAD;
    this.threads.clear();
    this.fileDescriptors.clear();
  }
}

const SCHED_QUANTUM_MS = 10;

export class SchedulerImpl {
  private runQueue: ProcessImpl[] = [];
  private currentIndex = -1;
  private _totalSwitches = 0;

  enqueue(process: ProcessImpl): void {
    if (process.state === ProcessState.RUNNING && !this.runQueue.includes(process)) {
      this.runQueue.push(process);
    }
  }

  dequeue(pid: Pid): void {
    this.runQueue = this.runQueue.filter(p => p.pid !== pid);
  }

  next(): ProcessImpl | null {
    if (this.runQueue.length === 0) return null;
    this.currentIndex = (this.currentIndex + 1) % this.runQueue.length;
    const proc = this.runQueue[this.currentIndex]!;
    this._totalSwitches++;
    return proc;
  }

  tick(dt: number): void {
    this.runQueue = this.runQueue.filter(p => p.state === ProcessState.RUNNING);
    for (const proc of this.runQueue) {
      proc.addCpuTime(dt);
    }
  }

  get totalSwitches(): number { return this._totalSwitches; }
  get queueLength(): number { return this.runQueue.length; }
}

export class OsKernelImpl implements OsKernel {
  readonly processes: Map<Pid, ProcessImpl> = new Map();
  readonly stats: KernelStats;
  private scheduler: SchedulerImpl = new SchedulerImpl();
  private _running = false;
  private _uptime = 0;
  private _cpuUsage = 0;
  private _memoryUsed = 0;
  private _syscallCount = 0;
  private _lastSyscallCount = 0;
  private _pidCounter = 1000;
  private _idleProcess: ProcessImpl;
  private bus?: EventBus;

  constructor(
    readonly config: KernelConfig,
  ) {
    this.stats = {
      processes: 0, threads: 0, running: 0, sleeping: 0, zombie: 0,
      cpuUsage: 0, memoryUsed: 0, memoryFree: config.memoryTotal,
      contextSwitches: 0, syscallsPerSecond: 0, uptime: 0,
      loadAverage: [0, 0, 0],
    };
    this._idleProcess = new ProcessImpl({ pid: pid(0), name: 'idle', args: ['idle'] });
  }

  private allocPid(): Pid {
    return pid(++this._pidCounter);
  }

  spawn(path: string, args: string[], env?: Record<string, string>): Promise<Process> {
    const name = path.split('/').pop() ?? path;
    const proc = new ProcessImpl({
      pid: this.allocPid(),
      ppid: pid(1),
      name,
      args: args.length > 0 ? args : [name],
      env: { ...env },
      cwd: '/home/user',
      uid: uid(1000),
      gid: gid(1000),
    });
    this.processes.set(proc.pid, proc);
    this.scheduler.enqueue(proc);
    this.updateStats();
    this.emitEvent('process.spawn', {
      pid: proc.pid, name: proc.name, args: proc.commandLine,
    });
    return Promise.resolve(proc);
  }

  kill(pid: Pid, sig: Signal): boolean {
    const proc = this.processes.get(pid);
    if (!proc) return false;
    proc.signal(sig);
    if (proc.state === ProcessState.DEAD) {
      this.scheduler.dequeue(pid);
      this.processes.delete(pid);
    }
    this.updateStats();
    this.emitEvent('process.kill', { pid, signal: sig, name: proc.name });
    return true;
  }

  getProcess(pid: Pid): Process | undefined {
    return this.processes.get(pid);
  }

  async syscall(ctx: SyscallContext): Promise<SyscallResult> {
    if (!this._running) return { retval: -1n, errno: 5 };
    this._syscallCount++;

    const proc = this.processes.get(ctx.pid);
    if (!proc) return { retval: -1n, errno: 3 };

    switch (ctx.number) {
      case SyscallNumber.GETPID:
        return { retval: BigInt(ctx.pid) };

      case SyscallNumber.GETPPID:
        return { retval: BigInt(proc.ppid) };

      case SyscallNumber.GETUID:
        return { retval: BigInt(proc.uid) };

      case SyscallNumber.UNAME: {
        return { retval: 0n };
      }

      case SyscallNumber.GETTIMEOFDAY:
        return { retval: 0n };

      case SyscallNumber.CLOCK_GETTIME:
        return { retval: 0n };

      case SyscallNumber.OPEN: {
        const pathArg = ctx.args[0];
        const path = pathArg != null ? this.readString(pathArg, proc) : '';
        const flags = Number(ctx.args[1] ?? 0n);
        const inode = Math.abs(this.simpleHash(path));
        const newFd = proc.allocFd(path, flags, inode);
        return { retval: BigInt(newFd) };
      }

      case SyscallNumber.READ: {
        const fdNum = Number(ctx.args[0]);
        const count = Number(ctx.args[2] ?? 0n);
        if (fdNum >= 0 && fdNum <= 2) {
          return { retval: BigInt(Math.min(count, 4096)) };
        }
        const fde = proc.fileDescriptors.get(fdNum);
        if (!fde) return { retval: -1n, errno: 9 };
        const bytesRead = Math.min(count, 4096);
        return { retval: BigInt(bytesRead) };
      }

      case SyscallNumber.WRITE: {
        const fdNum = Number(ctx.args[0]);
        const count = Number(ctx.args[2] ?? 0n);
        if (fdNum >= 0 && fdNum <= 2) {
          const buf = ctx.args[1];
          if (buf != null && (fdNum === 1 || fdNum === 2)) {
            this.emitOutput(ctx.pid, this.readString(buf, proc));
          }
          return { retval: BigInt(count) };
        }
        const fde = proc.fileDescriptors.get(fdNum);
        if (!fde) return { retval: -1n, errno: 9 };
        const buf = ctx.args[1];
        if (buf != null) {
          this.emitOutput(ctx.pid, this.readString(buf, proc));
        }
        return { retval: BigInt(count) };
      }

      case SyscallNumber.CLOSE: {
        const fdNum = Number(ctx.args[0]);
        proc.freeFd(fdNum);
        return { retval: 0n };
      }

      case SyscallNumber.LSEEK: {
        const fdNum = Number(ctx.args[0]);
        const offset = Number(ctx.args[1] ?? 0n);
        const whence = Number(ctx.args[2] ?? 0n);
        const fde = proc.fileDescriptors.get(fdNum);
        if (!fde) return { retval: -1n, errno: 9 };
        return { retval: BigInt(offset) };
      }

      case SyscallNumber.BRK: {
        const addr = ctx.args[0];
        if (addr == null) return { retval: proc.memory.heap.end };
        if (addr < proc.memory.heap.start || addr > proc.memory.heap.start + 0x1000000n) {
          return { retval: proc.memory.heap.end };
        }
        proc.memory.heap.end = addr;
        return { retval: addr };
      }

      case SyscallNumber.NANOSLEEP: {
        return { retval: 0n };
      }

      case SyscallNumber.EXIT: {
        proc.terminate();
        this.scheduler.dequeue(proc.pid);
        this.processes.delete(proc.pid);
        this.updateStats();
        return { retval: 0n };
      }

      case SyscallNumber.KILL: {
        const targetPid = pid(Number(ctx.args[0]));
        const sig = signal(Number(ctx.args[1]));
        this.kill(targetPid, sig);
        return { retval: 0n };
      }

      case SyscallNumber.GETCWD:
        return { retval: 0n };

      case SyscallNumber.CHDIR: {
        const pathArg = ctx.args[0];
        const path = pathArg != null ? this.readString(pathArg, proc) : '';
        proc['_cwd'] = path;
        return { retval: 0n };
      }

      case SyscallNumber.MMAP: {
        const len = Number(ctx.args[1] ?? 4096n);
        const perms = Number(ctx.args[2] ?? 3n);
        const flags = Number(ctx.args[3] ?? 0n);
        const permsStr = `${perms & 1 ? 'r' : '-'}${perms & 2 ? 'w' : '-'}${perms & 4 ? 'x' : '-'}`;
        const start = BigInt(Math.floor(Math.random() * 0x7fffff) * 4096 + 0x700000);
        const region: MemoryRegion = {
          start, end: start + BigInt(len), perms: permsStr,
          offset: 0n, dev: '00:00', inode: 0, path: '[anon]',
        };
        proc.memory.regions.push(region);
        return { retval: start };
      }

      case SyscallNumber.MUNMAP:
        return { retval: 0n };

      case SyscallNumber.POLL:
        return { retval: 0n };

      default:
        return { retval: 0n };
    }
  }

  private readString(addr: bigint, _proc: ProcessImpl): string {
    return `<string@0x${addr.toString(16)}>`;
  }

  private emitOutput(_pid: Pid, _data: string): void {
  }

  private simpleHash(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = ((hash << 5) - hash) + s.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  setHostname(name: string): void {
    (this.config as KernelConfig).hostname = name;
    this.emitEvent('kernel.hostname', { hostname: name });
  }

  async reboot(): Promise<void> {
    this.stop();
    this.reset();
    this.start();
    this.emitEvent('kernel.reboot', {});
  }

  async shutdown(): Promise<void> {
    for (const proc of this.processes.values()) {
      proc.terminate();
    }
    this.stop();
    this.emitEvent('kernel.shutdown', {});
  }

  private emitEvent(type: string, payload: Record<string, unknown>): void {
    if (this.bus) {
      this.bus.publish(createEvent(`hostos.${type}`, payload, { source: 'hostos' }));
    }
  }

  attach(bus: EventBus): void {
    this.bus = bus;
  }

  private updateStats(): void {
    const processList = Array.from(this.processes.values());
    this.stats.processes = processList.length + 1;
    this.stats.threads = processList.reduce((sum, p) => sum + p.threads.size, 0) + 1;
    this.stats.running = processList.filter(p => p.state === ProcessState.RUNNING).length;
    this.stats.sleeping = processList.filter(p => p.state === ProcessState.SLEEPING).length;
    this.stats.zombie = processList.filter(p => p.state === ProcessState.ZOMBIE).length;
    this.stats.contextSwitches = this.scheduler.totalSwitches;
    this.stats.memoryUsed = this._memoryUsed;
    this.stats.memoryFree = this.config.memoryTotal - this._memoryUsed;
  }

  tick(dt: number): void {
    if (!this._running) return;
    this._uptime += dt;

    const syscallDelta = this._syscallCount - this._lastSyscallCount;
    this.stats.syscallsPerSecond = syscallDelta / (dt / 1000);
    this._lastSyscallCount = this._syscallCount;

    this.scheduler.tick(dt);

    this.stats.uptime = this._uptime;

    const load = this.stats.running / this.config.cpuCores;
    for (let i = 0; i < 3; i++) {
      this.stats.loadAverage[i] = this.stats.loadAverage[i]! * 0.9 + load * 0.1;
    }
    this.updateStats();
  }

  start(): void {
    this._running = true;
    this._pidCounter = 1000;

    const init = new ProcessImpl({
      pid: pid(1), name: 'init', args: ['init'],
      uid: uid(0), gid: gid(0), cwd: '/',
    });
    this.processes.set(init.pid, init);
    this.scheduler.enqueue(init);

    const kthreadd = new ProcessImpl({
      pid: pid(2), name: 'kthreadd', args: ['kthreadd'],
      uid: uid(0), gid: gid(0), cwd: '/',
    });
    kthreadd.setState(ProcessState.SLEEPING);
    this.processes.set(kthreadd.pid, kthreadd);

    this.updateStats();
    this.emitEvent('kernel.start', { config: this.config });
  }

  stop(): void {
    this._running = false;
    this.processes.clear();
  }

  reset(): void {
    this.stop();
    this._uptime = 0;
    this._cpuUsage = 0;
    this._memoryUsed = 0;
    this._syscallCount = 0;
    this.scheduler = new SchedulerImpl();
    this._pidCounter = 1000;
    this.stats.processes = 0;
    this.stats.threads = 0;
    this.stats.running = 0;
    this.stats.sleeping = 0;
    this.stats.zombie = 0;
    this.stats.cpuUsage = 0;
    this.stats.memoryUsed = 0;
    this.stats.memoryFree = this.config.memoryTotal;
    this.stats.contextSwitches = 0;
    this.stats.syscallsPerSecond = 0;
    this.stats.uptime = 0;
    this.stats.loadAverage = [0, 0, 0];
  }
}

export class HostImpl implements Host {
  readonly kernel: OsKernelImpl;
  readonly network: NetworkStackImpl;
  private bus?: EventBus;

  constructor(
    readonly config: HostConfig,
  ) {
    this.kernel = new OsKernelImpl(config.kernel);
    this.network = new NetworkStackImpl(config.network);
  }

  async start(): Promise<void> {
    this.kernel.start();
    this.network.start();
    if (this.bus) {
      this.kernel.attach(this.bus);
      this.network.attach(this.bus);
    }
    this.emitEvent('host.start', { hostname: this.config.hostname });
  }

  async stop(): Promise<void> {
    await this.kernel.shutdown();
    this.network.stop();
    this.emitEvent('host.stop', { hostname: this.config.hostname });
  }

  async reset(): Promise<void> {
    await this.stop();
    this.kernel.reset();
    this.network.reset();
    this.emitEvent('host.reset', { hostname: this.config.hostname });
  }

  attach(bus: EventBus): void {
    this.bus = bus;
    this.kernel.attach(bus);
    this.network.attach(bus);
  }

  tick(dt: number): void {
    this.kernel.tick(dt);
    this.network.tick(dt);
  }

  private emitEvent(type: string, payload: Record<string, unknown>): void {
    if (this.bus) {
      this.bus.publish(createEvent(`host.${type}`, payload, { source: 'hostos' }));
    }
  }
}
