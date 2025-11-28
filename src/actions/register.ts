"use server";

import { request } from "@arcjet/next";
import aj from "@/lib/arcjet";
import { success, z } from "zod";
import { error } from "console";

const registerFormValidation = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email().transform((e) => e.toLowerCase()),
  password: z.string().min(8).max(20),
});

export async function registerUserAction(formData: FormData) {
  try {
    const parsed = registerFormValidation.safeParse({
      name: formData.get("name") ?? "",
      email: formData.get("email") ?? "",
      password: formData.get("password") ?? "",
    });

    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.errors.map((e) => e.message).join(", "),
      };
    }

    const { email } = parsed.data;

    if (!email) {
      return {
        success: false,
        error: "Email is missing",
      };
    }

    const req = await request();
    const decision = await aj.protect(req, { email });

    if (decision.isDenied()) {
        if(decision.conclusion.includes("DISPOSABLE")){
          console.log("Disposable email detected:", email); 
          return {
            success:false,
            error:"Disposable email addresses are not allowed.",
            status:400
          }
        }
        else if(decision.conclusion.includes("INVALID")){
          console.log("Invalid email format:", email); 
          return {
            success:false,

            error:"The email address format is invalid.",
            status:400
          }
        }
        else if(decision.conclusion.includes("NO_MX_RECORDS")){
                console.log("your email excide the max record value");
                
             return {
                success:false,
                error:"your email excide the max record value",
                status:400
             }
          }
          else if(decision.conclusion.includes("BOT_DETECTED")){
            console.log("Bot activity detected during registration for email:", email); 
            return {
                success:false,
                error:"Bot activity detected",
                status:400
            }
        }
        return {
        success: false,
        error: "you can't access this page for now try again later",
      };
    }

    return {
      success: true,
      message: "User validated",
      data:parsed.data
    };

  } catch (err) {
    console.error("Arcjet error:", err);
    return {
      success: false,
      error: "Internal server error",
    };
  }
}
