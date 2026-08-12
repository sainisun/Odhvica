import { describe, expect, it } from "vitest";
import { assertLiveEmailConfiguration, getEmailMode } from "./config";

describe("email configuration", () => {
  it("defaults to sandbox mode", () => { expect(getEmailMode({})).toBe("sandbox"); });
  it("fails closed when live configuration is incomplete", () => { expect(() => assertLiveEmailConfiguration({ ODHVICA_EMAIL_MODE: "live", EMAIL_FROM_ADDRESS: "hello@example.com" })).toThrow("Live email activation is blocked"); });
});
