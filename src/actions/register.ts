"use server";

import aj from "@/lib/arcjet";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { request } from "@arcjet/next";
import { error } from "console";
import z, { success } from "zod";

const registerFormValidation = z.object({
  name: z.string().min(5).max(30),
  email: z.string().email().transform((e) => e.toLowerCase()),
  password: z.string().min(8).max(20),
});

export default async function registerUserAction(formData: FormData) {
  const parsed = registerFormValidation.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Invalid input",
    };
  }

  const { name, email, password } = parsed.data;

  const req = await request();
  const decision = await aj.protect(req, { email });

  console.log(decision);

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) {
      return { success: false, error: "INVALID EMAIL" };
    }
    if (decision.reason.isBot()) {
      return { success: false, error: "BOT DETECTED" };
    }
    if (decision.reason.isSensitiveInfo()) {
      return { success: false, error: "SENSITIVE INFO DETECTED" };
    }
    if (decision.reason.isShield()) {
      return { success: false, error: "SHIELD TRIGGERED" };
    }
    if (decision.reason.isRateLimit()) {
      return { success: false, error: "TOO MANY REQUESTS" };
    }
  }

 try{
  await connectToDatabase();
  const user = User.findOne({ email });
  if(user){
    return {
      success:false,
      error:"user with this email exist",
      status:400,
    }
  }

  const newUser = new User({
    username: name,
    email: email,
    password: password,
  });

  newUser.save();

  if(!newUser){
    return {
      success:false, error:"failded to create user",status:400,
    }
  }

  return {
    success:true, message:"registration successfull",status:200
  }

 }catch(err:any){
    return { success: false,error:  "internal server error" };
 }
}
