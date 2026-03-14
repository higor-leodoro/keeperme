import { RouteProp, useRoute } from "@react-navigation/native";

import { RoutesParamsList } from "@/types/routes";

export const useRouteParams = <
  T extends keyof RoutesParamsList
>(): RoutesParamsList[T] => {
  const route = useRoute<RouteProp<RoutesParamsList, T>>();
  return route.params as RoutesParamsList[T];
};
