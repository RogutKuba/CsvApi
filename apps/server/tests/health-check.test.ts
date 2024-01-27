import { describe, test, expect } from 'bun:test';
import { app } from '../src/app';

describe('Health check test', () => {
  test('GET /health', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ status: 'ok' });
  });
});
