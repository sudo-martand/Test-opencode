import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  TerminalSessionImpl,
  SessionManagerImpl,
  type PtyFactory,
  type PtyProcess,
  type TerminalSize,
  defaultTheme,
  createDefaultTerminalConfig,
} from '../index';

function createMockPty(): PtyProcess {
  const handlers = new Set<(data: string) => void>();
  const exitHandlers = new Set<(code: number) => void>();
  return {
    pid: 123,
    fd: 0,
    write: vi.fn(),
    resize: vi.fn(),
    close: vi.fn(),
    onData: vi.fn((handler) => {
      handlers.add(handler);
      return () => handlers.delete(handler);
    }),
    onExit: vi.fn((handler) => {
      exitHandlers.add(handler);
      return () => exitHandlers.delete(handler);
    }),
  };
}

function createMockPtyFactory(pty?: PtyProcess): PtyFactory {
  return {
    spawn: vi.fn(() => pty ?? createMockPty()),
  };
}

describe('TerminalSessionImpl', () => {
  it('creates a session with given config', () => {
    const pty = createMockPty();
    const factory = createMockPtyFactory(pty);
    const session = new TerminalSessionImpl('test-1', {
      id: 'test-1',
      shell: '/bin/bash',
      cwd: '/home/user',
      env: { TERM: 'xterm-256color' },
      size: { cols: 80, rows: 24 },
    }, factory);

    expect(session.id).toBe('test-1');
    expect(session.config.shell).toBe('/bin/bash');
    expect(session.exited).toBe(false);
    expect(factory.spawn).toHaveBeenCalledWith('/bin/bash', {
      env: { TERM: 'xterm-256color' },
      cwd: '/home/user',
    });
  });

  it('handles output subscribers', () => {
    let received = '';
    const pty = createMockPty();
    const factory = createMockPtyFactory(pty);
    const session = new TerminalSessionImpl('test-1', {
      id: 'test-1',
      shell: '/bin/sh',
      cwd: '/tmp',
      env: {},
      size: { cols: 80, rows: 24 },
    }, factory);

    session.onOutput((data) => { received += data; });
    const onDataHandler = (pty.onData as ReturnType<typeof vi.fn>).mock.calls[0]![0] as (data: string) => void;
    onDataHandler('hello');
    expect(received).toBe('hello');
  });

  it('handles exit subscribers', () => {
    let exitCode: number | undefined;
    const pty = createMockPty();
    const factory = createMockPtyFactory(pty);
    const session = new TerminalSessionImpl('test-1', {
      id: 'test-1',
      shell: '/bin/sh',
      cwd: '/tmp',
      env: {},
      size: { cols: 80, rows: 24 },
    }, factory);

    session.onExit((code) => { exitCode = code; });
    const onExitHandler = (pty.onExit as ReturnType<typeof vi.fn>).mock.calls[0]![0] as (code: number) => void;
    onExitHandler(0);
    expect(exitCode).toBe(0);
    expect(session.exited).toBe(true);
    expect(session.exitCode).toBe(0);
  });

  it('write delegates to pty', () => {
    const pty = createMockPty();
    const factory = createMockPtyFactory(pty);
    const session = new TerminalSessionImpl('test-1', {
      id: 'test-1',
      shell: '/bin/sh',
      cwd: '/tmp',
      env: {},
      size: { cols: 80, rows: 24 },
    }, factory);

    session.write('ls -la');
    expect(pty.write).toHaveBeenCalledWith('ls -la');
  });

  it('resize delegates to pty', () => {
    const pty = createMockPty();
    const factory = createMockPtyFactory(pty);
    const session = new TerminalSessionImpl('test-1', {
      id: 'test-1',
      shell: '/bin/sh',
      cwd: '/tmp',
      env: {},
      size: { cols: 80, rows: 24 },
    }, factory);

    const newSize: TerminalSize = { cols: 132, rows: 43 };
    session.resize(newSize);
    expect(pty.resize).toHaveBeenCalledWith(newSize);
  });

  it('close delegates to pty', () => {
    const pty = createMockPty();
    const factory = createMockPtyFactory(pty);
    const session = new TerminalSessionImpl('test-1', {
      id: 'test-1',
      shell: '/bin/sh',
      cwd: '/tmp',
      env: {},
      size: { cols: 80, rows: 24 },
    }, factory);

    session.close();
    expect(pty.close).toHaveBeenCalled();
  });

  it('does not write after exit', () => {
    const pty = createMockPty();
    const factory = createMockPtyFactory(pty);
    const session = new TerminalSessionImpl('test-1', {
      id: 'test-1',
      shell: '/bin/sh',
      cwd: '/tmp',
      env: {},
      size: { cols: 80, rows: 24 },
    }, factory);

    const onExitHandler = (pty.onExit as ReturnType<typeof vi.fn>).mock.calls[0]![0] as (code: number) => void;
    onExitHandler(0);
    session.write('should not write');
    expect(pty.write).not.toHaveBeenCalledWith('should not write');
  });

  it('unsubscribes output handlers', () => {
    let count = 0;
    const pty = createMockPty();
    const factory = createMockPtyFactory(pty);
    const session = new TerminalSessionImpl('test-1', {
      id: 'test-1',
      shell: '/bin/sh',
      cwd: '/tmp',
      env: {},
      size: { cols: 80, rows: 24 },
    }, factory);

    const unsub = session.onOutput(() => { count++; });
    unsub();
    const onDataHandler = (pty.onData as ReturnType<typeof vi.fn>).mock.calls[0]![0] as (data: string) => void;
    onDataHandler('data');
    expect(count).toBe(0);
  });
});

describe('SessionManagerImpl', () => {
  let factory: PtyFactory;
  let manager: SessionManagerImpl;

  beforeEach(() => {
    factory = createMockPtyFactory();
    manager = new SessionManagerImpl(factory);
  });

  it('creates a session with defaults', () => {
    const session = manager.create({});
    expect(session.id).toBeDefined();
    expect(session.config.shell).toBe('/bin/bash');
    expect(session.config.cwd).toBe('/home/user');
    expect(session.config.size).toEqual({ cols: 80, rows: 24 });
  });

  it('creates a session with custom config', () => {
    const session = manager.create({
      id: 'custom',
      shell: '/bin/zsh',
      cwd: '/root',
      size: { cols: 132, rows: 43 },
    });
    expect(session.id).toBe('custom');
    expect(session.config.shell).toBe('/bin/zsh');
  });

  it('retrieves a session by id', () => {
    const session = manager.create({ id: 'find-me' });
    expect(manager.get('find-me')).toBe(session);
  });

  it('returns undefined for unknown session', () => {
    expect(manager.get('unknown')).toBeUndefined();
  });

  it('lists all sessions', () => {
    const a = manager.create({ id: 'a' });
    const b = manager.create({ id: 'b' });
    const list = manager.list();
    expect(list).toHaveLength(2);
    expect(list).toContain(a);
    expect(list).toContain(b);
  });

  it('closes a session by id', () => {
    const session = manager.create({ id: 'close-me' });
    const result = manager.close('close-me');
    expect(result).toBe(true);
    expect(manager.get('close-me')).toBeUndefined();
  });

  it('returns false when closing non-existent session', () => {
    expect(manager.close('nope')).toBe(false);
  });

  it('closes all sessions', () => {
    manager.create({});
    manager.create({});
    manager.closeAll();
    expect(manager.list()).toHaveLength(0);
  });

  it('increments session counter', () => {
    const a = manager.create({});
    const b = manager.create({});
    expect(a.id).not.toBe(b.id);
  });
});

describe('defaultTheme', () => {
  it('has all theme properties', () => {
    expect(defaultTheme.foreground).toBeDefined();
    expect(defaultTheme.background).toBeDefined();
    expect(defaultTheme.cursor).toBeDefined();
    expect(defaultTheme.black).toBeDefined();
    expect(defaultTheme.red).toBeDefined();
    expect(defaultTheme.green).toBeDefined();
    expect(defaultTheme.yellow).toBeDefined();
    expect(defaultTheme.blue).toBeDefined();
    expect(defaultTheme.magenta).toBeDefined();
    expect(defaultTheme.cyan).toBeDefined();
    expect(defaultTheme.white).toBeDefined();
    expect(defaultTheme.brightBlack).toBeDefined();
    expect(defaultTheme.brightRed).toBeDefined();
    expect(defaultTheme.brightGreen).toBeDefined();
    expect(defaultTheme.brightYellow).toBeDefined();
    expect(defaultTheme.brightBlue).toBeDefined();
    expect(defaultTheme.brightMagenta).toBeDefined();
    expect(defaultTheme.brightCyan).toBeDefined();
    expect(defaultTheme.brightWhite).toBeDefined();
  });

  it('uses dark theme colors', () => {
    expect(defaultTheme.background).toBe('#0a0a0a');
    expect(defaultTheme.foreground).toBe('#c0c0c0');
  });
});

describe('createDefaultTerminalConfig', () => {
  it('returns config with reasonable defaults', () => {
    const config = createDefaultTerminalConfig();
    expect(config.size).toEqual({ cols: 80, rows: 24 });
    expect(config.fontSize).toBe(14);
    expect(config.cursorBlink).toBe(true);
    expect(config.scrollback).toBe(10000);
  });
});
