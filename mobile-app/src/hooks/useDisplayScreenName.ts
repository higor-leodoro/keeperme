import { useRoute } from "@react-navigation/native";

import { RoutesParamsList } from "@/types/routes";

/**
 * Converte PascalCase para camelCase
 * Exemplo: "NewTransaction" -> "newTransaction"
 */
const toCamelCase = (str: string): string => {
  return str.charAt(0).toLowerCase() + str.slice(1);
};

/**
 * Hook que retorna o nome da tela atual normalizado em camelCase
 * Para uso com chaves de tradução: t(`screens.${screenName}.title`)
 */
export const useDisplayScreenName = (): string => {
  const route = useRoute();
  const routeName = route.name as keyof RoutesParamsList;

  return toCamelCase(routeName);
};
