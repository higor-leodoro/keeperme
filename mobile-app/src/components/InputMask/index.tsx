import { useEffect, useState } from "react";
import { View } from "react-native";
import MaskInput, { Mask, createNumberMask } from "react-native-mask-input";

import { CustomText } from "@/components";
import { colors } from "@/constants";
import { useCurrency } from "@/hooks";

type InputMaskProps = {
  value: string;
  onChangeText: (text: string, unmasked: string) => void;
  mask?: Mask;
  placeholder?: string;
  label?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  isCurrency?: boolean;
  currencyValue?: number;
  onCurrencyChange?: (value: number) => void;
};

export const InputMask = ({
  value,
  onChangeText,
  mask,
  placeholder,
  label,
  keyboardType = "default",
  isCurrency = false,
  currencyValue,
  onCurrencyChange,
}: InputMaskProps) => {
  const { currency } = useCurrency();
  const [displayValue, setDisplayValue] = useState("");

  // Configurar máscara de moeda
  const currencyMask = createNumberMask({
    prefix: currency === "BRL" ? ["R", "$", " "] : ["$", " "],
    delimiter: currency === "BRL" ? "." : ",",
    separator: currency === "BRL" ? "," : ".",
    precision: 2,
  });

  const currencyPlaceholder = currency === "BRL" ? "R$ 0,00" : "$ 0.00";

  // Inicializar valor de moeda quando o componente receber um valor inicial
  useEffect(() => {
    if (isCurrency && currencyValue !== undefined && currencyValue > 0) {
      const amountInCents = Math.round(currencyValue * 100).toString();
      const prefix = currency === "BRL" ? "R$ " : "$ ";
      const delimiter = currency === "BRL" ? "." : ",";
      const separator = currency === "BRL" ? "," : ".";

      const integer = amountInCents.slice(0, -2) || "0";
      const decimal = amountInCents.slice(-2).padStart(2, "0");
      const integerFormatted = integer.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        delimiter
      );

      const maskedValue = `${prefix}${integerFormatted}${separator}${decimal}`;
      setDisplayValue(maskedValue);
    }
  }, [currencyValue, currency, isCurrency]);

  const handleCurrencyChange = (masked: string, unmasked: string) => {
    setDisplayValue(masked);
    if (unmasked && onCurrencyChange) {
      const numericValue = parseFloat(unmasked) / 100;
      onCurrencyChange(numericValue);
    } else if (onCurrencyChange) {
      onCurrencyChange(0);
    }
  };

  if (isCurrency) {
    return (
      <View className="gap-2">
        {label && (
          <CustomText className="text-lg text-white">{label}</CustomText>
        )}
        <View className="border-1 border-transparent rounded-12 bg-app-gray-medium rounded-2xl">
          <MaskInput
            value={displayValue}
            onChangeText={handleCurrencyChange}
            mask={currencyMask}
            placeholder={placeholder || currencyPlaceholder}
            placeholderTextColor={colors.palette.gray.light}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="numeric"
            style={{
              color: colors.palette.white,
              fontSize: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              fontFamily: "Poppins_400Regular",
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View className="gap-2">
      {label && <CustomText className="text-lg text-white">{label}</CustomText>}
      <View className="border-1 border-transparent rounded-12 bg-app-gray-medium rounded-2xl">
        <MaskInput
          value={value}
          onChangeText={onChangeText}
          mask={mask}
          placeholder={placeholder}
          placeholderTextColor={colors.palette.gray.light}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={keyboardType}
          style={{
            color: colors.palette.white,
            fontSize: 16,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontFamily: "Poppins_400Regular",
          }}
        />
      </View>
    </View>
  );
};
