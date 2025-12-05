"use server";

import aj from "@/lib/arcjet";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { request } from "@arcjet/next";
import bcrypt from "bcryptjs";
import { error } from "console";
// import { redirect } from "next/navigation";
import { success, z } from "zod";

const loginFormValidation = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

const loginUserFormAction = async (formData: FormData) => {
  const toValidate = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
  };

  const parsed = loginFormValidation.safeParse(toValidate);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.errors.map((e) => e.message).join(", "),
      status: 400,
    };
  }

  const { email,password } = parsed.data;

  if (!email) {
    return {
      success: false,
      error: "Email is required",
      status: 400,
    };
  }

  try {
    const req = await request();
    const decision = await aj.protect(req, { email });

    if (decision.isDenied()) {
      let reason = "Access denied";

      if (decision.conclusion.includes("DISPOSABLE")) {
        reason = "Disposable email addresses are not allowed.";
        console.log("Disposable email detected:", email);
      } else if (decision.conclusion.includes("INVALID")) {
        reason = "The email address format is invalid.";
        console.log("Invalid email format:", email);
      } else if (decision.conclusion.includes("NO_MX_RECORDS")) {
        reason = "Email domain has no MX records.";
        console.log("No MX record for:", email);
      }
      else{
        reason = "your can access the page. please try later"
      }

      return {
        success: false,
        error: reason,
        status: 403,
      };
    }
    // connection to my database 
    await connectToDatabase()

    // git user with the same email from the database 
    const user = await User.findOne({email: email}).select("+password") ?? true;
    if (!user ) {
      return {
        success:false,
        error: "your don't have an account yet or verify your info. Get register first",
        status:400,
      }
    }

    const ispasswordMatch = bcrypt.compare(password, user.password)
    if (!ispasswordMatch) {
      return {
        success:false,
        error:"login failed",
        status:400
      }
    }
    return{
      success:true,
      error:"Login successful",
      status:200,
    }
  } catch (err: any) {
    console.error("Arcjet login error:", err);
    return {
      success: false,
      error: "Internal server error",
      status: 500,
    };
  }
};

export default loginUserFormAction;
