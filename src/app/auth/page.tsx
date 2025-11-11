/* eslint-disable react/no-children-prop */
"use client";

import { useState } from "react";
import { LucideLock, LucideMail, LucideUser } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { FaApple, FaGoogle } from "react-icons/fa";
import { useForm } from "@tanstack/react-form";
import { loginFormSchema, signupFormSchema } from "@/lib/zod/auth";
import { login, signup } from "@/lib/client/auth-functions";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden">
      <div className="w-full bg-white flex flex-col items-center transition-all duration-300">
        {/* Titlu */}
        <div className="pt-8 px-6 text-center">
          <h1 className="font-poppins font-bold text-2xl sm:text-4xl leading-snug bg-linear-to-b from-primary to-secondary bg-clip-text text-transparent">
            {isLogin ? "Welcome to Skill Trade" : "Create your account"}
          </h1>
          {isLogin && (
            <p className="text-md text-black/70 mt-2">
              Login or Sign up to access your account
            </p>
          )}
        </div>

        {/* Butoane Login / SignUp */}
        <div className="flex w-full mt-6 text-[1.1rem] sm:text-[1.2rem] font-semibold">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 sm:py-4 ${
              isLogin ? "bg-[#DCE9FB]" : "bg-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 sm:py-4 ${
              !isLogin ? "bg-[#DCE9FB]" : "bg-white"
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* Formular */}
        <div className="flex-1 w-full bg-[#DCE9FB] flex flex-col items-center px-6 py-8">
          {isLogin ? <SignIn /> : <SignUp />}
        </div>
      </div>
    </div>
  );
}
function SignIn() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginFormSchema,
    },
    onSubmit: async ({ value }) => {
      const error = await login({
        formData: value,
        callBackURL: "/",
      });
      if (error) {
        setError(error);
      }
    },
  });
  return (
    <div>
      <form
        id="sign-in-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="gap-[10px]">
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    type="email"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Email"
                    autoComplete="off"
                    icon={<LucideMail />}
                  ></Input>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Password"
                    autoComplete="off"
                    icon={<LucideLock />}
                    isPassword
                  ></Input>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />
          <Button variant="secondary" type="submit" className="w-full">
            Login
          </Button>
          {error && <p className="text-red-500">{error}</p>}
        </FieldGroup>
      </form>
      {/* Forgot password */}
      <div className="w-full max-w-[350px] mt-2">
        <a
          href="#"
          className="block text-sm font-semibold text-[#6085B9] text-right mb-4"
        >
          Forgot password?
        </a>
      </div>

      {/* Or continue with social */}
      <p className="text-center text-sm text-gray-700 my-4">
        Or continue with social
      </p>

      {/* Social buttons */}
      <div className="flex flex-col gap-2 w-full max-w-[350px]">
        <Button variant="outline">
          <FaGoogle size={20} /> Login with Google
        </Button>

        <Button variant="outline">
          <FaApple size={20} /> Login with Apple
        </Button>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-gray-500 mt-6 px-4">
        By signing in with an account, you agree to SO&apos;s Terms of Service
        and Privacy Policy.
      </p>
    </div>
  );
}

function SignUp() {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
    validators: {
      onSubmit: signupFormSchema,
    },
    onSubmit: async ({ value }) => {
      const error = await signup({
        formData: value,
        callBackURL: "/discover",
      });
      if (error) {
        setError(error);
      }
    },
  });

  return (
    <div className="w-full max-w-[350px]">
      <form
        id="sign-up-form"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <FieldGroup className="gap-[10px]">
          {/* Name Field */}
          <form.Field
            name="name"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    type="text"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Full Name"
                    autoComplete="name"
                    icon={<LucideUser />}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* Email Field */}
          <form.Field
            name="email"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Email"
                    autoComplete="email"
                    icon={<LucideMail />}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* Password Field */}
          <form.Field
            name="password"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Password"
                    autoComplete="new-password"
                    icon={<LucideLock />}
                    isPassword
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* Confirm Password Field */}
          <form.Field
            name="confirmPassword"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <Input
                    id={field.name}
                    type="password"
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    icon={<LucideLock />}
                    isPassword
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          />

          {/* Terms Checkbox */}
          <form.Field
            name="terms"
            children={(field) => {
              const isInvalid = !field.state.meta.isValid;
              return (
                <div className="flex items-center gap-2 mt-2">
                  <Checkbox
                    id="terms"
                    checked={field.state.value}
                    onCheckedChange={(checked) =>
                      field.handleChange(checked as boolean)
                    }
                    aria-invalid={isInvalid}
                    className={isInvalid ? "border-destructive" : ""}
                  />
                  <FieldLabel
                    htmlFor="terms"
                    className={`text-sm ${
                      isInvalid ? "text-destructive" : "text-foreground"
                    }`}
                  >
                    I understood the Terms & Policy
                  </FieldLabel>
                </div>
              );
            }}
          />

          {/* Submit Button */}
          <Button type="submit" variant="secondary">
            Sign Up
          </Button>
        </FieldGroup>

        {/* Error Message */}
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        {/* Social Sign Up Section */}
        <p className="text-center text-sm text-gray-700 my-2">
          Or sign up with
        </p>
        <div className="flex flex-col gap-2">
          <Button type="button" variant="outline">
            <FaGoogle size={20} /> Sign up with Google
          </Button>
          <Button type="button" variant="outline">
            <FaApple size={20} /> Sign up with Apple
          </Button>
        </div>
      </form>
    </div>
  );
}
