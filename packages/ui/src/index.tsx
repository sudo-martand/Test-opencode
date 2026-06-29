import {
  type SimulationEvent,
  EventTypes,
} from '@cybersim/shared';
import { defaultTheme } from '@cybersim/terminal';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  Skull,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  X,
  GripHorizontal,
  type LucideIcon,
} from 'lucide-react';
import {
  type ReactNode,
  type MouseEvent,
  type KeyboardEvent,
  useState,
  useCallback,
  useMemo,
  Children,
  isValidElement,
  createElement,
  type HTMLAttributes,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
} from 'react';

// ── Helpers ──────────────────────────────────────────────────────────────

export type CSSClass = string | undefined | null | false | '' | readonly CSSClass[];
export function cx(...classes: CSSClass[]): string {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ');
}

// ── Panel ────────────────────────────────────────────────────────────────

export interface PanelProps {
  id: string;
  title?: string;
  icon?: LucideIcon;
  children?: ReactNode;
  defaultSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  statusBar?: ReactNode;
  onResize?: (id: string, size: { width: number; height: number }) => void;
  onClose?: (id: string) => void;
  className?: string;
}

const panelVariants: Variants = {
  collapsed: { height: 'auto', opacity: 0.7 },
  expanded: { height: 'auto', opacity: 1 },
};

export function Panel({
  id,
  title,
  icon: Icon,
  children,
  defaultSize,
  minWidth = 200,
  minHeight = 100,
  resizable = false,
  collapsible = false,
  defaultCollapsed = false,
  statusBar,
  onResize,
  onClose,
  className,
}: PanelProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [size, setSize] = useState(defaultSize ?? { width: 400, height: 300 });
  const [resizing, setResizing] = useState(false);

  const handleResizeStart = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!resizable) return;
      e.preventDefault();
      setResizing(true);

      const startX = e.clientX;
      const startY = e.clientY;
      const startW = size.width;
      const startH = size.height;

      const onMouseMove = (ev: globalThis.MouseEvent) => {
        const newW = Math.max(minWidth, startW + (ev.clientX - startX));
        const newH = Math.max(minHeight, startH + (ev.clientY - startY));
        setSize({ width: newW, height: newH });
      };

      const onMouseUp = () => {
        setResizing(false);
        onResize?.(id, size);
        globalThis.removeEventListener('mousemove', onMouseMove);
        globalThis.removeEventListener('mouseup', onMouseUp);
      };

      globalThis.addEventListener('mousemove', onMouseMove);
      globalThis.addEventListener('mouseup', onMouseUp);
    },
    [resizable, size, minWidth, minHeight, id, onResize],
  );

  return (
    <motion.div
      className={cx(
        'cyber-panel',
        'flex flex-col border border-[#1a3a3a] bg-[#0d1117] rounded overflow-hidden',
        resizing && 'select-none',
        className,
      )}
      style={{ width: size.width, minWidth }}
      variants={panelVariants}
      animate={collapsed ? 'collapsed' : 'expanded'}
      data-panel-id={id}
    >
      <div className="flex items-center justify-between px-2 py-1 bg-[#161b22] border-b border-[#1a3a3a] select-none">
        <div className="flex items-center gap-2 text-xs text-[#8b949e] font-medium">
          {Icon && <Icon size={14} className="text-[#58a6ff]" />}
          <span>{title ?? id}</span>
        </div>
        <div className="flex items-center gap-1">
          {resizable && (
            <div
              className="cursor-se-resize p-0.5 hover:bg-[#1a3a3a] rounded"
              onMouseDown={handleResizeStart}
            >
              <GripHorizontal size={12} className="text-[#484f58]" />
            </div>
          )}
          {collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-0.5 hover:bg-[#1a3a3a] rounded"
              aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {collapsed ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
            </button>
          )}
          {onClose && (
            <button
              onClick={() => onClose(id)}
              className="p-0.5 hover:bg-[#1a3a3a] rounded"
              aria-label="Close panel"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            className="flex-1 overflow-auto p-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {statusBar && !collapsed && (
        <div className="flex items-center px-2 py-0.5 bg-[#161b22] border-t border-[#1a3a3a] text-[10px] text-[#8b949e]">
          {statusBar}
        </div>
      )}
    </motion.div>
  );
}

// ── DataTable ────────────────────────────────────────────────────────────

export interface Column<T extends Record<string, unknown>> {
  key: keyof T & string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: T[keyof T], row: T) => ReactNode;
}

export interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  defaultSortColumn?: keyof T & string;
  defaultSortDirection?: 'asc' | 'desc';
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
  selectedId?: string;
  rowIdKey?: keyof T & string;
  compact?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 50,
  defaultSortColumn,
  defaultSortDirection = 'asc',
  onRowClick,
  onRowDoubleClick,
  selectedId,
  rowIdKey = 'id' as keyof T & string,
  compact = false,
  className,
}: DataTableProps<T>) {
  const [sortColumn, setSortColumn] = useState<keyof T & string | undefined>(defaultSortColumn);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>(defaultSortDirection);
  const [filters, setFilters] = useState<Partial<Record<keyof T & string, string>>>({});
  const [page, setPage] = useState(0);

  const handleSort = useCallback(
    (col: keyof T & string) => {
      if (sortColumn === col) {
        setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortColumn(col);
        setSortDirection('asc');
      }
    },
    [sortColumn],
  );

  const setFilter = useCallback((col: keyof T & string, value: string) => {
    setFilters((prev) => ({ ...prev, [col]: value }));
    setPage(0);
  }, []);

  const filtered = useMemo(() => {
    let result = [...data];
    for (const [col, val] of Object.entries(filters)) {
      if (val) {
        result = result.filter((row) => {
          const cell = row[col];
          return String(cell).toLowerCase().includes(val.toLowerCase());
        });
      }
    }
    return result;
  }, [data, filters]);

  const sorted = useMemo(() => {
    if (!sortColumn) return filtered;
    return [...filtered].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      let cmp = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        cmp = aVal - bVal;
      } else {
        cmp = String(aVal).localeCompare(String(bVal));
      }
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sortColumn, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const safePage = Math.min(page, totalPages - 1);
  const pageData = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);

  const SortIcon = sortDirection === 'asc' ? ChevronUp : ChevronDown;

  return (
    <div className={cx('cyber-datatable flex flex-col gap-1', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#1a3a3a]">
              {columns.map((col) => (
                <Th
                  key={col.key}
                  align={col.align}
                  style={col.width ? { width: col.width, minWidth: col.width } : undefined}
                  className={cx('sticky top-0 bg-[#161b22] z-10')}
                >
                  <div className="flex flex-col gap-0.5">
                    <button
                      onClick={() => col.sortable && handleSort(col.key)}
                      className={cx(
                        'flex items-center gap-1 text-[#8b949e] font-medium hover:text-[#c9d1d9]',
                        compact ? 'py-0.5 text-[10px]' : 'py-1 text-xs',
                      )}
                    >
                      {col.label}
                      {col.sortable && sortColumn === col.key && (
                        <SortIcon size={10} className="text-[#58a6ff]" />
                      )}
                      {col.sortable && sortColumn !== col.key && (
                        <ChevronsUpDown size={10} className="text-[#484f58]" />
                      )}
                    </button>
                    {col.filterable && (
                      <input
                        placeholder="Filter..."
                        value={(filters[col.key] as string) ?? ''}
                        onChange={(e) => setFilter(col.key, e.currentTarget.value)}
                        className="bg-[#0d1117] border border-[#30363d] rounded px-1 py-0.5 text-[10px] text-[#c9d1d9] w-full outline-none focus:border-[#58a6ff]"
                      />
                    )}
                  </div>
                </Th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageData.map((row) => {
              const rowId = String(row[rowIdKey]);
              return (
                <tr
                  key={rowId}
                  onClick={() => onRowClick?.(row)}
                  onDoubleClick={() => onRowDoubleClick?.(row)}
                  className={cx(
                    'border-b border-[#1a3a3a] transition-colors',
                    onRowClick && 'cursor-pointer',
                    selectedId === rowId
                      ? 'bg-[#1f3a5f]/30'
                      : 'hover:bg-[#161b22]',
                  )}
                >
                  {columns.map((col) => {
                    const cellValue = row[col.key];
                    return (
                      <Td
                        key={col.key}
                        align={col.align}
                        className={cx(compact ? 'py-0.5' : 'py-1')}
                      >
                        {col.render
                          ? col.render(cellValue as T[keyof T], row)
                          : String(cellValue)}
                      </Td>
                    );
                  })}
                </tr>
              );
            })}
            {pageData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="text-center py-4 text-[#484f58] text-xs">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between px-1 py-0.5 text-[10px] text-[#8b949e]">
        <span>
          {sorted.length} result{sorted.length !== 1 && 's'}
        </span>
        <div className="flex items-center gap-2">
          <button
            disabled={safePage <= 0}
            onClick={() => setPage(safePage - 1)}
            className="px-1 py-0.5 disabled:opacity-30 hover:text-[#c9d1d9]"
          >
            Prev
          </button>
          <span>
            {safePage + 1} / {totalPages}
          </span>
          <button
            disabled={safePage >= totalPages - 1}
            onClick={() => setPage(safePage + 1)}
            className="px-1 py-0.5 disabled:opacity-30 hover:text-[#c9d1d9]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

function Th({
  align,
  children,
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'center' | 'right' | undefined }) {
  return (
    <th
      className={cx(
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        'px-2 font-medium',
        className,
      )}
      {...props}
    >
      {children}
    </th>
  );
}

function Td({
  align,
  children,
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement> & { align?: 'left' | 'center' | 'right' | undefined }) {
  return (
    <td
      className={cx(
        align === 'center' && 'text-center',
        align === 'right' && 'text-right',
        'px-2 text-[#c9d1d9]',
        className,
      )}
      {...props}
    >
      {children}
    </td>
  );
}

// ── StatusIndicator ──────────────────────────────────────────────────────

export type StatusLevel = 'active' | 'inactive' | 'error' | 'warning' | 'pending';

export interface StatusIndicatorProps {
  level: StatusLevel;
  label?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusColors: Record<StatusLevel, string> = {
  active: 'bg-[#3fb950]',
  inactive: 'bg-[#484f58]',
  error: 'bg-[#f85149]',
  warning: 'bg-[#d29922]',
  pending: 'bg-[#58a6ff]',
};

const sizeMap = {
  sm: { dot: 'w-1.5 h-1.5', text: 'text-[10px]' },
  md: { dot: 'w-2 h-2', text: 'text-xs' },
  lg: { dot: 'w-2.5 h-2.5', text: 'text-sm' },
};

export function StatusIndicator({ level, label, pulse = false, size = 'md' }: StatusIndicatorProps) {
  const s = sizeMap[size];
  return (
    <motion.span
      className="inline-flex items-center gap-1.5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.span
        className={cx(
          'rounded-full',
          statusColors[level],
          s.dot,
          pulse && 'shadow-[0_0_4px]',
        )}
        animate={
          pulse
            ? {
                opacity: [1, 0.4, 1],
                scale: [1, 1.3, 1],
              }
            : {}
        }
        transition={
          pulse
            ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      />
      {label && <span className={cx('text-[#8b949e]', s.text)}>{label}</span>}
    </motion.span>
  );
}

// ── Timestamp ────────────────────────────────────────────────────────────

export interface TimestampProps {
  value: number;
  format?: 'full' | 'time' | 'date' | 'relative';
  showIcon?: boolean;
  className?: string;
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const dateOnlyFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: '2-digit',
});

export function Timestamp({ value, format = 'full', showIcon = false, className }: TimestampProps) {
  const label = useMemo(() => {
    if (format === 'relative') return formatRelative(value);
    if (format === 'time') return timeFormatter.format(value);
    if (format === 'date') return dateOnlyFormatter.format(value);
    return dateFormatter.format(value);
  }, [value, format]);

  return (
    <span className={cx('inline-flex items-center gap-1 text-xs text-[#8b949e]', className)}>
      {showIcon && <span className="text-[#484f58]">🕒</span>}
      <time dateTime={new Date(value).toISOString()}>{label}</time>
    </span>
  );
}

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const seconds = Math.floor(diff / 1000);
  if (seconds < 5) return 'just now';
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// ── Severity ─────────────────────────────────────────────────────────────

export type SeverityLevel = 'info' | 'low' | 'medium' | 'high' | 'critical';

export interface SeverityProps {
  level: SeverityLevel;
  label?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const severityConfig: Record<SeverityLevel, { color: string; bgColor: string; icon: LucideIcon; label: string }> = {
  info: { color: 'text-[#58a6ff]', bgColor: 'bg-[#58a6ff]/10', icon: Info, label: 'Info' },
  low: { color: 'text-[#3fb950]', bgColor: 'bg-[#3fb950]/10', icon: Info, label: 'Low' },
  medium: { color: 'text-[#d29922]', bgColor: 'bg-[#d29922]/10', icon: AlertCircle, label: 'Medium' },
  high: { color: 'text-[#f85149]', bgColor: 'bg-[#f85149]/10', icon: AlertTriangle, label: 'High' },
  critical: { color: 'text-[#da3633]', bgColor: 'bg-[#da3633]/15', icon: Skull, label: 'Critical' },
};

const severitySizeMap = {
  sm: 'text-[10px] px-1 py-0.5 gap-1',
  md: 'text-xs px-1.5 py-0.5 gap-1.5',
  lg: 'text-sm px-2 py-1 gap-2',
};

export function Severity({ level, label, showIcon = true, size = 'sm', className }: SeverityProps) {
  const config = severityConfig[level];
  const Icon = config.icon;
  return (
    <motion.span
      className={cx(
        'inline-flex items-center rounded font-medium',
        config.color,
        config.bgColor,
        severitySizeMap[size],
        className,
      )}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {showIcon && <Icon size={size === 'lg' ? 16 : size === 'md' ? 14 : 12} />}
      <span>{label ?? config.label}</span>
    </motion.span>
  );
}

// ── Notification ─────────────────────────────────────────────────────────

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface NotificationData {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  timestamp: number;
  dismissable?: boolean;
  timeoutMs?: number;
}

export interface NotificationToastProps extends NotificationData {
  onDismiss: (id: string) => void;
}

const notificationIcons: Record<NotificationType, LucideIcon> = {
  info: Info,
  success: AlertCircle,
  warning: AlertTriangle,
  error: Skull,
};

const notificationColors: Record<NotificationType, string> = {
  info: 'border-[#58a6ff] bg-[#58a6ff]/5',
  success: 'border-[#3fb950] bg-[#3fb950]/5',
  warning: 'border-[#d29922] bg-[#d29922]/5',
  error: 'border-[#f85149] bg-[#f85149]/5',
};

export function NotificationToast({
  id,
  type,
  title,
  message,
  dismissable = true,
  onDismiss,
}: NotificationToastProps) {
  const Icon = notificationIcons[type];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 100, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 100, scale: 0.9 }}
      className={cx(
        'flex items-start gap-2 p-2 rounded border text-xs w-72 shadow-lg',
        notificationColors[type],
        'bg-[#0d1117]/95 backdrop-blur',
      )}
    >
      <Icon size={14} className="mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        <div className="font-medium text-[#c9d1d9]">{title}</div>
        {message && <div className="text-[#8b949e] mt-0.5">{message}</div>}
      </div>
      {dismissable && (
        <button onClick={() => onDismiss(id)} className="shrink-0 p-0.5 hover:bg-[#1a3a3a] rounded">
          <X size={10} />
        </button>
      )}
    </motion.div>
  );
}
