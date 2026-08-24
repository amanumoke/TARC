import { describe, expect, it } from 'vitest';
import { generateToken, hashPassword, verifyPassword, verifyToken } from './security.js';

describe('Security Utilities', () => {
  it('hashes and verifies a password correctly', async () => {
    const raw = 'tarc_secret_2026';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(await verifyPassword(raw, hash)).toBe(true);
    expect(await verifyPassword('wrong_password', hash)).toBe(false);
  });

  it('generates and verifies signed JWT tokens', () => {
    const payload = { id: 'usr-123', email: 'admin@tarc.gov.et', role: 'ADMIN' as const };
    const token = generateToken(payload);
    const decoded = verifyToken(token);
    expect(decoded.id).toBe(payload.id);
    expect(decoded.email).toBe(payload.email);
    expect(decoded.role).toBe(payload.role);
  });
});
