# React Native Feature Architecture

A project-agnostic guide for building React Native (Expo) apps with a feature-first architecture. Copy this into any new RN project and follow it layer by layer.

---

## Table of Contents

1. [Philosophy](#1-philosophy)
2. [Tech Stack & Setup](#2-tech-stack--setup)
3. [Root Project Structure](#3-root-project-structure)
4. [Canonical Feature Anatomy](#4-canonical-feature-anatomy)
5. [Layer-by-Layer Guide](#5-layer-by-layer-guide)
   - [5.1 Route](#51-route)
   - [5.2 Screen](#52-screen)
   - [5.3 ViewModel](#53-viewmodel)
   - [5.4 Service](#54-service)
   - [5.5 Mutation](#55-mutation)
   - [5.6 Query](#56-query)
   - [5.7 Store](#57-store)
   - [5.8 Validation](#58-validation)
   - [5.9 Barrel](#59-barrel)
6. [Shared Layer](#6-shared-layer)
7. [Navigation](#7-navigation)
8. [Cross-Cutting Conventions](#8-cross-cutting-conventions)
9. [Feature Scaffolding Checklist](#9-feature-scaffolding-checklist)
10. [Anti-Patterns](#10-anti-patterns)
11. [End-to-End Reference: Login Feature](#11-end-to-end-reference-login-feature)

---

## 1. Philosophy

**Mission.** Isolated, testable features where UI, orchestration, and IO are strictly separated. Any feature can be read top-to-bottom by one engineer without chasing imports across the codebase, and any feature can be deleted by removing a single folder.

### Four pillars

1. **Feature isolation.** Each feature under `src/features/<name>/` owns its screens, state, and services. Cross-feature communication happens only through barrel exports (`index.ts`).
2. **ViewModel as the single seam.** Screens consume exactly one hook — their ViewModel. They never import services, mutations, queries, or stores directly. Swapping a feature's data source is a ViewModel edit, not a screen edit.
3. **Thin services.** Services are pure `async` functions. No React, no state, no hooks. They take arguments, call `fetch`, return data, or throw.
4. **Composable state.** Server state lives in React Query. Form state lives in `react-hook-form`. Multi-screen flow state lives in tiny `useSyncExternalStore` stores. Single-screen state lives in `useState`. Never mix responsibilities.

### Data flow

```
Stack.Screen
   │
   ▼
<Screen>Screen.tsx  ──►  use<Screen>ViewModel()
                              │
                              ├──►  useForm() + zodResolver           (form state)
                              ├──►  use<Action>Mutation()             (writes)
                              ├──►  use<Resource>Query()              (reads)
                              ├──►  <flow>FlowStore                   (multi-screen state)
                              └──►  useNavigation() / useRoute()      (navigation)
                                        │
                                        ▼
                                <feature>.service.ts  ──►  fetchWithAuth()  ──►  HTTP
```

Data flows down; events flow up. The ViewModel is the only place where these axes meet.

---

## 2. Tech Stack & Setup

### Required dependencies

| Purpose | Packages |
|---|---|
| Framework | `expo`, `react-native`, `typescript` |
| Navigation | `@react-navigation/native`, `@react-navigation/native-stack`, `@react-navigation/bottom-tabs` |
| Server state | `@tanstack/react-query` |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` |
| Secure storage | `expo-secure-store` |
| Animation | `react-native-reanimated` |
| Screens / safe area / gestures | `react-native-screens`, `react-native-safe-area-context`, `react-native-gesture-handler` |

### Install

```bash
npx create-expo-app@latest my-app --template blank-typescript
cd my-app

npx expo install react-native-screens react-native-safe-area-context \
  react-native-gesture-handler react-native-reanimated expo-secure-store

npm install @react-navigation/native @react-navigation/native-stack \
  @react-navigation/bottom-tabs @tanstack/react-query \
  react-hook-form @hookform/resolvers zod

npm install -D babel-plugin-module-resolver
```

### `babel.config.js`

Reanimated must be the **last** plugin.

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          alias: { '@': './src' },
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        },
      ],
      'react-native-reanimated/plugin',
    ],
  };
};
```

### `tsconfig.json`

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

### `App.tsx`

Provider stack wraps the navigator. Keep this file short — all routing lives in `src/app/router/`.

```tsx
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/providers/queryClient';
import { RootNavigator } from '@/app/router/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
```

### Styling

This guide is neutral on styling. All snippets use bare React Native `StyleSheet`. If you want utility classes, add [NativeWind](https://www.nativewind.dev/); if you want a token-driven system, add [Tamagui](https://tamagui.dev/); if you want CSS-in-JS, add `styled-components/native`. The architecture does not change.

---

## 3. Root Project Structure

```
my-app/
├── App.tsx
├── babel.config.js
├── tsconfig.json
├── package.json
└── src/
    ├── app/
    │   └── router/
    │       ├── RootNavigator.tsx
    │       ├── types.ts
    │       ├── auth.stack.tsx
    │       └── app.tabs.tsx
    ├── features/
    │   ├── auth/
    │   ├── home/
    │   └── profile/
    ├── shared/
    │   ├── ui/
    │   ├── services/
    │   ├── providers/
    │   ├── hooks/
    │   └── types/
    └── assets/
        ├── icons/
        ├── images/
        └── animations/
```

Three top-level buckets:

- **`app/`** — wiring: navigation, root providers, global theme setup. No business logic.
- **`features/`** — one folder per feature. All domain code lives here.
- **`shared/`** — reusable building blocks that are not owned by any feature.

---

## 4. Canonical Feature Anatomy

```
src/features/<feature>/
├── screens/
│   └── <Screen>/
│       ├── <Screen>Screen.tsx         # consumes only its ViewModel
│       └── components/                # private to this screen
├── components/                        # shared across screens within the feature
├── hooks/
│   ├── models/
│   │   └── use<Screen>ViewModel.ts    # orchestrates mutations + queries + stores
│   ├── mutations/
│   │   └── use<Action>.ts             # thin useMutation wrapper
│   └── queries/
│       └── use<Resource>.ts           # useQuery + exported queryKey
├── services/
│   └── <feature>.service.ts           # pure async fns, no React
├── stores/                            # only for multi-step flows
│   └── <flow>-flow.store.ts           # useSyncExternalStore
├── validations/
│   └── <feature>.validations.ts       # zod schemas + inferred types
└── index.ts                           # barrel: public API of the feature
```

**Omit layers you don't need.** No queries? No `hooks/queries/` folder. No multi-step flow? No `stores/` folder. Never create empty folders for symmetry.

---

## 5. Layer-by-Layer Guide

Each layer: **Purpose → Rules → Code → Anti-patterns.**

### 5.1 Route

**Purpose.** Register screens with React Navigation. Thin wiring only.

**Rules.**
- One stack file per feature: `src/app/router/<feature>.stack.tsx`.
- Param types live in `src/app/router/types.ts`.
- No logic. No hooks. No data fetching.

**Code.**

```tsx
// src/app/router/auth.stack.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen, SignUpScreen } from '@/features/auth';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
    </Stack.Navigator>
  );
}
```

```ts
// src/app/router/types.ts
export type AuthStackParamList = {
  Login: undefined;
  SignUp: { invitationCode?: string } | undefined;
};

export type AppTabsParamList = {
  Home: undefined;
  Profile: { userId: string };
};
```

**Anti-patterns.**
- Calling hooks or fetching data here.
- Inline `Stack.Screen` components that define logic.

---

### 5.2 Screen

**Purpose.** Render the UI. Consume exactly one ViewModel.

**Rules.**
- File name: `<Screen>Screen.tsx`.
- Lives in `screens/<Screen>/<Screen>Screen.tsx`.
- Imports nothing from `services/`, `hooks/mutations/`, `hooks/queries/`, or `stores/` directly.
- Wraps content in `SafeAreaView`. If the screen has a form, wrap in `KeyboardAvoidingView`.
- Form fields use RHF `Controller` around `TextInput`.
- Screen-specific components live in `screens/<Screen>/components/`, not in the feature-level `components/`.

**Code.**

```tsx
// src/features/auth/screens/Login/LoginScreen.tsx
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import { Button, ErrorBanner, FormField } from '@/shared/ui';
import { useLoginViewModel } from '@/features/auth/hooks/models/useLoginViewModel';

export function LoginScreen() {
  const { form, handleLogin, isPending, apiError, goToSignUp } =
    useLoginViewModel();
  const { control, formState: { errors } } = form;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Welcome back</Text>

          {apiError ? <ErrorBanner message={apiError} /> : null}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField label="Email" error={errors.email?.message}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </FormField>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField label="Password" error={errors.password?.message}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="password"
                  placeholder="••••••••"
                />
              </FormField>
            )}
          />

          <Button title="Sign in" onPress={handleLogin} loading={isPending} />

          <View style={styles.footer}>
            <Text>Don't have an account?</Text>
            <Button variant="link" title="Sign up" onPress={goToSignUp} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  content: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 24 },
});
```

**Anti-patterns.**
- Importing `useMutation`, `useQuery`, or any service function directly.
- Reading from a store without routing through the ViewModel.
- Inline `StyleSheet.create` inside the render body (create it once, outside the component).
- Monolithic screens — once a screen exceeds ~150 lines, extract pieces into `screens/<Screen>/components/`.

---

### 5.3 ViewModel

**Purpose.** Orchestrate the screen: form, mutations, queries, stores, navigation.

**Rules.**
- File name: `use<Screen>ViewModel.ts`.
- Returns a flat object shaped for the screen's needs — never a raw mutation/query object.
- All navigation happens here. Screens do not call `navigation.navigate()` directly.
- Exposes `isPending`, `apiError`, and high-level action handlers (e.g. `handleLogin`, `handleSubmit`, `goToSignUp`).

**Code.**

```ts
// src/features/auth/hooks/models/useLoginViewModel.ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loginSchema, type LoginFormData } from '@/features/auth/validations/auth.validations';
import { useSignIn } from '@/features/auth/hooks/mutations/useSignIn';
import type { AuthStackParamList } from '@/app/router/types';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function useLoginViewModel() {
  const navigation = useNavigation<Navigation>();
  const signIn = useSignIn();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const apiError = signIn.error ? (signIn.error as Error).message : null;

  const handleLogin = form.handleSubmit(async (data) => {
    await signIn.mutateAsync(data);
    // React Query cache update triggers the auth gate in RootNavigator.
  });

  const goToSignUp = () => navigation.navigate('SignUp');

  return {
    form,
    handleLogin,
    goToSignUp,
    isPending: signIn.isPending,
    apiError,
  };
}
```

**Anti-patterns.**
- Returning the whole `useMutation` object. Always reshape into what the screen needs.
- Business logic inside the screen — if you see an `if` chain in a screen, it belongs here.
- Navigation calls from the screen.

---

### 5.4 Service

**Purpose.** HTTP / IO layer. Pure async functions.

**Rules.**
- File name: `<feature>.service.ts`.
- No React. No hooks. No state.
- Use `fetchWithAuth` from `@/shared/services/http`.
- On `!res.ok`, throw `new Error(friendlyMessage)`. The ViewModel surfaces this via `apiError`.
- Return typed data; never return `Response`.

**Code.**

```ts
// src/features/auth/services/auth.service.ts
import { fetchWithAuth } from '@/shared/services/http';
import type { User } from '@/shared/types';

const AUTH_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth`;

export async function signIn(email: string, password: string): Promise<User> {
  const res = await fetchWithAuth(`${AUTH_URL}/signin`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? 'Unable to sign in. Check your credentials.');
  }
  return res.json();
}

export async function getCurrentUser(): Promise<User | null> {
  const res = await fetchWithAuth(`${AUTH_URL}/me`);
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to load user.');
  return res.json();
}
```

**Anti-patterns.**
- Calling `useQuery`/`useMutation` inside a service.
- Reading React context from a service.
- Silently swallowing errors — always throw with a user-friendly message.

---

### 5.5 Mutation

**Purpose.** Wrap a write service fn with React Query and cache-invalidation rules.

**Rules.**
- File name: `use<Action>.ts`.
- Thin. The file typically does nothing but wrap `useMutation` and invalidate relevant queries.
- Import `queryKey` constants from the query file — never inline the key.

**Code.**

```ts
// src/features/auth/hooks/mutations/useSignIn.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn } from '@/features/auth/services/auth.service';
import { currentUserQueryKey } from '@/features/auth/hooks/queries/useCurrentUser';
import type { LoginFormData } from '@/features/auth/validations/auth.validations';

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: LoginFormData) => signIn(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
    },
  });
}
```

**Anti-patterns.**
- Calling `queryClient.invalidateQueries(['currentUser'])` with an inlined key.
- Putting navigation calls in `onSuccess`. That belongs to the ViewModel.
- Mutations that also do reads.

---

### 5.6 Query

**Purpose.** Wrap a read service fn with React Query.

**Rules.**
- File name: `use<Resource>.ts`.
- **Always export the `queryKey` as a `const ... as const`** so mutations can reuse it.
- Configure `staleTime`, `retry`, and `refetchOnMount` consciously — don't leave the defaults unless you understand them.

**Code.**

```ts
// src/features/auth/hooks/queries/useCurrentUser.ts
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/features/auth/services/auth.service';

export const currentUserQueryKey = ['currentUser'] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
```

Parameterized queries use a key builder:

```ts
export const userProfileQueryKey = (userId: string) =>
  ['users', userId, 'profile'] as const;

export function useUserProfile(userId: string) {
  return useQuery({
    queryKey: userProfileQueryKey(userId),
    queryFn: () => getUserProfile(userId),
    enabled: Boolean(userId),
  });
}
```

**Anti-patterns.**
- Inlining query keys at call sites.
- Using queries for data that is only needed inside one component render — prefer `useState`.

---

### 5.7 Store

**Purpose.** Share state across multiple screens in a flow (e.g. multi-step signup).

**Rules.**
- **Only** for state that must survive route transitions inside a feature.
- Use `useSyncExternalStore`. No Zustand, no Redux, no Context. You want zero dependencies for something this small.
- Expose a plain object with typed setters, a `reset()`, and a `getSnapshot()`.
- No persistence by default. If you need to persist, write explicitly to `expo-secure-store` in the setters.
- Do **not** use a store for single-screen state. That belongs in `useState` or `useForm`.

**Code.**

```ts
// src/features/auth/stores/signup-flow.store.ts
import { useSyncExternalStore } from 'react';

export type SignUpFlowData = {
  email: string;
  password: string;
  displayName: string;
};

type State = { data: Partial<SignUpFlowData> };

let state: State = { data: {} };
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): State {
  return state;
}

function setState(next: State) {
  state = next;
  listeners.forEach((l) => l());
}

export const signUpFlowStore = {
  setCredentials(payload: Pick<SignUpFlowData, 'email' | 'password'>) {
    setState({ data: { ...state.data, ...payload } });
  },
  setIdentity(payload: Pick<SignUpFlowData, 'displayName'>) {
    setState({ data: { ...state.data, ...payload } });
  },
  reset() {
    setState({ data: {} });
  },
  getSnapshot,
};

export function useSignUpFlowStore(): Partial<SignUpFlowData> {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot).data;
}
```

**Anti-patterns.**
- Using the store for form state inside one screen.
- Persisting to `AsyncStorage` for sensitive data (use `expo-secure-store`).
- Importing the store in a screen — route it through the ViewModel.

---

### 5.8 Validation

**Purpose.** Define form shapes, field rules, and the inferred TypeScript types.

**Rules.**
- File name: `<feature>.validations.ts`.
- Schema names: `<context>Schema` (e.g. `loginSchema`, `createPasswordSchema`).
- Inferred types: `<Context>FormData = z.infer<typeof schema>`.
- Error messages should be user-facing (choose the language that matches your app).

**Code.**

```ts
// src/features/auth/validations/auth.validations.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export const createPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, 'Minimum 8 characters')
      .regex(/[a-zA-Z]/, 'Must contain at least 1 letter')
      .regex(/\d/, 'Must contain at least 1 number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type CreatePasswordFormData = z.infer<typeof createPasswordSchema>;
```

**Anti-patterns.**
- Ad-hoc validation logic scattered inside the ViewModel or screen.
- Inline types instead of `z.infer`.

---

### 5.9 Barrel

**Purpose.** The feature's public API. External imports go through this file only.

**Rules.**
- Export: screens, ViewModels, mutations/queries consumed outside the feature, stores (the object + hook), schemas, inferred types.
- Do **not** export services, components private to a screen, or internal helpers.

**Code.**

```ts
// src/features/auth/index.ts
export { LoginScreen } from './screens/Login/LoginScreen';
export { SignUpScreen } from './screens/SignUp/SignUpScreen';

export { useLoginViewModel } from './hooks/models/useLoginViewModel';
export { useSignUpViewModel } from './hooks/models/useSignUpViewModel';

export { useCurrentUser, currentUserQueryKey } from './hooks/queries/useCurrentUser';
export { useSignIn } from './hooks/mutations/useSignIn';
export { useSignOut } from './hooks/mutations/useSignOut';

export { signUpFlowStore, useSignUpFlowStore } from './stores/signup-flow.store';

export {
  loginSchema,
  createPasswordSchema,
  type LoginFormData,
  type CreatePasswordFormData,
} from './validations/auth.validations';
```

**Anti-patterns.**
- Re-exporting everything with `export *`.
- Importing from a feature via a deep path (`@/features/auth/services/...`) instead of the barrel.

---

## 6. Shared Layer

### 6.1 `shared/ui/`

Reusable atoms used by any feature. Examples: `Button`, `FormField`, `ErrorBanner`, `Typography`, `Icon`, `LoadingSpinner`, `Screen`.

API surface (not full impl):

```tsx
// src/shared/ui/Button.tsx
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

type Variant = 'primary' | 'secondary' | 'link';

export type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', loading, disabled }: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.base, styles[variant], isDisabled && styles.disabled]}
    >
      {loading ? <ActivityIndicator /> : <Text style={styles[`${variant}Text`]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, alignItems: 'center' },
  primary: { backgroundColor: '#111' },
  secondary: { backgroundColor: '#eee' },
  link: { backgroundColor: 'transparent', paddingVertical: 4, paddingHorizontal: 0 },
  primaryText: { color: '#fff', fontWeight: '600' },
  secondaryText: { color: '#111', fontWeight: '600' },
  linkText: { color: '#06f', fontWeight: '600' },
  disabled: { opacity: 0.5 },
});
```

### 6.2 `shared/services/http.ts`

```ts
// src/shared/services/http.ts
import { getToken } from './token.service';

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = await getToken();
  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}
```

### 6.3 `shared/services/token.service.ts`

```ts
// src/shared/services/token.service.ts
import * as SecureStore from 'expo-secure-store';

const KEY = 'auth.token';

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY);
}

export async function setToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(KEY, token);
}

export async function clearToken(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
```

### 6.4 `shared/providers/queryClient.ts`

```ts
// src/shared/providers/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
});
```

### 6.5 `shared/hooks/`

Cross-feature hooks like `useDebounce`, `useKeyboardVisible`, `useAppState`. Kept small; feature-specific hooks belong inside the feature.

### 6.6 `shared/types/`

Shared TS interfaces — `User`, `Paginated<T>`, `ApiError`, etc. One file per concept, barrelled via `shared/types/index.ts`.

---

## 7. Navigation

### Typed stacks

```ts
// src/app/router/types.ts
import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Login: undefined;
  SignUp: { invitationCode?: string } | undefined;
};

export type AppTabsParamList = {
  Home: undefined;
  Profile: { userId: string };
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  App: NavigatorScreenParams<AppTabsParamList>;
};
```

### Auth gate

The root navigator switches stacks based on the current-user query. The query is the single source of truth; no separate auth store.

```tsx
// src/app/router/RootNavigator.tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './auth.stack';
import { AppTabs } from './app.tabs';
import { useCurrentUser } from '@/features/auth';
import { SplashScreen } from '@/shared/ui';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading) return <SplashScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <Stack.Screen name="App" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}
```

### Reading params

```ts
import { useRoute, type RouteProp } from '@react-navigation/native';
import type { AppTabsParamList } from '@/app/router/types';

const route = useRoute<RouteProp<AppTabsParamList, 'Profile'>>();
const { userId } = route.params;
```

### Deep linking

Configure the `linking` prop on `NavigationContainer` with a `prefixes` array and a `config.screens` map that mirrors your param lists. Keep deep-link path definitions next to `types.ts`.

---

## 8. Cross-Cutting Conventions

- **Imports.** Always use `@/` aliases: `@/features/*`, `@/shared/*`, `@/app/*`. Never relative paths that climb out of a folder (`../../`).
- **Forms.** Always `react-hook-form` + `zod` + `Controller` around `TextInput`. Never raw `useState` for form fields.
- **Server state.** Always React Query. Never fetch in `useEffect`.
- **Tokens.** Always `expo-secure-store`. Never `AsyncStorage`.
- **Assets.**
  - SVG icons → `src/assets/icons/` (via `react-native-svg-transformer`).
  - Feature images → `src/assets/images/`.
  - Lottie → `src/assets/animations/` (via `lottie-react-native`).
- **Comments.** Minimal. If code needs a comment to be understood, rename the thing first. The only comments worth writing explain a non-obvious *why*.
- **Styling.** Keep `StyleSheet.create` outside the component body; do not build style objects inline on every render. Prefer `gap` over margin hacks.
- **Absolute URLs.** All API base URLs come from `process.env.EXPO_PUBLIC_*` env vars.

---

## 9. Feature Scaffolding Checklist

Create files in this order — each step compiles cleanly:

1. **Validations** → `validations/<feature>.validations.ts` (schemas + inferred types).
2. **Service** → `services/<feature>.service.ts` (pure async fns, uses `fetchWithAuth`).
3. **Query / Mutation** → `hooks/queries/*`, `hooks/mutations/*` (thin React Query wrappers; queries export `queryKey`).
4. **Store** (only if multi-step flow) → `stores/<flow>-flow.store.ts`.
5. **ViewModel** → `hooks/models/use<Screen>ViewModel.ts` (composes the above + navigation).
6. **Screen** → `screens/<Screen>/<Screen>Screen.tsx` (consumes ViewModel only).
7. **Barrel** → `index.ts` (export screens, viewmodels, mutations/queries, stores, schemas).
8. **Route** → `src/app/router/<feature>.stack.tsx` (register `Stack.Screen`s; update `types.ts`).

Omit steps for layers that aren't needed. Don't scaffold empty folders.

---

## 10. Anti-Patterns

- **Screen imports a service, mutation, or query directly.** Everything goes through the ViewModel.
- **ViewModel returns a raw mutation object.** Reshape it — expose `isPending`, `apiError`, and an action handler.
- **Inline query keys.** Always import the exported `queryKey` constant.
- **Stores for single-screen state.** That belongs in `useState` or `useForm`.
- **`AsyncStorage` for tokens.** Use `expo-secure-store`.
- **Deep imports into another feature.** Go through the barrel (`@/features/other`).
- **Empty folders "for symmetry".** Delete them.
- **`StyleSheet.create` inside the render body.** Hoist it to module scope.
- **Monolithic screens.** Split into `screens/<Screen>/components/` once the file exceeds ~150 lines.
- **Navigation calls from the screen.** The ViewModel owns navigation.
- **`useEffect` fetches.** Use a React Query `useQuery`.
- **Ad-hoc validation.** All validation goes through Zod schemas in `validations/`.
- **Feature-owned UI atoms.** If more than one feature needs it, move it to `shared/ui/`.

---

## 11. End-to-End Reference: Login Feature

A complete, minimal login feature. Every layer included. Read top to bottom.

### Tree

```
src/features/auth/
├── screens/Login/LoginScreen.tsx
├── hooks/
│   ├── models/useLoginViewModel.ts
│   ├── mutations/useSignIn.ts
│   └── queries/useCurrentUser.ts
├── services/auth.service.ts
├── validations/auth.validations.ts
└── index.ts
```

### `validations/auth.validations.ts`

```ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
```

### `services/auth.service.ts`

```ts
import { fetchWithAuth } from '@/shared/services/http';
import { setToken, clearToken } from '@/shared/services/token.service';
import type { User } from '@/shared/types';

const AUTH_URL = `${process.env.EXPO_PUBLIC_API_URL}/auth`;

export async function signIn(email: string, password: string): Promise<User> {
  const res = await fetchWithAuth(`${AUTH_URL}/signin`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message ?? 'Unable to sign in. Check your credentials.');
  }
  const { token, user } = await res.json();
  await setToken(token);
  return user;
}

export async function getCurrentUser(): Promise<User | null> {
  const res = await fetchWithAuth(`${AUTH_URL}/me`);
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Failed to load user.');
  return res.json();
}

export async function signOut(): Promise<void> {
  await fetchWithAuth(`${AUTH_URL}/signout`, { method: 'POST' });
  await clearToken();
}
```

### `hooks/queries/useCurrentUser.ts`

```ts
import { useQuery } from '@tanstack/react-query';
import { getCurrentUser } from '@/features/auth/services/auth.service';

export const currentUserQueryKey = ['currentUser'] as const;

export function useCurrentUser() {
  return useQuery({
    queryKey: currentUserQueryKey,
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
}
```

### `hooks/mutations/useSignIn.ts`

```ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signIn } from '@/features/auth/services/auth.service';
import { currentUserQueryKey } from '@/features/auth/hooks/queries/useCurrentUser';
import type { LoginFormData } from '@/features/auth/validations/auth.validations';

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: LoginFormData) => signIn(email, password),
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey, user);
    },
  });
}
```

### `hooks/models/useLoginViewModel.ts`

```ts
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { loginSchema, type LoginFormData } from '@/features/auth/validations/auth.validations';
import { useSignIn } from '@/features/auth/hooks/mutations/useSignIn';
import type { AuthStackParamList } from '@/app/router/types';

type Navigation = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

export function useLoginViewModel() {
  const navigation = useNavigation<Navigation>();
  const signIn = useSignIn();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onSubmit',
  });

  const apiError = signIn.error ? (signIn.error as Error).message : null;

  const handleLogin = form.handleSubmit(async (data) => {
    await signIn.mutateAsync(data);
  });

  const goToSignUp = () => navigation.navigate('SignUp');

  return {
    form,
    handleLogin,
    goToSignUp,
    isPending: signIn.isPending,
    apiError,
  };
}
```

### `screens/Login/LoginScreen.tsx`

```tsx
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Controller } from 'react-hook-form';
import { Button, ErrorBanner, FormField } from '@/shared/ui';
import { useLoginViewModel } from '@/features/auth/hooks/models/useLoginViewModel';

export function LoginScreen() {
  const { form, handleLogin, goToSignUp, isPending, apiError } = useLoginViewModel();
  const { control, formState: { errors } } = form;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Welcome back</Text>

          {apiError ? <ErrorBanner message={apiError} /> : null}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField label="Email" error={errors.email?.message}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </FormField>
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <FormField label="Password" error={errors.password?.message}>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  autoComplete="password"
                  placeholder="••••••••"
                />
              </FormField>
            )}
          />

          <Button title="Sign in" onPress={handleLogin} loading={isPending} />

          <View style={styles.footer}>
            <Text>Don't have an account?</Text>
            <Button variant="link" title="Sign up" onPress={goToSignUp} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  flex: { flex: 1 },
  content: { padding: 24, gap: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 16 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 24 },
});
```

### `index.ts`

```ts
export { LoginScreen } from './screens/Login/LoginScreen';

export { useLoginViewModel } from './hooks/models/useLoginViewModel';

export { useCurrentUser, currentUserQueryKey } from './hooks/queries/useCurrentUser';
export { useSignIn } from './hooks/mutations/useSignIn';

export {
  loginSchema,
  type LoginFormData,
} from './validations/auth.validations';
```

### `src/app/router/auth.stack.tsx`

```tsx
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@/features/auth';
import type { AuthStackParamList } from './types';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
}
```

That's the entire feature. Every other feature in your app will look exactly like this.
