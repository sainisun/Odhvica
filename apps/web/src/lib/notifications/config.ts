export type EmailMode = "sandbox" | "live";
type Environment = Record<string, string | undefined>;

export function getEmailMode(environment: Environment = process.env): EmailMode {
  return environment.ODHVICA_EMAIL_MODE === "live" ? "live" : "sandbox";
}

export function assertLiveEmailConfiguration(environment: Environment = process.env) {
  if (getEmailMode(environment) !== "live") throw new Error("Live email configuration cannot be used while ODHVICA_EMAIL_MODE is sandbox.");
  const missing = ["EMAIL_PROVIDER_API_KEY", "EMAIL_FROM_ADDRESS", "EMAIL_SENDER_NAME"].filter((key) => !environment[key]);
  if (missing.length) throw new Error(`Live email activation is blocked until configuration is provided: ${missing.join(", ")}.`);
}
