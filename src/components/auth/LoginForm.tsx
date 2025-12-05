"use client";

import { Lock, Mail } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import loginUserFormAction from "@/actions/login"; // your server action
import { toast } from "sonner";
import loginUserFormAction from "@/actions/loginUserFormAction";
import { useRouter } from "next/navigation";

const loginFormValidation = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .max(20, { message: "Password must be at most 20 characters long" }),
});

type LoginFormData = z.infer<typeof loginFormValidation>;

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },reset
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormValidation),
  });

  // Make onSubmit async
  const onSubmit = async (data: LoginFormData) => {
    // checking if the user is online 
    const Online = navigator.onLine;
    if(!Online){
      toast.error("Network status",{
        description: "it seems like you are offline please check your internet connection and try again",
      })
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", data.email);
      formData.append("password", data.password);

      const result = await loginUserFormAction(formData);

      console.log("Login result:", result);

      if (!result?.success) {
           toast.error("Login failed", {
           description: result?.error || "Something went wrong",
        });
      } else {
        toast.success("Login successful!", {
          description: "Welcome back!",
        });
        reset();
        router.push("/"); // Redirect to home
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Login failed", {
        description: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl sm:p-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Login to Your Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
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
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full mt-4 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </Button>
      </form>

      <p className="text-sm text-gray-500 text-center mt-4">
        Don’t have an account?{" "}
        <a href="/register" className="text-blue-600 hover:underline">
          Register
        </a>
      </p>
    </div>
  );
}
