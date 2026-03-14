/**
 * Converte uma string de data ISO (YYYY-MM-DD) para Date sem problemas de timezone
 * @param dateString - Data em formato ISO (YYYY-MM-DD)
 * @returns Date object no timezone local
 */
const parseISODateString = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Formata uma string de data de acordo com o locale especificado
 * @param date - Data em formato ISO (YYYY-MM-DD) ou Date object
 * @param locale - Locale para formatação (padrão: "pt-BR")
 * @returns String formatada (pt-BR: "dd/MM/yyyy", en-US: "MM/dd/yyyy")
 */
export const formatDate = (
  date: string | Date,
  locale: "pt-BR" | "en-US" = "pt-BR"
): string => {
  const dateObj = typeof date === "string" ? parseISODateString(date) : date;

  return dateObj.toLocaleDateString(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

/**
 * Formata uma string de data para um formato mais legível (dd/MM/yy)
 * @param date - Data em formato ISO (YYYY-MM-DD) ou Date object
 * @returns String formatada no padrão "01/01/21"
 */
export const formatDateShort = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISODateString(date) : date;

  return dateObj.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

/**
 * Formata uma string de data para um formato relativo (ex: "Hoje", "Ontem", "dd/MM")
 * @param date - Data em formato ISO (YYYY-MM-DD) ou Date object
 * @returns String formatada
 */
export const formatDateRelative = (date: string | Date): string => {
  const dateObj = typeof date === "string" ? parseISODateString(date) : date;
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  // Zerar horas para comparação apenas de datas
  const dateOnly = new Date(
    dateObj.getFullYear(),
    dateObj.getMonth(),
    dateObj.getDate()
  );
  const todayOnly = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );
  const yesterdayOnly = new Date(
    yesterday.getFullYear(),
    yesterday.getMonth(),
    yesterday.getDate()
  );

  if (dateOnly.getTime() === todayOnly.getTime()) {
    return "Hoje";
  } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
    return "Ontem";
  } else {
    return formatDateShort(dateObj);
  }
};
