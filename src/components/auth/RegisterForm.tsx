"use client";

import { Lock, Mail, User } from "lucide-react";
import React from "react";
import { Input } from "../ui/input";
import { email, z } from "zod";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const registerFormValidation = z.object({
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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerFormValidation),
  });

  const onSubmit = (data: RegisterFormData) => {
    setLoading(true);
    console.log("Form Submitted:", data);
    setTimeout(() => setLoading(false), 2000); // Mock async submit
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-xl sm:p-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Create an Account
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div className="relative">
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Enter your name"
            disabled={loading}
            className={`pl-10 ${
              errors.name ? "border-red-500" : "focus:border-gray-400"
            }`}
            {...register("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            type="email"
            placeholder="Email"
            disabled={loading}
            className={`pl-10 ${
              errors.email ? "border-red-500" : "focus:border-gray-400"
            }`}
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
            className={`pl-10 ${
              errors.password ? "border-red-500" : "focus:border-gray-400"
            }`}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
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
