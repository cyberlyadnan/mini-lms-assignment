# LearnHub Mobile App

LearnHub is an Expo React Native course-discovery app with authentication, bookmarking, enrollment tracking, notifications, offline awareness, and a polished tab-based UI.

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

## Prerequisites

- Node.js `18+`
- npm `9+`
- Expo CLI (`npx expo ...` works without global install)
- EAS CLI (`npm i -g eas-cli`) for APK builds

## Setup

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npx expo start
```

4. Run on device/emulator from the Expo terminal menu.

## Environment Setup

No `.env` file is required.  
This project uses a public API endpoint (`https://api.freeapi.app`) and local fallback auth for demo reliability.

## Folder Structure

- `app/` - Expo Router screens and layouts
- `components/` - shared UI components
- `hooks/` - reusable app hooks
- `services/` - API clients and service modules
- `store/` - Zustand state stores
- `types/` - shared TypeScript models
- `utils/` - constants, storage, notifications, helper functions

## Run Commands

Start app:

```bash
npx expo start
```

Build Android APK (EAS preview profile):

```bash
eas build --platform android --profile preview
```

## Architectural Decisions

- Uses Expo Router file-based navigation for clear route ownership and tab/stack composition.
- Uses Zustand for lightweight local state (auth, courses, preferences) and React Query for remote data caching.
- Stores auth and sensitive data in SecureStore; app preferences/bookmarks/enrollment in AsyncStorage.
- Implements centralized API error normalization (`handleApiError`) for consistent user-facing messages.

## Known Limitations

- Push notification behavior is limited in Expo Go; for full notifications use a development build.
- Public API auth endpoints may be unavailable, so local fallback auth is used for demo continuity.
- Enrolled course data is locally persisted and can include legacy ID-only records from earlier app versions.
- Offline mode supports local browsing of saved state, but fresh network data requires connectivity.

## Screenshots

- Home screen - _Add screenshot here_
- Course detail - _Add screenshot here_
- Profile screen - _Add screenshot here_
- Bookmarks and Enrolled screens - _Add screenshot here_
