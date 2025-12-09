"use server";

import ajSignup from "@/lib/arcjet";
// import ajSignup from "@/lib/arcjetSignup"; // make sure this is your Signup arcjet config
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { request } from "@arcjet/next";
import bcrypt from "bcryptjs";
import z from "zod";

const registerFormValidation = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email().transform((e) => e.toLowerCase()),
  password: z.string().min(8).max(20),
});

export default async function registerUserAction(formData: FormData) {
  // ---------------------------
  // 1️⃣ Validate Input
  // ---------------------------
  const parsed = registerFormValidation.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid input fields." };
  }

  const { name, email, password } = parsed.data;

  // ---------------------------
  // 2️⃣ Arcjet Protection
  // ---------------------------
  let decision;

  try {
    const req = await request();
    decision = await ajSignup.protect(req, { email });
  } catch (err) {
    return {
      success: false,
      error: "Unable to verify your email domain. Try again or use a valid email.",
      status: 400,
    };
  }

  // ---------------------------
  // 3️⃣ Arcjet Denied Responses (Detailed)
  // ---------------------------
  if (decision.isDenied()) {
    const reason = decision.reason;

    // Email-based checks
    if (reason.isEmail()) {
      const conclusion = decision.conclusion || [];

      if (conclusion.includes("DISPOSABLE")) {
        return {
          success: false,
          error: "Disposable email addresses are not allowed. Please use a real email.",
        };
      }

      if (conclusion.includes("INVALID")) {
        return {
          success: false,
          error: "This email address is invalid. Please check your spelling.",
        };
      }

      if (conclusion.includes("NO_MX_RECORDS")) {
        return {
          success: false,
          error: "This email domain cannot receive messages (missing MX records).",
        };
      }

      return {
        success: false,
        error: "Invalid or suspicious email address.",
      };
    }

    // Bot detection
    if (reason.isBot()) {
      return {
        success: false,
        error: "Suspicious automated activity detected. Registration blocked.",
      };
    }

    // Sensitive info
    if (reason.isSensitiveInfo()) {
      return {
        success: false,
        error: "Sensitive or unsafe information detected in your request.",
      };
    }

    // Shield triggered
    if (reason.isShield()) {
      return {
        success: false,
        error: "Your request triggered a security shield and was blocked.",
      };
    }

    // Rate limit exceeded
    if (reason.isRateLimit()) {
      return {
        success: false,
        error: "Too many attempts. Please wait a moment and try again.",
      };
    }

    // Default fallback
    return {
      success: false,
      error: "Registration blocked for security reasons.",
    };
  }

  // ---------------------------
  // 4️⃣ Save into MongoDB
  // ---------------------------
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email }).select("+password");
    if (existingUser) {
      return {
        success: false,
        error: "A user with this email already exists.",
        status: 400,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      username: name,
      email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: "Registration successful",
      status: 200,
    };
  } catch (err) {
    return {
      success: false,
      error: "Internal server error. Please try again later.",
      status: 500,
    };
  }
}
