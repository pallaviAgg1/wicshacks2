# React Native Expo Setup Complete ✅

Your app has been converted to support both **Web** and **Mobile (React Native)** platforms!

## 📦 What Was Added

### Files Created:
- `app.json` - Expo configuration
- `index.js` - React Native entry point
- `babel.config.js` - Babel configuration for React Native
- `metro.config.js` - Metro bundler configuration
- `.babelrc` - Additional Babel config
- `src/App.expo.jsx` - React Native app component
- `EXPO_SETUP.md` - Detailed setup instructions
- `assets/` - Directory for app icons and splash images

### Dependencies Installed:
- `expo` - React Native framework
- `expo-router` - Navigation for mobile
- `react-native` - Core library
- `@react-navigation/*` - Native navigation
- `react-native-web` - Run React Native on web
- `expo-status-bar`, `expo-constants`, `expo-device` - Expo modules

### Package Scripts Updated:
```bash
npm run dev           # Web: Vite dev server
npm run web:build     # Web: Production build
npm run mobile        # Mobile: Expo dev server
npm run mobile:ios    # Mobile: Run on iOS
npm run mobile:android # Mobile: Run on Android
```

## 🚀 Getting Started

### Option 1: Web Development (Recommended to start)
```bash
npm run dev
# Opens http://localhost:5173
```

### Option 2: Mobile Development
```bash
npm run mobile
# Use Expo Go app on your phone or Android Studio emulator
```

## 📱 Architecture Overview

```
WicsHacks/
├── src/
│   ├── App.jsx          (Web version - uses React Router)
│   ├── App.expo.jsx     (Mobile version - uses React Native)
│   ├── main.jsx         (Web entry point)
│   └── components/      (Shared components - may need platform-specific versions)
├── index.html           (Web HTML entry point)
├── index.js             (Mobile JS entry point)
├── vite.config.js       (Web bundler config)
├── metro.config.js      (Mobile bundler config)
├── app.json             (Expo config)
└── babel.config.js      (Babel transform config)
```

## ⚙️ Configuration Details

### Metro Config (`metro.config.js`)
- Automatically handles platform-specific file extensions
- Supports `.web.js`, `.native.js` extensions
- Configured for Expo and React Native

### Babel Config (`babel.config.js`)
- Uses `babel-preset-expo` for React Native transforms
- Handles JSX and other modern JavaScript

### App Configuration (`app.json`)
- iOS: Bundle ID `com.base44.app`
- Android: Package `com.base44.app`
- Supports both platforms with adaptive icons

## 🔄 Next Steps

### 1. For Web Only (Current)
The web version should work immediately. Run:
```bash
npm run dev
```

### 2. To Use Mobile Features
You'll need to adapt your components:

**Current Issue**: Your app uses:
- ❌ React Router (web-only)
- ❌ Radix UI (web-only)
- ❌ Tailwind CSS (limited mobile support)
- ❌ React Leaflet (web-only)

**Required Changes**:
- ✅ Replace React Router with React Navigation or Expo Router
- ✅ Create React Native versions of Radix UI components
- ✅ Use `react-native-web` for cross-platform styling
- ✅ Replace react-leaflet with `react-native-maps`

### 3. Create Platform-Specific Components

Create parallel component versions:

```
components/
├── Button.native.jsx    (React Native version)
├── Button.web.jsx       (Radix UI version)
└── Button.jsx           (Fallback/shared)
```

Example: `components/Card.native.jsx`
```jsx
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
});

export default function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}
```

### 4. Update Navigation

**For Web** (current):
- Keep using React Router in `App.jsx`

**For Mobile** (new):
- Use React Navigation in `App.expo.jsx`
- Example:
```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

## 🎯 Development Workflow

### Running Both Simultaneously (Terminal 1 & 2)
```
Terminal 1:
npm run dev           # Web: http://localhost:5173

Terminal 2:
npm run mobile        # Mobile: Scan QR with Expo Go
```

### Testing on Device
1. Install Expo Go app on your phone
2. Run `npm run mobile`
3. Scan QR code with Expo Go
4. Hot reload works - edit and save!

## 📱 Build & Distribution

### Web Distribution
```bash
npm run web:build
# Creates ./dist/ folder
# Deploy to Vercel, Netlify, etc.
```

### Mobile Distribution
For iOS:
```bash
expo build:ios
```

For Android:
```bash
expo build:android
```

## 💡 Tips & Best Practices

1. **Use Platform Module**:
```jsx
import { Platform } from 'react-native';

if (Platform.OS === 'web') {
  // Web-specific code
} else {
  // Native code
}
```

2. **Use react-native-web**: Automatically renders React Native on web
```jsx
import { View, Text } from 'react-native';
// Works on both web and mobile!
```

3. **Conditional Imports**:
```jsx
import Button from './Button'; // Auto-picks Button.web.jsx or Button.native.jsx
```

4. **Avoid Platform Lock-in**:
- Use cross-platform libraries when possible
- Document platform-specific dependencies
- Plan components for portability

## 🐛 Troubleshooting

### Build Errors
- Clear cache: `rm -rf node_modules/.cache`
- Clean install: `rm -rf node_modules && npm install --legacy-peer-deps`

### Mobile Build Issues
- Expo CLI: `npm install -g expo-cli`
- Java/Android: Required for Android builds
- Xcode: Required for iOS builds

### Web Issues
- Port already in use: `npm run dev -- --port 3000`
- Clear browser cache: Hard refresh (Ctrl+Shift+R on Windows)

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [React Navigation](https://reactnavigation.org)
- [React Native Web](https://necolas.github.io/react-native-web/)

## ✅ Setup Verification

Run these commands to verify setup:

```bash
# Check web version
npm run dev

# Check mobile build (needs setup.js file adjustment)
npm run mobile

# Build for production
npm run web:build
```

---

**Happy coding!** 🎉

Your app now has a solid foundation for cross-platform development.
Next: Replace web-specific UI libraries with React Native components.
