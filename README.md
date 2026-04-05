# LearnHub Mobile App

A production-style Expo React Native learning app built with Expo Router, Zustand, React Query, SecureStore, and NativeWind.

## Project Overview

LearnHub is a modern mobile application for discovering courses, managing bookmarks, tracking enrollment, and handling authenticated sessions. It uses Expo Router to organize navigation into route groups, Zustand for app state management, and local persistence for offline continuity.

## Key Features

- Email/password authentication flow
- Auth persistence via SecureStore
- Course discovery and filtering
- Bookmark and enrollment management
- Offline-aware UI cues
- Centralized error handling and API retry logic
- Tab-based navigation with profile and home screens
- Form validation with React Hook Form + Zod

## Tech Stack

- Expo `~54.0.33`
- React Native `0.81.5`
- React `19.1.0`
- Expo Router `~6.0.23`
- TypeScript `~5.9.2`
- Zustand `^5.0.12`
- React Query `^5.96.1`
- NativeWind `^4.2.3`
- Axios `^1.14.0`
- `expo-secure-store` for auth persistence
- `@react-native-async-storage/async-storage` for local app data
- `react-hook-form` + `zod` for form validation

## Architecture

### Navigation

- `app/_layout.tsx`
  - Root layout for the app
  - Contains the global `AuthRedirector` that watches auth state and performs redirect logic
  - Wraps the app in `QueryClientProvider`, `SafeAreaProvider`, and `ErrorBoundary`

- `app/index.tsx`
  - App startup screen
  - Displays a loading state while auth initialization completes

- `app/(auth)/_layout.tsx`
  - Auth route group for login/register screens

- `app/(tabs)/_layout.tsx`
  - Tabbed app shell for authenticated users

### State Management

- `store/authStore.ts`
  - Zustand store for auth state: `user`, `token`, `isAuthenticated`, `isLoading`, `isInitialized`, `error`
  - Actions: `login`, `register`, `logout`, `checkAuth`
  - Ensures auth initialization completes with `isInitialized = true` on every boot

- `hooks/useAuth.ts`
  - Lightweight wrapper around `useAuthStore`
  - Exposes read-only auth state and actions for screen components

### Services

- `services/api.ts`
  - Axios client with request/response interceptors
  - Reads token from `secureStorage`
  - Handles retries with exponential backoff
  - Logs and normalizes API errors

- `services/authService.ts`
  - Auth-specific API wrapper
  - Handles login, register, logout, and current-user retrieval
  - Provides a local fallback auth mode when backend endpoints are unavailable

### Persistence

- `utils/secureStorage.ts`
  - Secure token and user persistence using Expo SecureStore

- `utils/asyncStorage.ts`
  - App-level storage for bookmarks and preferences

## Folder Structure

```text
app/
  _layout.tsx
  index.tsx
  (auth)/
    _layout.tsx
    login.tsx
    register.tsx
  (tabs)/
    _layout.tsx
    index.tsx
    profile.tsx
  course/[id].tsx
  bookmarks.tsx
  enrolled.tsx
  webview.tsx
components/
  CourseCard.tsx
  ErrorBoundary.tsx
  Header.tsx
  LoadingSpinner.tsx
  OfflineBanner.tsx
  SearchBar.tsx
constants/
  theme.ts
hooks/
  useAuth.ts
  useCourses.ts
  useNetwork.ts
  useNotifications.ts
services/
  api.ts
  authService.ts
store/
  authStore.ts
  courseStore.ts
  preferenceStore.ts
types/
  api.types.ts
  auth.types.ts
  course.types.ts
utils/
  asyncStorage.ts
  constants.ts
  enrolledCourses.ts
  notifications.ts
  secureStorage.ts
```

## Setup and Installation

### Prerequisites

- Node.js `18+`
- npm `9+`
- Expo CLI available via `npx expo`
- Optional: EAS CLI for native builds

### Install Dependencies

```bash
npm install
```

### Start Development

```bash
npx expo start
```

### Run on Device or Simulator

Use the Expo DevTools UI or terminal to launch on Android/iOS/emulator.

## Environment

- No `.env` file is required by default
- The app uses `https://api.freeapi.app` as the primary API endpoint
- Local fallback auth ensures the app remains usable even if backend endpoints are unavailable

## Production Readiness

This project is structured to support a stable production-style launch by enforcing:

- Centralized auth redirect logic in `app/_layout.tsx`
- Single source of truth for auth state with Zustand
- Safe persistence using SecureStore
- Resilient API error handling with retries and normalized messages
- Clear separation between auth flow and authenticated tab flow

## Common Tasks

### Clear cache and restart

```bash
npx expo start -c
```

### Lint the project

```bash
npm run lint
```

### Build Android or iOS with EAS

```bash
eas build --platform android
```

## Troubleshooting

### Login does not redirect

- Ensure `authStore.login()` sets `isAuthenticated: true`
- Confirm `app/_layout.tsx` redirect logic is running after `isInitialized` and `isLoading` are resolved

### Blank or white startup screen

- Check `app/index.tsx` for loader display
- Verify `checkAuth()` is executed once from `app/_layout.tsx`

### Touch inputs blocked on login

- Ensure `ScrollView` uses `keyboardShouldPersistTaps="handled"`
- Avoid full-screen absolute overlays in auth screens

### Android crashes

- Validate secure storage reads/writes with try/catch
- Prevent `JSON.parse(null)` by guarding stored values
- Use `Optional chaining` for user data access

## Notes

This project is designed for a robust auth-driven mobile experience with a clean separation between startup logic, authenticated content, and unauthenticated auth screens. The current architecture intentionally avoids competing navigation sources and keeps redirect behavior centralized.

## License

MIT
