import { Modal, Pressable, StyleSheet } from "react-native";
import { Calendar, DateData, LocaleConfig } from "react-native-calendars";

import { enUS, ptBR } from "./locale.calendar.config";

import { colors } from "@/constants/colors";
import { FONT_FAMILY } from "@/constants/font";
import { useInternationalization } from "@/hooks";
import { useDatePickerStore } from "@/stores";

export const DatePicker = () => {
  const { setDatePicker, visible, selectedDay, isTwoDates } =
    useDatePickerStore();
  const { currentLanguage } = useInternationalization();

  LocaleConfig.locales["pt-BR"] = ptBR;
  LocaleConfig.locales["en-US"] = enUS;
  LocaleConfig.defaultLocale = currentLanguage;

  const handleSelectDate = (day: DateData) => {
    if (!isTwoDates) {
      setDatePicker({
        selectedDay: day.dateString,
        visible: false,
      });
    } else {
      setDatePicker({
        endSelectedDay: day.dateString,
        visible: false,
        isTwoDates: false,
      });
    }
  };

  const handleCloseModal = () => {
    setDatePicker({ visible: false });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <Pressable style={styles.overlay} onPress={handleCloseModal}>
        <Pressable
          style={styles.container}
          onPress={(e) => e.stopPropagation()}
        >
          <Calendar
            style={styles.calendar}
            onDayPress={handleSelectDate}
            hideExtraDays
            markedDates={
              selectedDay
                ? {
                    [selectedDay]: {
                      selected: true,
                      selectedColor: colors.palette.black,
                    },
                  }
                : undefined
            }
            theme={{
              textMonthFontSize: 18,
              textMonthFontFamily: FONT_FAMILY.poppins.bold,
              monthTextColor: colors.palette.white,
              todayTextColor: colors.warning,
              selectedDayTextColor: colors.palette.white,
              selectedDayBackgroundColor: colors.palette.gray.medium,
              arrowColor: colors.palette.white,
              calendarBackground: colors.palette.gray.medium,
              textDisabledColor: colors.palette.gray.light,
              textDayStyle: {
                fontFamily: FONT_FAMILY.poppins.medium,
                color: colors.palette.white,
              },
              textDayFontFamily: FONT_FAMILY.poppins.regular,
              textDayHeaderFontFamily: FONT_FAMILY.poppins.medium,
              arrowStyle: {
                margin: 0,
                padding: 0,
              },
            }}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  container: {
    width: "90%",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.surface.border,
    backgroundColor: colors.palette.gray.medium,
  },
  calendar: {
    backgroundColor: colors.palette.gray.medium,
    borderRadius: 8,
  },
});
