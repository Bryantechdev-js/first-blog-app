"use server"

import { cookies } from "next/headers";
import { success } from "zod";

export async function logoutUserAction() {
    try{
        const cookiestore = await cookies();
        cookiestore.delete("token");
        return {
            success:true,
            error:"logout successful",
            status:200
        }
    }catch(error){
        console.error("logout error",error);
        return {
            success:false,
            error:"Logout failed. Please try again later.",
            status:500
        }
    }
}