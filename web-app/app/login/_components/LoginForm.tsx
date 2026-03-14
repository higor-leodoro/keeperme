"use client";

import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "./GoogleIcon";
import { useLoginViewModel } from "../_viewmodels/useLoginViewModel";

interface LoginFormProps {
  onFlip: () => void;
}

export function LoginForm({ onFlip }: LoginFormProps) {
  const { form, showPassword, toggleShowPassword, onSubmit } =
    useLoginViewModel();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <>
      <div className="flex items-center justify-center">
        <Image
          src="/logo.png"
          alt="Keeperme logo"
          width={250}
          height={10}
          className="mb-4 w-[80px] sm:w-[110px] md:w-[130px] lg:w-[150px] h-auto"
        />
      </div>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-primary mb-1 text-center">
        Welcome back
      </h2>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Sign in to your account
      </p>

      <form onSubmit={onSubmit}>
        <div className="mb-5">
          <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
            EMAIL
          </Label>
          <Input
            type="email"
            placeholder="alex@keeperme.app"
            className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="mb-2">
          <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
            PASSWORD
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="h-11 bg-surface-2 border-border text-primary text-sm pr-10 focus:border-primary"
              {...register("password")}
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-text-muted cursor-pointer p-0 flex"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-red-400 mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex justify-end mb-6">
          <button
            type="button"
            className="bg-transparent border-none text-xs text-text-muted cursor-pointer p-0"
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full h-11">
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-xs text-text-muted">or</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <Button
        variant="outline"
        className="w-full h-11 gap-2 hover:bg-surface-3"
      >
        <GoogleIcon />
        Continue with Google
      </Button>

      <p className="text-center mt-8 text-[13px] text-muted-foreground">
        {"Don't have an account? "}
        <button
          type="button"
          onClick={onFlip}
          className="bg-transparent border-none text-primary font-medium cursor-pointer p-0"
        >
          Create one
        </button>
      </p>
    </>
  );
}
