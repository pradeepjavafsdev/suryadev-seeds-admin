// metro.config.js
const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// 1. Add 'cjs' to sourceExts so Metro can find the Firebase files
defaultConfig.resolver.sourceExts.push('cjs');

// 2. (Optional but recommended) Disable package exports for broader compatibility
defaultConfig.resolver.unstable_enablePackageExports = false; 

module.exports = defaultConfig;