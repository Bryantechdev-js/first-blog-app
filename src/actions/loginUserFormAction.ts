"use server";

import ajSignup from "@/lib/arcjet";
// import ajSignup from "@/lib/arcjetSignup";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { request } from "@arcjet/next";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";
import z from "zod";

const loginFormValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

const loginUserFormAction = async (formData: FormData) => {
  const parsed = loginFormValidation.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { success: false, error: "Invalid email or password." };
  }

  const { email, password } = parsed.data;

  // Arcjet anti abuse check
  const req = await request();
  const decision = await ajSignup.protect(req, { email });

  // ==============================
  // 🔥 SPECIFIC ARCJET DENIED REASONS
  // ==============================
  if (decision.isDenied()) {
    const reason = decision.reason;

    // 1️⃣ Email-related issues
    if (reason.isEmail()) {
      const conclusion = decision.conclusion || [];

      if (conclusion.includes("DISPOSABLE")) {
        return { success: false, error: "Disposable email addresses are not allowed." };
      }
      if (conclusion.includes("INVALID")) {
        return { success: false, error: "Invalid email format." };
      }
      if (conclusion.includes("NO_MX_RECORDS")) {
        return {
          success: false,
          error: "The email domain is not reachable (missing MX records).",
        };
      }

      return { success: false, error: "Invalid or suspicious email address." };
    }

    // 2️⃣ Bots (automation detected)
    if (reason.isBot()) {
      return { success: false, error: "Bot-like behavior detected. Access denied." };
    }

    // 3️⃣ Sensitive information
    if (reason.isSensitiveInfo()) {
      return {
        success: false,
        error: "Sensitive or unsafe information detected in the request.",
      };
    }

    // 4️⃣ Shield triggered (high-risk behavior)
    if (reason.isShield()) {
      return {
        success: false,
        error: "Your request was blocked for security reasons.",
      };
    }

    // 5️⃣ Rate limit exceeded
    if (reason.isRateLimit()) {
      return {
        success: false,
        error: "Too many attempts. Please wait and try again.",
      };
    }

    // Default fallback
    return { success: false, error: "Login blocked for security reasons." };
  }

  // ==============================
  // 🔥 Normal Login Flow
  // ==============================

  await connectToDatabase();
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return { success: false, error: "No account found with this email." };
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return { success: false, error: "Incorrect password." };
  }

 // -------------------------
  // 1️⃣ Create JWT Payload
  // -------------------------
  const payload = {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
  };

  // -------------------------
  // 2️⃣ Create Secret Key
  // -------------------------
  const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

  // -------------------------
  // 3️⃣ Generate Token (1 hour)
  // -------------------------
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("1h") // 1 hour
    .sign(secret);

  // -------------------------
  // 4️⃣ Save token to cookie
  // -------------------------
  const cookiestore = await cookies()
  cookiestore.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: true, // important in production
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60, // 1 hour
  });

  return { success: true, message: "Login successful",status:200};
};

export default loginUserFormAction;
