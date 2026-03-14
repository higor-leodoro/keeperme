"use client";

import Image from "next/image";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleIcon } from "./GoogleIcon";
import { useRegisterViewModel } from "../_viewmodels/useRegisterViewModel";

interface RegisterFormProps {
  onFlip: () => void;
}

export function RegisterForm({ onFlip }: RegisterFormProps) {
  const { form, showPassword, toggleShowPassword, onSubmit } =
    useRegisterViewModel();
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
        Create account
      </h2>
      <p className="text-sm text-muted-foreground mb-8 text-center">
        Start managing your finances
      </p>

      <form onSubmit={onSubmit}>
        <div className="flex gap-3 mb-5">
          <div className="flex-1">
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              FIRST NAME
            </Label>
            <Input
              type="text"
              placeholder="Alex"
              className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
              {...register("firstName")}
            />
            {errors.firstName && (
              <p className="text-xs text-red-400 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="flex-1">
            <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
              LAST NAME
            </Label>
            <Input
              type="text"
              placeholder="Morgan"
              className="h-11 bg-surface-2 border-border text-primary text-sm focus:border-primary"
              {...register("lastName")}
            />
            {errors.lastName && (
              <p className="text-xs text-red-400 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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

        <div className="mb-6">
          <Label className="text-[11px] tracking-[2.5px] uppercase text-text-muted mb-2">
            PASSWORD
          </Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
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

        <Button type="submit" disabled={isSubmitting} className="w-full h-11">
          {isSubmitting ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            "Create Account"
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
        {"Already have an account? "}
        <button
          type="button"
          onClick={onFlip}
          className="bg-transparent border-none text-primary font-medium cursor-pointer p-0"
        >
          Sign in
        </button>
      </p>
    </>
  );
}
