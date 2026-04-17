import {
  useFonts as useBricolage,
  BricolageGrotesque_400Regular,
  BricolageGrotesque_500Medium,
  BricolageGrotesque_600SemiBold,
} from '@expo-google-fonts/bricolage-grotesque';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';
import { Geist_400Regular, Geist_500Medium } from '@expo-google-fonts/geist';

export function useAppFonts(): boolean {
  const [loaded] = useBricolage({
    BricolageGrotesque_400Regular,
    BricolageGrotesque_500Medium,
    BricolageGrotesque_600SemiBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
    Geist_400Regular,
    Geist_500Medium,
  });
  return loaded;
}
