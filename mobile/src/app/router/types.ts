import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthFlow = 'signup' | 'reset';

export type AuthStackParamList = {
  Login: undefined;
  LoginEmail: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  VerifyCode: { email: string; flow: AuthFlow };
  ResetPassword: { email: string };
};

export type AppTabsParamList = {
  Home: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabsParamList>;
};
