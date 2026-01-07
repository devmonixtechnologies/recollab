import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

// Enhanced security utilities for V3

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
};

// In-memory rate limiting (for development)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// CSRF protection
export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function validateCSRFToken(token: string, sessionToken: string): boolean {
  // In production, store CSRF tokens in session/database
  // For now, validate token format and length
  return token.length === 64 && /^[a-f0-9]+$/.test(token);
}

// Input sanitization
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
}

// Password strength validation
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
  score: number;
} {
  const errors: string[] = [];
  let score = 0;

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score += 1;
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  // Check for common patterns
  const commonPatterns = [
    /123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i
  ];

  if (commonPatterns.some(pattern => pattern.test(password))) {
    errors.push('Password contains common patterns that are easy to guess');
    score = Math.max(0, score - 2);
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: Math.max(0, Math.min(5, score))
  };
}

// Session security enhancements
export class SecureSessionManager {
  private static readonly SESSION_TIMEOUT = 7 * 24 * 60 * 60 * 1000; // 7 days
  private static readonly ABSOLUTE_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 days
  private static readonly MAX_CONCURRENT_SESSIONS = 5;

  static generateSecureToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  static validateSession(session: any): boolean {
    if (!session) return false;

    const now = Date.now();
    const createdAt = new Date(session.createdAt).getTime();
    const lastActivity = new Date(session.lastActivity || session.createdAt).getTime();

    // Check absolute timeout
    if (now - createdAt > this.ABSOLUTE_TIMEOUT) {
      return false;
    }

    // Check inactivity timeout
    if (now - lastActivity > this.SESSION_TIMEOUT) {
      return false;
    }

    return true;
  }

  static updateSessionActivity(sessionId: string): void {
    // In production, update lastActivity in database
    // For now, this is a placeholder
  }
}

// Content Security Policy headers
export function getCSPHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://cdn.jsdelivr.net",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' https://api.liveblocks.io https://api.openai.com",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
  };
}

// API rate limiting middleware
export function createRateLimitMiddleware(options: Partial<typeof rateLimitConfig> = {}) {
  const config = { ...rateLimitConfig, ...options };
  
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const now = Date.now();
    
    // Get current rate limit data for this IP
    const current = rateLimitStore.get(ip);
    
    if (!current || now > current.resetTime) {
      // Reset or initialize rate limit
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return null;
    }
    
    if (current.count >= config.max) {
      return NextResponse.json(
        { error: config.message },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': config.max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': current.resetTime.toString()
          }
        }
      );
    }
    
    // Increment count
    current.count++;
    
    return null; // Continue to next middleware
  };
}

// Data encryption utilities
export class DataEncryption {
  private static readonly ALGORITHM = 'aes-256-gcm';
  private static readonly KEY_LENGTH = 32;

  static generateKey(): string {
    return crypto.randomBytes(this.KEY_LENGTH).toString('hex');
  }

  static encrypt(text: string, key: string): {
    encrypted: string;
    iv: string;
    tag: string;
  } {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.ALGORITHM, Buffer.from(key, 'hex'));
    cipher.setAAD(Buffer.from('recollab-v3'));

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    return {
      encrypted,
      iv: iv.toString('hex'),
      tag: tag.toString('hex')
    };
  }

  static decrypt(encryptedData: {
    encrypted: string;
    iv: string;
    tag: string;
  }, key: string): string {
    const decipher = crypto.createDecipher(this.ALGORITHM, Buffer.from(key, 'hex'));
    decipher.setAAD(Buffer.from('recollab-v3'));
    decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

    let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
  }
}

// Audit logging
export class SecurityAuditLogger {
  static logSecurityEvent(event: {
    type: 'login' | 'logout' | 'failed_login' | 'permission_denied' | 'suspicious_activity';
    userId?: string;
    ip: string;
    userAgent?: string;
    details?: Record<string, any>;
  }): void {
    const logEntry = {
      ...event,
      timestamp: new Date().toISOString(),
      severity: this.getSeverityLevel(event.type)
    };

    // In production, send to security monitoring service
    console.log('[SECURITY AUDIT]', JSON.stringify(logEntry));
  }

  private static getSeverityLevel(type: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (type) {
      case 'login':
      case 'logout':
        return 'low';
      case 'failed_login':
      case 'permission_denied':
        return 'medium';
      case 'suspicious_activity':
        return 'high';
      default:
        return 'medium';
    }
  }
}

// Input validation schemas
export const validationSchemas = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  documentTitle: /^.{1,100}$/,
  roomId: /^[a-zA-Z0-9_-]{1,50}$/
};

export function validateInput(data: any, schema: Record<string, RegExp>): {
  isValid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  for (const [field, pattern] of Object.entries(schema)) {
    if (!data[field] || !pattern.test(data[field])) {
      errors[field] = `Invalid ${field} format`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
