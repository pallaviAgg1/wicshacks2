# Base44 App - Multi-Platform Setup

This project is now configured to run on both web and mobile (React Native) platforms.

## Running the App

### Web (Vite + React)
```bash
npm run dev        # Start development server
npm run web:build  # Build for production
npm run preview    # Preview production build
```

### Mobile (Expo + React Native)
```bash
npm run mobile              # Start local development server
npm run mobile:android      # Build and run on Android
npm run mobile:ios          # Build and run on iOS (macOS only)
npm run mobile:web          # Run on web via Expo
```

## Project Structure

- `src/App.jsx` - Web version (React Router)
- `src/App.expo.jsx` - Mobile version (React Native)
- `index.html` - Web entry point (Vite)
- `index.js` - Mobile entry point (Expo)
- `app.json` - Expo configuration
- `vite.config.js` - Vite configuration
- `metro.config.js` - Metro bundler configuration for React Native

## Platform-Specific Code

You can create platform-specific files using extensions:
- `.web.js`, `.web.jsx` - Web only
- `.native.js`, `.native.jsx` - Native only
- Regular `.js`, `.jsx` - Used by both

Example:
```
Button.web.jsx   # Uses web-specific styling
Button.native.jsx # Uses React Native components
Button.jsx       # Fallback for both
```

## Key Dependencies

### Web
- React Router for navigation
- Tailwind CSS for styling
- Radix UI for components

### Mobile
- React Navigation for navigation
- React Native components
- Expo modules for native features

## Next Steps

1. Install dependencies: `npm install`
2. For web development: `npm run dev`
3. For mobile development: `npm run mobile` (requires Expo CLI on device)
4. Customize assets in `/assets` folder (app icon, splash screen)
5. Update component libraries to be cross-platform compatible

## Notes

- Some web libraries (Radix UI, Tailwind) may need cross-platform replacements
- Consider using `react-native-web` for web-compatible components
- Mobile components should use React Native primitives
- Test both platforms during development
