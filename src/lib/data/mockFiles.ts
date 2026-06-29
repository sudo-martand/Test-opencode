import type { FileEntry } from '@/lib/types'

export const mockFilesystem: FileEntry = {
  name: '/',
  type: 'directory',
  modified: Date.now(),
  permissions: 'drwxr-xr-x',
  owner: 'root',
  group: 'root',
  children: [
    {
      name: 'home',
      type: 'directory',
      modified: Date.now(),
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: [
        {
          name: 'user',
          type: 'directory',
          modified: Date.now(),
          permissions: 'drwxr-xr-x',
          owner: 'user',
          group: 'user',
          children: [
            {
              name: 'Documents',
              type: 'directory',
              modified: Date.now(),
              permissions: 'drwxr-xr-x',
              owner: 'user',
              group: 'user',
              children: [
                { name: 'notes.md', type: 'file', size: 1126, modified: Date.now(), permissions: '-rw-r--r--', owner: 'user', group: 'user', content: '# Notes\n\nProject Alpha reconnaissance data.' },
                { name: 'targets.txt', type: 'file', size: 2450, modified: Date.now(), permissions: '-rw-r--r--', owner: 'user', group: 'user', content: '10.0.0.1\n10.0.0.2\n10.0.0.3' },
                { name: 'exploit.py', type: 'file', size: 3720, modified: Date.now(), permissions: '-rwxr-xr-x', owner: 'user', group: 'user', content: '#!/usr/bin/env python3\nprint("exploit ready")' },
              ],
            },
            {
              name: 'Downloads',
              type: 'directory',
              modified: Date.now(),
              permissions: 'drwxr-xr-x',
              owner: 'user',
              group: 'user',
              children: [
                { name: 'payload.bin', type: 'file', size: 1456000, modified: Date.now(), permissions: '-rw-r--r--', owner: 'user', group: 'user' },
                { name: 'tools.tar.gz', type: 'file', size: 8920000, modified: Date.now(), permissions: '-rw-r--r--', owner: 'user', group: 'user' },
              ],
            },
            {
              name: 'Tools',
              type: 'directory',
              modified: Date.now(),
              permissions: 'drwxr-xr-x',
              owner: 'user',
              group: 'user',
              children: [
                { name: 'scanner', type: 'directory', modified: Date.now(), permissions: 'drwxr-xr-x', owner: 'user', group: 'user' },
                { name: 'sniffer', type: 'directory', modified: Date.now(), permissions: 'drwxr-xr-x', owner: 'user', group: 'user' },
                { name: 'crypto', type: 'directory', modified: Date.now(), permissions: 'drwxr-xr-x', owner: 'user', group: 'user' },
              ],
            },
            {
              name: '.ssh',
              type: 'directory',
              modified: Date.now(),
              permissions: 'drwx------',
              owner: 'user',
              group: 'user',
              children: [
                { name: 'id_rsa', type: 'file', size: 2600, modified: Date.now(), permissions: '-rw-------', owner: 'user', group: 'user' },
                { name: 'id_rsa.pub', type: 'file', size: 600, modified: Date.now(), permissions: '-rw-r--r--', owner: 'user', group: 'user' },
                { name: 'known_hosts', type: 'file', size: 420, modified: Date.now(), permissions: '-rw-r--r--', owner: 'user', group: 'user' },
              ],
            },
            {
              name: 'config.json',
              type: 'file', size: 456, modified: Date.now(), permissions: '-rw-r--r--', owner: 'user', group: 'user',
              content: '{"theme": "matrix", "sound": true, "effects": true}',
            },
          ],
        },
      ],
    },
    {
      name: 'etc',
      type: 'directory',
      modified: Date.now(),
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: [
        { name: 'hosts', type: 'file', size: 250, modified: Date.now(), permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        { name: 'passwd', type: 'file', size: 1800, modified: Date.now(), permissions: '-rw-r--r--', owner: 'root', group: 'root' },
        { name: 'shadow', type: 'file', size: 900, modified: Date.now(), permissions: 'drw-------', owner: 'root', group: 'root' },
      ],
    },
    {
      name: 'var',
      type: 'directory',
      modified: Date.now(),
      permissions: 'drwxr-xr-x',
      owner: 'root',
      group: 'root',
      children: [
        {
          name: 'log',
          type: 'directory',
          modified: Date.now(),
          permissions: 'drwxr-xr-x',
          owner: 'root',
          group: 'root',
          children: [
            { name: 'syslog', type: 'file', size: 450000, modified: Date.now(), permissions: '-rw-r--r--', owner: 'root', group: 'root' },
            { name: 'auth.log', type: 'file', size: 120000, modified: Date.now(), permissions: '-rw-------', owner: 'root', group: 'root' },
          ],
        },
      ],
    },
  ],
}
