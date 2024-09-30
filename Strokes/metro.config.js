const {getDefaultConfig} = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Ensure Metro is handling asset files correctly
config.resolver.assetExts = [...config.resolver.assetExts, 'png', 'jpg', 'jpeg', 'gif', 'svg'];

module.exports = config;

