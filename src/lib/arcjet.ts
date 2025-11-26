// import arcjet,{protectSignup, tokenBucket } from "@arcjet/next";


// const aj = arcjet({
//   key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
//   rules: [
//     protectSignup({
//           mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
//       // block disposable, invalid, and email addresses with no MX records
//       deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
//     }),
//     bots: {
//       mode:"LIVE", // will block requests. Use "DRY_RUN" to log only,
//       allow: []
//     },
//     rateLimit: {
//       mode:"LIVE" // will block requests. Use "DRY_RUN" to log only,
//     ,
//       interval: "1m", // time window in seconds,
//       max:2, // max requests allowed in the time window
//     }
//   ]

// });

// export default aj;