import arcjet, { tokenBucket } from "@arcjet/next";

const ajGlobal = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      capacity: 200,
      refillRate: 50,
      interval: "1m",
    }),
  ],
});

export default ajGlobal;
