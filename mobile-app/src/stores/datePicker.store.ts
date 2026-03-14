import { create } from "zustand";

import { formatDate } from "@/utils/formatDate";

type DatePickerStoreProps = {
  visible: boolean;
  selectedDay: string;
  endSelectedDay?: string;
  isTwoDates: boolean;
  setDatePicker: (state: Partial<DatePickerStoreProps>) => void;
  resetDatePicker: () => void;
  getFormattedSelectedDay: (locale: "pt-BR" | "en-US") => string;
};

const getTodayISO = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const useDatePickerStore = create<DatePickerStoreProps>((set, get) => ({
  visible: false,
  selectedDay: getTodayISO(),
  endSelectedDay: undefined,
  isTwoDates: false,
  setDatePicker: (newState) => set((state) => ({ ...state, ...newState })),
  resetDatePicker: () =>
    set({
      visible: false,
      selectedDay: getTodayISO(),
      endSelectedDay: undefined,
      isTwoDates: false,
    }),
  getFormattedSelectedDay: (locale: "pt-BR" | "en-US") => {
    const { selectedDay } = get();
    return formatDate(selectedDay, locale);
  },
}));
