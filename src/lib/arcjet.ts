import arcjet, { protectSignup, shield, detectBot, tokenBucket } from "@arcjet/next";

// Global protection for all routes (middleware)
export const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    shield({ mode: "LIVE" }),
    detectBot({ mode: "LIVE", allow: [] }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 10,
      interval: 60,
      capacity: 20,
    }),
  ],
});

// Auth-specific protection (login/signup)
export const ajAuth = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    protectSignup({
      email: { mode: "LIVE", block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"] },
      bots: { mode: "LIVE", allow: [] },
      rateLimit: { mode: "LIVE", interval: "1m", max: 5 },
    }),
  ],
});

// Blog post protection
export const blogPostRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({ mode: "LIVE", allow: [] }),
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      capacity: 10,
      refillRate: 5,
      interval: "1m",
    }),
  ],
});

// Comments protection
export const commentsRules = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({ mode: "LIVE", allow: [] }),
    shield({ mode: "LIVE" }),
    tokenBucket({
      mode: "LIVE",
      capacity: 2,
      refillRate: 2,
      interval: "2m",
    }),
  ],
});

export default aj;

