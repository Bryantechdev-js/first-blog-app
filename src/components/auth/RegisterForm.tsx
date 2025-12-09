"use client";

import { Lock, Mail, User } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { z } from "zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import  registerUserAction  from "@/actions/register";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const registerFormValidation = z.object({
  name: z
    .string()
    .min(5, { message: "Name must be at least 5 characters long" })
    .max(30, { message: "Name must be at most 30 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

type RegisterFormData = z.infer<typeof registerFormValidation>;

export default function RegisterForm() {
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormValidation),
  });
  const router = useRouter();

  const onSubmit = async (data: RegisterFormData) => {
      if (!navigator.onLine) {
        toast.error("Network status",{description:"You are currently offline. Please check your internet connection."});
        return;
     }

    setLoading(true);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await registerUserAction(formData);
      console.log("Server action result:", result);

      if (!result?.success) {
        // ✅ Use result.message for success
        toast.error("Registration failed", {
          description: result?.error || "Something went wrong",
        });
      } else {
        // ✅ Use result.error for failure
        toast.success("Registration successful!", {
          description: result?.message || "Welcome aboard!",
        });
        reset(); // clear form
        router.push("/login");
      }
    } catch (err:any) {
      console.error("Error during registration:", err);
      toast.error("Registration failed", {
        description: err?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl sm:p-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter your name"
            disabled={loading}
            className={`pl-10 ${errors.name ? "border-red-500" : "focus:border-gray-400"}`}
            {...register("name")}
          />
          {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            placeholder="Email"
            disabled={loading}
            className={`pl-10 ${errors.email ? "border-red-500" : "focus:border-gray-400"}`}
            {...register("email")}
          />
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="password"
            placeholder="Enter your password"
            disabled={loading}
            className={`pl-10 ${errors.password ? "border-red-500" : "focus:border-gray-400"}`}
            {...register("password")}
          />
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Registering..." : "Register"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}
