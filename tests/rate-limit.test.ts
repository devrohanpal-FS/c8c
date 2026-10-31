import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { rateLimit, resetRateLimit, getClientIp } from '../lib/rate-limit/index';

describe('Rate Limiter & Anti-Abuse Suite', () => {
  it('allows requests within threshold and blocks excess requests', () => {
    const key = `test:ip:${Date.now()}`;
    resetRateLimit(key);

    // Limit to 3 requests
    const res1 = rateLimit(key, 3, 60000);
    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.remaining, 2);

    const res2 = rateLimit(key, 3, 60000);
    assert.strictEqual(res2.success, true);
    assert.strictEqual(res2.remaining, 1);

    const res3 = rateLimit(key, 3, 60000);
    assert.strictEqual(res3.success, true);
    assert.strictEqual(res3.remaining, 0);

    // 4th request must be blocked
    const res4 = rateLimit(key, 3, 60000);
    assert.strictEqual(res4.success, false);
    assert.strictEqual(res4.remaining, 0);

    resetRateLimit(key);
  });

  it('safely extracts client IP from proxy headers', () => {
    const reqWithForwarded = {
      headers: {
        'x-forwarded-for': '203.0.113.195, 70.41.3.18, 150.172.238.178',
      },
    };
    const ip = getClientIp(reqWithForwarded);
    assert.strictEqual(ip, '203.0.113.195');

    const reqWithRealIp = {
      headers: {
        'x-real-ip': '198.51.100.42',
      },
    };
    assert.strictEqual(getClientIp(reqWithRealIp), '198.51.100.42');

    const emptyReq = { headers: {} };
    assert.strictEqual(getClientIp(emptyReq), '127.0.0.1');
  });
});
