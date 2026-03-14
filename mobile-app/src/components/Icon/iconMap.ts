import {
  ArrowDown,
  ArrowDownLeft,
  ArrowLeft,
  ArrowLeftRight,
  ArrowUp,
  ArrowUpRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Car,
  DollarSign,
  Gamepad2,
  GraduationCap,
  Heart,
  Home,
  LogOut,
  LucideIcon,
  MoreHorizontal,
  Plus,
  ScrollText,
  ShoppingBag,
  ShoppingCart,
  Soup,
  TrendingDown,
  TrendingUp,
  User,
  UtensilsCrossed,
  Wallet,
} from "lucide-react-native";

// Mapeamento de todos os ícones disponíveis
export const iconMap = {
  wallet: Wallet,
  "arrow-up-right": ArrowUpRight,
  "arrow-down-left": ArrowDownLeft,
  home: Home,
  "utensils-crossed": UtensilsCrossed,
  car: Car,
  heart: Heart,
  "graduation-cap": GraduationCap,
  gamepad2: Gamepad2,
  "dollar-sign": DollarSign,
  "more-horizontal": MoreHorizontal,
  "shopping-cart": ShoppingCart,
  plus: Plus,
  "arrow-left-right": ArrowLeftRight,
  "scroll-text": ScrollText,
  "arrow-down": ArrowDown,
  "trending-down": TrendingDown,
  "trending-up": TrendingUp,
  "banknote-arrow-down": BanknoteArrowDown,
  "banknote-arrow-up": BanknoteArrowUp,
  soup: Soup,
  "shopping-bag": ShoppingBag,
  "arrow-left": ArrowLeft,
  "arrow-up": ArrowUp,
  user: User,
  "log-out": LogOut,
} as const;

// Type para os nomes dos ícones (com autocomplete)
export type IconName = keyof typeof iconMap;

// Helper para obter o componente do ícone
export const getIcon = (name: IconName): LucideIcon => {
  return iconMap[name];
};
