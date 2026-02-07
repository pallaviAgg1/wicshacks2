const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .web extensions
config.resolver.sourceExts.push('web.js');
config.resolver.sourceExts.push('web.jsx');
config.resolver.sourceExts.push('web.ts');
config.resolver.sourceExts.push('web.tsx');

// Add support for .native extensions
config.resolver.sourceExts.push('native.js');
config.resolver.sourceExts.push('native.jsx');

module.exports = mergeConfig(config, {});
