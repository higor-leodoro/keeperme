import { NavigationProp, useNavigation } from "@react-navigation/native";

import { RoutesParamsList } from "@/types/routes";

export const useAppNavigation = () => {
  return useNavigation<NavigationProp<RoutesParamsList>>();
};
