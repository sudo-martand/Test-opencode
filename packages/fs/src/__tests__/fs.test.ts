import { describe, it, expect, beforeEach } from 'vitest';
import { VirtualFileSystem, FsError, isDirectory, isRegularFile, isSymlink, fileMode } from '../index';
import { S_IFDIR, S_IFREG, S_IFLNK, S_IRWXU, S_IRWXG, S_IRWXO } from '../index';

describe('VirtualFileSystem', () => {
  let fs: VirtualFileSystem;

  beforeEach(async () => {
    fs = new VirtualFileSystem();
    await fs.init();
  });

  describe('initialization', () => {
    it('creates root directory', async () => {
      const stat = await fs.stat('/');
      expect(stat.isDirectory).toBe(true);
      expect(stat.name).toBe('/');
    });

    it('root has correct permissions', async () => {
      const stat = await fs.stat('/');
      expect(stat.mode & S_IRWXU).toBe(0o700);
    });

    it('handles non-existent path', async () => {
      await expect(fs.stat('/nonexistent')).rejects.toThrow(FsError);
    });
  });

  describe('mkdir', () => {
    it('creates a directory', async () => {
      const node = await fs.mkdir('/testdir');
      expect(isDirectory(node.mode)).toBe(true);
      expect(node.name).toBe('testdir');
    });

    it('creates nested directories', async () => {
      await fs.mkdir('/a');
      await fs.mkdir('/a/b');
      await fs.mkdir('/a/b/c');
      const stat = await fs.stat('/a/b/c');
      expect(stat.isDirectory).toBe(true);
    });

    it('throws EEXIST for existing directory', async () => {
      await fs.mkdir('/testdir');
      await expect(fs.mkdir('/testdir')).rejects.toMatchObject({ code: 'EEXIST' });
    });

    it('throws ENOENT for invalid parent path', async () => {
      await expect(fs.mkdir('/nonexistent/dir')).rejects.toThrow(FsError);
    });

    it('applies custom mode', async () => {
      const mode = fileMode(S_IFDIR | 0o700);
      const node = await fs.mkdir('/private', mode);
      expect(node.mode & 0o777).toBe(0o700);
    });
  });

  describe('writeFile / readFile', () => {
    it('writes and reads a string', async () => {
      await fs.writeFile('/test.txt', 'hello world');
      const content = await fs.readFileAsString('/test.txt');
      expect(content).toBe('hello world');
    });

    it('writes and reads binary data', async () => {
      const data = new Uint8Array([0x00, 0x01, 0x02, 0xFF]);
      await fs.writeFile('/binary.bin', data);
      const read = await fs.readFile('/binary.bin');
      expect(read).toEqual(data);
    });

    it('overwrites existing file', async () => {
      await fs.writeFile('/test.txt', 'original');
      await fs.writeFile('/test.txt', 'updated');
      const content = await fs.readFileAsString('/test.txt');
      expect(content).toBe('updated');
    });

    it('creates file with parent directory existing', async () => {
      await fs.mkdir('/parent');
      await fs.writeFile('/parent/file.txt', 'content');
      const content = await fs.readFileAsString('/parent/file.txt');
      expect(content).toBe('content');
    });

    it('requires parent directory to exist', async () => {
      await expect(fs.writeFile('/nonexistent/file.txt', 'content')).rejects.toThrow(FsError);
    });

    it('returns file stats after write', async () => {
      const node = await fs.writeFile('/test.txt', 'data');
      expect(isRegularFile(node.mode)).toBe(true);
      expect(node.size).toBe(4);
    });

    it('enforces max file size', async () => {
      const smallFs = new VirtualFileSystem({ maxFileSize: 10 });
      await smallFs.init();
      const data = new Uint8Array(100);
      await expect(smallFs.writeFile('/big.txt', data)).rejects.toMatchObject({ code: 'ENOSPC' });
    });
  });

  describe('readdir', () => {
    it('lists directory contents', async () => {
      await fs.mkdir('/dir1');
      await fs.mkdir('/dir2');
      await fs.writeFile('/file1.txt', '');
      const entries = await fs.readdir('/');
      const names = entries.map((e) => e.name).sort();
      expect(names).toContain('dir1');
      expect(names).toContain('dir2');
      expect(names).toContain('file1.txt');
    });

    it('returns empty for new directory', async () => {
      await fs.mkdir('/empty');
      const entries = await fs.readdir('/empty');
      expect(entries).toHaveLength(0);
    });

    it('throws ENOTDIR for file path', async () => {
      await fs.writeFile('/file.txt', '');
      await expect(fs.readdir('/file.txt')).rejects.toMatchObject({ code: 'ENOTDIR' });
    });
  });

  describe('stat', () => {
    it('returns correct file stats', async () => {
      await fs.writeFile('/stats.txt', 'content');
      const s = await fs.stat('/stats.txt');
      expect(s.isFile).toBe(true);
      expect(s.isDirectory).toBe(false);
      expect(s.size).toBe(7);
      expect(s.mode).toBeDefined();
      expect(s.inode).toBeDefined();
    });

    it('returns correct directory stats', async () => {
      await fs.mkdir('/mydir');
      const s = await fs.stat('/mydir');
      expect(s.isDirectory).toBe(true);
      expect(s.isFile).toBe(false);
    });
  });

  describe('unlink', () => {
    it('removes a file', async () => {
      await fs.writeFile('/delete.txt', 'content');
      await fs.unlink('/delete.txt');
      await expect(fs.stat('/delete.txt')).rejects.toThrow(FsError);
    });

    it('throws EISDIR for directory', async () => {
      await fs.mkdir('/dir');
      await expect(fs.unlink('/dir')).rejects.toMatchObject({ code: 'EISDIR' });
    });
  });

  describe('rmdir', () => {
    it('removes an empty directory', async () => {
      await fs.mkdir('/emptydir');
      await fs.rmdir('/emptydir');
      await expect(fs.stat('/emptydir')).rejects.toThrow(FsError);
    });

    it('throws ENOTEMPTY for non-empty directory', async () => {
      await fs.mkdir('/parent');
      await fs.mkdir('/parent/child');
      await expect(fs.rmdir('/parent')).rejects.toMatchObject({ code: 'ENOTEMPTY' });
    });

    it('throws ENOTDIR for file', async () => {
      await fs.writeFile('/file.txt', '');
      await expect(fs.rmdir('/file.txt')).rejects.toMatchObject({ code: 'ENOTDIR' });
    });
  });

  describe('symlink / readlink', () => {
    it('creates and reads a symlink', async () => {
      await fs.writeFile('/target.txt', 'real content');
      await fs.symlink('/target.txt', '/link.txt');
      const target = await fs.readlink('/link.txt');
      expect(target).toBe('/target.txt');
    });

    it('follows symlink on read', async () => {
      await fs.writeFile('/target.txt', 'real content');
      await fs.symlink('/target.txt', '/link.txt');
      const content = await fs.readFileAsString('/link.txt');
      expect(content).toBe('real content');
    });

    it('throws EINVAL for non-symlink', async () => {
      await fs.writeFile('/file.txt', '');
      await expect(fs.readlink('/file.txt')).rejects.toMatchObject({ code: 'EINVAL' });
    });
  });

  describe('link', () => {
    it('creates a hard link', async () => {
      await fs.writeFile('/original.txt', 'content');
      await fs.link('/original.txt', '/hardlink.txt');
      const original = await fs.readFileAsString('/original.txt');
      expect(original).toBe('content');
      const s = await fs.stat('/hardlink.txt');
      expect(s.size).toBe(7);
    });
  });

  describe('chmod / chown', () => {
    it('changes file mode', async () => {
      await fs.writeFile('/test.txt', '');
      await fs.chmod('/test.txt', fileMode(0o644));
      const s = await fs.stat('/test.txt');
      expect(s.mode & 0o777).toBe(0o644);
    });

    it('changes file ownership', async () => {
      await fs.writeFile('/test.txt', '');
      const owner = 'owner-123' as unknown as number;
      const group = 'group-456' as unknown as number;
      await fs.chown('/test.txt', owner, group);
      const s = await fs.stat('/test.txt');
      expect(s.uid).toBe(owner);
      expect(s.gid).toBe(group);
    });
  });

  describe('exists', () => {
    it('returns true for existing paths', async () => {
      await fs.mkdir('/existing');
      expect(await fs.exists('/existing')).toBe(true);
      expect(await fs.exists('/')).toBe(true);
    });

    it('returns false for non-existent paths', async () => {
      expect(await fs.exists('/nonexistent')).toBe(false);
    });
  });

  describe('readOnly mode', () => {
    it('prevents writes in read-only mode', async () => {
      const roFs = new VirtualFileSystem({ readOnly: true });
      await roFs.init();
      await expect(roFs.mkdir('/test')).rejects.toMatchObject({ code: 'EROFS' });
      await expect(roFs.writeFile('/test.txt', '')).rejects.toMatchObject({ code: 'EROFS' });
    });
  });

  describe('mount', () => {
    it('mounts a filesystem', async () => {
      const procFs = new VirtualFileSystem();
      await procFs.init();
      fs.mount('/proc', procFs);
      expect(fs.mounts).toHaveLength(1);
      expect(fs.mounts[0]!.path).toBe('/proc');
    });

    it('throws EBUSY for duplicate mount point', async () => {
      const a = new VirtualFileSystem();
      const b = new VirtualFileSystem();
      await a.init();
      await b.init();
      fs.mount('/mnt', a);
      expect(() => fs.mount('/mnt', b)).toThrow();
    });

    it('unmounts a filesystem', () => {
      const sub = new VirtualFileSystem();
      sub.init();
      fs.mount('/sub', sub);
      expect(fs.unmount('/sub')).toBe(true);
      expect(fs.mounts).toHaveLength(0);
    });
  });

  describe('mountProc / mountSys / mountDev', () => {
    it('mounts proc filesystem', async () => {
      await fs.mountProc();
      const mount = fs.findMount('/proc');
      expect(mount).toBeDefined();
      expect(mount!.path).toBe('/proc');
      const content = await mount!.filesystem.readFileAsString('/cpuinfo');
      expect(content).toContain('CyberSim Virtual CPU');
    });

    it('mounts sys filesystem', async () => {
      await fs.mountSys();
      const mount = fs.findMount('/sys');
      expect(mount).toBeDefined();
      const content = await mount!.filesystem.readFileAsString('/kernel/hostname');
      expect(content).toContain('cybersim-host');
    });

    it('mounts dev filesystem', async () => {
      await fs.mountDev();
      const mount = fs.findMount('/dev');
      expect(mount).toBeDefined();
      expect(await mount!.filesystem.exists('/null')).toBe(true);
    });
  });

  describe('snapshot / restore', () => {
    it('snapshots and restores filesystem state', async () => {
      await fs.mkdir('/snapdir');
      await fs.writeFile('/snapdir/file.txt', 'snapshot content');
      const snap = await fs.snapshot();

      const fs2 = new VirtualFileSystem();
      await fs2.init();
      await fs2.restore(snap);
      const exists = await fs2.exists('/snapdir');
      expect(exists).toBe(true);
    });
  });

  describe('walk', () => {
    it('walks directory tree', async () => {
      await fs.mkdir('/a');
      await fs.mkdir('/a/b');
      await fs.writeFile('/a/b/foo.txt', 'foo');
      const paths: string[] = [];
      for (const entry of fs.walk('/')) {
        paths.push(entry.path);
      }
      expect(paths).toContain('/a');
      expect(paths).toContain('/a/b');
      expect(paths).toContain('/a/b/foo.txt');
    });
  });

  describe('createDefaultFilesystem', () => {
    it('creates standard directory structure', async () => {
      const { createDefaultFilesystem } = await import('../index');
      const defaultFs = await createDefaultFilesystem();
      expect(await defaultFs.exists('/home')).toBe(true);
      expect(await defaultFs.exists('/tmp')).toBe(true);
      expect(await defaultFs.exists('/etc')).toBe(true);
      expect(await defaultFs.exists('/usr/bin')).toBe(true);
      const procMount = defaultFs.findMount('/proc');
      expect(procMount).toBeDefined();
      const sysMount = defaultFs.findMount('/sys');
      expect(sysMount).toBeDefined();
      const devMount = defaultFs.findMount('/dev');
      expect(devMount).toBeDefined();
    });
  });

  describe('utimes', () => {
    it('updates access and modification times', async () => {
      await fs.writeFile('/test.txt', 'content');
      const atime = 1000000 as unknown as number;
      const mtime = 2000000 as unknown as number;
      await fs.utimes('/test.txt', atime, mtime);
      const s = await fs.stat('/test.txt');
      expect(s.atime).toBe(atime);
      expect(s.mtime).toBe(mtime);
    });
  });

  describe('error cases', () => {
    it('throws ENOENT for reading nonexistent file', async () => {
      await expect(fs.readFile('/nope')).rejects.toThrow(FsError);
    });

    it('throws EISDIR for reading root as file', async () => {
      await expect(fs.readFile('/')).rejects.toMatchObject({ code: 'EISDIR' });
    });

    it('throws ENOTDIR when path component is not a directory', async () => {
      await fs.writeFile('/file.txt', '');
      await expect(fs.stat('/file.txt/sub')).rejects.toThrow(FsError);
    });
  });
});

describe('helper functions', () => {
  it('isDirectory identifies directories', () => {
    expect(isDirectory(fileMode(S_IFDIR | 0o755))).toBe(true);
    expect(isDirectory(fileMode(S_IFREG | 0o644))).toBe(false);
    expect(isDirectory(fileMode(S_IFLNK | 0o777))).toBe(false);
  });

  it('isRegularFile identifies files', () => {
    expect(isRegularFile(fileMode(S_IFREG | 0o644))).toBe(true);
    expect(isRegularFile(fileMode(S_IFDIR | 0o755))).toBe(false);
  });

  it('isSymlink identifies symlinks', () => {
    expect(isSymlink(fileMode(S_IFLNK | 0o777))).toBe(true);
    expect(isSymlink(fileMode(S_IFREG | 0o644))).toBe(false);
  });
});
