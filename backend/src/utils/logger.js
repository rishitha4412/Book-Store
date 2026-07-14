import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGS_DIR = path.join(__dirname, '../../logs');

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

const COLORS = {
  reset: '\x1b[0m',
  info: '\x1b[32m', // Green
  warn: '\x1b[33m', // Yellow
  error: '\x1b[31m', // Red
  debug: '\x1b[36m', // Cyan
};

class CustomLogger {
  constructor() {
    this.env = process.env.NODE_ENV || 'development';
  }

  formatMessage(level, message, meta) {
    const timestamp = new Date().toISOString();
    const metaString = meta && Object.keys(meta).length ? ` | Meta: ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}]: ${message}${metaString}`;
  }

  log(level, message, meta = {}) {
    const formatted = this.formatMessage(level, message, meta);
    
    // Console output with colors
    const color = COLORS[level] || COLORS.reset;
    console.log(`${color}${formatted}${COLORS.reset}`);

    // File writing (JSON formatting for log ingestion systems)
    const logObject = {
      timestamp: new Date().toISOString(),
      level,
      message,
      meta,
    };

    const logLine = JSON.stringify(logObject) + '\n';
    
    // Write to combined log file
    fs.appendFile(path.join(LOGS_DIR, 'combined.log'), logLine, (err) => {
      if (err) console.error('Failed to write to combined.log', err);
    });

    // Write to error log file if level is error
    if (level === 'error') {
      fs.appendFile(path.join(LOGS_DIR, 'error.log'), logLine, (err) => {
        if (err) console.error('Failed to write to error.log', err);
      });
    }
  }

  info(message, meta) {
    this.log('info', message, meta);
  }

  warn(message, meta) {
    this.log('warn', message, meta);
  }

  error(message, meta) {
    // If message is an Error instance, extract message and stack
    if (message instanceof Error) {
      this.log('error', message.message, { ...meta, stack: message.stack });
    } else {
      this.log('error', message, meta);
    }
  }

  debug(message, meta) {
    if (this.env === 'development') {
      this.log('debug', message, meta);
    }
  }
}

const logger = new CustomLogger();
export default logger;
