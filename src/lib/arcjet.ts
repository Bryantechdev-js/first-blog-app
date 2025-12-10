import arcjet, { protectSignup } from "@arcjet/next";

const ajSignup = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    protectSignup({
      email: { mode: "LIVE", block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"] },
      bots: { mode: "LIVE" ,allow:[]},
      rateLimit: { mode: "LIVE", interval: "1m", max: 5 },
    }),
  ],
});

export default ajSignup;
