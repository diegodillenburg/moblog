export interface MlogOptions {
  maxLines?: number;
  startMinimized?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'dark' | 'light' | 'auto';
  captureConsole?: boolean;
  captureErrors?: boolean;
  capturePromiseRejections?: boolean;
  persist?: boolean;
  storageKey?: string;
  filter?: {
    levels?: Array<'log' | 'info' | 'warn' | 'error' | 'debug'>;
    text?: string | null;
  };
  onLog?: (entry: LogEntry) => void;
  onError?: (error: LogEntry) => void;
}

export interface LogEntry {
  type: 'log' | 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: number;
  stack?: string;
}

export interface FilterOptions {
  levels?: Array<'log' | 'info' | 'warn' | 'error' | 'debug'>;
  text?: string;
}

export class Mlog {
  static instance: Mlog | null;
  static init(options?: MlogOptions): Mlog;
  static destroy(): void;

  constructor(options?: MlogOptions);

  log(message: string, type?: 'log' | 'info' | 'warn' | 'error' | 'debug'): void;
  show(): void;
  hide(): void;
  toggle(): void;
  clear(): void;
  filter(options: FilterOptions): void;
  copy(): void;
  export(format?: 'txt' | 'json'): void;
  destroy(): void;
}

export default Mlog;
