"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  value: number
  onChange: (value: number) => void
  placeholder?: string
  className?: string
}

function formatCents(cents: number): string {
  if (cents === 0) return ""

  const negative = cents < 0
  const absCents = Math.abs(cents)
  const integerPart = Math.floor(absCents / 100).toString()
  const decimalPart = (absCents % 100).toString().padStart(2, "0")

  const integerFormatted = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    "."
  )

  return `${negative ? "-" : ""}R$ ${integerFormatted},${decimalPart}`
}

export function CurrencyInput({
  value,
  onChange,
  placeholder = "R$ 0,00",
  className,
}: CurrencyInputProps) {
  const [cents, setCents] = useState(() => Math.round(value * 100))
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const newCents = Math.round(value * 100)
    if (newCents !== cents) {
      setCents(newCents)
    }
  }, [value])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      e.preventDefault()

      if (e.key === "Backspace") {
        const newCents = Math.floor(cents / 10)
        setCents(newCents)
        onChange(newCents / 100)
        return
      }

      if (e.key === "Delete") {
        setCents(0)
        onChange(0)
        return
      }

      if (/^\d$/.test(e.key)) {
        const digit = parseInt(e.key, 10)
        const newCents = cents * 10 + digit
        if (newCents <= 99999999999) {
          setCents(newCents)
          onChange(newCents / 100)
        }
      }
    },
    [cents, onChange]
  )

  const displayValue = formatCents(cents)

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="numeric"
      value={displayValue}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      onChange={() => {}}
      className={cn(
        "flex h-11 w-full rounded-md border bg-surface-2 border-border px-3 py-1 text-sm text-primary shadow-xs transition-colors focus:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
    />
  )
}
