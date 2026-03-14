export type Currency = "BRL" | "USD";

/**
 * Formata um valor numérico para o formato de moeda especificada
 * @param value - Valor numérico a ser formatado
 * @param currency - Moeda a ser usada na formatação (BRL ou USD)
 * @returns String formatada no padrão da moeda (ex: "R$ 1.234,56" ou "$1,234.56")
 */
export const formatCurrency = (value: number, currency: Currency = "BRL"): string => {
  const locale = currency === "BRL" ? "pt-BR" : "en-US";
  
  return value.toLocaleString(locale, {
    style: "currency",
    currency: currency,
  });
};

