import type { SimulationEvent, EventBus } from '@cybersim/shared';

export interface TerminalSize {
  cols: number;
  rows: number;
}

export interface TerminalCursor {
  x: number;
  y: number;
  visible: boolean;
  style: 'block' | 'underline' | 'bar';
}

export interface TerminalMode {
  insert: boolean;
  applicationCursor: boolean;
  applicationKeypad: boolean;
  bracketedPaste: boolean;
  reverseVideo: boolean;
  origin: boolean;
  wraparound: boolean;
  altScreen: boolean;
}

export interface TerminalTheme {
  foreground: string;
  background: string;
  cursor: string;
  cursorAccent: string;
  selectionBackground: string;
  black: string;
  red: string;
  green: string;
  yellow: string;
  blue: string;
  magenta: string;
  cyan: string;
  white: string;
  brightBlack: string;
  brightRed: string;
  brightGreen: string;
  brightYellow: string;
  brightBlue: string;
  brightMagenta: string;
  brightCyan: string;
  brightWhite: string;
}

export interface TerminalConfig {
  size: TerminalSize;
  theme: TerminalTheme;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  cursorBlink: boolean;
  scrollback: number;
  tabStopWidth: number;
}

export interface PtyOptions {
  env?: Record<string, string>;
  cwd?: string;
  uid?: number;
  gid?: number;
}

export interface PtyProcess {
  readonly pid: number;
  readonly fd: number;
  write(data: string): void;
  resize(size: TerminalSize): void;
  close(): void;
  onData(handler: (data: string) => void): () => void;
  onExit(handler: (code: number) => void): () => void;
}

export interface PtyFactory {
  spawn(shell: string, options?: PtyOptions): PtyProcess;
}

export interface SessionConfig {
  id: string;
  shell: string;
  cwd: string;
  env: Record<string, string>;
  size: TerminalSize;
}

export interface TerminalSession {
  readonly id: string;
  readonly config: SessionConfig;
  readonly pty: PtyProcess;

  write(data: string): void;
  resize(size: TerminalSize): void;
  close(): void;

  onOutput(handler: (data: string) => void): () => void;
  onExit(handler: (code: number) => void): () => void;
}

export class TerminalSessionImpl implements TerminalSession {
  readonly id: string;
  readonly config: SessionConfig;
  readonly pty: PtyProcess;
  private outputHandlers: Set<(data: string) => void> = new Set();
  private exitHandlers: Set<(code: number) => void> = new Set();
  private _exited: boolean = false;
  private _exitCode?: number;

  constructor(id: string, config: SessionConfig, ptyFactory: PtyFactory, eventBus?: EventBus) {
    this.id = id;
    this.config = config;
    this.pty = ptyFactory.spawn(config.shell, {
      env: config.env,
      cwd: config.cwd,
    });

    this.pty.onData((data) => {
      for (const h of this.outputHandlers) h(data);
    });

    this.pty.onExit((code) => {
      this._exited = true;
      this._exitCode = code;
      for (const h of this.exitHandlers) h(code);
    });

    if (eventBus) {
      eventBus.publish({
        id: `terminal-session-start-${id}`,
        type: 'terminal.session.start',
        timestamp: Date.now(),
        payload: { id, config },
        metadata: { source: 'terminal' },
      });
    }
  }

  write(data: string): void {
    if (!this._exited) this.pty.write(data);
  }

  resize(size: TerminalSize): void {
    this.pty.resize(size);
  }

  close(): void {
    if (!this._exited) this.pty.close();
  }

  onOutput(handler: (data: string) => void): () => void {
    this.outputHandlers.add(handler);
    return () => this.outputHandlers.delete(handler);
  }

  onExit(handler: (code: number) => void): () => void {
    this.exitHandlers.add(handler);
    return () => this.exitHandlers.delete(handler);
  }

  get exited(): boolean { return this._exited; }
  get exitCode(): number | undefined { return this._exitCode; }
}

export interface SessionManager {
  create(config: Partial<SessionConfig>): TerminalSession;
  get(id: string): TerminalSession | undefined;
  list(): TerminalSession[];
  close(id: string): boolean;
  closeAll(): void;
}

export class SessionManagerImpl implements SessionManager {
  private sessions: Map<string, TerminalSession> = new Map();
  private sessionCounter: number = 0;

  constructor(
    private ptyFactory: PtyFactory,
    private eventBus?: EventBus,
  ) {}

  create(config: Partial<SessionConfig>): TerminalSession {
    const id = config.id ?? `session-${++this.sessionCounter}`;
    const fullConfig: SessionConfig = {
      id,
      shell: config.shell ?? '/bin/bash',
      cwd: config.cwd ?? '/home/user',
      env: config.env ?? { TERM: 'xterm-256color', PATH: '/usr/local/bin:/usr/bin:/bin' },
      size: config.size ?? { cols: 80, rows: 24 },
    };

    const session = new TerminalSessionImpl(id, fullConfig, this.ptyFactory, this.eventBus);
    this.sessions.set(id, session);
    return session;
  }

  get(id: string): TerminalSession | undefined {
    return this.sessions.get(id);
  }

  list(): TerminalSession[] {
    return Array.from(this.sessions.values());
  }

  close(id: string): boolean {
    const session = this.sessions.get(id);
    if (!session) return false;
    session.close();
    this.sessions.delete(id);
    return true;
  }

  closeAll(): void {
    for (const [id, session] of this.sessions) {
      session.close();
    }
    this.sessions.clear();
  }
}

export const defaultTheme: TerminalTheme = {
  foreground: '#c0c0c0',
  background: '#0a0a0a',
  cursor: '#c0c0c0',
  cursorAccent: '#0a0a0a',
  selectionBackground: '#404040',
  black: '#000000',
  red: '#cc3333',
  green: '#33cc33',
  yellow: '#cccc33',
  blue: '#3333cc',
  magenta: '#cc33cc',
  cyan: '#33cccc',
  white: '#c0c0c0',
  brightBlack: '#666666',
  brightRed: '#ff4444',
  brightGreen: '#44ff44',
  brightYellow: '#ffff44',
  brightBlue: '#4444ff',
  brightMagenta: '#ff44ff',
  brightCyan: '#44ffff',
  brightWhite: '#ffffff',
};

export function createDefaultTerminalConfig(): TerminalConfig {
  return {
    size: { cols: 80, rows: 24 },
    theme: defaultTheme,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    fontSize: 14,
    lineHeight: 1.2,
    cursorBlink: true,
    scrollback: 10000,
    tabStopWidth: 8,
  };
}
