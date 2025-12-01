import jwt from 'jsonwebtoken';

// Set up test environment
process.env.JWT_SECRET = 'test-jwt-secret-for-testing';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-for-testing';
process.env.NODE_ENV = 'test';

// Test JWT token generation and validation
describe('Auth Token Tests', () => {
  const JWT_SECRET = 'test-jwt-secret-for-testing';
  const JWT_REFRESH_SECRET = 'test-refresh-secret-for-testing';

  describe('JWT Token Generation', () => {
    it('should generate a valid access token', () => {
      const userId = 'test-user-123';
      const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });

      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe('string');

      const decoded = jwt.verify(accessToken, JWT_SECRET) as { userId: string };
      expect(decoded.userId).toBe(userId);
    });

    it('should generate a valid refresh token', () => {
      const userId = 'test-user-456';
      const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe('string');

      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
      expect(decoded.userId).toBe(userId);
    });

    it('should reject invalid tokens', () => {
      const invalidToken = 'invalid.token.here';

      expect(() => {
        jwt.verify(invalidToken, JWT_SECRET);
      }).toThrow();
    });

    it('should reject tokens signed with wrong secret', () => {
      const userId = 'test-user-789';
      const token = jwt.sign({ userId }, 'wrong-secret', { expiresIn: '15m' });

      expect(() => {
        jwt.verify(token, JWT_SECRET);
      }).toThrow();
    });
  });

  describe('Password Validation', () => {
    const bcrypt = require('bcryptjs');

    it('should hash password correctly', async () => {
      const password = 'TestPassword123!';
      const hash = await bcrypt.hash(password, 12);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should verify correct password', async () => {
      const password = 'TestPassword123!';
      const hash = await bcrypt.hash(password, 12);

      const isValid = await bcrypt.compare(password, hash);
      expect(isValid).toBe(true);
    });

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword456!';
      const hash = await bcrypt.hash(password, 12);

      const isValid = await bcrypt.compare(wrongPassword, hash);
      expect(isValid).toBe(false);
    });
  });

  describe('Input Validation', () => {
    const { z } = require('zod');

    const registerSchema = z.object({
      email: z.string().email('Invalid email format'),
      password: z.string().min(8, 'Password must be at least 8 characters'),
      firstName: z.string().min(1, 'First name is required'),
      lastName: z.string().min(1, 'Last name is required'),
      userType: z.enum(['individual', 'company']),
    });

    it('should validate correct registration data', () => {
      const validData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'individual',
      };

      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        email: 'not-an-email',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'individual',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject short password', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'short',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'individual',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject invalid user type', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
        firstName: 'John',
        lastName: 'Doe',
        userType: 'admin', // invalid type
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it('should reject missing required fields', () => {
      const invalidData = {
        email: 'test@example.com',
        password: 'Password123!',
      };

      const result = registerSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });
});

describe('Secure Token Generation', () => {
  const crypto = require('crypto');

  it('should generate unique tokens', () => {
    const token1 = crypto.randomBytes(32).toString('hex');
    const token2 = crypto.randomBytes(32).toString('hex');

    expect(token1).not.toBe(token2);
    expect(token1.length).toBe(64); // 32 bytes = 64 hex chars
    expect(token2.length).toBe(64);
  });

  it('should generate cryptographically random tokens', () => {
    const tokens = new Set();

    // Generate 100 tokens and verify uniqueness
    for (let i = 0; i < 100; i++) {
      const token = crypto.randomBytes(32).toString('hex');
      expect(tokens.has(token)).toBe(false);
      tokens.add(token);
    }

    expect(tokens.size).toBe(100);
  });
});
