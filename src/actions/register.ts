"use server";

import aj from "@/lib/arcjet";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { request } from "@arcjet/next";
import bcrypt from "bcryptjs";
// import { redirect } from "next/navigation";
import z from "zod";

const registerFormValidation = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email().transform((e) => e.toLowerCase()),
  password: z.string().min(8).max(20),
});

export default async function registerUserAction(formData: FormData) {

  
  // 1. Validate input
  const parsed = registerFormValidation.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const { name, email, password } = parsed.data;

  // 2. Arcjet protection (safe wrapper)
  let decision;
  try {
    const req = await request();
    decision = await aj.protect(req, { email });
  } catch (err) {
    return {
      success: false,
      error: "Email domain could not be checked. Please use a valid email.",
      status: 400,
    };
  }

  // 3. Check Arcjet decisions
  if (decision.isDenied()) {
    const reason = decision.reason;

    if (reason.isEmail()) {
      return { success: false, error: "Invalid or unreachable email domain." };
    }
    if (reason.isBot()) {
      return { success: false, error: "Suspicious activity detected (Bot)." };
    }
    if (reason.isSensitiveInfo()) {
      return { success: false, error: "Sensitive info detected in request." };
    }
    if (reason.isShield()) {
      return { success: false, error: "Security shield triggered." };
    }
    if (reason.isRateLimit()) {
      return { success: false, error: "Too many requests. Slow down." };
    }
  }

  // 4. Save into MongoDB safely
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email }).select("+password");

    if (existingUser) {
      return {
        success: false,
        error: "User with this email already exists.",
        status: 400,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
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
      error: "Internal server error. Please try again.",
      status: 500,
    };
  }
}
