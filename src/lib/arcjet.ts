
import arcjet,{protectSignup, tokenBucket } from "@arcjet/next";


const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
 rules: [
  protectSignup({ 
    email: { mode: "LIVE", block: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"] },
    bots: { mode: "LIVE", allow: [] },
    rateLimit: { mode: "LIVE", interval: "2m", max: 5 },
  }),
],

});

export default aj;