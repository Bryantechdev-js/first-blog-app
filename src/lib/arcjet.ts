import arcjet,{tokenBucket } from "@arcjet/next";


const aj = arcjet({
  key: process.env.ARCJET_KEY!, // Get your site key from https://app.arcjet.com
  rules: []

});

export default aj;