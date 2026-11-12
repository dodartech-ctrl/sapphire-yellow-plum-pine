import { createServerFn } from "@tanstack/react-start";

export const CREDIT_MAX = 5000;
export const OPENING_CREDITS = 4500;
export const PLATE_COST = 50;
export const WALLET_ID = "studio";

export const getStudioCredits = createServerFn({ method: "POST" }).handler(async () => {
  const { readWallet } = await import("@/lib/credits.server");
  return readWallet();
});

