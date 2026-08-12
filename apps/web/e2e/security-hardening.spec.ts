import { expect, test } from "@playwright/test";

test("public responses carry baseline security headers and hide framework branding", async ({ request }) => {
  const response = await request.get("/");
  expect(response.status()).toBe(200);
  const headers = response.headers();
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["permissions-policy"]).toContain("camera=()");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("public preview document stays within its local static response budget", async ({ request }) => {
  const response = await request.get("/");
  expect((await response.body()).byteLength).toBeLessThan(250_000);
});
