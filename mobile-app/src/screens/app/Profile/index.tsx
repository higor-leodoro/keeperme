import { useState } from "react";
import { Pressable, ScrollView, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

import {
  AppContainer,
  Avatar,
  CustomText,
  Header,
  Icon,
  InputMask,
  MainButton,
} from "@/components";
import { colors } from "@/constants";
import { useI18n } from "@/hooks";
import { useUpdateUser } from "@/hooks/mutations";
import { useAuthStore } from "@/stores";
import {
  Currency,
  Language,
  useInternationalizationStore,
} from "@/stores/internationalization.store";
import { cn } from "@/utils/";

export const Profile = () => {
  const { t } = useI18n();
  const { user, signOut } = useAuthStore();
  const { language, setLanguage, currency, setCurrency } =
    useInternationalizationStore();

  const [name, setName] = useState(user.name);
  const [lastName, setLastName] = useState(user.lastName || "");

  const { mutate: updateUser, isPending } = useUpdateUser({
    onSuccess: (updatedUser) => {
      Toast.show({
        type: "success",
        text1: t("common.success"),
        text2: t("common.updateSuccess"),
      });
      // Update the auth store with new user data
      useAuthStore.setState({ user: updatedUser });
    },
    onError: () => {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("common.updateError"),
      });
    },
  });

  const handleSave = () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: t("common.error"),
        text2: t("common.nameRequired"),
      });
      return;
    }

    updateUser({
      userId: user.id,
      name: name.trim(),
      lastName: lastName.trim() || undefined,
    });
  };

  const languageOptions: { value: Language; label: string }[] = [
    { value: "pt-BR", label: t("screens.profile.portugueseBrazil") },
    { value: "en-US", label: t("screens.profile.englishUS") },
  ];

  const currencyOptions: { value: Currency; label: string }[] = [
    { value: "BRL", label: t("screens.profile.brazilian") },
    { value: "USD", label: t("screens.profile.dollar") },
  ];

  return (
    <AppContainer>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-6 pb-8 px-4">
          {/* Avatar Section */}
          <View className="items-center mt-4">
            <Avatar photo={user.photo} name={user.name} size={100} />
          </View>

          {/* User Info Form */}
          <View className="gap-4">
            <InputMask
              label={t("screens.profile.name")}
              value={name}
              onChangeText={(masked) => setName(masked)}
              placeholder={t("screens.profile.name")}
            />

            <InputMask
              label={t("screens.profile.lastName")}
              value={lastName}
              onChangeText={(masked) => setLastName(masked)}
              placeholder={t("screens.profile.lastName")}
            />
          </View>

          {/* Preferences Section */}
          <View className="gap-4 mt-4">
            <CustomText className="text-white text-lg font-semibold">
              {t("screens.profile.language")}
            </CustomText>
            <View className="gap-2">
              {languageOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setLanguage(option.value)}
                  className={cn(
                    "flex-row items-center justify-between p-4 rounded-2xl border",
                    language === option.value
                      ? "bg-white/30 border-white/40"
                      : "bg-white/5 border-white/20"
                  )}
                >
                  <CustomText
                    className={`text-base ${
                      language === option.value
                        ? "text-white font-semibold"
                        : "text-gray-300"
                    }`}
                  >
                    {option.label}
                  </CustomText>
                  {language === option.value && (
                    <Icon
                      name="arrow-up-right"
                      size={20}
                      color={colors.palette.white}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="gap-4">
            <CustomText className="text-white text-lg font-semibold">
              {t("screens.profile.currency")}
            </CustomText>
            <View className="gap-2">
              {currencyOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setCurrency(option.value)}
                  className={`flex-row items-center justify-between p-4 rounded-2xl border ${
                    currency === option.value
                      ? "bg-white/20 border-white/40"
                      : "bg-white/5 border-white/20"
                  }`}
                >
                  <CustomText
                    className={`text-base ${
                      currency === option.value
                        ? "text-white font-semibold"
                        : "text-gray-300"
                    }`}
                  >
                    {option.label}
                  </CustomText>
                  {currency === option.value && (
                    <Icon
                      name="arrow-up-right"
                      size={20}
                      color={colors.palette.white}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Save Button */}
          <View className="mt-4">
            <MainButton
              text={t("screens.profile.save")}
              onPress={handleSave}
              disabled={isPending}
            />
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={signOut}
            className="flex-row items-center justify-center gap-2 p-3 rounded-2xl bg-error"
          >
            <Icon name="log-out" size={24} color={colors.palette.white} />
            <CustomText className="text-lg font-semibold">
              {t("screens.profile.logout")}
            </CustomText>
          </Pressable>
        </View>
      </ScrollView>
    </AppContainer>
  );
};
