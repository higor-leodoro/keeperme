import { Pressable } from "react-native";

import { CustomText } from "../CustomText";
import { DatePicker } from "../DatePicker";

import { useInternationalization } from "@/hooks";
import { useDatePickerStore } from "@/stores";

export const DateSelector = () => {
  const { setDatePicker, getFormattedSelectedDay } = useDatePickerStore();
  const { currentLanguage } = useInternationalization();

  const formattedDate = getFormattedSelectedDay(currentLanguage);

  const handleOpenDatePicker = () => {
    setDatePicker({ visible: true });
  };

  return (
    <>
      <Pressable
        className="flex-row items-center p-4 rounded-2xl bg-app-gray-medium"
        onPress={handleOpenDatePicker}
      >
        <CustomText className="text-app-white">{formattedDate}</CustomText>
      </Pressable>
      <DatePicker />
    </>
  );
};
