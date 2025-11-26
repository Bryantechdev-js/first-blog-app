import { z } from "zod";
import { registerFormValidation } from "@/components/auth/RegisterForm";
import { request } from "@arcjet/next";

export async function registerUserAction(formData: FormData) {
    const validatedFields = registerFormValidation.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });
    if (!validatedFields.success) {
        return {
            error: validatedFields?.error?.message,
            status: 400,
        };
    }

    const {name,email,password} = validatedFields.data;
    try{
        const req = await request()
    }catch(error){
        console.error("Error registering user:", error);
        return{
            error: "Failed to register user",
            status:500
        }
    }
}