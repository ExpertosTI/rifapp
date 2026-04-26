import { test, expect } from '@playwright/test';

test.describe('Healthcheck', () => {
  test('GET /api/healthz should return ok', async ({ request }) => {
    const res = await request.get('/api/healthz');
    expect(res.status()).toBe(200);
    const json = await res.json();
    expect(json.status).toBe('ok');
  });
});

test.describe('Página principal', () => {
  test('GET / no debe ser 404', async ({ request }) => {
    const res = await request.get('/');
    expect(res.status()).toBeLessThan(400);
  });
});
