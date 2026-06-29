import type { UID, Timestamp } from '@cybersim/shared';
import { uid, timestamp } from '@cybersim/shared';
import Dexie, { type Table, type EntityTable } from 'dexie';

// ── Types ────────────────────────────────────────────────────────────────

export type InodeNumber = number & { readonly __brand: 'inode' };
export type FileMode = number & { readonly __brand: 'filemode' };
export type FileSize = number & { readonly __brand: 'filesize' };
export type BlockNumber = number & { readonly __brand: 'block' };

export function inode(value: number): InodeNumber { return value as InodeNumber; }
export function fileMode(value: number): FileMode { return (value & 0o7777) as FileMode; }
export function fileSize(value: number): FileSize { return value as FileSize; }

export const S_IFMT = 0o170000;
export const S_IFDIR = 0o040000;
export const S_IFREG = 0o100000;
export const S_IFLNK = 0o120000;
export const S_IRWXU = 0o0700;
export const S_IRUSR = 0o0400;
export const S_IWUSR = 0o0200;
export const S_IXUSR = 0o0100;
export const S_IRWXG = 0o0070;
export const S_IRWXO = 0o0007;

export function isDirectory(mode: FileMode): boolean {
  return (mode & S_IFMT) === S_IFDIR;
}

export function isRegularFile(mode: FileMode): boolean {
  return (mode & S_IFMT) === S_IFREG;
}

export function isSymlink(mode: FileMode): boolean {
  return (mode & S_IFMT) === S_IFLNK;
}

export interface VirtualNode {
  inode: InodeNumber;
  name: string;
  mode: FileMode;
  uid: UID;
  gid: UID;
  size: FileSize;
  atime: Timestamp;
  mtime: Timestamp;
  ctime: Timestamp;
  nlink: number;
  blocks: number;
  parentInode?: InodeNumber | undefined;
  target?: string | undefined;
}

export interface VirtualFile {
  node: VirtualNode;
  content: Uint8Array;
}

export interface VirtualDirectory {
  node: VirtualNode;
  entries: Map<string, InodeNumber>;
}

export interface FsStats {
  inode: InodeNumber;
  name: string;
  mode: FileMode;
  size: FileSize;
  atime: Timestamp;
  mtime: Timestamp;
  ctime: Timestamp;
  uid: UID;
  gid: UID;
  nlink: number;
  blocks: number;
  isDirectory: boolean;
  isFile: boolean;
  isSymlink: boolean;
}

export interface MountPoint {
  path: string;
  filesystem: VirtualFileSystem;
  options?: Record<string, string> | undefined;
}

// ── Errors ───────────────────────────────────────────────────────────────

export class FsError extends Error {
  constructor(
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'FsError';
  }

  static ENOENT(path: string): FsError {
    return new FsError('ENOENT', `No such file or directory: ${path}`);
  }

  static EEXIST(path: string): FsError {
    return new FsError('EEXIST', `File exists: ${path}`);
  }

  static ENOTDIR(path: string): FsError {
    return new FsError('ENOTDIR', `Not a directory: ${path}`);
  }

  static EISDIR(path: string): FsError {
    return new FsError('EISDIR', `Is a directory: ${path}`);
  }

  static EACCES(path: string): FsError {
    return new FsError('EACCES', `Permission denied: ${path}`);
  }

  static ENOSPC(): FsError {
    return new FsError('ENOSPC', 'No space left on device');
  }

  static EROFS(path: string): FsError {
    return new FsError('EROFS', `Read-only filesystem: ${path}`);
  }
}

// ── IndexedDB persistence ────────────────────────────────────────────────

interface PersistedNode {
  inode: number;
  name: string;
  mode: number;
  uid: string;
  gid: string;
  size: number;
  atime: number;
  mtime: number;
  ctime: number;
  nlink: number;
  blocks: number;
  parentInode: number | undefined;
  target: string | undefined;
  content: ArrayBuffer | undefined;
}

class FsDatabase extends Dexie {
  nodes!: EntityTable<PersistedNode, 'inode'>;

  constructor(namespace: string) {
    super(`cybersim_fs_${namespace}`);
    this.version(1).stores({
      nodes: '++inode, name, parentInode, *uid, *gid',
    });
  }
}

// ── VirtualFileSystem ────────────────────────────────────────────────────

export interface VfsOptions {
  uid?: UID;
  gid?: UID;
  persistent?: boolean;
  persistenceNamespace?: string;
  maxFileSize?: number;
  readOnly?: boolean;
  caseSensitive?: boolean;
}

export class VirtualFileSystem {
  private nodes: Map<InodeNumber, VirtualNode> = new Map();
  private files: Map<InodeNumber, Uint8Array> = new Map();
  private directories: Map<InodeNumber, Map<string, InodeNumber>> = new Map();
  private nextInode: number = 1;
  private db?: FsDatabase;
  private lastIno: InodeNumber = inode(0);

  public readonly options: Required<VfsOptions>;
  public readonly mounts: MountPoint[] = [];

  constructor(options?: VfsOptions) {
    this.options = {
      uid: options?.uid ?? uid(),
      gid: options?.gid ?? uid(),
      persistent: options?.persistent ?? false,
      persistenceNamespace: options?.persistenceNamespace ?? 'default',
      maxFileSize: options?.maxFileSize ?? 1024 * 1024 * 64,
      readOnly: options?.readOnly ?? false,
      caseSensitive: options?.caseSensitive ?? true,
    };

    if (this.options.persistent) {
      this.db = new FsDatabase(this.options.persistenceNamespace);
    }
  }

  // ── Initialization ──────────────────────────────────────────────────

  async init(): Promise<void> {
    if (this.db) {
      const count = await this.db.nodes.count();
      if (count === 0) {
        await this.createRoot();
      } else {
        await this.loadFromDb();
      }
    } else {
      this.createRoot();
    }
  }

  private createRoot(): void {
    const now = timestamp();
    const rootMode = fileMode(S_IFDIR | 0o755);
    const rootNode: VirtualNode = {
      inode: this.allocInode(),
      name: '/',
      mode: rootMode,
      uid: this.options.uid,
      gid: this.options.gid,
      size: fileSize(4096),
      atime: now,
      mtime: now,
      ctime: now,
      nlink: 2,
      blocks: 0,
    };
    this.nodes.set(rootNode.inode, rootNode);
    this.directories.set(rootNode.inode, new Map());
  }

  private async loadFromDb(): Promise<void> {
    if (!this.db) return;
    const all = await this.db.nodes.toArray();
    let maxInode = 0;
    for (const p of all) {
      const node: VirtualNode = {
        inode: inode(p.inode),
        name: p.name,
        mode: fileMode(p.mode),
        uid: p.uid as UID,
        gid: p.gid as UID,
        size: fileSize(p.size),
        atime: p.atime as Timestamp,
        mtime: p.mtime as Timestamp,
        ctime: p.ctime as Timestamp,
        nlink: p.nlink,
        blocks: p.blocks,
        parentInode: p.parentInode !== undefined ? inode(p.parentInode) : undefined,
        target: p.target,
      };
      this.nodes.set(node.inode, node);

      if (isDirectory(node.mode)) {
        this.directories.set(node.inode, new Map());
      } else if (p.content) {
        this.files.set(node.inode, new Uint8Array(p.content));
      }

      if (p.inode > maxInode) maxInode = p.inode;
    }
    this.nextInode = maxInode + 1;
    this.lastIno = inode(maxInode);
    await this.rebuildDirectoryEntries();
  }

  private async rebuildDirectoryEntries(): Promise<void> {
    for (const [ino, node] of this.nodes) {
      if (isDirectory(node.mode) && node.parentInode !== undefined) {
        const parent = this.directories.get(node.parentInode);
        if (parent) {
          parent.set(node.name, ino);
        }
      }
    }
  }

  private allocInode(): InodeNumber {
    const ino = inode(this.nextInode++);
    this.lastIno = ino;
    return ino;
  }

  // ── Path resolution ─────────────────────────────────────────────────

  private resolvePath(path: string): { node: VirtualNode; parentNode: VirtualNode | undefined; name: string } {
    const normalized = this.normalize(path);
    if (normalized === '/') {
      const root = this.nodes.get(inode(1));
      if (!root) throw FsError.ENOENT(path);
      return { node: root, parentNode: undefined, name: '/' };
    }

    const parts = normalized.split('/').filter(Boolean);
    let current = this.nodes.get(inode(1));
    if (!current) throw FsError.ENOENT(path);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      if (!isDirectory(current!.mode)) {
        throw FsError.ENOTDIR(path);
      }
      const entries = this.directories.get(current!.inode);
      const childIno = entries?.get(part);
      if (childIno === undefined) {
        throw FsError.ENOENT(path);
      }
      const child = this.nodes.get(childIno);
      if (!child) throw FsError.ENOENT(path);

      if (i === parts.length - 1) {
        return { node: child, parentNode: current, name: part };
      }
      current = child;
    }

    throw FsError.ENOENT(path);
  }

  private normalize(path: string): string {
    if (!path.startsWith('/')) path = '/' + path;
    const parts = path.split('/').filter(Boolean);
    const result: string[] = [];
    for (const part of parts) {
      if (part === '.' || part === '') continue;
      if (part === '..') {
        result.pop();
      } else {
        result.push(this.options.caseSensitive ? part : part.toLowerCase());
      }
    }
    return '/' + result.join('/');
  }

  // ── Directory operations ────────────────────────────────────────────

  async mkdir(path: string, mode?: FileMode): Promise<VirtualNode> {
    this.checkReadOnly();
    const normalized = this.normalize(path);
    if (normalized === '/') throw FsError.EEXIST(path);

    const parts = normalized.split('/').filter(Boolean);
    const name = parts.pop()!;
    const parentPath = '/' + parts.join('/');

    try {
      const parent = this.resolvePath(parentPath);
      if (!isDirectory(parent.node.mode)) throw FsError.ENOTDIR(parentPath);

      const parentEntries = this.directories.get(parent.node.inode);
      if (parentEntries?.has(name)) throw FsError.EEXIST(path);

      const now = timestamp();
      const dirMode = mode ?? fileMode(S_IFDIR | 0o755);
      const dirNode: VirtualNode = {
        inode: this.allocInode(),
        name,
        mode: dirMode,
        uid: this.options.uid,
        gid: this.options.gid,
        size: fileSize(4096),
        atime: now,
        mtime: now,
        ctime: now,
        nlink: 2,
        blocks: 0,
        parentInode: parent.node.inode,
      };

      this.nodes.set(dirNode.inode, dirNode);
      this.directories.set(dirNode.inode, new Map());
      parentEntries!.set(name, dirNode.inode);
      parent.node.nlink++;
      parent.node.mtime = now;

      await this.persistNode(dirNode);
      return dirNode;
    } catch (e) {
      if (e instanceof FsError) throw e;
      throw FsError.ENOENT(parentPath);
    }
  }

  async readdir(path: string): Promise<VirtualNode[]> {
    const resolved = this.resolvePath(path);
    if (!isDirectory(resolved.node.mode)) throw FsError.ENOTDIR(path);

    const entries = this.directories.get(resolved.node.inode);
    if (!entries) return [];

    const result: VirtualNode[] = [];
    for (const [, childIno] of entries) {
      const child = this.nodes.get(childIno);
      if (child) result.push(child);
    }
    return result;
  }

  // ── File operations ─────────────────────────────────────────────────

  async writeFile(path: string, content: Uint8Array | string, mode?: FileMode): Promise<VirtualNode> {
    this.checkReadOnly();
    if (content.length > this.options.maxFileSize) throw FsError.ENOSPC();

    const data = typeof content === 'string' ? new TextEncoder().encode(content) : content;
    const normalized = this.normalize(path);
    const parts = normalized.split('/').filter(Boolean);
    const name = parts.pop()!;
    const parentPath = '/' + parts.join('/');

    try {
      const parent = this.resolvePath(parentPath);
      if (!isDirectory(parent.node.mode)) throw FsError.ENOTDIR(parentPath);

      const parentEntries = this.directories.get(parent.node.inode);
      const existingIno = parentEntries?.get(name);
      const now = timestamp();

      if (existingIno !== undefined) {
        const existing = this.nodes.get(existingIno);
        if (!existing) throw FsError.ENOENT(path);
        if (isDirectory(existing.mode)) throw FsError.EISDIR(path);

        existing.size = fileSize(data.length);
        existing.mtime = now;
        existing.ctime = now;
        this.files.set(existing.inode, data);
        await this.persistNode(existing);
        return existing;
      }

      const fileModeVal = mode ?? fileMode(S_IFREG | 0o644);
      const fileNode: VirtualNode = {
        inode: this.allocInode(),
        name,
        mode: fileModeVal,
        uid: this.options.uid,
        gid: this.options.gid,
        size: fileSize(data.length),
        atime: now,
        mtime: now,
        ctime: now,
        nlink: 1,
        blocks: Math.ceil(data.length / 512),
        parentInode: parent.node.inode,
      };

      this.nodes.set(fileNode.inode, fileNode);
      this.files.set(fileNode.inode, data);
      parentEntries!.set(name, fileNode.inode);
      parent.node.mtime = now;

      await this.persistNode(fileNode);
      return fileNode;
    } catch (e) {
      if (e instanceof FsError) throw e;
      throw FsError.ENOENT(parentPath);
    }
  }

  async readFile(path: string): Promise<Uint8Array> {
    const resolved = this.resolvePath(path);
    if (isDirectory(resolved.node.mode)) throw FsError.EISDIR(path);

    if (isSymlink(resolved.node.mode) && resolved.node.target) {
      return this.readFile(resolved.node.target);
    }

    const content = this.files.get(resolved.node.inode);
    if (content === undefined) return new Uint8Array();
    resolved.node.atime = timestamp() as Timestamp;
    return content;
  }

  async readFileAsString(path: string): Promise<string> {
    const data = await this.readFile(path);
    return new TextDecoder().decode(data);
  }

  // ── Metadata ────────────────────────────────────────────────────────

  async stat(path: string): Promise<FsStats> {
    const resolved = this.resolvePath(path);
    return this.nodeToStats(resolved.node);
  }

  async chmod(path: string, mode: FileMode): Promise<void> {
    this.checkReadOnly();
    const resolved = this.resolvePath(path);
    const masked = (resolved.node.mode & S_IFMT) | (mode & 0o7777);
    resolved.node.mode = fileMode(masked);
    resolved.node.ctime = timestamp() as Timestamp;
    await this.persistNode(resolved.node);
  }

  async chown(path: string, owner: UID, group: UID): Promise<void> {
    this.checkReadOnly();
    const resolved = this.resolvePath(path);
    resolved.node.uid = owner;
    resolved.node.gid = group;
    resolved.node.ctime = timestamp() as Timestamp;
    await this.persistNode(resolved.node);
  }

  async utimes(path: string, atime: Timestamp, mtime: Timestamp): Promise<void> {
    this.checkReadOnly();
    const resolved = this.resolvePath(path);
    resolved.node.atime = atime;
    resolved.node.mtime = mtime;
    await this.persistNode(resolved.node);
  }

  async link(targetPath: string, linkPath: string): Promise<VirtualNode> {
    this.checkReadOnly();
    const target = this.resolvePath(targetPath);
    const normalized = this.normalize(linkPath);
    const parts = normalized.split('/').filter(Boolean);
    const name = parts.pop()!;
    const parentPath = '/' + parts.join('/');
    const parent = this.resolvePath(parentPath);
    if (!isDirectory(parent.node.mode)) throw FsError.ENOTDIR(parentPath);

    const parentEntries = this.directories.get(parent.node.inode);
    if (parentEntries?.has(name)) throw FsError.EEXIST(linkPath);

    const now = timestamp();
    const linkMode = fileMode(target.node.mode & 0o777);
    const linkNode: VirtualNode = {
      inode: this.allocInode(),
      name,
      mode: linkMode,
      uid: this.options.uid,
      gid: this.options.gid,
      size: target.node.size,
      atime: now,
      mtime: now,
      ctime: now,
      nlink: target.node.nlink + 1,
      blocks: target.node.blocks,
      parentInode: parent.node.inode,
    };

    this.nodes.set(linkNode.inode, linkNode);
    parentEntries!.set(name, linkNode.inode);
    target.node.nlink++;
    return linkNode;
  }

  async symlink(targetPath: string, linkPath: string): Promise<VirtualNode> {
    this.checkReadOnly();
    const normalized = this.normalize(linkPath);
    const parts = normalized.split('/').filter(Boolean);
    const name = parts.pop()!;
    const parentPath = '/' + parts.join('/');
    const parent = this.resolvePath(parentPath);
    if (!isDirectory(parent.node.mode)) throw FsError.ENOTDIR(parentPath);

    const parentEntries = this.directories.get(parent.node.inode);
    if (parentEntries?.has(name)) throw FsError.EEXIST(linkPath);

    const now = timestamp();
    const linkNode: VirtualNode = {
      inode: this.allocInode(),
      name,
      mode: fileMode(S_IFLNK | 0o777),
      uid: this.options.uid,
      gid: this.options.gid,
      size: fileSize(new TextEncoder().encode(targetPath).length),
      atime: now,
      mtime: now,
      ctime: now,
      nlink: 1,
      blocks: 0,
      parentInode: parent.node.inode,
      target: targetPath,
    };

    this.nodes.set(linkNode.inode, linkNode);
    parentEntries!.set(name, linkNode.inode);
    return linkNode;
  }

  async readlink(path: string): Promise<string> {
    const resolved = this.resolvePath(path);
    if (!isSymlink(resolved.node.mode)) {
      throw new FsError('EINVAL', `Not a symlink: ${path}`);
    }
    return resolved.node.target ?? '';
  }

  async unlink(path: string): Promise<void> {
    this.checkReadOnly();
    const resolved = this.resolvePath(path);
    if (isDirectory(resolved.node.mode)) {
      throw FsError.EISDIR(path);
    }
    await this.removeNode(resolved);
  }

  async rmdir(path: string): Promise<void> {
    this.checkReadOnly();
    const resolved = this.resolvePath(path);
    if (!isDirectory(resolved.node.mode)) throw FsError.ENOTDIR(path);
    const entries = this.directories.get(resolved.node.inode);
    if (entries && entries.size > 0) {
      throw new FsError('ENOTEMPTY', `Directory not empty: ${path}`);
    }
    await this.removeNode(resolved);
  }

  async exists(path: string): Promise<boolean> {
    try {
      await this.resolvePath(path);
      return true;
    } catch {
      return false;
    }
  }

  // ── Internal ────────────────────────────────────────────────────────

  private async removeNode(resolved: { node: VirtualNode; parentNode?: VirtualNode | undefined; name: string }): Promise<void> {
    this.nodes.delete(resolved.node.inode);
    this.files.delete(resolved.node.inode);
    this.directories.delete(resolved.node.inode);

    if (resolved.parentNode) {
      const parentEntries = this.directories.get(resolved.parentNode.inode);
      parentEntries?.delete(resolved.name);
    }

    if (this.db) {
      await this.db.nodes.delete(resolved.node.inode);
    }
  }

  private nodeToStats(node: VirtualNode): FsStats {
    return {
      inode: node.inode,
      name: node.name,
      mode: node.mode,
      size: node.size,
      atime: node.atime,
      mtime: node.mtime,
      ctime: node.ctime,
      uid: node.uid,
      gid: node.gid,
      nlink: node.nlink,
      blocks: node.blocks,
      isDirectory: isDirectory(node.mode),
      isFile: isRegularFile(node.mode),
      isSymlink: isSymlink(node.mode),
    };
  }

  private checkReadOnly(): void {
    if (this.options.readOnly) throw FsError.EROFS('filesystem');
  }

  private async persistNode(node: VirtualNode): Promise<void> {
    if (!this.db) return;
    const content = this.files.get(node.inode);
    await this.db.nodes.put({
      inode: node.inode,
      name: node.name,
      mode: node.mode,
      uid: node.uid,
      gid: node.gid,
      size: node.size,
      atime: node.atime,
      mtime: node.mtime,
      ctime: node.ctime,
      nlink: node.nlink,
      blocks: node.blocks,
      parentInode: node.parentInode,
      target: node.target,
      content: content?.buffer as ArrayBuffer | undefined,
    });
  }

  // ── Mount management ────────────────────────────────────────────────

  mount(path: string, filesystem: VirtualFileSystem, options?: Record<string, string>): void {
    const normalized = this.normalize(path);
    if (this.mounts.some((m) => m.path === normalized)) {
      throw new FsError('EBUSY', `Mount point in use: ${path}`);
    }
    this.mounts.push({ path: normalized, filesystem, options });
  }

  unmount(path: string): boolean {
    const normalized = this.normalize(path);
    const idx = this.mounts.findIndex((m) => m.path === normalized);
    if (idx === -1) return false;
    this.mounts.splice(idx, 1);
    return true;
  }

  findMount(path: string): MountPoint | undefined {
    const normalized = this.normalize(path);
    let best: MountPoint | undefined;
    for (const m of this.mounts) {
      if (normalized.startsWith(m.path)) {
        if (!best || m.path.length > best.path.length) {
          best = m;
        }
      }
    }
    return best;
  }

  // ── Snapshot ────────────────────────────────────────────────────────

  async snapshot(): Promise<Uint8Array> {
    const data: Record<string, unknown> = {
      nodes: Array.from(this.nodes.entries()).map(([ino, node]) => ({ ino, ...node })),
      files: Array.from(this.files.entries()).map(([ino, content]) => ({ ino, content: Array.from(content) })),
      nextInode: this.nextInode,
    };
    return new TextEncoder().encode(JSON.stringify(data));
  }

  async restore(data: Uint8Array): Promise<void> {
    const parsed = JSON.parse(new TextDecoder().decode(data)) as {
      nodes: Array<{ ino: number } & VirtualNode>;
      files: Array<{ ino: number; content: number[] }>;
      nextInode: number;
    };

    this.nodes.clear();
    this.files.clear();
    this.directories.clear();

    for (const n of parsed.nodes) {
      const node: VirtualNode = {
        inode: inode(n.ino),
        name: n.name,
        mode: fileMode(n.mode),
        uid: n.uid,
        gid: n.gid,
        size: fileSize(n.size),
        atime: n.atime as Timestamp,
        mtime: n.mtime as Timestamp,
        ctime: n.ctime as Timestamp,
        nlink: n.nlink,
        blocks: n.blocks,
        parentInode: n.parentInode,
        target: n.target,
      };
      this.nodes.set(node.inode, node);
      if (isDirectory(node.mode)) {
        this.directories.set(node.inode, new Map());
      }
    }

    for (const f of parsed.files) {
      this.files.set(inode(f.ino), new Uint8Array(f.content));
    }

    this.nextInode = parsed.nextInode;
    await this.rebuildDirectoryEntries();
  }

  // ── Pseudo-filesystem helpers ───────────────────────────────────────

  async mountProc(): Promise<VirtualFileSystem> {
    const procFs = new VirtualFileSystem();
    await procFs.init();

    await procFs.writeFile('/cpuinfo', 'processor\t: 0\nmodel name\t: CyberSim Virtual CPU\n');
    await procFs.writeFile('/meminfo', 'MemTotal:       8388608 kB\nMemFree:        4194304 kB\n');
    await procFs.writeFile('/uptime', '3600.00 1800.00\n');
    await procFs.writeFile('/loadavg', '0.00 0.01 0.05 1/100 1234\n');
    await procFs.writeFile('/version', 'Linux version 6.8.0-cybersim (build@cybersim)\n');
    await procFs.mkdir('/self');
    await procFs.mkdir('/net');
    await procFs.writeFile('/net/tcp', '  sl  local_address rem_address   st tx_queue rx_queue\n');
    await procFs.mkdir('/sys');

    this.mount('/proc', procFs);
    return procFs;
  }

  async mountSys(): Promise<VirtualFileSystem> {
    const sysFs = new VirtualFileSystem();
    await sysFs.init();
    await sysFs.mkdir('/class');
    await sysFs.mkdir('/class/net');
    await sysFs.mkdir('/devices');
    await sysFs.mkdir('/kernel');
    await sysFs.mkdir('/kernel/cgroup');
    await sysFs.writeFile('/kernel/hostname', 'cybersim-host\n');
    await sysFs.writeFile('/kernel/osrelease', '6.8.0-cybersim\n');

    this.mount('/sys', sysFs);
    return sysFs;
  }

  async mountDev(): Promise<VirtualFileSystem> {
    const devFs = new VirtualFileSystem();
    await devFs.init();
    await devFs.writeFile('/null', '');
    await devFs.writeFile('/zero', '');
    await devFs.writeFile('/random', '');
    await devFs.writeFile('/urandom', '');
    await devFs.mkdir('/shm');
    await devFs.mkdir('/pts');

    this.mount('/dev', devFs);
    return devFs;
  }

  // ── Iteration ───────────────────────────────────────────────────────

  *walk(path: string = '/'): Generator<{ path: string; node: VirtualNode }> {
    try {
      const entries = this.readdirSync(path);
      for (const node of entries) {
        const fullPath = path === '/' ? `/${node.name}` : `${path}/${node.name}`;
        yield { path: fullPath, node };
        if (isDirectory(node.mode)) {
          yield* this.walk(fullPath);
        }
      }
    } catch {
      // skip inaccessible
    }
  }

  private readdirSync(path: string): VirtualNode[] {
    try {
      const resolved = this.resolvePathSync(path);
      if (!isDirectory(resolved.node.mode)) return [];
      const entries = this.directories.get(resolved.node.inode);
      if (!entries) return [];
      return Array.from(entries.values())
        .map((ino) => this.nodes.get(ino))
        .filter(Boolean) as VirtualNode[];
    } catch {
      return [];
    }
  }

  private resolvePathSync(path: string): { node: VirtualNode; parentNode: VirtualNode | undefined; name: string } {
    const normalized = this.normalize(path);
    if (normalized === '/') {
      const root = this.nodes.get(inode(1));
      if (!root) throw FsError.ENOENT(path);
      return { node: root, parentNode: undefined, name: '/' };
    }

    const parts = normalized.split('/').filter(Boolean);
    let current = this.nodes.get(inode(1));
    if (!current) throw FsError.ENOENT(path);

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i]!;
      if (!isDirectory(current!.mode)) throw FsError.ENOTDIR(path);
      const entries = this.directories.get(current!.inode);
      const childIno = entries?.get(part);
      if (childIno === undefined) throw FsError.ENOENT(path);
      const child = this.nodes.get(childIno);
      if (!child) throw FsError.ENOENT(path);
      if (i === parts.length - 1) return { node: child, parentNode: current, name: part };
      current = child;
    }

    throw FsError.ENOENT(path);
  }
}

// ── Factory ──────────────────────────────────────────────────────────────

export async function createDefaultFilesystem(): Promise<VirtualFileSystem> {
  const fs = new VirtualFileSystem();
  await fs.init();
  await fs.mkdir('/home');
  await fs.mkdir('/home/user');
  await fs.mkdir('/tmp');
  await fs.mkdir('/var');
  await fs.mkdir('/var/log');
  await fs.mkdir('/var/run');
  await fs.mkdir('/etc');
  await fs.mkdir('/usr');
  await fs.mkdir('/usr/bin');
  await fs.mkdir('/usr/lib');
  await fs.mkdir('/bin');
  await fs.writeFile('/etc/hostname', 'cybersim-host\n');
  await fs.writeFile('/etc/passwd', 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash\n');
  await fs.writeFile('/etc/hosts', '127.0.0.1\tlocalhost\n::1\tlocalhost\n');
  await fs.mountProc();
  await fs.mountSys();
  await fs.mountDev();
  return fs;
}
