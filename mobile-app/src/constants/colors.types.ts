import { colors } from "./colors";

// Extrai todos os valores de cores das categorias
type CategoryColors =
  | typeof colors.category.house
  | typeof colors.category.food
  | typeof colors.category.transport
  | typeof colors.category.health
  | typeof colors.category.education
  | typeof colors.category.entertainment
  | typeof colors.category.finance
  | typeof colors.category.grocery
  | typeof colors.category.others;

// Todas as cores disponíveis no sistema para autocomplete
export type ColorToken =
  // Estados
  | typeof colors.success
  | typeof colors.error
  | typeof colors.warning
  // Utilitários
  | typeof colors.textLight
  // Paleta base
  | typeof colors.palette.black
  | typeof colors.palette.white
  | typeof colors.palette.gray.medium
  | typeof colors.palette.gray.light
  // Surfaces
  | typeof colors.surface.border
  | typeof colors.surface.overlay
  // Categorias
  | CategoryColors;

// Type que fornece autocomplete mas ainda aceita qualquer string válida
export type ColorValue = ColorToken | (string & Record<never, never>);
