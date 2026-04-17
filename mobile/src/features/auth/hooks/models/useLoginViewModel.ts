import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/app/router/types';

type RootNavigation = NativeStackNavigationProp<RootStackParamList>;

export function useLoginViewModel() {
  const navigation = useNavigation();

  const handleEnter = () => {
    navigation.getParent<RootNavigation>()?.replace('App', { screen: 'Home' });
  };

  return { handleEnter };
}
