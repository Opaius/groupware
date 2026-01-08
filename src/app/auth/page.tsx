/* eslint-disable react/no-children-prop */
"use client";

import { useState, useRef, useLayoutEffect } from "react";
import gsap from "gsap";
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
import { authClient } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleToggle = (login: boolean) => {
    if (login !== isLogin) {
      setIsLogin(login);
    }
  };

  return (
    <div className="flex h-svh items-center justify-center overflow-hidden">
      <div className="w-full h-full bg-white grid grid-rows-[1fr_auto] items-center transition-all duration-300">
        {/* Titlu */}
        <div className="pt-8 px-6 text-center">
          <h1 className="font-poppins font-bold text-2xl sm:text-4xl leading-snug gradient-text">
            {isLogin ? "Welcome to Skill Trade" : "Create your account"}
          </h1>
          {isLogin && (
            <p className="text-md text-black/70 mt-2">
              Login or Sign up to access your account
            </p>
          )}
        </div>

        <div className="w-full ">
          {/* Butoane Login / SignUp */}
          <div className="flex w-full mt-6 font-semibold">
            <button
              onClick={() => handleToggle(true)}
              className={`flex-1 py-3 sm:py-4 ${
                isLogin ? "bg-accent-light" : "bg-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleToggle(false)}
              className={`flex-1 py-3 sm:py-4 ${
                !isLogin ? "bg-accent-light" : "bg-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Formular */}
          <div className="flex-1 w-full h-max bg-accent-light flex flex-col items-center px-6 py-8">
            {isLogin ? <SignIn /> : <SignUp />}
          </div>
        </div>
      </div>
    </div>
  );

  function SignIn() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const form = useForm({
      defaultValues: {
        email: "",
        password: "",
      },
      validators: {
        onSubmit: loginFormSchema,
      },
      onSubmit: async ({ value }) => {
        const { error } = await authClient.signIn.email({
          email: value.email,
          password: value.password,
          callbackURL: "/",
        });
        if (error) setError(error.message ?? "Something went wrong");
        else router.push("/");
      },
    });
    return (
      <div className="h-full flex flex-col ">
        <div className="my-auto">
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
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
          <div className="w-full mt-2">
            <a
              href="#"
              className="block text-sm font-semibold auth-link text-right mb-4"
            >
              Forgot password?
            </a>
          </div>

          {/* Or continue with social */}
          <p className="text-center text-sm auth-social-text my-4">
            Or continue with social
          </p>

          {/* Social buttons */}
          <div className="flex flex-col gap-2 w-full ">
            <Button variant="outline">
              <FaGoogle size={20} /> Login with Google
            </Button>

            <Button variant="outline">
              <FaApple size={20} /> Login with Apple
            </Button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs auth-social-text mt-6 px-4">
          By signing in with an account, you agree to SO&apos;s Terms of Service
          and Privacy Policy.
        </p>
      </div>
    );
  }

  function SignUp() {
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
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
        const { error } = await authClient.signUp.email({
          name: value.name,
          email: value.email,
          password: value.password,
          callbackURL: "/",
        });
        if (error) {
          setError(error.message ?? "something went wrong");
        } else router.push("/");
      },
    });

    return (
      <div className="w-full my-auto">
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
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
          <p className="text-center text-sm auth-social-text my-2">
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
}
